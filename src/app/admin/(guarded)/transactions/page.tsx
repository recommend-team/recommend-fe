"use client";

import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import { useAdminTransactions, useVerifyTransaction } from "@/hooks";
import type { AdminTransactionSummary, OrderStatus } from "@/types";

/**
 * The money view: one row per payment.
 *
 * Orders are listed per vendor, which is right for fulfilment and wrong for reconciling
 * against Paystack — a basket split across two vendors appears there as two rows whose
 * totals exclude delivery and sum to something the buyer never saw. Here, one row is one
 * charge, with the vendor orders it paid for underneath it.
 */

const STATUSES: Array<OrderStatus | "ALL"> = [
  "ALL",
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const STATUS_LABELS: Record<OrderStatus | "ALL", string> = {
  ALL: "All",
  PENDING_PAYMENT: "Awaiting payment",
  PAID: "Paid",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const PAGE_SIZE = 20;

function formatNaira(n: number): string {
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const transactions = useAdminTransactions({
    page,
    limit: PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
    search: search.trim() || undefined,
  });

  const rows = transactions.data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transactions"
        description="One row per payment. Anything still awaiting payment can be checked against Paystack directly."
      />

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search reference, buyer name or phone"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-dm transition-colors ${
                  status === s
                    ? "bg-recommend-orange text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {transactions.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load transactions.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Reference</th>
                <th className="py-3 pr-4">Buyer</th>
                <th className="py-3 pr-4">Vendors</th>
                <th className="py-3 pr-4">Items</th>
                <th className="py-3 pr-4">Delivery</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Placed</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.isLoading ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-gray-400">
                    Loading transactions…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-gray-400">
                    {search ? "No transactions match." : "No transactions yet."}
                  </td>
                </tr>
              ) : (
                rows.map((t) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    expanded={expanded === t.id}
                    onToggle={() =>
                      setExpanded((current) => (current === t.id ? null : t.id))
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {transactions.data && transactions.data.total > 0 && (
          <Paginator
            page={page}
            total={transactions.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={rows.length}
            onChange={setPage}
            label="transactions"
          />
        )}
      </div>
    </div>
  );
}

function TransactionRow({
  transaction,
  expanded,
  onToggle,
}: {
  transaction: AdminTransactionSummary;
  expanded: boolean;
  onToggle: () => void;
}) {
  const verify = useVerifyTransaction();
  const unpaid = transaction.status === "PENDING_PAYMENT";
  const itemCount = transaction.vendors.reduce(
    (sum, v) => sum + v.items.reduce((n, i) => n + i.quantity, 0),
    0
  );

  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-gray-100 hover:bg-amber-50/40 cursor-pointer"
      >
        <td className="py-3 pr-4 font-mono text-xs text-gray-700">
          {transaction.reference}
        </td>
        <td className="py-3 pr-4">
          <div className="flex flex-col">
            <span className="text-gray-800">{transaction.buyerName}</span>
            <span className="text-xs text-gray-500">
              {transaction.buyerPhone}
            </span>
          </div>
        </td>
        <td className="py-3 pr-4 text-gray-700">
          {transaction.vendors.map((v) => v.vendorName ?? "Unknown").join(", ")}
        </td>
        <td className="py-3 pr-4 text-gray-700">{itemCount}</td>
        <td className="py-3 pr-4 text-gray-700">
          {transaction.deliveryFee > 0
            ? formatNaira(transaction.deliveryFee)
            : "—"}
        </td>
        <td className="py-3 pr-4 font-bold text-gray-900">
          {formatNaira(transaction.totalAmount)}
        </td>
        <td className="py-3 pr-4">
          <StatusPill status={transaction.status} />
        </td>
        <td className="py-3 pr-4 text-gray-500">
          {new Date(transaction.createdAt).toLocaleString()}
        </td>
        <td className="py-3 pr-4">
          {unpaid && (
            <button
              onClick={(e) => {
                // The row toggles on click; the button must not do both.
                e.stopPropagation();
                verify.mutate(transaction.reference);
              }}
              disabled={verify.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-dm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
              title="Ask Paystack whether this was actually paid"
            >
              <RefreshCw
                size={13}
                className={verify.isPending ? "animate-spin" : ""}
              />
              {verify.isPending ? "Checking…" : "Check Paystack"}
            </button>
          )}
        </td>
      </tr>

      {verify.isError && (
        <tr className="border-b border-gray-100">
          <td colSpan={9} className="py-2 px-4 text-xs text-red-600 bg-red-50">
            Couldn&apos;t check this payment. Nothing has changed.
          </td>
        </tr>
      )}

      {/* A check that finds nothing is still an answer, and the buyer is owed it. */}
      {verify.isSuccess && verify.data?.status === "PENDING_PAYMENT" && (
        <tr className="border-b border-gray-100">
          <td
            colSpan={9}
            className="py-2 px-4 text-xs text-gray-600 bg-gray-50"
          >
            Paystack has no successful payment for this reference — it was not
            paid.
          </td>
        </tr>
      )}

      {expanded && (
        <tr className="border-b border-gray-100 bg-gray-50/60">
          <td colSpan={9} className="py-3 px-4">
            <div className="flex flex-col gap-3">
              {transaction.vendors.map((vendor) => (
                <div key={vendor.orderId} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      {vendor.vendorName ?? "Unknown vendor"}
                    </span>
                    <StatusPill status={vendor.status} />
                    <span className="text-xs text-gray-500">
                      {formatNaira(vendor.subtotal)} · payout{" "}
                      {formatNaira(vendor.vendorAmount)}
                    </span>
                  </div>
                  <ul className="pl-3">
                    {vendor.items.map((item, index) => (
                      <li
                        key={`${vendor.orderId}-${index}`}
                        className="text-gray-700"
                      >
                        <span className="font-bold text-gray-400">
                          {item.quantity}×{" "}
                        </span>
                        {item.name}
                        <span className="text-gray-500">
                          {" "}
                          — {formatNaira(item.lineTotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="text-xs text-gray-500">
                {transaction.fulfillmentType === "DELIVERY"
                  ? `Delivering to ${transaction.deliveryAddress ?? "—"}`
                  : "For pickup"}
                {transaction.paidAt
                  ? ` · paid ${new Date(transaction.paidAt).toLocaleString()}`
                  : " · not paid"}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
