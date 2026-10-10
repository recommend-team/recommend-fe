/**
 * Features that are built but switched off until the business is ready for them.
 *
 * Pickup: buyers collecting orders themselves. Off until `NEXT_PUBLIC_PICKUP_ENABLED` is
 * "true" — matching the backend's `PICKUP_ENABLED`, which is what actually refuses a
 * pickup checkout. While off, the order forms offer delivery only and the site's copy
 * talks about delivery alone. Turning it on brings both back with no code change.
 */
export const PICKUP_ENABLED =
  process.env.NEXT_PUBLIC_PICKUP_ENABLED === "true";
