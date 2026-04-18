import VendorHeroSection from "@/components/templates/VendorHeroSection";
import RegistrationTiersSection from "@/components/templates/RegistrationTiersSection";
import VendorFeaturesSection from "@/components/templates/VendorFeaturesSection";
import { SlidingLocations } from "@/components/templates/SlidingLocations";
import FaqSection from "@/components/templates/FaqSection";
import VendorCTASection from "@/components/templates/VendorCTASection";
import FooterSection from "@/components/templates/FooterSection";

export default function VendorPage() {
  return (
    <>
      <VendorHeroSection />
      <RegistrationTiersSection />
      <VendorFeaturesSection />
      <SlidingLocations />
      <FaqSection />
      <VendorCTASection />
      <FooterSection />
    </>
  );
}
