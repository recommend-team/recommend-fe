
export const CUSTOMER_APP_URL = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL ?? '';

if (!CUSTOMER_APP_URL && process.env.NODE_ENV === 'production') {
  // Visible in the build log, where whoever is deploying will see it.
  console.warn(
    'NEXT_PUBLIC_CUSTOMER_APP_URL is not set — the "Start Ordering" buttons will render disabled.',
  );
}

/**
 * The vendor PWA. This site no longer contains a vendor dashboard — signing up, signing
 * in and running a business all happen in `recommend_vendors`. What remains here is the
 * pitch, and every vendor-facing button on it is a way out to that app.
 */
export const VENDOR_APP_URL = process.env.NEXT_PUBLIC_VENDOR_APP_URL ?? '';

if (!VENDOR_APP_URL && process.env.NODE_ENV === 'production') {
  console.warn(
    'NEXT_PUBLIC_VENDOR_APP_URL is not set — every vendor sign-up and login link will point nowhere.',
  );
}

/**
 * A path inside the vendor app, e.g. `vendorApp('/signup')`.
 *
 * Returns `''` when the URL is unset, which `Button` renders as disabled — a relative
 * `/signup` would 404 on this site, and a dead button is a more honest failure than a
 * broken page.
 */
export function vendorApp(path = ''): string {
  if (!VENDOR_APP_URL) return '';
  return `${VENDOR_APP_URL.replace(/\/$/, '')}${path}`;
}
