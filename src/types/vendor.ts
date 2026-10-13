/**
 * What this site still knows about a vendor: enough to render a storefront.
 *
 * Vendors manage their business in the vendor app (`recommend_vendors`), so the profile,
 * payout, KYC and earnings shapes that used to live here went with the dashboard. They
 * are defined once now, in that app's `src/lib/contract.ts`.
 */

export interface OperatingHours {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface Vendor {
  id: string;
  businessName: string | null;
  businessDescription: string | null;
  businessCategory: string | null;
  /** From the `areas` table. The old free-text `businessAreas` is no longer sent. */
  serviceAreas: { id: string; name: string }[];
  businessLogoUrl: string | null;
  businessBannerUrl: string | null;
  whatsappNumber: string | null;
  isOpen: boolean;
  operatingHours: Record<string, OperatingHours> | null;
  slug: string | null;
}
