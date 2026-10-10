/**
 * Where this site sends people: the customer chat and the vendor app.
 *
 * Both come from the environment. Outside production, an unset value falls back to the
 * staging deployment — as `API_URL` does in `api.ts` — so a fresh checkout's buttons work
 * without any setup. In production an unset value is a deploy mistake: the buttons render
 * disabled (sending real vendors to staging would sign them up in the wrong database) and
 * the build log says which variable is missing.
 */

const STAGING_CUSTOMER_APP_URL = "https://recommend-customer-app.vercel.app";
const STAGING_VENDOR_APP_URL = "https://recommend-vendors.vercel.app";

function resolve(name: string, value: string | undefined, staging: string, what: string): string {
  if (value) return value;
  if (process.env.NODE_ENV !== "production") return staging;
  // Visible in the build log, where whoever is deploying will see it.
  console.warn(`${name} is not set — ${what} will render disabled.`);
  return "";
}

export const CUSTOMER_APP_URL = resolve(
  "NEXT_PUBLIC_CUSTOMER_APP_URL",
  process.env.NEXT_PUBLIC_CUSTOMER_APP_URL,
  STAGING_CUSTOMER_APP_URL,
  'the "Start Ordering" buttons'
);

/**
 * The vendor PWA. This site no longer contains a vendor dashboard — signing up, signing
 * in and running a business all happen in `recommend_vendors`. What remains here is the
 * pitch, and every vendor-facing button on it is a way out to that app.
 */
export const VENDOR_APP_URL = resolve(
  "NEXT_PUBLIC_VENDOR_APP_URL",
  process.env.NEXT_PUBLIC_VENDOR_APP_URL,
  STAGING_VENDOR_APP_URL,
  "every vendor sign-up and login button"
);

/**
 * A path inside the vendor app, e.g. `vendorApp('/signup')`.
 *
 * Returns `''` when the URL is unset, which `Button` renders as disabled — a relative
 * `/signup` would 404 on this site, and a dead button is a more honest failure than a
 * broken page.
 */
export function vendorApp(path = ""): string {
  if (!VENDOR_APP_URL) return "";
  return `${VENDOR_APP_URL.replace(/\/$/, "")}${path}`;
}
