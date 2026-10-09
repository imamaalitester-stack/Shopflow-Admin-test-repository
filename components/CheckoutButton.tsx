"use client";

import { useState } from "react";

export default function CheckoutButton({ amountCents }: { amountCents: number }) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amountCents }),
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
