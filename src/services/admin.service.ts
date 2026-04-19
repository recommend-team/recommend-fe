import { request } from "@/lib/api";
import type {
  AdminUser,
  CreateAdminPayload,
  PaginatedResult,
  PaginationParams,
  PendingApproval,
  PlatformStats,
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

export async function getPlatformStats(): Promise<PlatformStats> {
  return request<PlatformStats>("/super-admin/stats");
}

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

export async function getPendingApprovals(
  params: PaginationParams = {}
): Promise<PaginatedResult<PendingApproval>> {
  return request<PaginatedResult<PendingApproval>>(
    `/admin/pending${qs({ page: params.page, limit: params.limit })}`
  );
}
