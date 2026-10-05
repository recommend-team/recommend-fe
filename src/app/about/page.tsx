import AboutHeroSection from "@/components/templates/AboutHeroSection";
import FounderStorySection from "@/components/templates/FounderStorySection";
import AboutValuesSection from "@/components/organisms/AboutValuesSection";
import FaqSection from "@/components/templates/FaqSection";
import CTASection from "@/components/templates/CTASection";
import FooterSection from "@/components/templates/FooterSection";
// Hidden for now: its figures (10M+ customers, 98% satisfaction, 500+ businesses) are not
// backed by anything in the product. Bring it back with real numbers.
// import StatsSection from "@/components/templates/StatsSection";
// Hidden for now: the street strip no longer fits the page.
// import { SlidingLocations } from "@/components/templates/SlidingLocations";
// Hidden for now: it still sold a "WhatsApp storefront".
// import CaricatureSection from "@/components/organisms/CaricatureSection";

/**
 * The story (why Recommend exists), what we stand for, and answers to common questions.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <FounderStorySection />
      <AboutValuesSection />
      {/* <StatsSection /> */}
      {/* <SlidingLocations /> */}
      {/* <CaricatureSection /> */}
      <FaqSection />
      <CTASection />
      <FooterSection />
    </>
  );
}
