import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Served at /robots.txt. Only the staff console is closed to crawlers. The other private
 * pages (reset password, rider verification, order receipts, the old storefronts) stay
 * crawlable on purpose: they carry a "noindex" tag, and a crawler has to be allowed in to
 * read it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
