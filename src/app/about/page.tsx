import AboutContent from "@/components/templates/AboutContent";
import FooterSection from "@/components/templates/FooterSection";
// The previous About page, kept for now. AboutContent replaces all of it.
// import AboutHeroSection from "@/components/templates/AboutHeroSection";
// import FounderStorySection from "@/components/templates/FounderStorySection";
// import AboutValuesSection from "@/components/organisms/AboutValuesSection";
// import FaqSection from "@/components/templates/FaqSection";
// import CTASection from "@/components/templates/CTASection";
// Hidden: its figures (10M+ customers, 98% satisfaction, 500+ businesses) are not backed by
// anything in the product. Bring it back with real numbers.
// import StatsSection from "@/components/templates/StatsSection";

export const metadata = {
  title: "About Recommend — local commerce, as simple as asking",
  description:
    "Recommend is a personal market assistant for Lagos. Founded by Chanor James to connect people with verified vendors nearby in one conversation.",
};

/**
 * Who we are, the founder's story, mission and vision, what we do, who we serve, what we
 * stand for, trust and safety, and what to do next.
 */
export default function AboutPage() {
  return (
    <>
      <AboutContent />
      <FooterSection />
    </>
  );
}
