import ContactContent from "@/components/templates/ContactContent";
import FooterSection from "@/components/templates/FooterSection";
// The previous contact page, kept for now. ContactContent replaces all of it.
// import ContactHeroSection from "@/components/templates/ContactHeroSection";
// import ContactFormSection from "@/components/templates/ContactFormSection";
// import { SlidingLocations } from "@/components/templates/SlidingLocations";
// import FaqSection from "@/components/templates/FaqSection";
// import VendorCTASection from "@/components/templates/VendorCTASection";

export const metadata = {
  title: "Contact Recommend — we're here to help",
  description:
    "Get help with an order, your vendor store or riding with us, or reach the team about partnerships and press.",
};

export default function ContactPage() {
  return (
    <>
      <ContactContent />
      <FooterSection />
    </>
  );
}
