"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlatformStats } from "@/services";
import type { PlatformStats } from "@/types";
import { queryKeys } from "./queryKeys";

export function usePlatformStats() {
  return useQuery<PlatformStats>({
    queryKey: queryKeys.platformStats(),
    queryFn: getPlatformStats,
    staleTime: 1000 * 60,
  });
}
