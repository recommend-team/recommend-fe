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
    whatsappNumber: string | null;
    operatingHours: Record<
      string,
      { isOpen: boolean; open: string; close: string }
    > | null;
    // Payout
    bankName?: string | null;
    bankCode?: string | null;
    bankAccountNumber?: string | null;
    bankAccountName?: string | null;
    // KYC documents (admin can review everything submitted)
    cacDocumentUrl?: string | null;
    tinDocumentUrl?: string | null;
    ninDocumentUrl?: string | null;
    passportPhotoUrl?: string | null;
    bankStatementUrl?: string | null;
    utilityBillUrl?: string | null;
    // Quota
    orderQuota?: number | null;
    monthlyOrderCount?: number;
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

/**
 * Mirrors `OrderStatus` on the backend, in lifecycle order.
 *
 * `READY` and `DISPATCHED` mean different things at different levels: on a vendor's
 * order `READY` is "I have the goods, a rider can collect"; on a checkout it means every
 * vendor is. `DISPATCHED` and `COMPLETED` only ever appear on a checkout — with one
 * rider carrying the whole basket, no single vendor knows collection has finished.
 *
 * `PROCESSING` predates the lifecycle and is written by nothing.
 */
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "READY"
  | "DISPATCHED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

/**
 * One vendor's slice of a basket — the unit of fulfilment.
 *
 * An order holds many line items and no single product: rice and a drink from the same
 * vendor is one order with two `items`. For the money view — one row per payment, with
 * the delivery fee and the charge the buyer actually saw — use `AdminTransactionSummary`.
 */
export interface AdminOrderSummary {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string | null;
  /** This vendor's goods subtotal. Delivery belongs to the checkout, not here. */
  totalAmount: string;
  platformFee: string;
  vendorAmount: string;
  fulfillmentType: "PICKUP" | "DELIVERY";
  status: OrderStatus;
  deliveryAddress: string | null;
  notes: string | null;
  paidAt: string | null;
  createdAt: string;
  items: {
    id: string;
    productId: string;
    /** Snapshot taken at purchase — the product may have been renamed since. */
    productName: string;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
  }[];
  /** The payment this order was part of. */
  checkout: {
    id: string;
    reference: string;
    totalAmount: string;
    deliveryFee: string;
  } | null;
  vendor: {
    id: string;
    firstName: string;
    lastName: string;
    businessName: string | null;
  };
}

/** One payment, and the vendor orders it covers. */
export interface AdminTransactionSummary {
  id: string;
  reference: string;
  status: OrderStatus;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string | null;
  fulfillmentType: "PICKUP" | "DELIVERY";
  deliveryAddress: string | null;
  goodsTotal: number;
  deliveryFee: number;
  totalAmount: number;
  paidAt: string | null;
  createdAt: string;
  deliveryCode: string | null;
  vendors: {
    orderId: string;
    vendorId: string;
    vendorName: string | null;
    status: OrderStatus;
    subtotal: number;
    vendorAmount: number;
    items: { name: string; quantity: number; lineTotal: number }[];
  }[];
}

export interface AdminBuyerDetail {
  buyer: AdminBuyerSummary;
  orders: AdminOrderSummary[];
  orderCount: number;
}

export interface AdminUserDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "SELLER" | "RIDER" | "BUYER" | "ADMIN" | "SUPER_ADMIN";
  status: UserStatus;
  profilePicture?: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;

  // Vendor fields
  vendorType?: VendorType | null;
  businessName?: string | null;
  businessAddress?: string | null;
  businessCategory?: string | null;
  businessAreas?: string[] | null;
  businessLogoUrl?: string | null;
  businessBannerUrl?: string | null;
  businessDescription?: string | null;
  whatsappNumber?: string | null;
  isOpen?: boolean;
  operatingHours?: Record<
    string,
    { isOpen: boolean; open: string; close: string }
  > | null;
  slug?: string | null;
  cacDocumentUrl?: string | null;
  tinDocumentUrl?: string | null;
  ninDocumentUrl?: string | null;
  passportPhotoUrl?: string | null;
  bankStatementUrl?: string | null;
  utilityBillUrl?: string | null;

  // Rider fields
  riderType?: RiderType | null;
  bvn?: string | null;
  guarantorName?: string | null;
  guarantorPhone?: string | null;
  governmentIdUrl?: string | null;
  selfieUrl?: string | null;

  // Payout
  bankName?: string | null;
  bankCode?: string | null;
  bankAccountNumber?: string | null;
  bankAccountName?: string | null;

  // Quota
  orderQuota?: number | null;
  monthlyOrderCount?: number;
}

export interface VendorListFilters extends PaginationParams {
  status?: UserStatus;
}

export interface OrderListFilters extends PaginationParams {
  status?: AdminOrderSummary["status"];
  vendorId?: string;
}

/** Who moved a status, and on whose behalf. */
export type StatusActor =
  | "VENDOR"
  | "RIDER"
  | "BUYER"
  | "ADMIN"
  /** No person — the payment webhook, the reconciliation sweep, a derived change. */
  | "SYSTEM";

/** One recorded transition. `orderId` is set for a vendor's order, null for a checkout. */
export interface AdminStatusEvent {
  id: string;
  orderId: string | null;
  checkoutId: string | null;
  fromStatus: string;
  toStatus: string;
  actorType: StatusActor;
  actorId: string | null;
  note: string | null;
  createdAt: string;
}

export interface TransactionListFilters extends PaginationParams {
  status?: OrderStatus;
  /** Reference, buyer name or phone — matched server-side. */
  search?: string;
}

export interface BuyerListFilters extends PaginationParams {
  status?: UserStatus;
}

export interface RejectPendingPayload {
  id: string;
  reason?: string;
}
