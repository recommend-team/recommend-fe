import type { UserStatus, RiderType, VendorType } from "./auth";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface CreateAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PlatformStats {
  totalVendors: number;
  pendingVendors: number;
  totalRiders: number;
  pendingRiders: number;
  totalBuyers: number;
  totalOrders: number;
  paidOrders: number;
  totalRevenue: string;
  totalPlatformFee: string;
}

export interface PendingApproval {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "SELLER" | "RIDER";
  status: UserStatus;
  vendorType?: VendorType | null;
  riderType?: RiderType | null;
  businessName?: string | null;
  businessCategory?: string | null;
  createdAt: string;
}
