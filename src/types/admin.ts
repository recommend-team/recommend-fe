import type { DeliveryPin } from "@/lib/maps";
import type { UserStatus, RiderType, VendorType } from "./auth";
import type { ChoiceGroup, Product } from "./product";

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
  /**
   * Orders paid for and not cancelled or refunded, by Lagos calendar period — on the
   * vendor list only. Optional so the other places this type is built need not invent it.
   */
  orders?: VendorOrderCounts;
}

export interface VendorOrderCounts {
  today: number;
  /** Since Monday. */
  week: number;
  /** Since the 1st. */
  month: number;
  allTime: number;
}

/** Which period the vendor list is ranked by, most orders first. */
export type VendorOrderSort = keyof VendorOrderCounts;

export type PayoutAccountStatus = "PENDING_VERIFICATION" | "ACTIVE" | "REMOVED";

export type WithdrawalStatus =
  | "REQUESTED"
  | "PROCESSING"
  | "SETTLED"
  | "FAILED"
  | "REVERSED";

/** A vendor's bank account, from the `accounts` table — not the old columns on users. */
export interface AdminPayoutAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  status: PayoutAccountStatus;
  isDefault: boolean;
  verifiedAt: string | null;
  removedAt: string | null;
  createdAt: string;
}

export interface WithdrawalAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

/** A withdrawal as the vendor page lists it. */
export interface AdminVendorWithdrawal {
  id: string;
  reference: string;
  status: WithdrawalStatus;
  amountRequested: number;
  feeAmount: number;
  amountSent: number;
  failureReason: string | null;
  attempts: number;
  settledAt: string | null;
  createdAt: string;
  /** Null only if the account row is gone, which removal does not do. */
  account: WithdrawalAccount | null;
}

/** A withdrawal on the all-vendors page, with who asked for it. */
export interface AdminWithdrawal extends AdminVendorWithdrawal {
  transferCode: string | null;
  lastAttemptAt: string | null;
  vendor: {
    id: string;
    name: string;
    businessName: string | null;
    email: string;
  } | null;
}

export type WalletEntryType =
  | "EARNING"
  | "COMMISSION"
  | "WITHDRAWAL"
  | "WITHDRAWAL_REVERSED"
  | "ADJUSTMENT";

/** One line of a vendor's statement. Signed: credits positive, debits negative. */
export interface WalletEntry {
  id: string;
  type: WalletEntryType;
  amount: number;
  orderId: string | null;
  withdrawalId: string | null;
  note: string | null;
  createdAt: string;
}

export interface WithdrawalListFilters extends PaginationParams {
  status?: WithdrawalStatus;
  /** Reference, or vendor business name, name or email. */
  search?: string;
}

