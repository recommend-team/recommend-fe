"use client";

import { useQuery } from "@tanstack/react-query";
import { getPendingApprovals } from "@/services";
import type { PaginatedResult, PendingApproval } from "@/types";
import { queryKeys } from "./queryKeys";

export function usePendingApprovals(page = 1, limit = 20) {
  return useQuery<PaginatedResult<PendingApproval>>({
    queryKey: queryKeys.pendingApprovals(page, limit),
    queryFn: () => getPendingApprovals({ page, limit }),
    staleTime: 1000 * 30,
  });
}
