"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Clock, Ban, CheckCircle2 } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks";
import type { AuthUser } from "@/types";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-recommend-amber">
      <p className="text-sm font-dm text-gray-500">Loading…</p>
    </div>
  );
}

function StatusScreen({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-recommend-amber p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#FFD91D] p-6 md:p-8 text-center flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-recommend-orange">
          {icon}
        </div>
        <h2 className="text-xl font-bold font-dm text-gray-900">{title}</h2>
        <p className="text-sm font-dm text-gray-600 leading-relaxed">
          {description}
        </p>
        {action}
      </div>
    </div>
  );
}

export default function VendorGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!user) {
      router.replace(
        `/vendor/login?redirect=${encodeURIComponent(pathname)}`
      );
    }
  }, [mounted, isLoading, user, router, pathname]);

  const handleLogout = () => {
    logout();
    router.replace("/vendor/login");
  };

  if (!mounted || isLoading) return <LoadingFallback />;
  if (!user) return null;

  // Only sellers can access the vendor dashboard
  if (user.role !== "SELLER") {
    return (
      <StatusScreen
        icon={<Ban size={24} />}
        title="Vendor dashboard only"
        description="This area is only for vendor accounts. Head back to the home page — or log in with a vendor account."
        action={
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-bold font-dm text-gray-700 hover:bg-gray-50"
            >
              Log out
            </button>
            <Link
              href="/"
              className="rounded-full bg-recommend-green text-white px-4 py-2 text-sm font-bold font-dm hover:bg-recommend-green-hover"
            >
              Go home
            </Link>
          </div>
        }
      />
    );
  }

  // Pending vendors: KYC review hasn't finished
  if (user.status === "PENDING") {
    return (
      <StatusScreen
        icon={<Clock size={24} />}
        title="Your account is pending review"
        description="We're reviewing your KYC documents. You'll get an email once approved — usually within 24 hours. Once approved, this dashboard unlocks."
        action={
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-bold font-dm text-gray-700 hover:bg-gray-50"
            >
              Log out
            </button>
            <Link
              href="/vendor"
              className="rounded-full bg-recommend-green text-white px-4 py-2 text-sm font-bold font-dm hover:bg-recommend-green-hover"
            >
              Back to site
            </Link>
          </div>
        }
      />
    );
  }

  // Suspended / deactivated
  if (user.status === "SUSPENDED" || user.status === "DEACTIVATED") {
    return (
      <StatusScreen
        icon={<Ban size={24} />}
        title={
          user.status === "SUSPENDED"
            ? "Your account is suspended"
            : "Your account is deactivated"
        }
        description="Contact Recommend support to resolve the issue. Once resolved, you'll be able to log back in."
        action={
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-recommend-orange text-white px-4 py-2 text-sm font-bold font-dm hover:bg-orange-600"
            >
              Contact support
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-bold font-dm text-gray-700 hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        }
      />
    );
  }

  // APPROVED — let them in (but acknowledge non-obvious state for safety)
  if (user.status !== "APPROVED") {
    return (
      <StatusScreen
        icon={<CheckCircle2 size={24} />}
        title="Account status unknown"
        description="Your account status isn't APPROVED. Refresh — if this persists, contact support."
      />
    );
  }

  return <>{children}</>;
}

export function useVendorAuth(): AuthUser | null {
  const { data: user } = useCurrentUser();
  return user ?? null;
}
