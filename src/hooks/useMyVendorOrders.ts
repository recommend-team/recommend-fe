"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyVendorOrders, type VendorOrdersFilters } from "@/services";
import type { AdminOrderSummary, PaginatedResult } from "@/types";
import { queryKeys } from "./queryKeys";

export function useMyVendorOrders(filters: VendorOrdersFilters = {}) {
  return useQuery<PaginatedResult<AdminOrderSummary>>({
    queryKey: queryKeys.myVendorOrders(filters),
    queryFn: () => getMyVendorOrders(filters),
    staleTime: 1000 * 30,
  });
}
