"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, FileText, ExternalLink } from "lucide-react";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import {
  usePendingApprovals,
  useApprovePending,
  useRejectPending,
} from "@/hooks";
import { useConfirm, usePrompt } from "@/components/organisms/DialogProvider";
import type { PendingApproval } from "@/types";

type RoleFilter = "ALL" | "SELLER" | "RIDER";
const ROLE_FILTERS: Array<{ value: RoleFilter; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "SELLER", label: "Vendors" },
  { value: "RIDER", label: "Riders" },
];

const PAGE_SIZE = 20;

function docsFor(p: PendingApproval): Array<{ label: string; url: string }> {
  const list: Array<{ label: string; url: string }> = [];
  if (p.role === "SELLER") {
    if (p.vendorType === "REGISTERED") {
      if (p.cacDocumentUrl)
        list.push({ label: "CAC certificate", url: p.cacDocumentUrl });
      if (p.tinDocumentUrl)
        list.push({ label: "TIN certificate", url: p.tinDocumentUrl });
    } else {
      if (p.ninDocumentUrl)
        list.push({ label: "NIN document", url: p.ninDocumentUrl });
      if (p.passportPhotoUrl)
        list.push({ label: "Passport photo", url: p.passportPhotoUrl });
      if (p.bankStatementUrl)
        list.push({ label: "Bank statement", url: p.bankStatementUrl });
      if (p.utilityBillUrl)
        list.push({ label: "Utility bill", url: p.utilityBillUrl });
    }
  } else if (p.role === "RIDER") {
    if (p.governmentIdUrl)
      list.push({ label: "Government ID", url: p.governmentIdUrl });
    if (p.selfieUrl) list.push({ label: "Selfie", url: p.selfieUrl });
  }
  return list;
}

export default function KycPage() {
  const confirm = useConfirm();
  const prompt = usePrompt();
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [actionError, setActionError] = useState<string | null>(null);

  const pending = usePendingApprovals(page, PAGE_SIZE);
  const approve = useApprovePending();
  const reject = useRejectPending();

  const rows = pending.data?.items ?? [];
  const filtered =
    roleFilter === "ALL" ? rows : rows.filter((r) => r.role === roleFilter);

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

  const onApprove = async (p: PendingApproval) => {
    const name =
      p.businessName || `${p.firstName} ${p.lastName}`.trim() || "applicant";
    const kind = p.role === "SELLER" ? "vendor" : "rider";
    const ok = await confirm({
      title: `Approve ${name}?`,
      message: `They'll be able to operate as a ${kind} on the platform immediately.`,
      confirmLabel: "Approve",
      variant: "primary",
    });
    if (!ok) return;
    runAction(() => approve.mutateAsync(p.id));
  };

  const onReject = async (p: PendingApproval) => {
    const name =
      p.businessName || `${p.firstName} ${p.lastName}`.trim() || "applicant";
    const reason = await prompt({
      title: `Reject ${name}?`,
      message:
        "The applicant will be notified and can resubmit. A short reason helps them fix the issue.",
      placeholder: "e.g. CAC document unreadable",
      confirmLabel: "Reject",
      variant: "danger",
      multiline: true,
    });
    if (reason === null) return;
    runAction(() => reject.mutateAsync({ id: p.id, reason }));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="KYC Verifications"
        description="Approve or reject vendor and rider applications. Click any document to view in a new tab."
      />

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
        <div className="flex gap-2">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setRoleFilter(f.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-dm transition-colors ${
                roleFilter === f.value
                  ? "bg-recommend-orange text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
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

        {pending.isLoading ? (
          <p className="text-sm font-dm text-gray-400 py-6 text-center">
            Loading queue…
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm font-dm text-gray-400 py-6 text-center">
            No pending applications.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {filtered.map((p) => {
              const docs = docsFor(p);
              const isVendor = p.role === "SELLER";
              return (
                <li
                  key={p.id}
                  className="rounded-xl bg-amber-50/40 border border-amber-100 p-4 flex flex-col md:flex-row md:items-start gap-4"
                >
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isVendor
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isVendor ? "Vendor" : "Rider"}
                      </span>
                      {isVendor && p.vendorType && (
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                          {p.vendorType === "REGISTERED"
                            ? "Registered"
                            : "Non-registered"}
                        </span>
                      )}
                      {!isVendor && p.riderType && (
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                          {p.riderType === "COMPANY"
                            ? "Company"
                            : "Individual"}
                        </span>
                      )}
                      <span className="text-[10px] font-dm text-gray-400">
                        Applied {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="font-bold text-gray-900">
                      {p.businessName ||
                        `${p.firstName} ${p.lastName}`.trim() ||
                        "Unnamed"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.email} · {p.phoneNumber}
                    </p>
                    {isVendor && p.businessCategory && (
                      <p className="text-xs text-gray-600">
                        Category: {p.businessCategory}
                      </p>
                    )}

                    {!isVendor && (p.bvn || p.guarantorName) && (
                      <div className="text-xs text-gray-600 flex flex-col gap-0.5">
                        {p.bvn && (
                          <span>
                            BVN: {p.bvn.slice(0, 3)}••••{p.bvn.slice(-3)}
                          </span>
                        )}
                        {p.guarantorName && (
                          <span>
                            Guarantor: {p.guarantorName}
                            {p.guarantorPhone ? ` (${p.guarantorPhone})` : ""}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-2">
                      <p className="text-xs font-bold font-dm text-gray-500 mb-1">
                        Documents ({docs.length})
                      </p>
                      {docs.length === 0 ? (
                        <p className="text-xs text-gray-400">
                          No KYC documents uploaded yet.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {docs.map((d) => (
                            <Link
                              key={d.label}
                              href={d.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-dm text-gray-700 hover:border-recommend-orange hover:text-recommend-orange transition-colors"
                            >
                              <FileText size={12} />
                              {d.label}
                              <ExternalLink size={10} />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 md:w-32 shrink-0">
                    <button
                      onClick={() => onApprove(p)}
                      disabled={approve.isPending}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1 rounded-full bg-recommend-green px-3 py-1.5 text-xs font-bold text-white hover:bg-recommend-green-hover disabled:opacity-50"
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(p)}
                      disabled={reject.isPending}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1 rounded-full bg-white border border-red-500 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X size={14} />
                      Reject
                    </button>
                    {isVendor && (
                      <Link
                        href={`/admin/vendors/${p.id}`}
                        className="flex-1 md:flex-none flex items-center justify-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-dm text-gray-600 hover:border-recommend-orange hover:text-recommend-orange"
                      >
                        Details
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {pending.data && pending.data.total > 0 && (
          <Paginator
            page={page}
            total={pending.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={rows.length}
            onChange={setPage}
            label="pending applications"
          />
        )}
      </div>
    </div>
  );
}
