"use client";

import { AlertTriangle } from "lucide-react";
import {
  useCurrentUser,
  useMyVendorProfile,
  useMyProducts,
  useMyVendorOrders,
  useMyVendorEarnings,
} from "@/hooks";
import { AlertBar } from "@/components/organisms/AlertBar";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

// Important function
// function formatNaira(raw: string | number): string {
//   const n = typeof raw === "string" ? Number(raw) : raw;
//   if (!Number.isFinite(n)) return "₦0";
//   return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
// }

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
    <div className="flex flex-col gap-6 p-0 md:p-[10vh]">
      <AlertBar
        icon={AlertTriangle}
        variant="inform"
        AlertText="Your account is under review"
        iconColor="yellow"
        hide={false}
      />
      <DashboardLayout
        dashboard={<div>This is the dashboard tab</div>}
        orders={<div>This is the orders tab</div>}
        inventory={<div>This is the inventory tab</div>}
        payments={<div>This is the payments tab</div>}
        grow={<div>This is the grow tab</div>}
      />
    </div>
  );
}
