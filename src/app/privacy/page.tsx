import LegalDocument from "@/components/templates/LegalDocument";
import FooterSection from "@/components/templates/FooterSection";
import { PRIVACY } from "@/lib/legal/privacy";

export const metadata = {
  title: "Privacy Policy — Recommend",
  description:
    "How Recommend collects, uses, shares and protects your personal data, and your rights under the NDPR and NDPA 2023.",
};

export default function PrivacyPage() {
  return (
    <>
      <LegalDocument doc={PRIVACY} current="/privacy" />
      <FooterSection />
    </>
  );
}
