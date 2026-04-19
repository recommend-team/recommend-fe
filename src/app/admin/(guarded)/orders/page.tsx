"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import StatusPill from "@/components/atoms/admin/StatusPill";
import Paginator from "@/components/atoms/admin/Paginator";
import PageHeader from "@/components/atoms/admin/PageHeader";
import { useAdminOrders } from "@/hooks";
import type { AdminOrderSummary } from "@/types";

type OrderStatus = AdminOrderSummary["status"];

const STATUSES: Array<OrderStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "PAID",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
];

const PAGE_SIZE = 20;

function formatNaira(raw: string | number): string {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const orders = useAdminOrders({
    page,
    limit: PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
  });

  const rows = orders.data?.items ?? [];
  const filtered = rows.filter((o) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return (
      o.buyerName.toLowerCase().includes(needle) ||
      o.buyerPhone.includes(needle) ||
      o.product.name.toLowerCase().includes(needle) ||
      (o.vendor.businessName ?? "").toLowerCase().includes(needle)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description="Platform-wide order oversight. Read-only — backend doesn't expose refund or override endpoints yet."
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
              placeholder="Search buyer, phone, product, vendor"
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

        {orders.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load orders.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Vendor</th>
                <th className="py-3 pr-4">Buyer</th>
                <th className="py-3 pr-4">Qty</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.isLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    Loading orders…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    {search ? "No orders match." : "No orders yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-gray-100 hover:bg-amber-50/40"
                  >
                    <td className="py-3 pr-4 font-bold text-gray-900">
                      {o.product.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      {o.vendor.businessName ??
                        `${o.vendor.firstName} ${o.vendor.lastName}`}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800">{o.buyerName}</span>
                        <span className="text-xs text-gray-500">
                          {o.buyerPhone}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-700">{o.quantity}</td>
                    <td className="py-3 pr-4 font-bold text-gray-900">
                      {formatNaira(o.totalAmount)}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {orders.data && orders.data.total > 0 && (
          <Paginator
            page={page}
            total={orders.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={rows.length}
            onChange={setPage}
            label="orders"
          />
        )}
      </div>
    </div>
  );
}
