"use client";

import Image from "next/image";
import Link from "next/link";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import { BackgroundTwo } from "./BackgroundTwo";

export default function VendorHeroSection() {
  return (
    <BackgroundTwo>
      <div className="relative w-full px-6 md:px-14 pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          {/* Left: heading + CTAs */}
          <div className="flex flex-col gap-6">
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

          {/* Right: vendor photo placeholder */}
          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-[280px] h-[320px] md:w-[380px] md:h-[440px] rounded-2xl overflow-hidden border-2 border-recommend-orange">
              {/* TODO: replace with final vendor photo */}
              <Image
                src="/images/stopwatch.png"
                alt="Vendor"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Tagline + secondary CTA */}
        <div className="relative z-10 mt-16 md:mt-24 flex flex-col items-center gap-6">
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
