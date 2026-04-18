"use client";

import { useMutation } from "@tanstack/react-query";
import { registerVendor } from "@/services";
import { ApiError } from "@/lib/api";
import type { RegisterVendorPayload, RegisterVendorResponse } from "@/types";

export function useRegisterVendor() {
  return useMutation<RegisterVendorResponse, ApiError, RegisterVendorPayload>({
    mutationFn: registerVendor,
  });
}
