"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, ArrowDown, Plus } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import { useVendors } from "@/hooks";
import CreateVendorDialog from "@/components/organisms/vendor-admin/CreateVendorDialog";
import type { UserStatus, VendorOrderSort } from "@/types";

/** Order counts by period — paid, not cancelled or refunded, Lagos time. */
const ORDER_COLUMNS: { key: VendorOrderSort; label: string; hint: string }[] = [
  { key: "today", label: "Today", hint: "Orders since midnight" },
  { key: "week", label: "This week", hint: "Orders since Monday" },
  { key: "month", label: "This month", hint: "Orders since the 1st" },
  { key: "allTime", label: "All time", hint: "Every order" },
];

const STATUSES: Array<UserStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "SUSPENDED",
  "DEACTIVATED",
];

const PAGE_SIZE = 20;

export default function VendorsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  // Ranked on the server, so "top this week" is across every vendor, not this page's.
  const [sort, setSort] = useState<VendorOrderSort | undefined>(undefined);
  const [creating, setCreating] = useState(false);

  const vendors = useVendors({
    page,
    limit: PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
    sort,
  });

  const toggleSort = (key: VendorOrderSort) => {
    // A second click on the same column goes back to newest first.
    setSort((current) => (current === key ? undefined : key));
    setPage(1);
  };

  const rows = vendors.data?.items ?? [];
  const filtered = rows.filter((v) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return (
      (v.businessName ?? "").toLowerCase().includes(needle) ||
      v.email.toLowerCase().includes(needle) ||
      `${v.firstName} ${v.lastName}`.toLowerCase().includes(needle)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vendors"
        description="Review, approve, and manage vendor accounts."
        right={
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-recommend-green px-4 py-2 font-dm text-sm font-bold text-white hover:bg-recommend-green-hover"
          >
            <Plus size={15} /> Add vendor
          </button>
        }
      />

      {creating && (
        <CreateVendorDialog
          onClose={() => setCreating(false)}
          onCreated={(vendor) =>
            // Their page says whether the set-password email went.
            router.push(`/admin/vendors/${vendor.id}?created=1&invite=${vendor.inviteSent ? 1 : 0}`)
          }
        />
      )}

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search business, name, or email"
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
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {vendors.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load vendors. Refresh to try again.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Business</th>
                <th className="py-3 pr-4">Tier</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Status</th>
                {ORDER_COLUMNS.map(({ key, label, hint }) => (
                  <th key={key} className="py-3 pr-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleSort(key)}
                      title={`${hint}. Click to rank by this.`}
                      aria-pressed={sort === key}
                      className={`inline-flex items-center gap-1 uppercase tracking-wide whitespace-nowrap hover:text-gray-800 ${
                        sort === key ? "text-recommend-orange" : ""
                      }`}
                    >
                      {label}
                      {sort === key && <ArrowDown size={12} />}
                    </button>
                  </th>
                ))}
                <th className="py-3 pr-4">Created</th>
                <th className="py-3 pr-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.isLoading ? (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-gray-400">
                    Loading vendors…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-gray-400">
                    {search ? "No vendors match." : "No vendors yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => router.push(`/admin/vendors/${v.id}`)}
                    className="border-b border-gray-100 hover:bg-amber-50/40 cursor-pointer"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {v.businessName ?? "Unnamed"}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-[280px]">
                          {v.firstName} {v.lastName} · {v.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      {v.vendorType === "REGISTERED"
                        ? "Registered"
                        : "Non-registered"}
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      {v.businessCategory ?? "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusPill status={v.status} />
                    </td>
                    {ORDER_COLUMNS.map(({ key }) => {
                      const count = v.orders?.[key] ?? 0;
                      return (
                        <td
                          key={key}
                          className={`py-3 pr-4 text-right tabular-nums ${
                            count === 0
                              ? "text-gray-300"
                              : sort === key
                                ? "font-bold text-gray-900"
                                : "text-gray-700"
                          }`}
                        >
                          {count.toLocaleString()}
                        </td>
                      );
                    })}
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <ChevronRight size={16} className="text-gray-400" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {vendors.data && vendors.data.total > 0 && (
          <Paginator
            page={page}
            total={vendors.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={rows.length}
            onChange={setPage}
            label="vendors"
          />
        )}
      </div>
    </div>
  );
}
