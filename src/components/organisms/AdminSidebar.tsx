"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Store,
  Bike,
  ShoppingBag,
  MessagesSquare,
  Receipt,
  ShieldCheck,
  Users,
  UserCog,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  requireSuperAdmin?: boolean;
}

const items: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Vendors", href: "/admin/vendors", icon: Store },
  { label: "Riders", href: "/admin/riders", icon: Bike },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Transactions", href: "/admin/transactions", icon: Receipt },
  {
    label: "Conversations",
    href: "/admin/conversations",
    icon: MessagesSquare,
  },
  { label: "KYC Verifications", href: "/admin/kyc", icon: ShieldCheck },
  { label: "Buyers", href: "/admin/buyers", icon: Users },
  {
    label: "Admin Management",
    href: "/admin/admins",
    icon: UserCog,
    requireSuperAdmin: true,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the drawer automatically when the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const visibleItems = items.filter(
    (item) => !item.requireSuperAdmin || user?.role === "SUPER_ADMIN"
  );

  const Brand = () => (
    <div className="flex items-center gap-2">
      <Image
        src="/logo-minimal.svg"
        alt="Recommend"
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold font-dm text-recommend-orange truncate">
          Recommend Admin
        </span>
        <span className="text-[10px] font-dm text-gray-500">
          Ecosystem Management
        </span>
      </div>
    </div>
  );

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-dm transition-colors ${
              active
                ? "bg-recommend-orange text-white font-bold"
                : "text-gray-700 hover:bg-amber-100"
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const UserFooter = () => (
    <div className="border-t border-gray-200 pt-3">
      {user && (
        <div className="px-3 pb-3">
          <p className="text-sm font-bold font-dm text-gray-800 truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs font-dm text-gray-500 truncate">
            {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
          </p>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-dm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut size={18} />
        <span>Log out</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar — fixed, always visible on small screens */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-[#FFD91D] px-4 h-14">
        <Link href="/admin">
          <Brand />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-700 hover:bg-amber-100"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-recommend-amber border-r border-[#FFD91D] p-4 flex flex-col gap-2 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-2">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-gray-700 hover:bg-amber-100"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <NavList onNavigate={() => setMobileOpen(false)} />
            <div className="mt-auto">
              <UserFooter />
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col gap-2 bg-white/70 backdrop-blur-sm border-r border-[#FFD91D] p-4 min-h-screen sticky top-0">
        <Link href="/admin" className="mb-4 flex items-center gap-2 px-2">
          <Brand />
        </Link>
        <NavList />
        <div className="mt-auto">
          <UserFooter />
        </div>
      </aside>
    </>
  );
}
