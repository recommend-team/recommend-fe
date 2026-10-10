"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendorDetail } from "@/services";
import type { AdminVendorDetail } from "@/types";
import { queryKeys } from "./queryKeys";

export function useVendorDetail(id: string) {
  return useQuery<AdminVendorDetail>({
    queryKey: queryKeys.vendorDetail(id),
    queryFn: () => getVendorDetail(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}
