import { request } from "@/lib/api";
import type {
  CheckoutPayload,
  CheckoutResponse,
  OrderStatusView,
} from "@/types";

/** Start payment for a storefront cart. Prices are recomputed by the server. */
export async function createCheckout(
  payload: CheckoutPayload
): Promise<CheckoutResponse> {
  return request<CheckoutResponse>("/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrderStatus(
  reference: string
): Promise<OrderStatusView> {
  return request<OrderStatusView>(
    `/checkout/${encodeURIComponent(reference)}`
  );
}

/**
 * Ask Paystack directly whether this order was paid. For the moment a buyer lands back
 * here before Paystack's webhook has — it settles the order the same way the webhook does.
 */
export async function verifyOrder(
  reference: string
): Promise<OrderStatusView> {
  return request<OrderStatusView>(
    `/checkout/${encodeURIComponent(reference)}/verify`,
    { method: "POST" }
  );
}
