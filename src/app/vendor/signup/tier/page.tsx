"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";
import type { VendorType } from "@/types";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "700", "800", "900"] });

const TIERS = [
  {
    type: "NON_REGISTERED" as VendorType,
    title: "Unregistered Business",
    subtitle: "30 orders limit/month",
    image: "/images/unregistered-vendor.png",
    imageAlt: "Unregistered vendor at a stall",
  },
  {
    type: "REGISTERED" as VendorType,
    title: "Registered Business",
    subtitle: "Unlimited orders",
    image: "/images/registered-vendor.png",
    imageAlt: "Registered business vendor",
  },
];

function TierSelectionInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const [selected, setSelected] = useState<VendorType | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("tier", selected);
    router.push(`/vendor/signup/register?${params.toString()}`);
  };

  return (
    <BackgroundTwo>
      <div className={`${dmSans.className} relative z-10 min-h-screen w-full flex flex-col`}>

        {/* ── Header ── */}
        <div className="flex items-center justify-end px-6 md:px-10 pt-6 pb-2">
          <Link
            href="/vendor/login"
            className="text-sm font-bold font-dm text-gray-800 hover:text-recommend-orange transition-colors"
          >
            Already a vendor? Log in
          </Link>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 flex items-start justify-center px-3 md:px-4 pb-10 pt-2 md:pt-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm p-4 md:p-10 flex flex-col gap-4 md:gap-6">

            {/* ── Heading — MOBILE ── */}
            <div className="flex flex-col gap-1 md:hidden">
              <h2 className="font-black text-[26px] leading-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-champ, inherit)" }}>
                Is your business<br />registered?
              </h2>
              <p className="font-extrabold text-[13px] leading-snug text-[#66665B]">
                Choose your registration status. You can upgrade anytime
              </p>
            </div>

            {/* ── Heading — DESKTOP (untouched) ── */}
            <div className="hidden md:flex flex-col gap-2 whitespace-nowrap">
              <Text variant="section-heading-48" color="dark">
                Is your business registered?
              </Text>
              <Text variant="neighborhoods-list" color="grey">
                Choose your business registration status. You can upgrade anytime
              </Text>
            </div>

            {/* ── Cards — MOBILE ── */}
            <div className="flex flex-col gap-3 md:hidden">
              {TIERS.map((tier) => {
                const isSelected = selected === tier.type;
                return (
                  <button
                    key={tier.type}
                    type="button"
                    onClick={() => setSelected(tier.type)}
                    className="text-left focus:outline-none w-full"
                  >
                    <div
                      className={`relative w-full rounded-2xl bg-[#FFF8B8] border-2 overflow-hidden transition-all duration-200 h-[130px] ${
                        isSelected
                          ? "border-recommend-orange ring-2 ring-recommend-orange/20 scale-[1.02]"
                          : "border-[#FFD91D]"
                      }`}
                    >
                      {/* Text block — left side */}
                      <div className="relative z-10 h-full flex flex-col justify-center p-4 w-[52%]">
                        <p className="font-black text-[15px] leading-snug text-gray-900">
                          {tier.title}
                        </p>
                        <p className="font-bold text-[12px] text-gray-900 mt-1">
                          {tier.subtitle}
                        </p>
                      </div>

                      {/* Image — right side */}
                      <div className="absolute bottom-0 right-0 w-[52%] h-full">
                        <Image
                          src={tier.image}
                          alt={tier.imageAlt}
                          fill
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8B8] via-[#FFF8B8]/50 to-transparent" />
                      </div>

                      {/* Check badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-recommend-orange flex items-center justify-center z-20">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Cards — DESKTOP (untouched) ── */}
            <div className="hidden md:grid md:grid-cols-2 gap-5">
              {TIERS.map((tier) => {
                const isSelected = selected === tier.type;
                return (
                  <button
                    key={tier.type}
                    type="button"
                    onClick={() => setSelected(tier.type)}
                    className="text-left focus:outline-none"
                  >
                    <div
                      className={`relative w-full rounded-2xl bg-[#FFF8B8] border-2 overflow-hidden transition-all duration-200 min-h-[240px] ${
                        isSelected
                          ? "border-recommend-orange ring-2 ring-recommend-orange/20 scale-[1.02]"
                          : "border-[#FFD91D] hover:scale-[1.01]"
                      }`}
                    >
                      <div className="relative z-10 p-5 flex flex-col gap-2 w-[60%]">
                        <p className="font-black font-dm text-xl leading-snug text-gray-900 whitespace-nowrap">
                          {tier.title}
                        </p>
                        <p className="font-dm font-bold text-gray-900 text-sm mt-1">
                          {tier.subtitle}
                        </p>
                      </div>

                      <div className="absolute bottom-0 right-0 w-[65%] h-[175px]">
                        <Image
                          src={tier.image}
                          alt={tier.imageAlt}
                          fill
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8B8] via-[#FFF8B8]/40 to-transparent" />
                      </div>

                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-recommend-orange flex items-center justify-center z-20">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Footer actions ── */}
            <div className="flex items-center justify-between pt-1 gap-3">
              <Button
                variant="gradient"
                text="Continue"
                disabled={!selected}
                onClick={handleContinue}
              />
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  aria-label="Previous"
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
                  disabled
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
                  disabled
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </BackgroundTwo>
  );
}

export default function TierSelectionPage() {
  return (
    <Suspense fallback={null}>
      <TierSelectionInner />
    </Suspense>
  );
}