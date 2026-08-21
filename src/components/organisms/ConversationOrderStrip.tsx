"use client";

import { useConversationOrder } from "@/hooks";
import StatusPill from "@/components/atoms/admin/StatusPill";

const naira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

/**
 * What happened to the last order this conversation placed.
 *
 * Sits above the composer so an admin who has just sent a payment card can watch it go
 * from unpaid to paid without leaving the thread — which is the only way to know whether
 * to keep chasing the buyer. It keeps showing the order after payment, because "paid" is
 * the answer the admin was waiting for.
 */
export default function ConversationOrderStrip({
  conversationId,
}: {
  conversationId: string;
}) {
  const { data: order } = useConversationOrder(conversationId);

  if (!order) return null;

  const unpaid = order.status === "PENDING_PAYMENT";

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-black/10 bg-white px-3 py-2">
      <span className="font-mono text-[11px] text-gray-500">
        {order.reference}
      </span>
      <StatusPill status={order.status} />
      <span className="font-dm text-xs font-bold text-gray-800">
        {naira(order.totalAmount)}
      </span>
      <span className="font-dm text-xs text-gray-400">
        {unpaid
          ? "Waiting for payment"
          : order.paidAt
            ? `Paid ${new Date(order.paidAt).toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : ""}
      </span>
    </div>
  );
}
