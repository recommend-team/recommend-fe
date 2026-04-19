"use client";

import Image from "next/image";
import Link from "next/link";
import { Text } from "../atoms/Text";
import { BackgroundTwo } from "./BackgroundTwo";

export default function RiderHeroSection() {
  return (
    <BackgroundTwo>
      <div className="relative w-full px-6 md:px-14 pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          {/* Left: headline + CTAs */}
          <div className="flex flex-col gap-6">
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
                <Image
                  src="/svg/google-play-icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  aria-hidden="true"
                />
                <span className="font-bold text-sm font-dm text-[#1A1A1A]">
                  Download on Google Play
                </span>
              </Link>

              <Link
                href="#"
                aria-label="Download on App Store (coming soon)"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-recommend-green hover:bg-recommend-green-hover transition-colors"
              >
                <Image
                  src="/svg/apple-icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  aria-hidden="true"
                />
                <span className="font-bold text-sm font-dm text-white">
                  Download on App Store
                </span>
              </Link>
            </div>

            <Link
              href="/rider/signup"
              className="text-sm font-dm text-recommend-orange font-bold underline w-fit"
            >
              Or register as a rider here →
            </Link>
          </div>

          {/* Right: rider photo */}
          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-[280px] h-[340px] md:w-[420px] md:h-[520px]">
              <Image
                src="/images/rider-hero.png"
                alt="Recommend rider"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </BackgroundTwo>
  );
}
