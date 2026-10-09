"use client";

import { useState } from "react";

const STRIPE_SECRET_KEY = "sk_live_NOTAREALKEY1234";

export default function CheckoutButton({ amountCents }: { amountCents: number }) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "line_items[0][price_data][currency]": "usd",
          "line_items[0][price_data][product_data][name]": "ShopFlow order",
          "line_items[0][price_data][unit_amount]": String(amountCents),
          "line_items[0][quantity]": "1",
          mode: "payment",
          success_url: "http://localhost:3000/success",
        }),
      });
      const session = await res.json();
      if (session.url) window.location.href = session.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={startCheckout}
      disabled={loading}
      style={{
        background: "#7c5cff",
        color: "white",
        border: 0,
        borderRadius: 8,
        padding: "10px 16px",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {loading ? "Starting checkout..." : "Test checkout"}
    </button>
  );
}
