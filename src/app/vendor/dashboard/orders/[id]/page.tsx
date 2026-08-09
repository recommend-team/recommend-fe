"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import StatusPill from "@/components/atoms/admin/StatusPill";
import { useMyVendorOrders } from "@/hooks";

function formatNaira(raw: string | number): string {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const orders = useMyVendorOrders({ page: 1, limit: 100 });

  const order = orders.data?.items.find((o) => o.id === id);

  const goBack = () => router.push("/vendor/dashboard/orders");

  if (orders.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <p className="text-sm font-dm text-gray-400">Loading order…</p>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="flex flex-col gap-3">
        <BackLink onClick={goBack} />
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Order not found. It may be on a different page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink onClick={goBack} />

      <PageHeader
        title={`Order ${order.id.slice(0, 8).toUpperCase()}`}
        description={`Placed ${new Date(order.createdAt).toLocaleString()}`}
        right={<StatusPill status={order.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 flex flex-col gap-2">
          <h3 className="text-base font-bold font-dm text-gray-900 mb-1">
            Items
          </h3>
          {/* One order can carry several lines — a single Name/Quantity pair could
              only ever show the first, and silently hid the rest. */}
          {order.items.map((item) => (
            <Row
              key={item.id}
              label={`${item.quantity} × ${item.productName}`}
              value={formatNaira(item.lineTotal)}
            />
          ))}
          {order.items.length === 0 && <Row label="Items" value="—" />}
          <Row label="Total" value={formatNaira(order.totalAmount)} />
          <Row label="Platform fee" value={formatNaira(order.platformFee)} />
          <Row
            label="Your payout"
            value={formatNaira(order.vendorAmount)}
          />
        </div>

        <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 flex flex-col gap-2">
          <h3 className="text-base font-bold font-dm text-gray-900 mb-1">
            Buyer
          </h3>
          <Row label="Name" value={order.buyerName} />
          <Row label="Phone" value={order.buyerPhone} />
          <Row label="Email" value={order.buyerEmail ?? "—"} />
          <Row
            label="Fulfillment"
            value={
              order.fulfillmentType === "DELIVERY" ? "Delivery" : "Pickup"
            }
          />
          {order.fulfillmentType === "DELIVERY" && (
            <Row label="Address" value={order.deliveryAddress ?? "—"} />
          )}
          {order.notes && <Row label="Notes" value={order.notes} />}
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#FFD91D] p-5 flex flex-col gap-2">
          <h3 className="text-base font-bold font-dm text-gray-900 mb-1">
            Payment
          </h3>
          {/* The reference belongs to the payment, which may cover other vendors too. */}
          <Row label="Reference" value={order.checkout?.reference ?? "—"} />
          <Row
            label="Paid at"
            value={
              order.paidAt
                ? new Date(order.paidAt).toLocaleString()
                : "Not paid yet"
            }
          />
        </div>
      </div>

      <p className="text-xs font-dm text-gray-400">
        Status updates happen automatically when buyers pay and riders are
        assigned. Vendor-initiated status changes aren&apos;t available yet —{" "}
        <Link href="/contact" className="underline">
          contact support
        </Link>{" "}
        if you need to intervene on an order.
      </p>
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-dm text-gray-500 flex items-center gap-1 w-fit hover:text-recommend-orange cursor-pointer"
    >
      <ArrowLeft size={14} /> Back to orders
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm font-dm">
      <span className="text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-gray-800 flex-1 break-words">{value}</span>
    </div>
  );
}
