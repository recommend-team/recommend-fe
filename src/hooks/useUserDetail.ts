"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserDetail } from "@/services";
import type { AdminUserDetail } from "@/types";

export function useUserDetail(id: string) {
  return useQuery<AdminUserDetail>({
    queryKey: ["admin", "users", id] as const,
    queryFn: () => getUserDetail(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}
