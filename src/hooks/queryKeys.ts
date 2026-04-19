export const queryKeys = {
  storefront: (slug: string) => ["storefront", slug] as const,
  currentUser: () => ["auth", "currentUser"] as const,
  platformStats: () => ["admin", "stats"] as const,
  admins: (page: number, limit: number) =>
    ["admin", "admins", { page, limit }] as const,
  pendingApprovals: (page: number, limit: number) =>
    ["admin", "pending", { page, limit }] as const,
} as const;
