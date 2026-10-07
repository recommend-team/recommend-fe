"use client";

import { usePathname } from "next/navigation";
import { LandingHeader } from "./Header";

/**
 * The public site's header, fixed to the top of every page.
 *
 * It used to slide away on scroll and only come back near the top of the page, so on a
 * long page the menu and Start Ordering were out of reach. It is slim enough to stay.
 */
export default function GeneralHeader() {
  const pathname = usePathname();

  // Areas with their own chrome: the admin panel, storefronts and the order flow.
  const hideOnRoute =
    (pathname?.startsWith("/admin") ?? false) ||
    (pathname?.startsWith("/store") ?? false) ||
    (pathname?.startsWith("/order") ?? false);

  if (hideOnRoute) return null;

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <LandingHeader />
    </header>
  );
}
