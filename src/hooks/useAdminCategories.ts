"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignVendorsToCategory,
  changeCategoryRate,
  getCategoryOptions,
  getUncategorisedVendors,
  getVendorRate,
  setVendorRate,
  createCategory,
  getCategories,
  getCategoryRateHistory,
  updateCategory,
} from "@/services";
import type { ApiError } from "@/lib/api";
import type {
  Category,
  CategoryList,
  CategoryOption,
  CategoryRateChange,
  UncategorisedVendor,
  VendorRate,
} from "@/types";

const CATEGORIES = ["admin", "categories"] as const;

export function useCategories() {
  return useQuery<CategoryList>({
    queryKey: CATEGORIES,
    queryFn: getCategories,
    staleTime: 1000 * 30,
  });
}

/** Only fetched once someone opens it. */
export function useCategoryRateHistory(id: string, enabled: boolean) {
  return useQuery<CategoryRateChange[]>({
    queryKey: [...CATEGORIES, id, "rate-history"],
    queryFn: () => getCategoryRateHistory(id),
    enabled,
  });
}

/** Any change can move vendor counts, words or rates: refresh the whole list. */
function useCategoryMutation<T>(fn: (input: T) => Promise<Category>) {
  const queryClient = useQueryClient();
  return useMutation<Category, ApiError, T>({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES }),
  });
}

export const useCreateCategory = () => useCategoryMutation(createCategory);
export const useUpdateCategory = () => useCategoryMutation(updateCategory);
export const useChangeCategoryRate = () => useCategoryMutation(changeCategoryRate);

/** The active categories, for picking one — the same list vendors choose from. */
export function useCategoryOptions() {
  return useQuery<CategoryOption[]>({
    queryKey: ["categories", "options"],
    queryFn: getCategoryOptions,
    staleTime: 1000 * 60,
  });
}

export function useUncategorisedVendors() {
  return useQuery<UncategorisedVendor[]>({
    queryKey: [...CATEGORIES, "uncategorised"],
    queryFn: getUncategorisedVendors,
    staleTime: 1000 * 30,
  });
}

/** Moving vendors changes counts and the list of those in no category. */
export function useAssignVendorsToCategory() {
  const queryClient = useQueryClient();
  return useMutation<{ moved: number }, ApiError, { categoryId: string; vendorIds: string[] }>({
    mutationFn: assignVendorsToCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES }),
  });
}

export function useVendorRate(vendorId: string) {
  return useQuery<VendorRate>({
    queryKey: ["admin", "vendor-rate", vendorId],
    queryFn: () => getVendorRate(vendorId),
    enabled: !!vendorId,
  });
}

/** Super Admin only. */
export function useSetVendorRate() {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, { vendorId: string; feePercent: number | null }>({
    mutationFn: setVendorRate,
    onSuccess: (_data, { vendorId }) =>
      queryClient.invalidateQueries({ queryKey: ["admin", "vendor-rate", vendorId] }),
  });
}
