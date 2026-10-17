"use client";

import { History } from "lucide-react";
import { useVendorHistory } from "@/hooks";
import type { VendorAdminAction } from "@/types";

const ACTION_LABELS: Record<VendorAdminAction, string> = {
  CREATED: "Set up",
  STORE_UPDATED: "Store",
  OWNER_UPDATED: "Owner",
  EMAIL_CHANGED: "Login email",
  INVITE_SENT: "Password link",
  KYC_UPDATED: "Documents",
  PRODUCT_ADDED: "Product added",
  PRODUCT_UPDATED: "Product",
  PRODUCT_REMOVED: "Product removed",
  DEACTIVATED: "Deactivated",
};

/**
 * What admins have changed on this vendor, newest first, and who — so "who changed this
 * price?" has an answer. The vendor's own edits aren't here; only Recommend's.
 */
export default function VendorHistoryTab({ vendorId }: { vendorId: string }) {
  const history = useVendorHistory(vendorId, true);
  const entries = history.data ?? [];

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-[#FFD91D] bg-white p-5 md:p-6">
      <header className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-recommend-orange">
          <History size={14} />
        </span>
        <div>
          <h3 className="font-dm text-base font-bold text-gray-900">Changes by admins</h3>
          <p className="font-dm text-xs text-gray-500">
            The vendor&apos;s own edits aren&apos;t listed — only Recommend&apos;s.
          </p>
        </div>
      </header>

      {history.isLoading && (
        <p className="py-6 text-center font-dm text-sm text-gray-400">Loading history…</p>
      )}
      {history.isError && (
        <p className="py-6 text-center font-dm text-sm text-red-600">
          Couldn&apos;t load the history.
        </p>
      )}
      {!history.isLoading && !history.isError && entries.length === 0 && (
        <p className="py-6 text-center font-dm text-sm text-gray-400">
          No admin has changed anything on this vendor yet.
        </p>
      )}

      <ol className="flex flex-col divide-y divide-gray-100">
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5 font-dm text-sm">
            <span className="w-40 shrink-0 text-xs text-gray-400">
              {new Date(entry.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">
              {ACTION_LABELS[entry.action] ?? entry.action}
            </span>
            <span className="min-w-0 flex-1 text-gray-800">{entry.summary}</span>
            <span className="shrink-0 text-xs text-gray-500">by {entry.admin.name}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
