import RiderHeroSection from "@/components/templates/RiderHeroSection";
import RiderValuesSection from "@/components/organisms/RiderValuesSection";
import AccountTypesSection from "@/components/templates/AccountTypesSection";
import { SlidingLocations } from "@/components/templates/SlidingLocations";
import FaqSection from "@/components/templates/FaqSection";
import RiderCTASection from "@/components/templates/RiderCTASection";
import FooterSection from "@/components/templates/FooterSection";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Ride with Recommend — deliver in Lagos and earn",
  description:
    "Become a Recommend rider: deliver orders from vendors to buyers across Lagos, on your own schedule. Sign up in minutes.",
  path: "/rider",
});

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
