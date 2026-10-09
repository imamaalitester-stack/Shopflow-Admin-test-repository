import { listOrders } from "@/lib/db";
import OrdersTable from "@/components/OrdersTable";
import CheckoutButton from "@/components/CheckoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const orders = await listOrders();

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>ShopFlow Admin</h1>
      <p style={{ color: "#8b90a0", marginTop: 0, fontSize: 14 }}>
        Every order placed through the storefront.
      </p>

      <OrdersTable orders={orders} />

      <div style={{ marginTop: 32 }}>
        <CheckoutButton amountCents={2500} />
      </div>
    </main>
  );
}
