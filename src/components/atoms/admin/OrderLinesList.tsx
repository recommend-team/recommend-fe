import type { AdminOrderSummary } from "@/types";

/**
 * An order's items as the buyer built them — "2× Rice and beans (2 portions, Protein:
 * Beef, with Beef ×2)" — one row per dish, its packs, choices and extras folded in. An
 * older server without `lines` falls back to one row per stored item.
 */
export default function OrderLinesList({
  order,
}: {
  order: Pick<AdminOrderSummary, "items" | "lines">;
}) {
  const rows = order.lines
    ? order.lines.map((line) => ({ quantity: line.quantity, name: line.name }))
    : order.items.map((item) => ({ quantity: item.quantity, name: item.productName }));

  if (rows.length === 0) return <span className="text-gray-400">—</span>;
  return (
    <div className="flex flex-col gap-0.5">
      {rows.map((row, index) => (
        <span key={index} className="text-gray-900">
          <span className="font-bold text-gray-400">{row.quantity}× </span>
          {row.name}
        </span>
      ))}
    </div>
  );
}
