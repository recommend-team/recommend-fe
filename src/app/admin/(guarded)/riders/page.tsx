"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Search, UserPlus, Phone } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import AddRiderDialog from "@/components/organisms/AddRiderDialog";
import { useRiders, useApprovePending, useRejectPending } from "@/hooks";
import { useConfirm, usePrompt } from "@/components/organisms/DialogProvider";
import type { AdminRider, UserStatus } from "@/types";

const PAGE_SIZE = 20;

const FILTERS: { value: UserStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Awaiting approval" },
  { value: "SUSPENDED", label: "Suspended" },
];

export default function RidersPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const prompt = usePrompt();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  // `?add=1` (from the rider picker, when there is nobody to pick) opens the form.
  const [adding, setAdding] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("add")
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const riders = useRiders({
    page,
    limit: PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
    search: search.trim() || undefined,
  });
  const approve = useApprovePending();
  const reject = useRejectPending();
  const rows = riders.data?.items ?? [];

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

  const onApprove = async (r: AdminRider) => {
    const ok = await confirm({
      title: `Approve ${r.firstName} ${r.lastName}?`,
      message: "They can be assigned to deliveries straight away.",
      confirmLabel: "Approve",
      variant: "primary",
    });
    if (!ok) return;
    runAction(() => approve.mutateAsync(r.id));
  };

  const onReject = async (r: AdminRider) => {
    const reason = await prompt({
      title: `Reject ${r.firstName} ${r.lastName}?`,
      message:
        "Their application will be marked as rejected. A short reason helps them understand what to change.",
      placeholder: "e.g. Guarantor phone not reachable",
      confirmLabel: "Reject",
      variant: "danger",
      multiline: true,
    });
    if (reason === null) return;
    runAction(() => reject.mutateAsync({ id: r.id, reason }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Riders"
          description="Everyone who delivers for Recommend. Assign them to deliveries from Transactions, and reach them by phone."
        />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-recommend-green px-4 py-2.5 font-dm text-sm font-bold text-white hover:bg-recommend-green-hover"
        >
          <UserPlus size={16} />
          Add rider
        </button>
      </div>

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
              placeholder="Search name, phone or email"
              aria-label="Search riders"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setStatus(f.value);
                  setPage(1);
                }}
                aria-pressed={status === f.value}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-dm transition-colors ${
                  status === f.value
                    ? "bg-recommend-orange text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {actionError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">{actionError}</p>
        )}
        {riders.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load riders.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Rider</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Deliveries</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Added</th>
                <th className="py-3 pr-4 w-44"></th>
              </tr>
            </thead>
            <tbody>
              {riders.isLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    Loading riders…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    {search || status !== "ALL" ? "No riders match." : "No riders yet — add your first."}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/admin/riders/${r.id}`)}
                    className="border-b border-gray-100 hover:bg-amber-50/40 align-top cursor-pointer"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {r.firstName} {r.lastName}
                        </span>
                        <span className="text-xs text-gray-500">{r.email ?? "No email"}</span>
                        {r.riderNote && (
                          <span className="mt-0.5 max-w-xs truncate text-xs text-gray-400">
                            {r.riderNote}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                      {r.phoneNumber ? (
                        <a
                          href={`tel:${r.phoneNumber}`}
                          className="inline-flex items-center gap-1 text-gray-700 hover:text-recommend-green"
                        >
                          <Phone size={12} /> {r.phoneNumber}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      {r.riderType === "COMPANY" ? "Fleet" : "Solo"}
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      <span className={r.activeDeliveries > 0 ? "font-bold text-gray-900" : ""}>
                        {r.activeDeliveries} in progress
                      </span>
                      <span className="block text-xs text-gray-500">
                        {r.completedDeliveries} delivered
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                      {r.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onApprove(r)}
                            disabled={approve.isPending}
                            className="flex items-center gap-1 rounded-full bg-recommend-green px-3 py-1.5 text-xs font-bold text-white hover:bg-recommend-green-hover disabled:opacity-50"
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(r)}
                            disabled={reject.isPending}
                            className="flex items-center gap-1 rounded-full bg-white border border-red-500 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {riders.data && riders.data.total > 0 && (
          <Paginator
            page={page}
            total={riders.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={rows.length}
            onChange={setPage}
            label="riders"
          />
        )}
      </div>

      {adding && (
        <AddRiderDialog
          onClose={() => setAdding(false)}
          onCreated={(rider) => router.push(`/admin/riders/${rider.id}`)}
        />
      )}
    </div>
  );
}
