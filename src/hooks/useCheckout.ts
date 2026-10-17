"use client";

import { useMutation } from "@tanstack/react-query";
import { createCheckout } from "@/services";
import { ApiError } from "@/lib/api";
import type { CheckoutPayload, CheckoutResponse } from "@/types";

export function useCheckout() {
  return useMutation<CheckoutResponse, ApiError, CheckoutPayload>({
    mutationFn: createCheckout,
  });
}
