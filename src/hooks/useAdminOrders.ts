"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "@/services";
import type {
  AdminOrderSummary,
  OrderListFilters,
  PaginatedResult,
} from "@/types";
import { queryKeys } from "./queryKeys";

export function useAdminOrders(filters: OrderListFilters = {}) {
  return useQuery<PaginatedResult<AdminOrderSummary>>({
    queryKey: queryKeys.adminOrders(filters),
    queryFn: () => getAdminOrders(filters),
    staleTime: 1000 * 30,
  });
}
