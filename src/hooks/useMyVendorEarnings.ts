"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyVendorEarnings } from "@/services";
import type { VendorEarnings } from "@/types";
import { queryKeys } from "./queryKeys";

export function useMyVendorEarnings() {
  return useQuery<VendorEarnings>({
    queryKey: queryKeys.myVendorEarnings(),
    queryFn: getMyVendorEarnings,
    staleTime: 1000 * 60,
  });
}
