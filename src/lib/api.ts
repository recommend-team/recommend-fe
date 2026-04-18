const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://recommend-staging.onrender.com";

export interface Vendor {
  id: string;
  businessName: string | null;
  businessDescription: string | null;
  businessCategory: string | null;
  businessAreas: string[] | null;
  businessLogoUrl: string | null;
  businessBannerUrl: string | null;
  whatsappNumber: string | null;
  isOpen: boolean;
  operatingHours: Record<
    string,
    { isOpen: boolean; open: string; close: string }
  > | null;
  slug: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface StorefrontData {
  vendor: Vendor;
  products: Product[];
}

export interface CreateOrderPayload {
  productId: string;
  quantity: number;
  buyerPhone: string;
  buyerName: string;
  buyerEmail?: string;
  fulfillmentType: "PICKUP" | "DELIVERY";
  deliveryAddress?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  authorizationUrl: string;
  reference: string;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? `API error: ${res.status}`);
  }

  return json.data as T;
}

export async function getStorefront(slug: string): Promise<StorefrontData> {
  return apiFetch<StorefrontData>(`/store/${slug}`);
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
