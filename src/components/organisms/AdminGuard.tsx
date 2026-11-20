"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks";
import { isStaff, staffCanOpen, staffHome } from "@/lib/staff-access";
import type { AdminRole } from "@/types";

/** Nothing to listen to: being in the browser never changes once true. */
const subscribeNothing = () => () => undefined;

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

/**
 * Admins, the super admin and customer service get in. Customer service only reach
 * Conversations — anywhere else sends them there.
 */
export default function AdminGuard({ children, requireRole }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();
  // False while server-rendering and hydrating, true once in the browser — where the
  // session in localStorage can be read. Without an effect that sets state on mount.
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  );

  const role = user?.role;
  const allowed = requireRole === "SUPER_ADMIN" ? role === "SUPER_ADMIN" : isStaff(role);
  const canOpen = allowed && staffCanOpen(role, pathname);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!user) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed) {
      router.replace(isStaff(role) ? staffHome(role) : "/");
      return;
    }
    if (!canOpen) router.replace(staffHome(role));
  }, [mounted, isLoading, user, role, allowed, canOpen, router, pathname]);

  // Render the same LoadingFallback on server and on the first client render,
  // so the hydrated DOM matches the SSR output. Once `mounted` flips true (only
  // on the client), we can safely swap in the real tree.
  if (!mounted || isLoading) {
    return <LoadingFallback />;
  }

  if (!user || !canOpen) return null;
  return <>{children}</>;
}
