"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Store = "google" | "apple";

const STORES: { id: Store; label: string; icon: string; className: string; text: string }[] = [
  {
    id: "google",
    label: "Google Play",
    icon: "/svg/google-play-icon.svg",
    className: "border-2 border-[#1A1A1A] bg-white hover:bg-gray-100",
    text: "text-[#1A1A1A]",
  },
  {
    id: "apple",
    label: "App Store",
    icon: "/svg/apple-icon.svg",
    className: "bg-recommend-green hover:bg-recommend-green-hover",
    text: "text-white",
  },
];

/** How long "Coming soon" stays on a tapped badge. */
const NOTICE_MS = 2500;

/**
 * The Play Store and App Store badges, before the apps are published.
 *
 * Tapping one says "Coming soon" on the badge itself, rather than linking to `#` — which
 * jumped the page to the top and looked broken. When the apps are live, give each store a
 * URL and render a link instead.
 */
export function StoreBadges({ className = "" }: { className?: string }) {
  const [notice, setNotice] = useState<Store | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {STORES.map((store) => {
        const showing = notice === store.id;
        return (
          <button
            key={store.id}
            type="button"
            onClick={() => setNotice(store.id)}
            aria-label={`${store.label} — coming soon`}
            className={`flex min-h-11 w-fit items-center gap-2 rounded-full px-5 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-orange ${store.className}`}
          >
            <Image src={store.icon} alt="" width={18} height={18} aria-hidden="true" />
            <span className={`min-w-[170px] text-left font-dm text-sm font-bold ${store.text}`}>
              {showing ? "Coming soon" : `Download on ${store.label}`}
            </span>
          </button>
        );
      })}
      <span className="sr-only" aria-live="polite">
        {notice ? `${notice === "google" ? "Google Play" : "App Store"} app coming soon` : ""}
      </span>
    </div>
  );
}
