export const queryKeys = {
  storefront: (slug: string) => ["storefront", slug] as const,
  currentUser: () => ["auth", "currentUser"] as const,
} as const;
