import type { UserStatus, RiderType, VendorType } from "./auth";
import type { Product } from "./product";

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
  // KYC document URLs surfaced by the admin API
  cacDocumentUrl?: string | null;
  tinDocumentUrl?: string | null;
  ninDocumentUrl?: string | null;
  passportPhotoUrl?: string | null;
  bankStatementUrl?: string | null;
  utilityBillUrl?: string | null;
  governmentIdUrl?: string | null;
  selfieUrl?: string | null;
  bvn?: string | null;
  guarantorName?: string | null;
  guarantorPhone?: string | null;
  createdAt: string;
}

export interface AdminVendorSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "SELLER";
  status: UserStatus;
  vendorType: VendorType;
  businessName: string | null;
  businessAddress: string | null;
  businessCategory: string | null;
  businessLogoUrl: string | null;
  slug: string | null;
  isOpen: boolean;
  isEmailVerified: boolean;
  productCount?: number;
  createdAt: string;
}

export interface AdminVendorDetail {
  vendor: AdminVendorSummary & {
    businessDescription: string | null;
    businessBannerUrl: string | null;
    businessAreas: string[] | null;
    operatingHours: Record<
      string,
      { isOpen: boolean; open: string; close: string }
    > | null;
  };
  products: Product[];
  productCount: number;
}

export interface AdminBuyerSummary {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string;
  status: UserStatus;
  createdAt: string;
}

export interface AdminOrderSummary {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string | null;
  quantity: number;
  unitPrice: string;
  totalAmount: string;
  platformFee: string;
  vendorAmount: string;
  fulfillmentType: "PICKUP" | "DELIVERY";
  status: "PENDING" | "PAID" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED";
  paymentReference: string | null;
  deliveryAddress: string | null;
  notes: string | null;
  paidAt: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
  };
  vendor: {
    id: string;
    firstName: string;
    lastName: string;
    businessName: string | null;
  };
}

export interface AdminBuyerDetail {
  buyer: AdminBuyerSummary;
  orders: AdminOrderSummary[];
  orderCount: number;
}

export interface VendorListFilters extends PaginationParams {
  status?: UserStatus;
}

export interface OrderListFilters extends PaginationParams {
  status?: AdminOrderSummary["status"];
  vendorId?: string;
}

export interface BuyerListFilters extends PaginationParams {
  status?: UserStatus;
}

export interface RejectPendingPayload {
  id: string;
  reason?: string;
}
