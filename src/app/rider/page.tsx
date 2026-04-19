import RiderHeroSection from "@/components/templates/RiderHeroSection";
import RiderValuesSection from "@/components/templates/RiderValuesSection";
import AccountTypesSection from "@/components/templates/AccountTypesSection";
import { SlidingLocations } from "@/components/templates/SlidingLocations";
import FaqSection from "@/components/templates/FaqSection";
import RiderCTASection from "@/components/templates/RiderCTASection";
import FooterSection from "@/components/templates/FooterSection";

export default function RiderPage() {
  return (
    <>
      <RiderHeroSection />
      <RiderValuesSection />
      <AccountTypesSection />
      <SlidingLocations />
      <FaqSection />
      <RiderCTASection />
      <FooterSection />
    </>
  );
}
