/**
 * How people reach the team — the contact page, a vendor's shop and the order page.
 *
 * `NEXT_PUBLIC_SUPPORT_PHONE` and `NEXT_PUBLIC_SUPPORT_EMAIL` override the defaults. Baked
 * in at build time, so a change needs a redeploy. The backend (`SUPPORT_*`) and the
 * customer app (`VITE_SUPPORT_*`) carry the same defaults; keep all three the same.
 */

const DEFAULT_SUPPORT_PHONE = "+234 814 306 7676";
const DEFAULT_SUPPORT_EMAIL = "contacts.recommend@gmail.com";

/** Written for people: `+234 814 306 7676`. */
export const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || DEFAULT_SUPPORT_PHONE;

/** The same number for a `tel:` link — no spaces. */
export const SUPPORT_PHONE_HREF = `tel:${SUPPORT_PHONE.replace(/[^\d+]/g, "")}`;

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || DEFAULT_SUPPORT_EMAIL;
