"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Search } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import {
  usePendingApprovals,
  useApprovePending,
  useRejectPending,
} from "@/hooks";
import { useConfirm, usePrompt } from "@/components/organisms/DialogProvider";
import type { PendingApproval } from "@/types";

const PAGE_SIZE = 20;

export default function RidersPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const prompt = usePrompt();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const pending = usePendingApprovals(page, PAGE_SIZE);
  const approve = useApprovePending();
  const reject = useRejectPending();

  const riders = (pending.data?.items ?? []).filter(
    (p) => p.role === "RIDER"
  );
  const filtered = riders.filter((r) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return (
      r.email.toLowerCase().includes(needle) ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(needle) ||
      r.phoneNumber.includes(needle)
    );
  });

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

  const onApprove = async (r: PendingApproval) => {
    const ok = await confirm({
      title: `Approve ${r.firstName} ${r.lastName}?`,
      message:
        "They will be able to accept delivery orders on the platform immediately.",
      confirmLabel: "Approve",
      variant: "primary",
    });
    if (!ok) return;
    runAction(() => approve.mutateAsync(r.id));
  };

  const onReject = async (r: PendingApproval) => {
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
      <PageHeader
        title="Riders"
        description="Pending rider applications awaiting approval. Backend doesn't expose a full rider roster yet — only the pending queue."
      />

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or phone"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green"
          />
        </div>

        {actionError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            {actionError}
          </p>
        )}
        {pending.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load pending queue.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Rider</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Contact</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Applied</th>
                <th className="py-3 pr-4 w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.isLoading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    Loading riders…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    {search ? "No riders match." : "No pending riders."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
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
                        <span className="text-xs text-gray-500">{r.email}</span>
                        {r.bvn && (
                          <span className="text-xs text-gray-400 mt-0.5">
                            BVN: {r.bvn.slice(0, 3)}••••{r.bvn.slice(-3)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      {r.riderType === "COMPANY" ? "Company" : "Individual"}
                    </td>
                    <td className="py-3 pr-4 text-gray-700">{r.phoneNumber}</td>
                    <td className="py-3 pr-4">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprove(r)}
                          disabled={approve.isPending}
                          className="flex items-center gap-1 rounded-full bg-recommend-green px-3 py-1.5 text-xs font-bold text-white hover:bg-recommend-green-hover disabled:opacity-50"
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(r)}
                          disabled={reject.isPending}
                          className="flex items-center gap-1 rounded-full bg-white border border-red-500 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pending.data && pending.data.total > 0 && (
          <Paginator
            page={page}
            total={pending.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={riders.length}
            onChange={setPage}
            label="pending applications"
          />
        )}
      </div>
    </div>
  );
}
