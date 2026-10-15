import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Served at /sitemap.xml: every page we want found in search. Add a page here when it
 * launches. The storefronts (/store/…) are left out — buying moved to the customer app,
 * and they are kept out of search until they are used again.
 */
const PAGES = ["/", "/vendor", "/rider", "/rider/signup", "/about", "/contact", "/terms", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }));
}
