import { Bricolage_Grotesque } from "next/font/google";
import { NO_INDEX } from "@/lib/site";

// Vendors' own shops — the links they share on social media, where buyers fill a cart and
// pay. Kept out of search for now: they are reached through the vendor's link. Remove
// `robots` (and add them to the sitemap) to have them indexed.
export const metadata = {
  title: "Recommend Store",
  description: "Browse products and place your order",
  robots: NO_INDEX,
};

/** The shop's display face — vendor names and headings (`font-display`). */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={display.variable}>{children}</div>;
}
