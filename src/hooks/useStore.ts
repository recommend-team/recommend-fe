"use client";

import { useQuery } from "@tanstack/react-query";
import { getStorefront, type StorefrontData } from "@/lib/api";

export function useStorefront(slug: string) {
  return useQuery<StorefrontData>({
    queryKey: ["storefront", slug],
    queryFn: () => getStorefront(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
