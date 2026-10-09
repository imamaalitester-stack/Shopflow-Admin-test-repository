"use client";

import type { Order } from "@/lib/db";

export default function OrdersTable({ orders }: { orders: Order[] }) {
  if (!orders || orders.length === 0) {
    return (
      <p style={{ color: "#8b90a0", fontSize: 14 }}>No orders yet.</p>
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
      <thead>
        <tr style={{ textAlign: "left", color: "#8b90a0", fontSize: 12 }}>
          <th style={{ padding: "8px 0" }}>Order</th>
          <th style={{ padding: "8px 0" }}>Status</th>
          <th style={{ padding: "8px 0" }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} style={{ borderTop: "1px solid #1c2030", fontSize: 14 }}>
            <td style={{ padding: "10px 0", fontFamily: "monospace", fontSize: 12 }}>
              {order.id.slice(0, 8)}
            </td>
            <td style={{ padding: "10px 0" }}>{order.status}</td>
            <td style={{ padding: "10px 0" }}>
              ${(order.total_cents / 100).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
