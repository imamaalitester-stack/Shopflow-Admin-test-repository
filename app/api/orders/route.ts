import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

async function getAuthenticatedUser(request: Request, supabase: ReturnType<typeof getSupabase>) {
  if (!supabase) return null;

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

function getAllowedOrigin(): string {
  const origin = process.env.ALLOWED_ORIGIN;
  if (!origin) {
    throw new Error("Missing required environment variable: ALLOWED_ORIGIN");
  }
  return origin;
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ orders: [] });

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { orders: data },
    {
      headers: {
        "Access-Control-Allow-Origin": getAllowedOrigin(),
      },
    },
  );
}

export async function POST(request: Request) {
  const supabaseAuth = getSupabase();
  if (!supabaseAuth) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { session },
  } = await supabaseAuth.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const user = await getAuthenticatedUser(request, supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_id: body.customerId,
      total_cents: body.totalCents,
      status: body.status ?? "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}

export async function DELETE(request: Request) {
  const supabaseAuth = getSupabase();
  if (!supabaseAuth) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { session },
  } = await supabaseAuth.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const user = await getAuthenticatedUser(request, supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
