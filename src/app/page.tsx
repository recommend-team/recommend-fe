import CaricatureSection from "@/components/organisms/CaricatureSection";
import { LandingSectionOne } from "@/components/organisms/LandingSection1";
import { BackgroundOne } from "@/components/templates/BackgroundOne";
import NoAppSection from "@/components/templates/NoAppSection";
import WhatYouCanOrderSection from "@/components/templates/WhatYouCanOrderSection";
import { SlidingLocations } from "@/components/templates/SlidingLocations";
import CTASection from "@/components/templates/CTASection";

export default function Home() {
  return (
    <BackgroundOne>
      <LandingSectionOne />
      <NoAppSection />
      <WhatYouCanOrderSection />
      <SlidingLocations />
      <CaricatureSection />
      <CTASection />
    </BackgroundOne>
  );
}
