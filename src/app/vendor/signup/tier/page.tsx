"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";
import { Card } from "@/components/atoms/Card";
import type { VendorType } from "@/types";

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
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-28 md:pt-36 pb-16">

        {/* Already a vendor — top right */}
        <div className="absolute top-6 right-6 md:top-10 md:right-14 z-20">
          <Link
            href="/vendor/login"
            className="text-sm font-bold font-dm text-gray-700 hover:text-recommend-orange underline"
          >
            Already a vendor? Log in
          </Link>
        </div>

        <div className="max-w-2xl mx-auto flex flex-col gap-8">

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <Text variant="section-heading-48" color="dark">
              Is your business registered?
            </Text>
            <Text variant="neighborhoods-list" color="grey">
              Choose your business registration status. You can upgrade anytime.
            </Text>
          </div>

          {/* Tier cards — reusing your existing Card atom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TIERS.map((tier) => {
              const isSelected = selected === tier.type;
              return (
                <button
                  key={tier.type}
                  type="button"
                  onClick={() => setSelected(tier.type)}
                  className="text-left focus:outline-none"
                >
                  <Card
                    variant="regular"
                    padding="medium"
                    rounded="lg"
                    hoverable
                    className={`bg-[#FFF8B8] border-2 border-[#FFD91D] flex flex-col gap-3 transition-all duration-200 ${
                      isSelected
                        ? "ring-4 ring-recommend-orange border-recommend-orange scale-[1.02]"
                        : ""
                    }`}
                  >
                    {/* Title row with checkmark */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-bold font-dm text-gray-900 text-lg leading-tight">
                          {tier.title}
                        </p>
                        <p className="font-dm text-gray-700 text-sm">
                          {tier.subtitle}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-recommend-orange flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Vendor photo */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden">
                      <Image
                        src={tier.image}
                        alt={tier.imageAlt}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>

          {/* Continue + Back */}
          <div className="flex items-center gap-4">
            <Button
              variant="green"
              text="Continue"
              disabled={!selected}
              onClick={handleContinue}
            />
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-dm text-gray-500 hover:text-recommend-orange underline"
            >
              Back
            </button>
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