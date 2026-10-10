"use client";

import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/services";
import { ApiError } from "@/lib/api";
import type { CreateOrderPayload, CreateOrderResponse } from "@/types";

export function useCreateOrder() {
  return useMutation<CreateOrderResponse, ApiError, CreateOrderPayload>({
    mutationFn: createOrder,
  });
}
