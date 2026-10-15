import { NO_INDEX } from "@/lib/site";

// Order receipts are reached from a payment redirect — private, and nothing to search for.
export const metadata = {
  title: "Order - Recommend",
  description: "Your order details",
  robots: NO_INDEX,
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
