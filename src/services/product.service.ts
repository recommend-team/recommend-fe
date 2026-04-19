import { request } from "@/lib/api";
import type {
  CreateProductPayload,
  PaginatedResult,
  Product,
  UpdateProductPayload,
} from "@/types";

function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== ""
  );
  if (entries.length === 0) return "";
  const search = new URLSearchParams();
  for (const [key, value] of entries) {
    search.set(key, String(value));
  }
  return `?${search.toString()}`;
}

export interface ProductListFilters {
  page?: number;
  limit?: number;
}

export async function getMyProducts(
  filters: ProductListFilters = {}
): Promise<PaginatedResult<Product>> {
  return request<PaginatedResult<Product>>(
    `/products${qs({ page: filters.page, limit: filters.limit })}`
  );
}

export async function createProduct(
  payload: CreateProductPayload
): Promise<Product> {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<Product> {
  return request<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  return request<void>(`/products/${id}`, { method: "DELETE" });
}
