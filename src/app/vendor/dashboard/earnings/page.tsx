"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Coins, TrendingUp, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import { useMyVendorEarnings } from "@/hooks";

function formatNaira(raw: string | number): string {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function formatMonth(ym: string): string {
  // ym is expected as YYYY-MM
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export default function EarningsPage() {
  const earnings = useMyVendorEarnings();

  const chartData = earnings.data
    ? [...earnings.data.monthlyBreakdown]
        .sort((a, b) => a.month.localeCompare(b.month))
        .map((m) => ({
          month: formatMonth(m.month),
          gross: Number(m.gross),
          net: Number(m.net),
        }))
    : [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Earnings"
        description="Your gross revenue, net payout, and platform fees from all PAID and COMPLETED orders."
      />

      {earnings.isError && (
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Couldn&apos;t load earnings. Refresh to try again.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Gross revenue"
          value={
            earnings.data ? formatNaira(earnings.data.grossTotal) : undefined
          }
          subtext="Total sales before deductions"
        />
        <StatCard
          icon={Coins}
          label="Your net earnings"
          value={
            earnings.data ? formatNaira(earnings.data.netTotal) : undefined
          }
          subtext="After 20% platform fee"
          accent="text-recommend-green"
        />
        <StatCard
          icon={Receipt}
          label="Platform fees"
          value={
            earnings.data
              ? formatNaira(earnings.data.platformFeeTotal)
              : undefined
          }
          subtext="Recommend's share"
        />
      </div>

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-dm text-gray-900">
              12-month trend
            </h2>
            <p className="text-xs font-dm text-gray-500">
              Monthly gross revenue and your net payout.
            </p>
          </div>
        </div>
        {earnings.isLoading ? (
          <div className="h-[320px] flex items-center justify-center">
            <p className="text-sm font-dm text-gray-400">Loading chart…</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center">
            <p className="text-sm font-dm text-gray-400">
              No earnings in the last 12 months yet.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 16, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={11}
                tickMargin={8}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(v) =>
                  v >= 1_000_000
                    ? `₦${(v / 1_000_000).toFixed(1)}M`
                    : v >= 1_000
                      ? `₦${(v / 1_000).toFixed(0)}k`
                      : `₦${v}`
                }
              />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number"
                    ? formatNaira(value)
                    : String(value)
                }
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="gross"
                name="Gross"
                stroke="#EF5A22"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="net"
                name="Net"
                stroke="#006837"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6">
        <h2 className="text-lg font-bold font-dm text-gray-900 mb-3">
          Monthly breakdown
        </h2>
        {earnings.isLoading ? (
          <p className="text-sm font-dm text-gray-400 py-4">Loading…</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm font-dm text-gray-400 py-4">No data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-dm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">Month</th>
                  <th className="py-2 pr-4">Gross</th>
                  <th className="py-2 pr-4">Net</th>
                  <th className="py-2 pr-4">Platform fee</th>
                </tr>
              </thead>
              <tbody>
                {[...chartData].reverse().map((row) => {
                  const fee = row.gross - row.net;
                  return (
                    <tr key={row.month} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-gray-800">{row.month}</td>
                      <td className="py-2 pr-4 text-gray-900 font-bold">
                        {formatNaira(row.gross)}
                      </td>
                      <td className="py-2 pr-4 text-recommend-green font-bold">
                        {formatNaira(row.net)}
                      </td>
                      <td className="py-2 pr-4 text-gray-500">
                        {formatNaira(fee)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs font-dm text-gray-400">
        Note: payout requests aren&apos;t available yet — the backend records
        balances but doesn&apos;t expose a withdrawal endpoint. Contact
        support for manual payouts.
      </p>
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
  value: string | undefined;
  subtext?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold font-dm uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <Icon size={18} className={accent ?? "text-recommend-orange"} />
      </div>
      <span
        className={`text-2xl md:text-3xl font-bold font-dm ${accent ?? "text-gray-900"}`}
      >
        {value ?? "—"}
      </span>
      {subtext && (
        <span className="text-xs font-dm text-gray-400">{subtext}</span>
      )}
    </div>
  );
}
