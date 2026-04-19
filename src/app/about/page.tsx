import GeneralHeader from "@/components/organisms/GeneralHeader";
import AboutHeroSection from "@/components/templates/AboutHeroSection";
import FounderStorySection from "@/components/templates/FounderStorySection";
import StatsSection from "@/components/templates/StatsSection";
import AboutValuesSection from "@/components/templates/AboutValuesSection";
import {SlidingLocations} from "@/components/templates/SlidingLocations";
import CaricatureSection from "@/components/organisms/CaricatureSection";
import FaqSection from "@/components/templates/FaqSection";
import CTASection from "@/components/templates/CTASection";
import FooterSection from "@/components/templates/FooterSection";

export default function AboutPage() {
  return (
    <>
      <GeneralHeader />
      <AboutHeroSection />
      <FounderStorySection />
      <AboutValuesSection/>
      <StatsSection />
      <SlidingLocations />
      <CaricatureSection />
      <FaqSection />
      <CTASection />
      <FooterSection />
    </>
  );
}