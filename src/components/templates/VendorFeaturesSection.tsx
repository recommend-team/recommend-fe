"use client";

import Image from "next/image";
import { Text } from "../atoms/Text";
import { BackgroundThree } from "./BackgroundThree";

interface Feature {
  title: string;
  description: string;
  illustration: React.ReactNode;
}

const LiveDashboardIllustration = (
  <div className="relative flex-shrink-0 w-[60px] md:w-[80px]">
    <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-[20px]">
      <Image
        src="/svg/thinking-squiggle.svg"
        alt=""
        width={24}
        height={24}
        className="w-full h-auto"
      />
    </div>
    <Image
      src="/svg/faq-figure.svg"
      alt=""
      width={80}
      height={120}
      className="w-full h-auto"
    />
  </div>
);

const InventoryIllustration = (
  <div className="relative w-full h-full flex items-end justify-center">
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[50px] md:w-[60px]">
      <Image
        src="/svg/dashed-path.svg"
        alt=""
        width={60}
        height={24}
        className="w-full h-auto"
      />
    </div>
    <Image
      src="/svg/delivery_scooter.svg"
      alt="Delivery scooter"
      width={110}
      height={80}
      className="w-[65px] md:w-[80px] h-auto relative z-10"
    />
  </div>
);

const features: Feature[] = [
  {
    title: "Order Management",
    description:
      "Accept or reject incoming orders, track rider status in real time from pickup to delivery.",
    illustration: (
      <Image src="/svg/joy_leap2.svg" alt="" width={100} height={100} className="h-full w-auto" aria-hidden="true" />
    ),
  },
  {
    title: "Live Dashboard",
    description:
      "Track daily and weekly orders, top products, and earnings from one clean, simple view.",
    illustration: LiveDashboardIllustration,
  },
  {
    title: "Inventory Control",
    description:
      "Manage your products, special offers, per-plate pricing, drinks, and promotions all in one place.",
    illustration: InventoryIllustration,
  },
  {
    title: "Secure Payouts",
    description:
      "Request withdrawals to your bank account anytime. PIN-secured for your protection.",
    illustration: (
      <Image src="/svg/salaryman.svg" alt="" width={100} height={100} className="h-full w-auto" aria-hidden="true" />
    ),
  },
];

export default function VendorFeaturesSection() {
  return (
    <BackgroundThree>
      <div className="relative w-full px-6 md:px-14 py-16 md:py-24">
        <div className="text-center mb-10 md:mb-14 flex flex-col items-center gap-1">
          <Text
            variant="section-heading-48-center"
            color="orange"
            className="leading-tight"
          >
            Everything to run
          </Text>
          <Text
            variant="section-heading-48-center"
            color="grey"
            className="leading-tight"
          >
            your business online.
          </Text>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 pb-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="snap-center shrink-0 w-[70%] md:w-auto"
              >
                <div className="h-full rounded-2xl bg-[#FFF8B8] border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
                  <Text
                    variant="neighborhoods-title"
                    color="dark"
                    className="font-bold"
                  >
                    {feature.title}
                  </Text>
                  <Text
                    variant="neighborhoods-list"
                    color="grey"
                    className="leading-relaxed flex-1"
                  >
                    {feature.description}
                  </Text>
                  <div className="relative w-full h-24 md:h-28 flex items-end justify-center">
                    {feature.illustration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BackgroundThree>
  );
}