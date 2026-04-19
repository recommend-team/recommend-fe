"use client";

import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Coins,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import StatusPill from "@/components/atoms/admin/StatusPill";
import {
  useCurrentUser,
  useMyVendorProfile,
  useMyProducts,
  useMyVendorOrders,
  useMyVendorEarnings,
} from "@/hooks";

function formatNaira(raw: string | number): string {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export default function VendorDashboardPage() {
  const { data: user } = useCurrentUser();
  const profile = useMyVendorProfile();
  const products = useMyProducts({ page: 1, limit: 5 });
  const orders = useMyVendorOrders({ page: 1, limit: 5 });
  const earnings = useMyVendorEarnings();

  const productCount = products.data?.total ?? 0;
  const orderCount = orders.data?.total ?? 0;
  const isOpen = profile.data?.isOpen ?? false;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName ?? "vendor"}`}
        description={profile.data?.businessName ?? ""}
        right={
          <span className="inline-flex items-center gap-1.5 text-xs font-bold font-dm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span
              className={isOpen ? "text-green-700" : "text-gray-500"}
            >
              {isOpen ? "Store is open" : "Store is closed"}
            </span>
          </span>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingBag}
          label="Total orders"
          value={orders.isLoading ? undefined : orderCount}
          subtext="All time"
        />
        <StatCard
          icon={Package}
          label="Products"
          value={products.isLoading ? undefined : productCount}
          subtext={`${20 - productCount} slots left (max 20)`}
        />
        <StatCard
          icon={Coins}
          label="Net earnings"
          value={
            earnings.data ? formatNaira(earnings.data.netTotal) : undefined
          }
          subtext="After 20% platform fee"
          isCurrency
        />
        <StatCard
          icon={TrendingUp}
          label="Gross revenue"
          value={
            earnings.data ? formatNaira(earnings.data.grossTotal) : undefined
          }
          subtext="Before platform fee"
          isCurrency
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-dm text-gray-900">
              Recent orders
            </h2>
            <Link
              href="/vendor/dashboard/orders"
              className="text-sm font-bold font-dm text-recommend-orange flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {orders.isLoading ? (
            <p className="text-sm font-dm text-gray-400 py-4">Loading…</p>
          ) : orders.data && orders.data.items.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {orders.data.items.slice(0, 5).map((o) => (
                <li
                  key={o.id}
                  className="py-3 flex items-center justify-between text-sm font-dm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {o.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {o.buyerName} · {formatNaira(o.totalAmount)}
                    </p>
                  </div>
                  <StatusPill status={o.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-dm text-gray-400 py-4">
              No orders yet. Your store is ready — share your link to start
              receiving orders.
            </p>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-dm text-gray-900">
              Recent products
            </h2>
            <Link
              href="/vendor/dashboard/products/new"
              className="text-sm font-bold font-dm text-recommend-orange flex items-center gap-1"
            >
              <Plus size={14} /> Add product
            </Link>
          </div>
          {products.isLoading ? (
            <p className="text-sm font-dm text-gray-400 py-4">Loading…</p>
          ) : products.data && products.data.items.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {products.data.items.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="py-3 flex items-center justify-between text-sm font-dm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatNaira(p.price)} ·{" "}
                      {p.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>
                  <Link
                    href={`/vendor/dashboard/products/${p.id}`}
                    className="text-xs font-bold font-dm text-recommend-orange underline"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-dm text-gray-400 py-4">
              No products yet.{" "}
              <Link
                href="/vendor/dashboard/products/new"
                className="text-recommend-orange font-bold underline"
              >
                Add your first product
              </Link>
              .
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  isCurrency,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string | undefined;
  subtext?: string;
  isCurrency?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#FFD91D] p-4 md:p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold font-dm uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <Icon size={18} className="text-recommend-orange" />
      </div>
      <span
        className={`font-bold font-dm text-gray-900 ${isCurrency ? "text-xl md:text-2xl" : "text-3xl"}`}
      >
        {value === undefined
          ? "—"
          : typeof value === "number"
            ? value.toLocaleString()
            : value}
      </span>
      {subtext && (
        <span className="text-xs font-dm text-gray-400">{subtext}</span>
      )}
    </div>
  );
}
