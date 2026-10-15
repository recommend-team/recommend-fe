import type { Metadata } from "next";
import { SOCIAL_LINKS } from "./social";

/**
 * The public face of the site for search engines and link previews: its address, name, and
 * the metadata every indexable page shares.
 *
 * The address defaults to production so canonical links, the sitemap and share cards always
 * point there — even from a staging deploy, which should never compete with it in search.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://getrecommend.co").replace(/\/$/, "");
export const SITE_NAME = "Recommend";
export const X_HANDLE = "@heyrecommend";

/**
 * The branded card image, drawn by src/app/opengraph-image.tsx. Named explicitly because
 * once a page sets its own `openGraph`, Next.js stops adding the file-based image for it.
 */
const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Recommend — anything you need, from vendors near you",
};

/**
 * Title, description, canonical address and share card for one page.
 *
 * Next.js replaces a parent's `openGraph` and `twitter` objects rather than merging them,
 * so a page that set only a title would share the home page's card. Going through this
 * keeps each page's card in step with its own title and description.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_NG",
      url: path,
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      site: X_HANDLE,
      title,
      description,
      images: [SHARE_IMAGE],
    },
  };
}

/** For pages that work but should never appear in search results. */
export const NO_INDEX: Metadata["robots"] = { index: false, follow: false };

/**
 * Who Recommend is, in the vocabulary search engines read (schema.org), for the home page.
 * Only facts that are true today.
 */
export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "Brand Collaborator Limited",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.svg`,
  description:
    "A personal market assistant for Lagos: tell Recommend what you need and it connects you with verified vendors nearby, then handles payment and delivery.",
  email: "legal@getrecommend.co",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  areaServed: { "@type": "City", name: "Lagos" },
  sameAs: SOCIAL_LINKS.map((link) => link.href),
};
