import type {
  BuyerListFilters,
  OrderListFilters,
  RiderListFilters,
  TransactionListFilters,
  VendorListFilters,
} from "@/types";

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
  riders: (filters: RiderListFilters) => ["admin", "riders", filters] as const,
  rider: (id: string) => ["admin", "riders", id] as const,
} as const;
