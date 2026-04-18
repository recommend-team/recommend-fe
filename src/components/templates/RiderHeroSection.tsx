"use client";

import Image from "next/image";
import Link from "next/link";
import { Text } from "@/components/atoms/Text";

export default function RiderHeroSection() {
  return (
    <section className="relative min-h-screen bg-[#FFFFDC] overflow-hidden flex items-center px-6 md:px-16">

      {/* left content */}
      <div className="relative z-10 flex flex-col gap-6 max-w-[560px]">
        <div>
          <Text variant="section-heading-48" color="orange">
            Spread Happiness.
          </Text>
          <Text variant="section-heading-48" color="orange">
            Earn Fast.
          </Text>
        </div>

        <Text variant="faq-answer" color="dark">
          Join Recommend as a rider
        </Text>

        <div className="flex flex-wrap gap-4">
          <Link
            href="#"
            className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-[#1A1A1A] bg-transparent hover:bg-[#1A1A1A] hover:text-white transition-colors group"
          >
            <Image
              src="/svg/google-play-icon.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <span className="font-semibold text-sm text-[#1A1A1A] group-hover:text-white">
              Download on Google Play
            </span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1A3A2A] hover:bg-[#0f2a1a] transition-colors"
          >
            <Image
              src="/svg/apple-icon.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <span className="font-semibold text-sm text-white">
              Download on App Store
            </span>
          </Link>
        </div>
      </div>

      {/* rider photo — right side, bleeds to edge */}
      <div className="absolute right-0 bottom-0 h-full flex items-end pointer-events-none">
        <Image
          src="/images/rider-hero.png"
          alt="Recommend rider"
          width={600}
          height={700}
          className="object-contain object-bottom h-full w-auto max-w-[55vw]"
          priority
        />
      </div>

    </section>
  );
}