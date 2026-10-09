import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import crypto from "crypto";

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Missing required environment variable: STRIPE_WEBHOOK_SECRET");
  }
  return secret;
}

function verifyStripeSignature(payload: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    }),
  );

  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");
  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ received: true });

  const payload = await request.text();
  const signatureHeader = request.headers.get("stripe-signature");

  if (!verifyStripeSignature(payload, signatureHeader, getWebhookSecret())) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(payload);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("stripe_session_id", session.id);
  }

  return NextResponse.json({ received: true });
}
