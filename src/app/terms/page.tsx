import LegalDocument from "@/components/templates/LegalDocument";
import FooterSection from "@/components/templates/FooterSection";
import { TERMS } from "@/lib/legal/terms";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Use — Recommend",
  description:
    "The terms that govern using Recommend as a buyer or vendor: payments, refunds and cancellations, delivery, and liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <LegalDocument doc={TERMS} current="/terms" />
      <FooterSection />
    </>
  );
}
