"use client";

import Image from "next/image";
import Link from "next/link";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import { BackgroundTwo } from "./BackgroundTwo";

export default function VendorHeroSection() {
  return (
    <BackgroundTwo>
      <div className="relative w-full overflow-hidden">

        {/* ── MOBILE layout: image on top, text below ── */}
        <div className="flex flex-col md:hidden">
          {/* Vendor image — top, centered, bleeds upward */}
          <div className="relative w-full flex justify-center">
            <div className="relative w-[320px] h-[380px] -mt-10">
              <Image
                src="/images/vendorhero.png"
                alt="Vendor"
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
              Your Next
              <br />
              Customer Is
              <br />
              Already Looking
              <br />
              For You
            </Text>

            <div className="flex items-center gap-3">
              <Link href="/vendor/signup">
                <Button variant="gradient" text="Start Selling Today" />
              </Link>
              <Link href="/vendor/login">
                <Button variant="green" text="Log in" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── DESKTOP layout ── */}
        <div className="hidden md:grid grid-cols-2 items-start max-w-7xl mx-auto px-14 pt-36 pb-24 overflow-visible">
          {/* Left: text + CTAs */}
          <div className="flex flex-col gap-6 items-start text-left overflow-visible pt-16">
            <Text variant="hero-heading" color="orange">
              Your Next
              <br />
              Customer Is
              <br />
              Already Looking
              <br />
              For You
            </Text>

            <div className="flex items-center gap-3">
              <Link href="/vendor/signup">
                <Button variant="gradient" text="Start Selling Today" />
              </Link>
              <Link href="/vendor/login">
                <Button variant="green" text="Log in" />
              </Link>
            </div>
          </div>

          {/* Right: vendor image — left-aligned within column, shifted left to touch text column */}
          <div className="relative flex justify-start items-end -ml-35">
            <div className="relative w-[660px] h-[700px] -mt-46">
              <Image
                src="/images/vendorhero.png"
                alt="Vendor"
                fill
                className="object-contain object-bottom"
                priority
              />
              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#FFFFDC] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tagline + secondary CTA — shown on both mobile and desktop */}
        <div className="relative z-10 pb-16 md:pb-24 flex flex-col items-center gap-6 px-6">
          <Text variant="hero-heading" color="orange" className="text-center">
            A spot for every seller.
          </Text>
          <Link href="/vendor/signup">
            <Button variant="green" text="Become a Vendor" />
          </Link>
        </div>

      </div>
    </BackgroundTwo>
  );
}