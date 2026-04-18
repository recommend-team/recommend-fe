"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createOrder,
  type CreateOrderPayload,
  type CreateOrderResponse,
} from "@/lib/api";

export function useCreateOrder() {
  return useMutation<CreateOrderResponse, Error, CreateOrderPayload>({
    mutationFn: createOrder,
  });
}
