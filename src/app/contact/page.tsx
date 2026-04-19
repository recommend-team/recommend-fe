import ContactHeroSection from "@/components/templates/ContactHeroSection";
import ContactFormSection from "@/components/templates/ContactFormSection";
import { SlidingLocations } from "@/components/templates/SlidingLocations";
import FaqSection from "@/components/templates/FaqSection";
import VendorCTASection from "@/components/templates/VendorCTASection";
import FooterSection from "@/components/templates/FooterSection";

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactFormSection />
      <SlidingLocations />
      <FaqSection />
      <VendorCTASection />
      <FooterSection />
    </>
  );
}
