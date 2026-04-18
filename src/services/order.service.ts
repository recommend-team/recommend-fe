import { request } from "@/lib/api";
import type { CreateOrderPayload, CreateOrderResponse } from "@/types";

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  return request<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
