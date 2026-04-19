import type { UserStatus } from "@/types";

type AnyStatus =
  | UserStatus
  | "PAID"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

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
  FAILED: { label: "Failed", text: "text-red-700", dot: "bg-red-500" },
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
