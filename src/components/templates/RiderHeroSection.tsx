"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import { StoreBadges } from "../molecules/StoreBadges";
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

            <StoreBadges className="flex-col" />

            <Button
              variant="orange"
              text="Become a rider"
              href="/rider/signup"
              icon={<ArrowRight size={18} />}
            />
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

            <StoreBadges />

            <Button
              variant="orange"
              text="Become a rider"
              href="/rider/signup"
              icon={<ArrowRight size={18} />}
            />
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