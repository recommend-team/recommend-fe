"use client";

import { useQuery } from "@tanstack/react-query";
import { getBuyers } from "@/services";
import type {
  AdminBuyerSummary,
  BuyerListFilters,
  PaginatedResult,
} from "@/types";
import { queryKeys } from "./queryKeys";

export function useBuyers(filters: BuyerListFilters = {}) {
  return useQuery<PaginatedResult<AdminBuyerSummary>>({
    queryKey: queryKeys.buyers(filters),
    queryFn: () => getBuyers(filters),
    staleTime: 1000 * 30,
  });
}
