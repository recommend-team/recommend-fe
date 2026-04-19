"use client";

import { useEffect, useState } from "react";
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

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-recommend-amber">
      <p className="text-sm font-dm text-gray-500">Loading…</p>
    </div>
  );
}

export default function AdminGuard({ children, requireRole }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allowed = requireRole === "SUPER_ADMIN" ? isSuperAdmin(user) : isAdmin(user);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!user) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed) {
      router.replace("/");
    }
  }, [mounted, isLoading, user, allowed, router, pathname]);

  // Render the same LoadingFallback on server and on the first client render,
  // so the hydrated DOM matches the SSR output. Once `mounted` flips true (only
  // on the client), we can safely swap in the real tree.
  if (!mounted || isLoading) {
    return <LoadingFallback />;
  }

  if (!user || !allowed) return null;
  return <>{children}</>;
}
