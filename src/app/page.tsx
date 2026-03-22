import { LandingSectionOne } from "@/components/organisms/LandingSection1";
import { BackgroundOne } from "@/components/templates/BackgroundOne";
import NoAppSection from "@/components/templates/NoAppSection";
import { SlidingLocations } from "@/components/templates/SlidingLocations";

export default function Home() {
  return (
    <BackgroundOne>
      <LandingSectionOne />
      <NoAppSection />
      <SlidingLocations/>
    </BackgroundOne>
  );
}