export interface AdminVendorDetail {
  vendor: AdminVendorSummary & {
    businessDescription: string | null;
    businessBannerUrl: string | null;
    whatsappNumber: string | null;
    operatingHours: Record<
      string,
      { isOpen: boolean; open: string; close: string }
    > | null;
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
  serviceAreas: { id: string; name: string; stateName: string | null }[];
  /** Every account the vendor has added — active first, removed last. */
  payoutAccounts: AdminPayoutAccount[];
  wallet: { balance: number; entryCount: number };
  /** The latest 20. */
  withdrawals: AdminVendorWithdrawal[];
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
  /**
   * The items as built — one per dish, packs, choices and extras folded into `name`
   * ("Rice and beans (2 portions, with Beef ×2)"); `quantity` is packs for a built dish.
   * Absent from an older server.
   */
  lines?: { name: string; quantity: number; lineTotal: number }[];
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
  /** Where the address was picked on the map. Null when typed; absent on older servers. */
  deliveryPin?: DeliveryPin | null;
  goodsTotal: number;
  deliveryFee: number;
  totalAmount: number;
  paidAt: string | null;
  createdAt: string;
  deliveryCode: string | null;
  /** Who is carrying it. Null on a pickup, and on a delivery with no rider yet. */
  rider: { id: string; name: string; phone: string | null } | null;
  riderAssignedAt: string | null;
  /** Where it was placed: the chat, a vendor's storefront, or by an admin. */
  source: CheckoutSource;
  /**
   * Whether the buyer can be reached in the chat. Always for a chat order; a storefront
   * buyer only once they have signed in with the email they paid with.
   */
  buyerOnChat: boolean;
  /** When it last left with a rider. */
  dispatchedAt: string | null;
  /** With its rider longer than the server's limit (3 hours), not delivered. */
  stuck: boolean;
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

export type CheckoutSource = "CHAT" | "STOREFRONT" | "ADMIN";

export interface CatalogArea {
  id: string;
  name: string;
  stateName: string;
}

/** The area picker, with whatever the conversation already knows preselected. */
export interface CatalogContext {
  areaId: string | null;
  area: CatalogArea | null;
  areas: CatalogArea[];
}

/** A kind of shop, counted. Derived from the vendors, not a fixed taxonomy. */
export interface CatalogCategory {
  name: string;
  storeCount: number;
}

/** A store as the buyer would be offered it — approved, and serving their area. */
export interface CatalogStore {
  id: string;
  name: string;
  slug: string | null;
  category: string | null;
  areas: { id: string; name: string }[];
  isOpen: boolean;
  logoUrl: string | null;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  vendorId: string;
  vendorName: string | null;
  vendorSlug: string | null;
  /** An extra, sold only with a main item from the same store. Listed after its dishes. */
  isAddOn?: boolean;
  /** A dish: what its price is per, the extras ticked on it, its choices. Absent from an older server. */
  unit?: string | null;
  extras?: { id: string; name: string; price: number }[];
  choices?: ChoiceGroup[];
}

/** One line of a basket an admin is building for a buyer. */
export interface AdminOrderLine {
  productId: string;
  /** Portions in each pack, for a dish built as a pack; otherwise how many. */
  quantity: number;
  packs?: number;
  extras?: { productId: string; quantity: number }[];
  choices?: { groupId: string; optionIds: string[] }[];
}

export interface PlaceAdminOrderPayload {
  items: AdminOrderLine[];
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  fulfillmentType?: "PICKUP" | "DELIVERY";
  deliveryAddress?: string;
  /** Picked from Google instead of typed: the token, and the house number or landmark. */
  deliveryPlace?: { token: string; details?: string };
  notes?: string;
  /** Default true — the buyer gets the same inline payment card as any other checkout. */
  sendToBuyer?: boolean;
}

/** What comes back once the order exists and Paystack has issued a link. */
export interface PlacedAdminOrder {
  checkoutId: string;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
  paystackPublicKey: string | null;
  goodsTotal: number;
  deliveryFee: number;
  totalAmount: number;
  /** False when the card could not be delivered — the link still works by hand. */
  sent: boolean;
}

/** The order a conversation last placed, as the admin watches it progress. */
export interface ConversationOrder {
  reference: string;
  status: OrderStatus;
  createdAt: string;
  paidAt: string | null;
  fulfillmentType: "PICKUP" | "DELIVERY";
  deliveryAddress: string | null;
  goodsTotal: number;
  deliveryFee: number;
  totalAmount: number;
  canComplete: boolean;
  vendors: {
    vendorName: string | null;
    status: OrderStatus;
    items: { name: string; quantity: number; lineTotal: number }[];
  }[];
}

/**
 * Why the basket was refused. The platform re-reads every price and every vendor at
 * checkout, so a basket assembled a minute ago can still be rejected — and the admin
 * needs to know which item and why, not just that something failed.
 */
export interface CartChange {
  productId: string;
  productName: string | null;
  reason:
    | "REMOVED"
    | "UNAVAILABLE"
    | "VENDOR_CLOSED"
    | "PRICE_CHANGED"
    /** An extra with no main item from its vendor in the basket — never sold alone. */
    | "ADDON_WITHOUT_MAIN"
    /** An extra no longer offered with the dish it was added to. */
    | "EXTRA_NOT_OFFERED"
    /** A required choice unanswered, or too many / too few picked. */
    | "CHOICES_NEEDED"
    /** A chosen option removed or sold out since. */
    | "CHOICE_UNAVAILABLE";
  expectedUnitPrice?: number;
  currentUnitPrice?: number;
  /** On an extra: the dish it was added to. */
  dishId?: string;
  dishName?: string;
  /** On a choice problem: which choice, and which option. */
  groupId?: string;
  groupName?: string;
  optionId?: string;
  optionName?: string | null;
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
  /** Rank by orders in this period. Omitted: newest vendors first. */
  sort?: VendorOrderSort;
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
  /** One rider's deliveries. */
  riderId?: string;
  /** Paid or ready deliveries with no rider yet. */
  needsRider?: boolean;
  source?: CheckoutSource;
  /** With a rider for hours and not delivered. */
  stuck?: boolean;
}

/** A rider as the roster lists them (`GET /admin/riders`). */
export interface AdminRider {
  id: string;
  firstName: string;
  lastName: string;
  /** Null when the rider gave none. */
  email: string | null;
  phoneNumber: string | null;
  riderType: RiderType | null;
  riderNote: string | null;
  status: UserStatus;
  createdAt: string;
  /** Assigned and not yet delivered: paid, ready or on its way. */
  activeDeliveries: number;
  completedDeliveries: number;
}

export interface RiderListFilters extends PaginationParams {
  status?: UserStatus;
  /** Name, phone or email. */
  search?: string;
}

/** A rider admin adds by hand. Phone in any Nigerian format; email optional. */
export interface CreateRiderPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  riderType: RiderType;
  note?: string;
}

export interface BuyerListFilters extends PaginationParams {
  status?: UserStatus;
}

export interface RejectPendingPayload {
  id: string;
  reason?: string;
}
