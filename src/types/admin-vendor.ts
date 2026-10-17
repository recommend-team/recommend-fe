/**
 * An admin running a vendor's account for them (`/admin/vendors/:id/...`). Everything but
 * money: payout accounts, withdrawals and the wallet stay with the vendor.
 */

export type DaySchedule = { isOpen: boolean; open: string; close: string };

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/** `PATCH /admin/vendors/:id` — any subset. Store fields go through the vendor's own update. */
export interface AdminUpdateVendorPayload {
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
  businessDescription?: string;
  whatsappNumber?: string;
  businessLogoUrl?: string;
  businessBannerUrl?: string;
  isOpen?: boolean;
  operatingHours?: Partial<Record<WeekDay, DaySchedule>>;
  areaIds?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  vendorType?: "REGISTERED" | "NON_REGISTERED";
  /** null for no monthly limit. */
  orderQuota?: number | null;
}

export interface AdminProductPayload {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  /** An extra — sold only with a main item from the same vendor. */
  isAddOn?: boolean;
}

export interface LocationState {
  id: string;
  name: string;
}

export interface LocationArea {
  id: string;
  name: string;
  stateId: string;
}

export interface UploadedFile {
  url: string;
  secureUrl: string;
}
