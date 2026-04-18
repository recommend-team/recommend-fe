export const queryKeys = {
  storefront: (slug: string) => ["storefront", slug] as const,
} as const;
