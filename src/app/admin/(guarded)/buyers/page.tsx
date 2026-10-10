"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import { useBuyers } from "@/hooks";
import type { UserStatus } from "@/types";

const STATUSES: Array<UserStatus | "ALL"> = [
  "ALL",
  "APPROVED",
  "SUSPENDED",
  "DEACTIVATED",
];

const PAGE_SIZE = 20;

export default function BuyersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const buyers = useBuyers({
    page,
    limit: PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
  });

  const rows = buyers.data?.items ?? [];
  const filtered = rows.filter((b) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return (
      (b.email ?? "").toLowerCase().includes(needle) ||
      b.phoneNumber.includes(needle) ||
      `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase().includes(needle)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Buyers"
        description="WhatsApp customer accounts. Buyers register via the bot, not the website."
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, or phone"
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

        {buyers.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load buyers.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Buyer</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Joined</th>
                <th className="py-3 pr-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.isLoading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    Loading buyers…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    {search ? "No buyers match." : "No buyers yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => router.push(`/admin/buyers/${b.id}`)}
                    className="border-b border-gray-100 hover:bg-amber-50/40 cursor-pointer"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {`${b.firstName ?? ""} ${b.lastName ?? ""}`.trim() ||
                            "Unnamed buyer"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {b.email ?? "No email"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-700">{b.phoneNumber}</td>
                    <td className="py-3 pr-4">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(b.createdAt).toLocaleDateString()}
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

        {buyers.data && buyers.data.total > 0 && (
          <Paginator
            page={page}
            total={buyers.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={rows.length}
            onChange={setPage}
            label="buyers"
          />
        )}
      </div>
    </div>
  );
}
