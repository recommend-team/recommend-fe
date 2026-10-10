export type FulfillmentType = "PICKUP" | "DELIVERY";

export interface CreateOrderPayload {
  productId: string;
  quantity: number;
  buyerPhone: string;
  buyerName: string;
  buyerEmail?: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  authorizationUrl: string;
  reference: string;
}
