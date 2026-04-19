import { request } from "@/lib/api";
import type {
  AdminBuyerDetail,
  AdminBuyerSummary,
  AdminOrderSummary,
  AdminUser,
  AdminVendorDetail,
  AdminVendorSummary,
  BuyerListFilters,
  CreateAdminPayload,
  OrderListFilters,
  PaginatedResult,
  PaginationParams,
  PendingApproval,
  PlatformStats,
  VendorListFilters,
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

// Stats
export async function getPlatformStats(): Promise<PlatformStats> {
  return request<PlatformStats>("/super-admin/stats");
}

// Admins
export async function getAdmins(
  params: PaginationParams = {}
): Promise<PaginatedResult<AdminUser>> {
  return request<PaginatedResult<AdminUser>>(
    `/super-admin/admins${qs({ page: params.page, limit: params.limit })}`
  );
}

export async function createAdmin(
  payload: CreateAdminPayload
): Promise<AdminUser> {
  return request<AdminUser>("/super-admin/admins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function suspendAdmin(id: string): Promise<AdminUser> {
  return request<AdminUser>(`/super-admin/admins/${id}/suspend`, {
    method: "PATCH",
  });
}

// Pending approvals / KYC queue
export async function getPendingApprovals(
  params: PaginationParams = {}
): Promise<PaginatedResult<PendingApproval>> {
  return request<PaginatedResult<PendingApproval>>(
    `/admin/pending${qs({ page: params.page, limit: params.limit })}`
  );
}

export async function approvePending(id: string): Promise<unknown> {
  return request<unknown>(`/admin/pending/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectPending(
  id: string,
  reason?: string
): Promise<unknown> {
  return request<unknown>(`/admin/pending/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason: reason ?? "" }),
  });
}

// Vendors
export async function getVendors(
  params: VendorListFilters = {}
): Promise<PaginatedResult<AdminVendorSummary>> {
  return request<PaginatedResult<AdminVendorSummary>>(
    `/admin/vendors${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
    })}`
  );
}

export async function getVendorDetail(
  id: string
): Promise<AdminVendorDetail> {
  return request<AdminVendorDetail>(`/admin/vendors/${id}`);
}

// Any user by id (works for riders, buyers, vendors alike)
export async function getUserDetail(
  id: string
): Promise<import("@/types").AdminUserDetail> {
  return request<import("@/types").AdminUserDetail>(`/admin/users/${id}`);
}

// Generic user actions (vendors, riders, buyers share the same suspend/activate endpoints)
export async function suspendUser(id: string): Promise<unknown> {
  return request<unknown>(`/admin/users/${id}/suspend`, { method: "PATCH" });
}

export async function activateUser(id: string): Promise<unknown> {
  return request<unknown>(`/admin/users/${id}/activate`, { method: "PATCH" });
}

// Orders
export async function getAdminOrders(
  params: OrderListFilters = {}
): Promise<PaginatedResult<AdminOrderSummary>> {
  return request<PaginatedResult<AdminOrderSummary>>(
    `/admin/orders${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
      vendorId: params.vendorId,
    })}`
  );
}

// Buyers
export async function getBuyers(
  params: BuyerListFilters = {}
): Promise<PaginatedResult<AdminBuyerSummary>> {
  return request<PaginatedResult<AdminBuyerSummary>>(
    `/admin/buyers${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
    })}`
  );
}

export async function getBuyerDetail(id: string): Promise<AdminBuyerDetail> {
  return request<AdminBuyerDetail>(`/admin/buyers/${id}`);
}
