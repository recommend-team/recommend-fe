import GeneralHeader from "@/components/organisms/GeneralHeader";
import AboutHeroSection from "@/components/templates/AboutHeroSection";
import AboutValuesSection from "@/components/templates/AboutValuesSection";
import FooterSection from "@/components/templates/FooterSection";

export default function AboutPage() {
  return (
    <>
      <GeneralHeader />
      <AboutHeroSection />
      <AboutValuesSection/>
      <FooterSection />
    </>
  );
}