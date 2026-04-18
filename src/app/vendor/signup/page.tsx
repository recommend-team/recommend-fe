"use client";

import Link from "next/link";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";
import type { VendorType } from "@/types";

interface Tier {
  type: VendorType;
  title: string;
  blurb: string;
  requirements: string[];
}

const tiers: Tier[] = [
  {
    type: "NON_REGISTERED",
    title: "Non-registered business",
    blurb:
      "Perfect for small vendors and new businesses that aren't formally registered yet. Light KYC, fast setup.",
    requirements: [
      "Passport-style photo of owner",
      "BVN & NIN",
      "Active social media page",
      "Email & phone number",
    ],
  },
  {
    type: "REGISTERED",
    title: "Registered business",
    blurb:
      "Best for established businesses with documentation. Unlimited orders, priority support, verified badge.",
    requirements: [
      "CAC certificate",
      "TIN certificate",
      "Business bank account",
      "Business email & phone number",
    ],
  },
];

export default function SignupTierSelectionPage() {
  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-28 md:pt-36 pb-16">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <Text variant="faq-answer" color="dark">
              Step 1 of 3
            </Text>
            <Text variant="section-heading-48-center" color="orange">
              Choose your registration tier
            </Text>
            <Text variant="neighborhoods-list" color="grey" className="max-w-xl">
              Pick the tier that fits your business. You can upgrade later.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.type}
                className="flex flex-col gap-5 rounded-2xl bg-[#FFF8B8] border border-[#FFD91D] p-6 md:p-8"
              >
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
                <ul className="space-y-2">
                  {tier.requirements.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-2 text-sm font-dm text-gray-800"
                    >
                      <span className="text-recommend-orange mt-0.5">→</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/vendor/signup/register?tier=${tier.type}`}
                  className="mt-auto"
                >
                  <Button variant="green" text="Continue" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Text variant="neighborhoods-list" color="grey">
              Already have an account?{" "}
              <Link
                href="/vendor/login"
                className="text-recommend-orange font-bold underline"
              >
                Log in
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </BackgroundTwo>
  );
}
