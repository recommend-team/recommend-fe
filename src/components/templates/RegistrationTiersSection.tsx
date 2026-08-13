"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import { BackgroundThree } from "./BackgroundThree";
import { vendorApp } from "@/lib/links";
import type { VendorType } from "@/types";

interface Tier {
  type: VendorType;
  title: string;
  blurb: string;
  requirements: string[];
  cta: string;
}

const tiers: Tier[] = [
  {
    type: "NON_REGISTERED",
    title: "NON-REGISTERED BUSINESS",
    blurb:
      "Perfect for small vendors and new businesses that aren't formally registered yet. Light KYC, fast setup.",
    requirements: [
      "Passport-style photo of owner",
      "BVN & NIN",
      "Active social media page",
      "Email & phone number",
    ],
    cta: "Start small",
  },
  {
    type: "REGISTERED",
    title: "REGISTERED BUSINESS",
    blurb:
      "Best for established businesses with documentation. Unlimited orders, priority support, verified badge.",
    requirements: [
      "CAC certificate",
      "TIN certificate",
      "Business bank account",
      "Business email & phone number",
    ],
    cta: "Go fully verified",
  },
];

export default function RegistrationTiersSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <BackgroundThree>
      <div className="relative w-full px-6 md:px-14 py-16 md:py-24">
        <div className="flex flex-col items-center gap-2 mb-10">
          <Text variant="faq-answer" color="dark">
            Registration Tiers
          </Text>
          <Text
            variant="section-heading-48-center"
            color="orange"
            className="text-center"
          >
            Start small or go fully verified.
          </Text>
        </div>

        {/* Cards — swipeable on mobile, grid on desktop */}
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible pb-4">
            {tiers.map((tier, i) => (
              <div
                key={tier.type}
                onClick={() => setActiveIndex(i)}
                className="snap-center shrink-0 w-[85%] md:w-auto"
              >
                <div className="relative h-full rounded-2xl bg-[#FFF8B8] border border-[#FFD91D] p-6 md:p-8 flex flex-col gap-5">
                  <Text
                    variant="section-heading-48"
                    color="dark"
                    className="leading-tight"
                  >
                    {tier.title}
                  </Text>

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <Text
                        variant="neighborhoods-list"
                        color="grey"
                        className="leading-relaxed"
                      >
                        {tier.blurb}
                      </Text>
                      <ul className="space-y-1.5">
                        {tier.requirements.map((req) => (
                          <li
                            key={req}
                            className="flex items-start gap-2 text-sm font-dm text-gray-800"
                          >
                            <span className="text-recommend-orange mt-0.5">
                              →
                            </span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative w-24 h-28 md:w-32 md:h-36 shrink-0 rounded-xl overflow-hidden bg-white/30">
                      {/* TODO: replace with final tier photo */}
                      <Image
                        src="/images/stopwatch.png"
                        alt={tier.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* `?type=` pre-selects step one of the vendor app's wizard, so
                      picking a tier here is not a choice they make twice. */}
                  <div className="mt-auto">
                    <Button
                      variant="green"
                      text={tier.cta}
                      href={vendorApp(`/signup?type=${tier.type}`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile indicator dots */}
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {tiers.map((_, i) => (
              <motion.span
                key={i}
                className="h-1.5 rounded-full bg-recommend-orange"
                animate={{
                  width: activeIndex === i ? 28 : 8,
                  opacity: activeIndex === i ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </BackgroundThree>
  );
}