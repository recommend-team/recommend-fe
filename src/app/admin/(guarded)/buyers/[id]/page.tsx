"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ban, PlayCircle } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import PageHeader from "@/components/atoms/admin/PageHeader";
import {
  useBuyerDetail,
  useSuspendUser,
  useActivateUser,
} from "@/hooks";
import { useConfirm } from "@/components/organisms/DialogProvider";

function formatNaira(raw: string | number): string {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-dm text-gray-500 flex items-center gap-1 w-fit hover:text-recommend-orange cursor-pointer"
    >
      <ArrowLeft size={14} /> Back to buyers
    </button>
  );
}

export default function BuyerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const buyer = useBuyerDetail(id);
  const suspend = useSuspendUser();
  const activate = useActivateUser();

  const [actionError, setActionError] = useState<string | null>(null);

  const goBack = () => router.push("/admin/buyers");

  const runAction = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Action failed."
      );
    }
  };

  const confirmThenRun = async (
    fn: () => Promise<unknown>,
    options: {
      title: string;
      message?: string;
      confirmLabel?: string;
      variant?: "danger" | "primary";
    }
  ) => {
    const ok = await confirm(options);
    if (ok) runAction(fn);
  };

  if (buyer.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <p className="text-sm font-dm text-gray-400">Loading buyer…</p>
      </div>
    );
  }
  if (buyer.isError || !buyer.data) {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Couldn&apos;t load this buyer.
        </p>
      </div>
    );
  }

  const { buyer: b, orders, orderCount } = buyer.data;
  const isApproved = b.status === "APPROVED";
  const name =
    `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim() || "Unnamed buyer";

  return (
    <div className="flex flex-col gap-6">
      <BackLink onClick={goBack} />

      <PageHeader
        title={name}
        description={b.phoneNumber}
        right={<StatusPill status={b.status} />}
      />

      {actionError && (
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          {actionError}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {isApproved ? (
          <button
            onClick={() =>
              confirmThenRun(() => suspend.mutateAsync(b.id), {
                title: "Suspend this buyer?",
                message:
                  "They won't be able to place new orders until reactivated.",
                confirmLabel: "Suspend",
                variant: "danger",
              })
            }
            disabled={suspend.isPending}
            className="flex items-center gap-2 rounded-full bg-red-600 text-white px-4 py-2 text-sm font-bold font-dm hover:bg-red-700 disabled:opacity-50"
          >
            <Ban size={16} />
            {suspend.isPending ? "Working…" : "Suspend"}
          </button>
        ) : (
          <button
            onClick={() =>
              confirmThenRun(() => activate.mutateAsync(b.id), {
                title: "Reactivate this buyer?",
                message: "They'll be able to place orders again immediately.",
                confirmLabel: "Reactivate",
                variant: "primary",
              })
            }
            disabled={activate.isPending}
            className="flex items-center gap-2 rounded-full bg-recommend-green text-white px-4 py-2 text-sm font-bold font-dm hover:bg-recommend-green-hover disabled:opacity-50"
          >
            <PlayCircle size={16} />
            {activate.isPending ? "Working…" : "Reactivate"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 flex flex-col gap-2">
          <h3 className="text-base font-bold font-dm text-gray-900 mb-1">
            Contact
          </h3>
          <Row label="Name" value={name} />
          <Row label="Email" value={b.email ?? "—"} />
          <Row label="Phone" value={b.phoneNumber} />
          <Row
            label="Joined"
            value={new Date(b.createdAt).toLocaleString()}
          />
        </div>

        <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 flex flex-col gap-2">
          <h3 className="text-base font-bold font-dm text-gray-900 mb-1">
            Order summary
          </h3>
          <Row label="Total orders" value={String(orderCount)} />
          <Row
            label="Lifetime value"
            value={formatNaira(
              orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
            )}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6">
        <h3 className="text-base font-bold font-dm text-gray-900 mb-3">
          Recent orders
        </h3>
        {orders.length === 0 ? (
          <p className="text-sm font-dm text-gray-400">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-dm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Vendor</th>
                  <th className="py-2 pr-4">Qty</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((o) => (
                  <tr key={o.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-800">
                      {o.product.name}
                    </td>
                    <td className="py-2 pr-4 text-gray-700">
                      {o.vendor.businessName ??
                        `${o.vendor.firstName} ${o.vendor.lastName}`}
                    </td>
                    <td className="py-2 pr-4 text-gray-700">{o.quantity}</td>
                    <td className="py-2 pr-4 font-bold text-gray-900">
                      {formatNaira(o.totalAmount)}
                    </td>
                    <td className="py-2 pr-4">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="py-2 pr-4 text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length > 10 && (
              <p className="text-xs text-gray-400 mt-2">
                Showing 10 of {orders.length} orders
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm font-dm">
      <span className="text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-gray-800 flex-1 break-words">{value}</span>
    </div>
  );
}
