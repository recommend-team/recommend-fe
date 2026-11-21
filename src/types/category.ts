/** A kind of thing Recommend sells, and what Recommend keeps of each sale in it. */
export interface Category {
  id: string;
  name: string;
  /** 25 means Recommend keeps 25% of each sale. */
  feePercent: number;
  /** Words buyers might use for it, so the assistant knows where to look. */
  keywords: string[];
  isActive: boolean;
  vendorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryList {
  categories: Category[];
  /** What vendors outside every category pay. */
  standardPercent: number;
  uncategorisedVendors: number;
}

export interface CategoryRateChange {
  id: string;
  createdAt: string;
  /** Null when the category was created at this rate. */
  previousPercent: number | null;
  /** For a vendor, null means their own rate was removed. */
  newPercent: number | null;
  /** Null when Recommend set it — the starting categories. */
  changedByName: string | null;
}

export interface CreateCategoryPayload {
  name: string;
  keywords?: string[];
  /** Super Admin only. */
  feePercent?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  keywords?: string[];
  isActive?: boolean;
}

/** A category as a vendor (or an admin setting one up) picks it. */
export interface CategoryOption {
  id: string;
  name: string;
  feePercent: number;
}

/** A vendor in no category, with the category their own words point at, if any. */
export interface UncategorisedVendor {
  id: string;
  businessName: string | null;
  /** What they typed. */
  businessCategory: string | null;
  status: string | null;
  suggestedCategoryId: string | null;
  suggestedCategoryName: string | null;
}

/** Where a vendor's rate comes from. */
export type RateBasis = "CUSTOM" | "CATEGORY" | "STANDARD";

/** What Recommend keeps of one vendor's sales, why, and the history of their own rate. */
export interface VendorRate {
  percent: number;
  basis: RateBasis;
  categoryId: string | null;
  categoryName: string | null;
  categoryPercent: number | null;
  customPercent: number | null;
  standardPercent: number;
  history: CategoryRateChange[];
}
