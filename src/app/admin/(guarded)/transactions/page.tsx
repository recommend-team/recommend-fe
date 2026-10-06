"use client";

import { useState } from "react";
import { Search, RefreshCw, Truck, Check, History, Copy, UserPlus, Phone } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import AssignRiderDialog from "@/components/organisms/AssignRiderDialog";
import {
  useAdminTransactions,
  useCompleteTransaction,
  useDispatchTransaction,
  useOverrideTransactionStatus,
  useTransactionHistory,
  useVerifyTransaction,
} from "@/hooks";
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
  "READY",
  "DISPATCHED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const STATUS_LABELS: Record<OrderStatus | "ALL", string> = {
  ALL: "All",
  PENDING_PAYMENT: "Awaiting payment",
  PAID: "Paid",
  READY: "Ready",
  DISPATCHED: "On its way",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

/** Not a status: paid or ready deliveries nobody has been assigned to carry yet. */
const NEEDS_RIDER = "NEEDS_RIDER";
type Filter = OrderStatus | "ALL" | typeof NEEDS_RIDER;
const FILTERS: Filter[] = ["ALL", NEEDS_RIDER, ...STATUSES.filter((s) => s !== "ALL")];
const FILTER_LABELS: Record<Filter, string> = { ...STATUS_LABELS, [NEEDS_RIDER]: "Needs a rider" };

/** Where a delivery can take a rider: paid, ready, or already on its way (a swap). */
const ASSIGNABLE: OrderStatus[] = ["PAID", "READY", "DISPATCHED"];

const PAGE_SIZE = 20;

function formatNaira(n: number): string {
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("ALL");
  // A rider's page links here with `?search=<reference>`.
  const [search, setSearch] = useState(() =>
    typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("search") ?? ""
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const transactions = useAdminTransactions({
    page,
    limit: PAGE_SIZE,
    status: filter === "ALL" || filter === NEEDS_RIDER ? undefined : filter,
    needsRider: filter === NEEDS_RIDER || undefined,
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
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                aria-pressed={filter === f}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-dm transition-colors ${
                  filter === f
                    ? "bg-recommend-orange text-white"
                    : f === NEEDS_RIDER
                      ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {FILTER_LABELS[f]}
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
                <th className="py-3 pr-4">Rider</th>
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
                  <td colSpan={10} className="py-6 text-center text-gray-400">
                    Loading transactions…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-gray-400">
                    {filter === NEEDS_RIDER
                      ? "Every delivery has a rider."
                      : search
                        ? "No transactions match."
                        : "No transactions yet."}
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
  const dispatchOrder = useDispatchTransaction();
  const completeOrder = useCompleteTransaction();
  const [assigning, setAssigning] = useState(false);

  const unpaid = transaction.status === "PENDING_PAYMENT";
  const isPickup = transaction.fulfillmentType === "PICKUP";

  // A pickup order is never dispatched — the buyer collects it — so it goes straight
  // from ready to delivered.
  // A delivery is dispatched only with a named rider; until then, assigning one is the
  // action it is waiting for.
  const canAssign = !isPickup && ASSIGNABLE.includes(transaction.status);
  const needsRider = canAssign && !transaction.rider && transaction.status !== "DISPATCHED";
  const canDispatch = transaction.status === "READY" && !isPickup && !!transaction.rider;
  const lifecycleError = dispatchOrder.error ?? completeOrder.error;
  const canComplete =
    transaction.status === "DISPATCHED" ||
    (transaction.status === "READY" && isPickup);

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
          <div className="flex flex-col items-start gap-1">
            <span className="text-gray-800">{transaction.buyerName}</span>
            <span className="text-xs text-gray-500">
              {transaction.buyerPhone}
            </span>
            {/* Beside the phone number, because relaying it is a phone call. */}
            {transaction.status === "DISPATCHED" && transaction.deliveryCode && (
              <DeliveryCode code={transaction.deliveryCode} />
            )}
          </div>
        </td>
        <td className="py-3 pr-4 text-gray-700">
          {transaction.vendors.map((v) => v.vendorName ?? "Unknown").join(", ")}
        </td>
        <td className="py-3 pr-4">
          <RiderCell transaction={transaction} />
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
          {/* Only ever the one action this order is actually waiting for. A row of
              greyed-out buttons is a puzzle; one button is an instruction. */}
          <div className="flex flex-col gap-1.5 items-start">
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

            {needsRider && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAssigning(true);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-dm whitespace-nowrap ${
                  transaction.status === "READY"
                    ? "bg-recommend-orange text-white hover:bg-orange-600"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                }`}
                title="Choose who carries this delivery"
              >
                <UserPlus size={13} />
                Assign rider
              </button>
            )}

            {canDispatch && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatchOrder.mutate(transaction.reference);
                }}
                disabled={dispatchOrder.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-dm bg-recommend-green text-white hover:bg-recommend-green-hover disabled:opacity-50 whitespace-nowrap"
                title="A rider has collected everything and left"
              >
                <Truck size={13} />
                {dispatchOrder.isPending ? "Saving…" : "Dispatch"}
              </button>
            )}

            {canComplete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  completeOrder.mutate(transaction.reference);
                }}
                disabled={completeOrder.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-dm bg-recommend-green text-white hover:bg-recommend-green-hover disabled:opacity-50 whitespace-nowrap"
                title="The buyer has their order"
              >
                <Check size={13} />
                {completeOrder.isPending ? "Saving…" : "Delivered"}
              </button>
            )}

            {canAssign && transaction.rider && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAssigning(true);
                }}
                className="text-xs font-bold font-dm text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline"
              >
                Change rider
              </button>
            )}
          </div>
        </td>
      </tr>

      {lifecycleError && (
        <tr className="border-b border-gray-100">
          <td colSpan={10} className="py-2 px-4 text-xs text-red-600 bg-red-50">
            {lifecycleError.message}
          </td>
        </tr>
      )}

      {assigning && (
        <AssignRiderDialog transaction={transaction} onClose={() => setAssigning(false)} />
      )}

      {verify.isError && (
        <tr className="border-b border-gray-100">
          <td colSpan={10} className="py-2 px-4 text-xs text-red-600 bg-red-50">
            Couldn&apos;t check this payment. Nothing has changed.
          </td>
        </tr>
      )}

      {/* A check that finds nothing is still an answer, and the buyer is owed it. */}
      {verify.isSuccess && verify.data?.status === "PENDING_PAYMENT" && (
        <tr className="border-b border-gray-100">
          <td
            colSpan={10}
            className="py-2 px-4 text-xs text-gray-600 bg-gray-50"
          >
            Paystack has no successful payment for this reference — it was not
            paid.
          </td>
        </tr>
      )}

      {expanded && (
        <tr className="border-b border-gray-100 bg-gray-50/60">
          <td colSpan={10} className="py-3 px-4">
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

              <OverrideControl reference={transaction.reference} />
              <StatusHistory reference={transaction.reference} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/** Who is carrying it — a phone call away — or that nobody is yet. */
function RiderCell({ transaction }: { transaction: AdminTransactionSummary }) {
  if (transaction.fulfillmentType === "PICKUP") {
    return <span className="text-xs text-gray-400">Pickup</span>;
  }
  if (transaction.rider) {
    return (
      <div className="flex flex-col">
        <span className="text-gray-800">{transaction.rider.name}</span>
        {transaction.rider.phone && (
          <a
            href={`tel:${transaction.rider.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-recommend-green"
          >
            <Phone size={11} /> {transaction.rider.phone}
          </a>
        )}
      </div>
    );
  }
  if (ASSIGNABLE.includes(transaction.status)) {
    return <span className="text-xs font-bold text-orange-700">Needs a rider</span>;
  }
  return <span className="text-xs text-gray-400">—</span>;
}

/**
 * The six letters the customer reads out at the door.
 *
 */
function DeliveryCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={(event) => {
        // The row toggles on click; copying must not also expand it.
        event.stopPropagation();
        navigator.clipboard
          .writeText(code)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          })
          .catch(() => undefined);
      }}
      title="Copy the delivery code to send to the rider"
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-recommend-green/10 border border-recommend-green/30 hover:bg-recommend-green/20"
    >
      <span className="font-mono text-sm font-bold tracking-[0.15em] text-recommend-green">
        {code}
      </span>
      {copied ? (
        <Check size={12} className="text-recommend-green" />
      ) : (
        <Copy size={12} className="text-recommend-green/60" />
      )}
    </button>
  );
}

