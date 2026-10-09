import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

interface AttemptRecord {
  count: number;
  firstAttempt: number;
}

const attempts = new Map<string, AttemptRecord>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

function isRateLimited(key: string): boolean {
  const record = attempts.get(key);
  if (!record) return false;

  if (Date.now() - record.firstAttempt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }

  return record.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(key: string) {
  const record = attempts.get(key);
  if (!record || Date.now() - record.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: Date.now() });
    return;
  }
  record.count += 1;
}

function clearAttempts(key: string) {
  attempts.delete(key);
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { email, password } = await request.json();

  const key = `${getClientIp(request)}:${email}`;
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  const { data, error } = await supabase
    .from("customers")
    .select("id, email, full_name")
    .eq("email", email)
    .single();

  if (error || !data) {
    recordFailedAttempt(key);
    return NextResponse.json({ error: "No such account" }, { status: 401 });
  }

  if (password !== "shopflow") {
    recordFailedAttempt(key);
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  clearAttempts(key);
  return NextResponse.json({ user: data });
}
