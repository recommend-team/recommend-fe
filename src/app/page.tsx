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
import { ORGANIZATION_JSON_LD, pageMetadata } from "@/lib/site";
// Hidden for now: it still tells buyers to order on WhatsApp. NoAppSection shows the real flow.
// import { HowToOrder } from "@/components/templates/HowToOrder";
// Hidden for now: replaced by CoverageSection, which says where we are live, not just where.
// import { SlidingLocations } from "@/components/templates/SlidingLocations";
// Hidden for now: replaced by JoinUsSection; it still sells a "WhatsApp storefront".
// import CaricatureSection from "@/components/organisms/CaricatureSection";

export const metadata = pageMetadata({
  title: "Recommend — Order from vendors near you, just by chatting",
  description:
    "Tell Recommend what you want. We find it from vendors near you, take payment securely, and deliver it to your door.",
  path: "/",
});

export default function Home() {
  return (
    <BackgroundOne>
      <script
        type="application/ld+json"
        // Static, from our own constants — nothing a visitor can inject.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
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
