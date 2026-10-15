import VendorHeroSection from "@/components/templates/VendorHeroSection";
import RegistrationTiersSection from "@/components/templates/RegistrationTiersSection";
import VendorFeaturesSection from "@/components/templates/VendorFeaturesSection";
import { SlidingLocations } from "@/components/templates/SlidingLocations";
import FaqSection from "@/components/templates/FaqSection";
import VendorCTASection from "@/components/templates/VendorCTASection";
import FooterSection from "@/components/templates/FooterSection";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Sell on Recommend — reach buyers near you in Lagos",
  description:
    "Home kitchens, market stalls, Instagram shops and restaurants: list your products on Recommend and get orders from buyers nearby, with payment and delivery handled.",
  path: "/vendor",
});

export default function VendorPage() {
  return (
    <>
      <VendorHeroSection />
      <RegistrationTiersSection />
      <VendorFeaturesSection />
      <SlidingLocations />
      <FaqSection audience="vendor" />
      <VendorCTASection />
      <FooterSection />
    </>
  );
}
