import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShopFlow Admin",
  description: "Storefront order dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#0b0d12",
          color: "#e8eaf0",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
