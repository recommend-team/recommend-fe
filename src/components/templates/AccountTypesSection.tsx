"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import { BackgroundThree } from "./BackgroundThree";
import type { RiderType } from "@/types";

interface Tier {
  type: RiderType;
  title: string;
  blurb: string;
  bullets: string[];
  image: string;
  cta: string;
}

const tiers: Tier[] = [
  {
    type: "INDIVIDUAL",
    title: "SOLO RIDER",
    blurb:
      "Register as an individual. Full KYC ensures trust and security for you and our customers.",
    bullets: [
      "Name, Phone, Email",
      "Government-issued ID (Driver's License / Passport / National ID)",
      "BVN & NIN verification",
      "Profile photo & vehicle info",
      "Emergency contact",
      "Bank account for payouts",
      "Secure 4-digit PIN",
    ],
    image: "/images/solo-rider.png",
    cta: "Ride solo",
  },
  {
    type: "COMPANY",
    title: "FLEET OWNER",
    blurb:
      "Register your logistics business and manage multiple riders under one company account.",
    bullets: [
      "Company name, CAC certificate & TIN",
      "Office address & contact person",
      "Bank account for payouts",
      "Add multiple drivers with vehicle info",
      "Driver photos & BVN (for payouts)",
      "Secure admin PIN",
    ],
    image: "/images/fleet-owner.png",
    cta: "Bring your team",
  },
];

export default function AccountTypesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <BackgroundThree>
      <div className="relative w-full px-6 md:px-14 py-16 md:py-24">
        <div className="flex flex-col items-center gap-2 mb-10 md:mb-14 text-center">
          <Text variant="faq-answer" color="dark">
            Account Types
          </Text>
          <Text variant="section-heading-48-center" color="orange">
            Ride solo or bring your team
          </Text>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible pb-4">
            {tiers.map((tier, i) => (
              <div
                key={tier.type}
                onClick={() => setActiveIndex(i)}
                className="snap-center shrink-0 w-[85%] md:w-auto"
              >
                <div className="relative h-full rounded-2xl bg-[#FFF8B8] border border-[#FFD91D] p-6 md:p-8 flex flex-col gap-5">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 flex flex-col gap-3">
                      <Text
                        variant="section-heading-48"
                        color="dark"
                        className="leading-tight"
                      >
                        {tier.title}
                      </Text>
                      <Text
                        variant="neighborhoods-list"
                        color="grey"
                        className="leading-relaxed"
                      >
                        {tier.blurb}
                      </Text>
                    </div>
                    <div className="relative w-24 h-32 md:w-32 md:h-40 shrink-0">
                      <Image
                        src={tier.image}
                        alt={tier.title}
                        fill
                        className="object-contain object-bottom"
                      />
                    </div>
                  </div>

                  <ul className="space-y-1.5">
                    {tier.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm font-dm text-gray-800"
                      >
                        <span className="text-recommend-orange mt-0.5">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/rider/signup/register?tier=${tier.type}`}
                    className="mt-auto"
                  >
                    <Button variant="green" text={tier.cta} />
                  </Link>
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
