"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdmins } from "@/services";
import type { AdminUser, PaginatedResult } from "@/types";
import { queryKeys } from "./queryKeys";

export function useAdmins(page = 1, limit = 20) {
  return useQuery<PaginatedResult<AdminUser>>({
    queryKey: queryKeys.admins(page, limit),
    queryFn: () => getAdmins({ page, limit }),
    staleTime: 1000 * 30,
  });
}
