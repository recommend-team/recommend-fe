"use client";

import { Text } from "../atoms/Text";
import { BackgroundTwo } from "./BackgroundTwo";

export default function ContactHeroSection() {
  return (
    <BackgroundTwo>
      <div className="relative w-full px-6 md:px-14 pt-28 md:pt-36 pb-10 md:pb-14">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Text variant="hero-heading" color="orange">
            Get in Touch With Our Team
          </Text>
        </div>
      </div>
    </BackgroundTwo>
  );
}
