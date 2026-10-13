"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, RefreshCw, Undo2, SearchCheck } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import { useConfirm, usePrompt } from "@/components/organisms/DialogProvider";
import {
  useAdminWithdrawals,
  useFailWithdrawal,
  useRetryWithdrawal,
  useVerifyWithdrawal,
} from "@/hooks";
import type { AdminWithdrawal, WithdrawalStatus } from "@/types";

/**
 * Money going out: every vendor withdrawal, whatever became of it.
 *
 * Kept apart from Transactions, which is money coming in — a payment and a payout share
 * almost no columns, and the actions on each are different.
 */

type Filter = WithdrawalStatus | "ALL";

const FILTERS: Filter[] = [
  "ALL",
  "PROCESSING",
  "REQUESTED",
  "SETTLED",
  "FAILED",
  "REVERSED",
];

const FILTER_LABELS: Record<Filter, string> = {
  ALL: "All",
  PROCESSING: "Processing",
  REQUESTED: "Requested",
  SETTLED: "Settled",
  FAILED: "Failed",
  REVERSED: "Reversed",
};

/** Not settled and not given up on — the only ones an admin can still act on. */
const IN_FLIGHT: WithdrawalStatus[] = ["REQUESTED", "PROCESSING"];

const PAGE_SIZE = 20;

function formatNaira(n: number): string {
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

export default function AdminWithdrawalsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("ALL");
  // A vendor's Payout tab links here with `?search=<email>`.
  const [search, setSearch] = useState(() =>
    typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("search") ?? ""
  );

  const withdrawals = useAdminWithdrawals({
    page,
    limit: PAGE_SIZE,
    status: filter === "ALL" ? undefined : filter,
    search: search.trim() || undefined,
  });

  const rows = withdrawals.data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Withdrawals"
        description="Every vendor payout — in flight, settled, failed or reversed. Ones still in flight are listed first."
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
              placeholder="Search reference, vendor or email"
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
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {withdrawals.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load withdrawals.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Reference</th>
                <th className="py-3 pr-4">Vendor</th>
                <th className="py-3 pr-4">To</th>
                <th className="py-3 pr-4">Requested</th>
                <th className="py-3 pr-4">Fee</th>
                <th className="py-3 pr-4">Sent</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Requested on</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.isLoading ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-gray-400">
                    Loading withdrawals…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-gray-400">
                    {search || filter !== "ALL"
                      ? "No withdrawals match."
                      : "No withdrawals yet."}
                  </td>
                </tr>
              ) : (
                rows.map((w) => <WithdrawalRow key={w.id} withdrawal={w} />)
              )}
            </tbody>
          </table>
        </div>

        {withdrawals.data && withdrawals.data.total > 0 && (
          <Paginator
            page={page}
            total={withdrawals.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={rows.length}
            onChange={setPage}
            label="withdrawals"
          />
        )}
      </div>
    </div>
  );
}

function WithdrawalRow({ withdrawal: w }: { withdrawal: AdminWithdrawal }) {
  const retry = useRetryWithdrawal();
  const fail = useFailWithdrawal();
  const verify = useVerifyWithdrawal();
  const confirm = useConfirm();
  const prompt = usePrompt();

  const inFlight = IN_FLIGHT.includes(w.status);
  const refunded = w.status === "FAILED" || w.status === "REVERSED";
  const busy = retry.isPending || fail.isPending || verify.isPending;
  const error = retry.error ?? fail.error ?? verify.error;

  const onRetry = async () => {
    const ok = await confirm({
      title: "Retry this withdrawal?",
      message:
        "Paystack is checked first. If it already has this transfer, it is settled or left to finish — it is only sent again if Paystack has no record of it.",
      confirmLabel: "Retry now",
      variant: "primary",
    });
    if (ok) retry.mutate(w.id);
  };

  const onFail = async () => {
    const reason = await prompt({
      title: "Give up on this withdrawal?",
      message: `Paystack is checked first: this is refused if Paystack is still sending it, and settled instead if Paystack paid it. Otherwise ${formatNaira(w.amountRequested)} goes back to the vendor's balance.`,
      placeholder: "Why? (at least 5 characters, shown on their statement)",
      confirmLabel: "Fail and refund",
      variant: "danger",
      required: true,
    });
    if (reason && reason.trim().length >= 5) {
      fail.mutate({ id: w.id, reason: reason.trim() });
    }
  };

  return (
    <>
      <tr className="border-b border-gray-100 align-top">
        <td className="py-3 pr-4 font-mono text-xs text-gray-700">
          {w.reference}
        </td>
        <td className="py-3 pr-4">
          {w.vendor ? (
            <Link
              href={`/admin/vendors/${w.vendor.id}`}
              className="flex flex-col hover:text-recommend-orange"
            >
              <span className="text-gray-800">
                {w.vendor.businessName || w.vendor.name}
              </span>
              <span className="text-xs text-gray-500">{w.vendor.email}</span>
            </Link>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </td>
        <td className="py-3 pr-4 text-gray-700">
          {w.account ? (
            <div className="flex flex-col">
              <span>{w.account.accountName}</span>
              <span className="text-xs text-gray-500">
                {w.account.bankName} ·{" "}
                <span className="font-mono">{w.account.accountNumber}</span>
              </span>
            </div>
          ) : (
            "—"
          )}
        </td>
        <td className="py-3 pr-4 font-bold text-gray-900">
          {formatNaira(w.amountRequested)}
        </td>
        <td className="py-3 pr-4 text-gray-500">{formatNaira(w.feeAmount)}</td>
        <td className="py-3 pr-4 text-gray-700">{formatNaira(w.amountSent)}</td>
        <td className="py-3 pr-4">
          <StatusPill status={w.status} />
          {w.failureReason && (
            <p className="text-xs text-red-600 max-w-[240px] mt-0.5">
              {w.failureReason}
            </p>
          )}
          {inFlight && w.attempts > 1 && (
            <p className="text-xs text-gray-500 mt-0.5">
              {w.attempts} attempts
              {w.lastAttemptAt &&
                ` · last ${new Date(w.lastAttemptAt).toLocaleString()}`}
            </p>
          )}
        </td>
        <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
          {new Date(w.createdAt).toLocaleString()}
          {w.settledAt && (
            <p className="text-xs text-green-700">
              Settled {new Date(w.settledAt).toLocaleString()}
            </p>
          )}
        </td>
        <td className="py-3 pr-4">
          {inFlight && (
            <div className="flex flex-col gap-1.5 items-start">
              <button
                onClick={onRetry}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-dm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw
                  size={13}
                  className={retry.isPending ? "animate-spin" : ""}
                />
                {retry.isPending ? "Checking…" : "Retry"}
              </button>
              <button
                onClick={onFail}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-dm bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 whitespace-nowrap"
              >
                <Undo2 size={13} />
                {fail.isPending ? "Refunding…" : "Fail and refund"}
              </button>
            </div>
          )}
          {/* A refunded one may have been paid after all — the refund is then taken back. */}
          {refunded && (
            <button
              onClick={() => verify.mutate(w.id)}
              disabled={busy}
              title="Ask Paystack whether this was actually paid"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-dm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
            >
              <SearchCheck size={13} />
              {verify.isPending ? "Checking…" : "Check Paystack"}
            </button>
          )}
        </td>
      </tr>

      {error && (
        <tr className="border-b border-gray-100">
          <td colSpan={9} className="py-2 px-4 text-xs text-red-600 bg-red-50">
            {error.message}
          </td>
        </tr>
      )}
    </>
  );
}
