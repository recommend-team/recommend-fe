"use client";

import { useMutation } from "@tanstack/react-query";
import { registerRider } from "@/services";
import { ApiError } from "@/lib/api";
import type { RegisterRiderPayload, RegisterRiderResponse } from "@/types";

export function useRegisterRider() {
  return useMutation<RegisterRiderResponse, ApiError, RegisterRiderPayload>({
    mutationFn: registerRider,
  });
}
