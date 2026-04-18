import RiderHeroSection from "@/components/templates/RiderHeroSection";
import AccountTypesSection from "@/components/templates/AccountTypesSection";
import {SlidingLocations} from "@/components/templates/SlidingLocations";
import CaricatureSection from "@/components/organisms/CaricatureSection";
import FaqSection from "@/components/templates/FaqSection";
import CTASection from "@/components/templates/CTASection";
import FooterSection from "@/components/templates/FooterSection";

export default function RiderPage() {
  return (
    <main>
      <RiderHeroSection />
      <AccountTypesSection />
      <SlidingLocations />
            <CaricatureSection />
            <FaqSection />
            <CTASection />
            <FooterSection />
    </main>
  );
}