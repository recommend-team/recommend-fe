import type { UserStatus, VendorType } from "./auth";

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
  businessAreas: string[] | null;
  businessLogoUrl: string | null;
  businessBannerUrl: string | null;
  whatsappNumber: string | null;
  isOpen: boolean;
  operatingHours: Record<string, OperatingHours> | null;
  slug: string | null;
}

export interface VendorProfile extends Vendor {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: UserStatus;
  vendorType: VendorType;
  isEmailVerified: boolean;
  // Payout
  bankName?: string | null;
  bankCode?: string | null;
  bankAccountNumber?: string | null;
  bankAccountName?: string | null;
  // KYC document URLs (vendor can read its own)
  cacDocumentUrl?: string | null;
  tinDocumentUrl?: string | null;
  ninDocumentUrl?: string | null;
  passportPhotoUrl?: string | null;
  bankStatementUrl?: string | null;
  utilityBillUrl?: string | null;
  // Quota
  orderQuota?: number | null;
  monthlyOrderCount?: number;
  createdAt: string;
}

export interface UpdateVendorProfilePayload {
  businessName?: string;
  businessAddress?: string;
  businessDescription?: string;
  businessCategory?: string;
  businessAreas?: string[];
  businessLogoUrl?: string;
  businessBannerUrl?: string;
  whatsappNumber?: string;
  isOpen?: boolean;
  operatingHours?: Record<string, OperatingHours>;
}

export interface UpdatePayoutPayload {
  bankName: string;
  bankCode: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface SubmitKycRegisteredPayload {
  cacDocumentUrl?: string;
  tinDocumentUrl?: string;
}

export interface SubmitKycNonRegisteredPayload {
  ninDocumentUrl?: string;
  passportPhotoUrl?: string;
  bankStatementUrl?: string;
  utilityBillUrl?: string;
}

export interface VendorEarnings {
  grossTotal: string;
  netTotal: string;
  platformFeeTotal: string;
  monthlyBreakdown: Array<{
    month: string; // YYYY-MM
    gross: string;
    net: string;
  }>;
}

export interface UploadedFile {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  folder: string;
}
