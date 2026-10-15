import { NO_INDEX } from "@/lib/site";

// The old storefronts still work, but buying has moved to the customer app, so they are
// kept out of search. Remove `robots` (and add them to the sitemap) if they come back.
export const metadata = {
  title: "Recommend Store",
  description: "Browse products and place your order",
  robots: NO_INDEX,
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
