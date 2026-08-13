/**
 * Hosts `next/image` is allowed to optimise.
 *
 * The single source of truth: `next.config.ts` turns this into `images.remotePatterns`,
 * and `RemoteImage` checks against it at render. Keeping one list means a host can never
 * be allowed in the optimiser but rejected by the component, or the reverse.
 *
 * Plain data with no imports, because `next.config.ts` is loaded outside the app bundle.
 */
export const OPTIMISED_IMAGE_HOSTS = [
  // Backend-issued uploads: vendor KYC documents, logos, banners, product images.
  'res.cloudinary.com',
  // Hosts that appear in seed and demo data. Every product image in development is
  // currently a picsum URL, so without it the admin vendor page cannot open at all.
  'picsum.photos',
  'cdn.pixabay.com',
  'images.unsplash.com',
  'images.pexels.com',
] as const;
