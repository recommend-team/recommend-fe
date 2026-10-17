"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addVendorProduct,
  changeVendorEmail,
  createVendor,
  deactivateVendor,
  getVendorHistory,
  sendVendorInvite,
  updateVendorKyc,
  getAreasByState,
  getStates,
  getVendorProducts,
  removeVendorProduct,
  updateVendor,
  updateVendorProduct,
} from "@/services";
import { ApiError } from "@/lib/api";
import type {
  AdminProductPayload,
  AdminUpdateVendorPayload,
  CreateVendorPayload,
  KycDocumentKey,
  VendorAdminEdit,
  LocationArea,
  LocationState,
  PaginatedResult,
  Product,
} from "@/types";
import { queryKeys } from "./queryKeys";

/** Everything that shows a vendor: their page, the list, and their products. */
function useRefreshVendor(vendorId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.vendorDetail(vendorId) });
    queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "vendor-products", vendorId] });
    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "vendor-history", vendorId] });
  };
}

export function useUpdateVendor(vendorId: string) {
  const refresh = useRefreshVendor(vendorId);
  return useMutation<unknown, ApiError, AdminUpdateVendorPayload>({
    mutationFn: (payload) => updateVendor(vendorId, payload),
    onSuccess: refresh,
  });
}

export function useVendorProducts(vendorId: string) {
  return useQuery<PaginatedResult<Product>>({
    queryKey: ["admin", "vendor-products", vendorId],
    queryFn: () => getVendorProducts(vendorId),
    enabled: !!vendorId,
    staleTime: 1000 * 30,
  });
}

export function useAddVendorProduct(vendorId: string) {
  const refresh = useRefreshVendor(vendorId);
  return useMutation<Product, ApiError, AdminProductPayload>({
    mutationFn: (payload) => addVendorProduct(vendorId, payload),
    onSuccess: refresh,
  });
}

export function useUpdateVendorProduct(vendorId: string) {
  const refresh = useRefreshVendor(vendorId);
  return useMutation<
    Product,
    ApiError,
    { productId: string; payload: Partial<AdminProductPayload> }
  >({
    mutationFn: ({ productId, payload }) =>
      updateVendorProduct(vendorId, productId, payload),
    onSuccess: refresh,
  });
}

export function useRemoveVendorProduct(vendorId: string) {
  const refresh = useRefreshVendor(vendorId);
  return useMutation<unknown, ApiError, string>({
    mutationFn: (productId) => removeVendorProduct(vendorId, productId),
    onSuccess: refresh,
  });
}

/** Every active area, grouped by state — for choosing where a vendor delivers. */
export function useAllAreas(enabled: boolean) {
  return useQuery<{ state: LocationState; areas: LocationArea[] }[]>({
    queryKey: ["locations", "all-areas"],
    queryFn: async () => {
      const states = await getStates();
      return Promise.all(
        states.map(async (state) => ({
          state,
          areas: await getAreasByState(state.id),
        }))
      );
    },
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  return useMutation<{ id: string; inviteSent: boolean }, ApiError, CreateVendorPayload>({
    mutationFn: createVendor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] }),
  });
}

export function useChangeVendorEmail(vendorId: string) {
  const refresh = useRefreshVendor(vendorId);
  return useMutation<unknown, ApiError, string>({
    mutationFn: (email) => changeVendorEmail(vendorId, email),
    onSuccess: refresh,
  });
}

export function useSendVendorInvite(vendorId: string) {
  const refresh = useRefreshVendor(vendorId);
  return useMutation<unknown, ApiError, void>({
    mutationFn: () => sendVendorInvite(vendorId),
    onSuccess: refresh,
  });
}

export function useUpdateVendorKyc(vendorId: string) {
  const refresh = useRefreshVendor(vendorId);
  return useMutation<unknown, ApiError, Partial<Record<KycDocumentKey, string>>>({
    mutationFn: (documents) => updateVendorKyc(vendorId, documents),
    onSuccess: refresh,
  });
}

export function useDeactivateVendor(vendorId: string) {
  const refresh = useRefreshVendor(vendorId);
  return useMutation<unknown, ApiError, string | undefined>({
    mutationFn: (reason) => deactivateVendor(vendorId, reason),
    onSuccess: refresh,
  });
}

/** What admins have changed on this vendor, newest first. */
export function useVendorHistory(vendorId: string, enabled: boolean) {
  return useQuery<VendorAdminEdit[]>({
    queryKey: ["admin", "vendor-history", vendorId],
    queryFn: () => getVendorHistory(vendorId),
    enabled: enabled && !!vendorId,
    staleTime: 1000 * 15,
  });
}
