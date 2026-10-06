import Image from "next/image";
import { Text } from "@/components/atoms/Text";
import { NewsletterInput } from "@/components/molecules/NewsletterInput";
import { FooterNavColumn, type FooterItem } from "@/components/molecules/FooterNavColumn";
import { SOCIAL_LINKS } from "@/lib/social";

const neighborhoods = [
  "Lekki",
  "Admiralty Way",
  "Ajah",
  "Wole Ariyo Street",
  "Freedom Way",
  "Ikate & Jakande",
  "Igbo Efon",
  "Osapa London",
  "Victoria Arobieke Street",
];

// Pages that exist link to them. Blog, Terms of Use and Privacy Policy have no pages yet,
// so they are listed as text rather than as links to nowhere.
const company: FooterItem[] = [
  { label: "Vendors", href: "/vendor" },
  { label: "Riders", href: "/rider" },
  { label: "About", href: "/about" },
  { label: "FAQs", href: "/#faq" },
  "Blog",
  { label: "Contact", href: "/contact" },
  "Terms of Use",
  "Privacy Policy",
];

export default function FooterSection() {
  return (
    <footer
      className="relative w-full overflow-hidden"
    >
      <div className="relative z-10 px-6 md:px-12 pt-12 pb-4">

        <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-6">

          <div className="flex flex-col gap-6 max-w-125.25">

            <Text variant="section-heading-48" color="orange">
              Anything you need, from vendors near you.
            </Text>

            <NewsletterInput />

            <div className="hidden md:block">
              <Text variant="tap-hint" color="dark">
                All rights reserved 2026
              </Text>
            </div>

          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <FooterNavColumn heading="Neighborhoods" links={neighborhoods} showStar />
            <FooterNavColumn heading="Company" links={company} />
            <FooterNavColumn heading="Social" links={SOCIAL_LINKS} />
          </div>

        </div>

        <div className="mt-8 md:hidden">
          <Text variant="tap-hint" color="dark">
            All rights reserved 2026
          </Text>
        </div>
      </div>

      <div className="relative z-20 flex justify-end md:justify-start md:pl-66 -mb-8 md:-mb-12 mt-0">

        <div className="absolute bottom-0 right-[70px] md:right-auto md:left-45 w-[70px] md:w-[100px] scale-x-[-1] md:scale-x-[1]">
          <Image
            src="/svg/dashed-path.svg"
            alt=""
            width={100}
            height={40}
            className="w-full h-auto"
          />
        </div>

        <Image
          src="/svg/delivery_scooter.svg"
          alt="Delivery scooter"
          width={110}
          height={80}
          className="w-[65px] md:w-[110px] h-auto relative z-20"
        />

      </div>

      <div className="relative w-full overflow-hidden" style={{ height: "clamp(80px, 20vw, 250px)" }}>
        <Image
          src="/logo-full.svg"
          alt="Recommend"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

    </footer>
  );
}