/**
 * Force an order to any status.
 *
 * Kept inside the expanded row rather than on the row itself: this is the escape hatch,
 * not an everyday action, and putting it a click away is the difference between a tool
 * and a trap. It exists for the orders the ordinary rules have stranded — a vendor who
 * never marked ready, a decline handled over the phone.
 */
function OverrideControl({ reference }: { reference: string }) {
  const override = useOverrideTransactionStatus();
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [note, setNote] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-3">
      <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
        Override
      </span>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus | "")}
        className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-dm focus:outline-none focus:border-recommend-green"
      >
        <option value="">Choose a status…</option>
        {STATUSES.filter((s) => s !== "ALL").map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Why? (recorded against your name)"
        className="h-8 flex-1 min-w-[200px] rounded-lg border border-gray-200 bg-white px-2 text-xs font-dm focus:outline-none focus:border-recommend-green"
      />

      <button
        onClick={() =>
          status &&
          override.mutate(
            { reference, status, note: note.trim() || undefined },
            { onSuccess: () => setNote("") }
          )
        }
        disabled={!status || override.isPending}
        className="h-8 rounded-lg bg-gray-800 px-3 text-xs font-bold font-dm text-white hover:bg-gray-900 disabled:opacity-40"
      >
        {override.isPending ? "Saving…" : "Force"}
      </button>

      {override.isError && (
        <span className="text-xs text-red-600">Couldn&apos;t change it.</span>
      )}
    </div>
  );
}

/** Who moved this order, from what to what, and why. */
function StatusHistory({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false);
  const history = useTransactionHistory(open ? reference : null);

  return (
    <div className="border-t border-gray-200 pt-3">
      <button
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1.5 text-xs font-bold font-dm text-gray-600 hover:text-gray-900"
      >
        <History size={13} />
        {open ? "Hide history" : "Status history"}
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-1">
          {history.isLoading && (
            <span className="text-xs text-gray-400">Loading…</span>
          )}
          {history.data?.length === 0 && (
            <span className="text-xs text-gray-400">
              Nothing has moved yet.
            </span>
          )}
          {history.data?.map((event) => (
            <div key={event.id} className="flex flex-wrap gap-2 text-xs">
              <span className="text-gray-400 w-36 shrink-0">
                {new Date(event.createdAt).toLocaleString()}
              </span>
              <span className="text-gray-500 w-16 shrink-0">
                {/* A vendor order and the whole checkout can move on the same
                    second; which one it was is the useful part. */}
                {event.orderId ? "vendor" : "order"}
              </span>
              <span className="text-gray-800">
                {event.fromStatus} → <b>{event.toStatus}</b>
              </span>
              <span className="text-gray-500">by {event.actorType}</span>
              {event.note && (
                <span className="text-gray-500 italic">“{event.note}”</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
