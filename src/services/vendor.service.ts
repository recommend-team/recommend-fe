import { API_URL, request } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type {
  AdminOrderSummary,
  PaginatedResult,
  SubmitKycNonRegisteredPayload,
  SubmitKycRegisteredPayload,
  UpdatePayoutPayload,
  UpdateVendorProfilePayload,
  UploadedFile,
  VendorEarnings,
  VendorProfile,
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

export async function getMyVendorProfile(): Promise<VendorProfile> {
  return request<VendorProfile>("/sellers/profile");
}

export async function updateMyVendorProfile(
  payload: UpdateVendorProfilePayload
): Promise<VendorProfile> {
  return request<VendorProfile>("/sellers/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateVendorPayout(
  payload: UpdatePayoutPayload
): Promise<VendorProfile> {
  return request<VendorProfile>("/sellers/profile/payout", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function submitVendorKyc(
  payload: SubmitKycRegisteredPayload | SubmitKycNonRegisteredPayload
): Promise<VendorProfile> {
  return request<VendorProfile>("/sellers/profile/kyc", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface VendorOrdersFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export async function getMyVendorOrders(
  filters: VendorOrdersFilters = {}
): Promise<PaginatedResult<AdminOrderSummary>> {
  return request<PaginatedResult<AdminOrderSummary>>(
    `/sellers/orders${qs({
      page: filters.page,
      limit: filters.limit,
      status: filters.status,
    })}`
  );
}

export async function getMyVendorEarnings(): Promise<VendorEarnings> {
  return request<VendorEarnings>("/sellers/earnings");
}

// File upload goes to /storage/upload as multipart/form-data — needs to bypass
// the JSON-centric request() helper. Bearer token attached manually.
export async function uploadFile(
  file: File,
  folder = "products"
): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file);

  const token = getAccessToken();
  const res = await fetch(
    `${API_URL}/storage/upload?folder=${encodeURIComponent(folder)}`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    }
  );

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new Error(
      body.message ?? body.error ?? `Upload failed (${res.status})`
    );
  }
  return body.data as UploadedFile;
}
