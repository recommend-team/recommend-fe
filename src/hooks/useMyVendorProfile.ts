"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyVendorProfile,
  submitVendorKyc,
  updateMyVendorProfile,
  updateVendorPayout,
} from "@/services";
import { ApiError } from "@/lib/api";
import type {
  SubmitKycNonRegisteredPayload,
  SubmitKycRegisteredPayload,
  UpdatePayoutPayload,
  UpdateVendorProfilePayload,
  VendorProfile,
} from "@/types";
import { queryKeys } from "./queryKeys";

export function useMyVendorProfile() {
  return useQuery<VendorProfile>({
    queryKey: queryKeys.myVendorProfile(),
    queryFn: getMyVendorProfile,
    staleTime: 1000 * 30,
  });
}

export function useUpdateMyVendorProfile() {
  const queryClient = useQueryClient();
  return useMutation<VendorProfile, ApiError, UpdateVendorProfilePayload>({
    mutationFn: updateMyVendorProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.myVendorProfile(), data);
    },
  });
}

export function useUpdateVendorPayout() {
  const queryClient = useQueryClient();
  return useMutation<VendorProfile, ApiError, UpdatePayoutPayload>({
    mutationFn: updateVendorPayout,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.myVendorProfile(), data);
    },
  });
}

export function useSubmitVendorKyc() {
  const queryClient = useQueryClient();
  return useMutation<
    VendorProfile,
    ApiError,
    SubmitKycRegisteredPayload | SubmitKycNonRegisteredPayload
  >({
    mutationFn: submitVendorKyc,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.myVendorProfile(), data);
    },
  });
}
