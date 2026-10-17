import { API_URL, ApiError, request } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type {
  AdminProductPayload,
  AdminUpdateVendorPayload,
  LocationArea,
  LocationState,
  PaginatedResult,
  Product,
  UploadedFile,
} from "@/types";

/** An admin changing a vendor's store and owner details. Logged; the vendor is told. */
export async function updateVendor(
  id: string,
  payload: AdminUpdateVendorPayload
): Promise<unknown> {
  return request<unknown>(`/admin/vendors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getVendorProducts(
  vendorId: string
): Promise<PaginatedResult<Product>> {
  return request<PaginatedResult<Product>>(
    `/admin/vendors/${vendorId}/products?limit=100`
  );
}

export async function addVendorProduct(
  vendorId: string,
  payload: AdminProductPayload
): Promise<Product> {
  return request<Product>(`/admin/vendors/${vendorId}/products`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateVendorProduct(
  vendorId: string,
  productId: string,
  payload: Partial<AdminProductPayload>
): Promise<Product> {
  return request<Product>(`/admin/vendors/${vendorId}/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function removeVendorProduct(
  vendorId: string,
  productId: string
): Promise<unknown> {
  return request<unknown>(`/admin/vendors/${vendorId}/products/${productId}`, {
    method: "DELETE",
  });
}

/** The areas a vendor can be set to deliver to — every active area, by state. */
export async function getStates(): Promise<LocationState[]> {
  return request<LocationState[]>("/locations/states");
}

export async function getAreasByState(stateId: string): Promise<LocationArea[]> {
  return request<LocationArea[]>(`/locations/states/${stateId}/areas`);
}

/**
 * Upload an image (or PDF) and get back its address, to save on a vendor or product.
 *
 * Not `request()`: that sends JSON, and a file has to go as multipart form data with the
 * browser setting its own content type.
 */
export async function uploadFile(
  file: File,
  folder: "products" | "profile" | "kyc"
): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file);
  const token = getAccessToken();

  let res: Response;
  try {
    res = await fetch(`${API_URL}/storage/upload?folder=${folder}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
  } catch (cause) {
    throw new ApiError("Upload failed. Check your connection and try again.", 0, undefined, cause);
  }

  const body = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: UploadedFile;
  };
  if (!res.ok || body.success === false || !body.data?.secureUrl) {
    throw new ApiError(body.message ?? "Upload failed.", res.status, undefined, body);
  }
  return body.data;
}
