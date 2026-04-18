"use client";

import { useQuery } from "@tanstack/react-query";
import { getStorefront } from "@/services";
import type { StorefrontData } from "@/types";
import { queryKeys } from "./queryKeys";

export function useStorefront(slug: string) {
  return useQuery<StorefrontData>({
    queryKey: queryKeys.storefront(slug),
    queryFn: () => getStorefront(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 2,
  });
}
