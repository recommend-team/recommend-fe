export type FulfillmentType = "PICKUP" | "DELIVERY";

/** One line of a storefront cart, as sent to checkout. */
export interface CheckoutLine {
  productId: string;
  quantity: number;
  /** What the buyer was shown. Never used to price — only to spot a change since. */
  expectedUnitPrice?: number;
}

/** `POST /checkout` — the same checkout the chat uses, recorded as a storefront order. */
export interface CheckoutPayload {
  items: CheckoutLine[];
  buyerName: string;
  /** E.164: +2348012345678. */
  buyerPhone: string;
  /** Required from the storefront: the receipt and the delivery code go here. */
  buyerEmail: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  /** One of the vendor's service areas. Required for a delivery. */
  areaId?: string;
  notes?: string;
}

export interface CheckoutResponse {
  checkoutId: string;
  reference: string;
  /** Paystack's payment page. Paying there returns the buyer to /order/<reference>. */
  authorizationUrl: string;
  accessCode: string;
  paystackPublicKey: string | null;
  goodsTotal: number;
  deliveryFee: number;
  totalAmount: number;
  vendorCount: number;
}

export type CheckoutStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "READY"
  | "DISPATCHED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

/** `GET /checkout/:reference` — what was ordered and where it is. No contact details. */
export interface OrderStatusView {
  reference: string;
  status: CheckoutStatus;
  paidAt: string | null;
  goodsTotal: number;
  deliveryFee: number;
  totalAmount: number;
  fulfillmentType: FulfillmentType;
  createdAt: string;
  /** Set only while a rider has the order (or it waits at the counter). */
  deliveryCode: string | null;
  vendors: {
    status: CheckoutStatus;
    items: { name: string; quantity: number; unitPrice: number }[];
  }[];
}
