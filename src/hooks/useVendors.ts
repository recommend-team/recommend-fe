"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendors } from "@/services";
import type {
  AdminVendorSummary,
  PaginatedResult,
  VendorListFilters,
} from "@/types";
import { queryKeys } from "./queryKeys";

export function useVendors(filters: VendorListFilters = {}) {
  return useQuery<PaginatedResult<AdminVendorSummary>>({
    queryKey: queryKeys.vendors(filters),
    queryFn: () => getVendors(filters),
    staleTime: 1000 * 30,
  });
}
