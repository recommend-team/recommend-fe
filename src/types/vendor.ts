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
