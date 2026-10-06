"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRider, getRider, getRiders } from "@/services";
import { ApiError } from "@/lib/api";
import type { AdminRider, CreateRiderPayload, PaginatedResult, RiderListFilters } from "@/types";
import { queryKeys } from "./queryKeys";

/** The rider roster — every status, with deliveries in progress and completed. */
export function useRiders(filters: RiderListFilters = {}, enabled = true) {
  return useQuery<PaginatedResult<AdminRider>>({
    queryKey: queryKeys.riders(filters),
    queryFn: () => getRiders(filters),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useRider(id: string | null) {
  return useQuery<AdminRider>({
    queryKey: queryKeys.rider(id ?? ""),
    queryFn: () => getRider(id!),
    enabled: !!id,
  });
}

export function useCreateRider() {
  const queryClient = useQueryClient();

  return useMutation<AdminRider, ApiError, CreateRiderPayload>({
    mutationFn: createRider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "riders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
