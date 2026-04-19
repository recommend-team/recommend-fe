"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Bike,
  ShoppingBag,
  ShieldCheck,
  Users,
  UserCog,
  LogOut,
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

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col gap-2 bg-white/70 backdrop-blur-sm border-r border-[#FFD91D] p-4 min-h-screen sticky top-0">
      <Link href="/admin" className="mb-4 flex items-center gap-2 px-2">
        <Image
          src="/logo-minimal.svg"
          alt="Recommend"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold font-dm text-recommend-orange">
            Recommend Admin
          </span>
          <span className="text-[10px] font-dm text-gray-500">
            Ecosystem Management
          </span>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          if (item.requireSuperAdmin && user?.role !== "SUPER_ADMIN") {
            return null;
          }
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
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

      <div className="mt-auto border-t border-gray-200 pt-3">
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
    </aside>
  );
}
