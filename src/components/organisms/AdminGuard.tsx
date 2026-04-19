"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks";
import type { AdminRole, AuthUser } from "@/types";

function isAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "SUPER_ADMIN";
}

function isSuperAdmin(user: AuthUser | null | undefined): boolean {
  return user?.role === "SUPER_ADMIN";
}

interface AdminGuardProps {
  children: React.ReactNode;
  /** If provided, only users with one of these roles can see children. */
  requireRole?: AdminRole;
}

export default function AdminGuard({ children, requireRole }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();

  const allowed = requireRole === "SUPER_ADMIN" ? isSuperAdmin(user) : isAdmin(user);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed) {
      router.replace("/");
    }
  }, [isLoading, user, allowed, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-recommend-amber">
        <p className="text-sm font-dm text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!user || !allowed) return null;
  return <>{children}</>;
}
