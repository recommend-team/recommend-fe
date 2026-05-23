"use client";

import Image from "next/image";
import Link from "next/link";
import { Text } from "../atoms/Text";
import { BackgroundTwo } from "./BackgroundTwo";

export default function RiderHeroSection() {
  return (
    <BackgroundTwo>
      <div className="relative w-full overflow-hidden">

        {/* ── MOBILE layout: image on top, text below ── */}
        <div className="flex flex-col md:hidden">
          {/* Rider image — top, centered, bleeds upward */}
          <div className="relative w-full flex justify-center">
            <div className="relative w-[320px] h-[380px] -mt-10">
              <Image
                src="/images/rider-hero.png"
                alt="Recommend rider"
                fill
                className="object-contain object-bottom"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FFFFDC] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Text + CTAs below image */}
          <div className="flex flex-col gap-5 items-start text-left px-6 pb-16">
            <Text variant="hero-heading" color="orange">
              Spread
              <br />
              Happiness.
              <br />
              Earn Fast.
            </Text>

            <Text variant="faq-answer" color="dark">
              Join Recommend as a rider
            </Text>

            <div className="flex flex-col gap-3 w-full">
              <Link
                href="#"
                aria-label="Download on Google Play (coming soon)"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#1A1A1A] bg-white hover:bg-gray-100 transition-colors w-fit"
              >
                <Image src="/svg/google-play-icon.svg" alt="" width={18} height={18} aria-hidden="true" />
                <span className="font-bold text-sm font-dm text-[#1A1A1A]">Download on Google Play</span>
              </Link>

              <Link
                href="#"
                aria-label="Download on App Store (coming soon)"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-recommend-green hover:bg-recommend-green-hover transition-colors w-fit"
              >
                <Image src="/svg/apple-icon.svg" alt="" width={18} height={18} aria-hidden="true" />
                <span className="font-bold text-sm font-dm text-white">Download on App Store</span>
              </Link>
            </div>

            <Link href="/rider/signup" className="text-sm font-dm text-recommend-orange font-bold underline w-fit">
              Or register as a rider here →
            </Link>
          </div>
        </div>

        {/* ── DESKTOP layout ── */}
        <div className="hidden md:grid grid-cols-2 items-start max-w-7xl mx-auto px-14 pt-36 pb-24 overflow-visible">
          {/* Left: text + CTAs */}
          <div className="flex flex-col gap-6 items-start text-left overflow-visible pt-16">
            <Text variant="hero-heading" color="orange">
              Spread
              <br />
              Happiness.
              <br />
              Earn Fast.
            </Text>

            <Text variant="faq-answer" color="dark">
              Join Recommend as a rider
            </Text>

            {/* TODO: replace href="#" with real store links once apps are published */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="#"
                aria-label="Download on Google Play (coming soon)"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#1A1A1A] bg-white hover:bg-gray-100 transition-colors"
              >
                <Image src="/svg/google-play-icon.svg" alt="" width={18} height={18} aria-hidden="true" />
                <span className="font-bold text-sm font-dm text-[#1A1A1A]">Download on Google Play</span>
              </Link>

              <Link
                href="#"
                aria-label="Download on App Store (coming soon)"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-recommend-green hover:bg-recommend-green-hover transition-colors"
              >
                <Image src="/svg/apple-icon.svg" alt="" width={18} height={18} aria-hidden="true" />
                <span className="font-bold text-sm font-dm text-white">Download on App Store</span>
              </Link>
            </div>

            <Link href="/rider/signup" className="text-sm font-dm text-recommend-orange font-bold underline w-fit">
              Or register as a rider here →
            </Link>
          </div>

          {/* Right: rider image — left-aligned within column, shifted left to touch text column */}
          <div className="relative flex justify-start items-end -ml-59">
            <div className="relative w-[660px] h-[700px] -mt-46">
              <Image
                src="/images/rider-hero.png"
                alt="Recommend rider"
                fill
                className="object-contain object-bottom"
                priority
              />
              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#FFFFDC] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
    </BackgroundTwo>
  );
}