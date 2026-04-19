"use client";

import { useQuery } from "@tanstack/react-query";
import { getBuyerDetail } from "@/services";
import type { AdminBuyerDetail } from "@/types";
import { queryKeys } from "./queryKeys";

export function useBuyerDetail(id: string) {
  return useQuery<AdminBuyerDetail>({
    queryKey: queryKeys.buyerDetail(id),
    queryFn: () => getBuyerDetail(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}
