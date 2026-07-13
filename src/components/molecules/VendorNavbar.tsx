"use client";

import { useState } from "react";
import Image from "next/image";

interface VendorNavbarProps {
  businessName: string;
  isStoreOpen: boolean;
  onToggleStore?: (open: boolean) => void;
}

export default function VendorNavbar({
  businessName,
  isStoreOpen,
  onToggleStore,
}: VendorNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-9 z-50 mx-auto w-full max-w-280 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-5">
      <div className="flex items-center gap-3">
        <Image src="/logo-full.svg" alt="Recommend" width={100} height={28} />
        <span className="h-5 w-px bg-gray-200" aria-hidden="true" />
        <span className="whitespace-nowrap text-sm text-gray-600">
         Welcome to Recommend! {businessName} 👋
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onToggleStore?.(!isStoreOpen)}
          className={[
            "relative h-6 w-11 rounded-full transition-colors duration-200",
            isStoreOpen ? "bg-emerald-500" : "bg-gray-200",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
              isStoreOpen ? "translate-x-5" : "translate-x-0.5",
            ].join(" ")}
          />
        </button>
        <span className="text-sm text-gray-500">Open store</span>

        <button type="button" aria-label="Notifications">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-1"
          >
            <Image
              src="/images/vendor-avatar.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full"
            />
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700"
              >
                Settings
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-orange-500"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}