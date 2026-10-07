import { LandingSectionOne } from "@/components/organisms/LandingSection1";
import { BackgroundOne } from "@/components/templates/BackgroundOne";
import NoAppSection from "@/components/templates/NoAppSection";
import WhatYouCanOrderSection from "@/components/templates/WhatYouCanOrderSection";
import ChatToDoorSection from "@/components/templates/ChatToDoorSection";
import CoverageSection from "@/components/templates/CoverageSection";
import BuyerFaqSection from "@/components/templates/BuyerFaqSection";
import JoinUsSection from "@/components/templates/JoinUsSection";
import CTASection from "@/components/templates/CTASection";
import FooterSection from "@/components/templates/FooterSection";
// Hidden for now: it still tells buyers to order on WhatsApp. NoAppSection shows the real flow.
// import { HowToOrder } from "@/components/templates/HowToOrder";
// Hidden for now: replaced by CoverageSection, which says where we are live, not just where.
// import { SlidingLocations } from "@/components/templates/SlidingLocations";
// Hidden for now: replaced by JoinUsSection; it still sells a "WhatsApp storefront".
// import CaricatureSection from "@/components/organisms/CaricatureSection";

export default function Home() {
  return (
    <BackgroundOne>
      <LandingSectionOne />
      <NoAppSection />
      <WhatYouCanOrderSection />
      {/* <HowToOrder/> */}
      <ChatToDoorSection />
      {/* <SlidingLocations /> */}
      <CoverageSection />
      <BuyerFaqSection />
      {/* <CaricatureSection /> */}
      <JoinUsSection />
      <CTASection />
      <FooterSection />
    </BackgroundOne>
  );
}
