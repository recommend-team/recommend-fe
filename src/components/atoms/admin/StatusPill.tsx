import type { OrderStatus, UserStatus } from "@/types";

// Drawn from the shared types rather than a list kept by hand here — the hand-kept one
// had drifted from the backend, so orders rendered with a status this map had never
// heard of and fell through to the raw enum name.
type AnyStatus = UserStatus | OrderStatus;

const map: Record<string, { label: string; text: string; dot: string }> = {
  APPROVED: { label: "Active", text: "text-green-700", dot: "bg-green-500" },
  PENDING: { label: "Pending", text: "text-orange-700", dot: "bg-orange-400" },
  SUSPENDED: { label: "Suspended", text: "text-red-700", dot: "bg-red-500" },
  DEACTIVATED: {
    label: "Rejected",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
  PAID: { label: "Paid", text: "text-green-700", dot: "bg-green-500" },
  PROCESSING: {
    label: "Processing",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    text: "text-green-800",
    dot: "bg-green-700",
  },
  CANCELLED: { label: "Cancelled", text: "text-gray-500", dot: "bg-gray-400" },
  // "Awaiting payment" rather than "Pending": an order sitting here has not been paid
  // for, and reading it as "pending fulfilment" is how a paid order goes unnoticed.
  PENDING_PAYMENT: {
    label: "Awaiting payment",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  REFUNDED: { label: "Refunded", text: "text-purple-700", dot: "bg-purple-500" },
};

export default function StatusPill({ status }: { status: AnyStatus }) {
  const style =
    map[status] ??
    ({ label: status, text: "text-gray-500", dot: "bg-gray-300" } as const);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
