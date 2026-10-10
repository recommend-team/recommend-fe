"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import {
  Store,
  Bike,
  ShoppingBag,
  Users,
  Coins,
  ShieldCheck,
  Clock,
  TrendingUp,
} from "lucide-react";
import { usePlatformStats, usePendingApprovals, useCurrentUser } from "@/hooks";
import type { LucideIcon } from "lucide-react";

const COLORS = ["#EF5A22", "#006837", "#FFD91D", "#5398e2"];

function formatNaira(raw: string | number): string {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export default function AdminDashboardPage() {
  const { data: user } = useCurrentUser();
  const stats = usePlatformStats();
  const pending = usePendingApprovals(1, 20);

  const pendingCount =
    (stats.data?.pendingVendors ?? 0) + (stats.data?.pendingRiders ?? 0);

  const userDistribution = stats.data
    ? [
        { name: "Buyers", value: stats.data.totalBuyers },
        { name: "Vendors", value: stats.data.totalVendors },
        { name: "Riders", value: stats.data.totalRiders },
      ].filter((d) => d.value > 0)
    : [];

  const approvalBarData = stats.data
    ? [
        {
          name: "Vendors",
          approved: stats.data.totalVendors - stats.data.pendingVendors,
          pending: stats.data.pendingVendors,
        },
        {
          name: "Riders",
          approved: stats.data.totalRiders - stats.data.pendingRiders,
          pending: stats.data.pendingRiders,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-dm text-gray-900">
            Welcome, {user?.firstName ?? "Admin"}.
          </h1>
          <p className="text-sm font-dm text-gray-500">
            Live platform snapshot from the Recommend API.
          </p>
        </div>
        {pendingCount > 0 && (
          <Link
            href="/admin/kyc"
            className="flex items-center gap-2 rounded-full bg-recommend-orange px-4 py-2 text-sm font-bold font-dm text-white hover:bg-orange-600 transition-colors"
          >
            <ShieldCheck size={16} />
            {pendingCount} pending approval{pendingCount === 1 ? "" : "s"}
          </Link>
        )}
      </div>

      {stats.isError && (
        <ErrorBanner message="Couldn't load platform stats. Refresh to try again." />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Store}
          label="Total vendors"
          value={stats.data?.totalVendors}
          subtext={
            stats.data
              ? `${stats.data.pendingVendors} pending`
              : "Loading…"
          }
          accent="text-recommend-orange"
        />
        <StatCard
          icon={Bike}
          label="Total riders"
          value={stats.data?.totalRiders}
          subtext={
            stats.data ? `${stats.data.pendingRiders} pending` : "Loading…"
          }
          accent="text-recommend-green"
        />
        <StatCard
          icon={Users}
          label="Total buyers"
          value={stats.data?.totalBuyers}
          subtext="WhatsApp customers"
          accent="text-blue-500"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total orders"
          value={stats.data?.totalOrders}
          subtext={
            stats.data ? `${stats.data.paidOrders} paid` : "Loading…"
          }
          accent="text-recommend-orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueCard
          icon={Coins}
          label="Total revenue"
          value={stats.data ? formatNaira(stats.data.totalRevenue) : "—"}
          subtext="All paid, processing, and completed orders"
        />
        <RevenueCard
          icon={TrendingUp}
          label="Platform fees"
          value={stats.data ? formatNaira(stats.data.totalPlatformFee) : "—"}
          subtext="Recommend's share of transactions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="User distribution">
          {stats.isLoading ? (
            <ChartSkeleton />
          ) : userDistribution.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {userDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Approvals by role">
          {stats.isLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={approvalBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="approved"
                  name="Approved"
                  fill="#006837"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  name="Pending"
                  fill="#EF5A22"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold font-dm text-gray-900">
            Recent pending approvals
          </h2>
          <Link
            href="/admin/kyc"
            className="text-sm font-bold font-dm text-recommend-orange underline"
          >
            View all
          </Link>
        </div>
        {pending.isLoading ? (
          <p className="text-sm font-dm text-gray-400">Loading…</p>
        ) : pending.data && pending.data.items.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {pending.data.items.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="py-3 flex items-center justify-between text-sm font-dm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                      p.role === "SELLER"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {p.role === "SELLER" ? "Vendor" : "Rider"}
                  </span>
                  <span className="text-gray-900 font-bold truncate">
                    {p.businessName ||
                      `${p.firstName} ${p.lastName}`.trim() ||
                      "Unnamed"}
                  </span>
                  <span className="text-gray-500 truncate hidden md:inline">
                    {p.email}
                  </span>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-dm text-gray-400">
            No pending approvals right now.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: number | undefined;
  subtext?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#FFD91D] p-4 md:p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold font-dm uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <Icon size={18} className={accent ?? "text-gray-400"} />
      </div>
      <span className="text-3xl font-bold font-dm text-gray-900">
        {value === undefined ? "—" : value.toLocaleString()}
      </span>
      {subtext && (
        <span className="text-xs font-dm text-gray-400">{subtext}</span>
      )}
    </div>
  );
}

function RevenueCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
        <Icon size={20} className="text-recommend-orange" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold font-dm uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <span className="text-2xl font-bold font-dm text-gray-900">
          {value}
        </span>
        {subtext && (
          <span className="text-xs font-dm text-gray-400">{subtext}</span>
        )}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6">
      <h3 className="text-base font-bold font-dm text-gray-900 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[260px] flex items-center justify-center">
      <p className="text-sm font-dm text-gray-400">Loading chart…</p>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-[260px] flex items-center justify-center">
      <p className="text-sm font-dm text-gray-400">No data yet.</p>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 p-3 text-sm font-dm">
      {message}
    </div>
  );
}
