import type {
  BuyerListFilters,
  OrderListFilters,
  TransactionListFilters,
  VendorListFilters,
} from "@/types";
import type { ProductListFilters, VendorOrdersFilters } from "@/services";

export const queryKeys = {
  storefront: (slug: string) => ["storefront", slug] as const,
  currentUser: () => ["auth", "currentUser"] as const,
  // Admin
  platformStats: () => ["admin", "stats"] as const,
  admins: (page: number, limit: number) =>
    ["admin", "admins", { page, limit }] as const,
  pendingApprovals: (page: number, limit: number) =>
    ["admin", "pending", { page, limit }] as const,
  vendors: (filters: VendorListFilters) =>
    ["admin", "vendors", filters] as const,
  vendorDetail: (id: string) => ["admin", "vendors", id] as const,
  adminOrders: (filters: OrderListFilters) =>
    ["admin", "orders", filters] as const,
  adminTransactions: (filters: TransactionListFilters) =>
    ["admin", "transactions", filters] as const,
  buyers: (filters: BuyerListFilters) =>
    ["admin", "buyers", filters] as const,
  buyerDetail: (id: string) => ["admin", "buyers", id] as const,
  // Vendor-facing
  myVendorProfile: () => ["vendor", "profile"] as const,
  myProducts: (filters: ProductListFilters) =>
    ["vendor", "products", filters] as const,
  myVendorOrders: (filters: VendorOrdersFilters) =>
    ["vendor", "orders", filters] as const,
  myVendorEarnings: () => ["vendor", "earnings"] as const,
} as const;
