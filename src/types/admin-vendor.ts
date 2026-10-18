/**
 * An admin running a vendor's account for them (`/admin/vendors/:id/...`). Everything but
 * money: payout accounts, withdrawals and the wallet stay with the vendor.
 */

import type { ChoiceGroupInput } from "./product";

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
  /** Dishes only: what the price is per, the extras ticked on it, its choices. */
  unit?: string | null;
  extraIds?: string[];
  choices?: ChoiceGroupInput[];
  /** Extras only: the products it goes with. */
  dishIds?: string[];
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

/** `POST /admin/vendors` — someone onboarded in person. They're emailed a set-password link. */
export interface CreateVendorPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  vendorType: "REGISTERED" | "NON_REGISTERED";
  businessName: string;
  businessAddress: string;
  businessCategory: string;
  businessDescription?: string;
  areaIds?: string[];
}

/** The KYC documents, by vendor type. */
export type KycDocumentKey =
  | "cacDocumentUrl"
  | "tinDocumentUrl"
  | "ninDocumentUrl"
  | "passportPhotoUrl"
  | "bankStatementUrl"
  | "utilityBillUrl";

export type VendorAdminAction =
  | "CREATED"
  | "STORE_UPDATED"
  | "OWNER_UPDATED"
  | "EMAIL_CHANGED"
  | "INVITE_SENT"
  | "KYC_UPDATED"
  | "PRODUCT_ADDED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_REMOVED"
  | "DEACTIVATED";

/** One thing an admin did to a vendor (`GET /admin/vendors/:id/history`). */
export interface VendorAdminEdit {
  id: string;
  action: VendorAdminAction;
  summary: string;
  createdAt: string;
  admin: { id: string; name: string };
}
