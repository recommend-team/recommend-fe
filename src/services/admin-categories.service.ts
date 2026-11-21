import { request } from "@/lib/api";
import type {
  Category,
  CategoryList,
  CategoryOption,
  UncategorisedVendor,
  VendorRate,
  CategoryRateChange,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";

export async function getCategories(): Promise<CategoryList> {
  return request<CategoryList>("/admin/categories");
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  return request<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(params: {
  id: string;
  changes: UpdateCategoryPayload;
}): Promise<Category> {
  return request<Category>(`/admin/categories/${params.id}`, {
    method: "PATCH",
    body: JSON.stringify(params.changes),
  });
}

/** Super Admin only. Applies from the next order. */
export async function changeCategoryRate(params: {
  id: string;
  feePercent: number;
}): Promise<Category> {
  return request<Category>(`/admin/categories/${params.id}/rate`, {
    method: "PATCH",
    body: JSON.stringify({ feePercent: params.feePercent }),
  });
}

export async function getCategoryRateHistory(id: string): Promise<CategoryRateChange[]> {
  return request<CategoryRateChange[]>(`/admin/categories/${id}/rate-history`);
}

/** The active categories, for picking one. Public: the vendor app uses it at sign-up. */
export async function getCategoryOptions(): Promise<CategoryOption[]> {
  return request<CategoryOption[]>("/categories");
}

export async function getUncategorisedVendors(): Promise<UncategorisedVendor[]> {
  return request<UncategorisedVendor[]>("/admin/categories/uncategorised");
}

export async function assignVendorsToCategory(params: {
  categoryId: string;
  vendorIds: string[];
}): Promise<{ moved: number }> {
  return request<{ moved: number }>(`/admin/categories/${params.categoryId}/vendors`, {
    method: "POST",
    body: JSON.stringify({ vendorIds: params.vendorIds }),
  });
}

export async function getVendorRate(vendorId: string): Promise<VendorRate> {
  return request<VendorRate>(`/admin/vendors/${vendorId}/rate`);
}

/** Super Admin only. Null removes their own rate. */
export async function setVendorRate(params: {
  vendorId: string;
  feePercent: number | null;
}): Promise<unknown> {
  return request<unknown>(`/admin/vendors/${params.vendorId}/rate`, {
    method: "PATCH",
    body: JSON.stringify({ feePercent: params.feePercent }),
  });
}
