import { request } from "@/lib/api";
import type {
  CatalogArea,
  CatalogCategory,
  CatalogContext,
  CatalogProduct,
  CatalogStore,
  ConversationDetail,
  ConversationFeed,
  ConversationListFilters,
  ConversationOrder,
  ConversationSummary,
  PlaceAdminOrderPayload,
  PlacedAdminOrder,
} from "@/types";

function qs(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getConversations(
  filters: ConversationListFilters = {}
): Promise<ConversationFeed> {
  return request<ConversationFeed>(
    `/admin/conversations${qs({
      search: filters.search,
      needingAttention: filters.needingAttention || undefined,
      page: filters.page,
      limit: filters.limit,
    })}`
  );
}

export async function getConversation(
  id: string
): Promise<ConversationDetail> {
  return request<ConversationDetail>(`/admin/conversations/${id}`);
}

/** The assistant stops replying from this moment. The buyer is not told. */
export async function takeConversation(
  id: string
): Promise<ConversationSummary> {
  return request<ConversationSummary>(`/admin/conversations/${id}/take`, {
    method: "POST",
  });
}

/** Sends nothing — the assistant simply answers whatever the buyer says next. */
export async function releaseConversation(
  id: string
): Promise<ConversationSummary> {
  return request<ConversationSummary>(`/admin/conversations/${id}/release`, {
    method: "POST",
  });
}

/**
 * The catalogue as this buyer would have been shown it.
 *
 * Not `/admin/products`, which lists everything on the platform regardless of whether the
 * vendor is approved, open, or able to deliver to this address. Checkout does not validate
 * service area, so what these return is the only thing keeping an admin from placing an
 * undeliverable order.
 */
export async function getCatalogAreas(
  id: string,
  search?: string
): Promise<CatalogContext> {
  return request<CatalogContext>(
    `/admin/conversations/${id}/catalog/areas${qs({ search })}`
  );
}

/** Stored on the conversation, so the assistant stops asking too. */
export async function setConversationArea(
  id: string,
  areaId: string
): Promise<CatalogArea> {
  return request<CatalogArea>(`/admin/conversations/${id}/area`, {
    method: "POST",
    body: JSON.stringify({ areaId }),
  });
}

/** Only the kinds of shop that actually serve this buyer's area. */
export async function getCatalogCategories(
  id: string,
  areaId?: string
): Promise<CatalogCategory[]> {
  return request<CatalogCategory[]>(
    `/admin/conversations/${id}/catalog/categories${qs({ areaId })}`
  );
}

export async function getCatalogStores(
  id: string,
  params: { areaId?: string; category?: string; search?: string } = {}
): Promise<CatalogStore[]> {
  return request<CatalogStore[]>(
    `/admin/conversations/${id}/catalog/stores${qs(params)}`
  );
}

export async function getCatalogProducts(
  id: string,
  params: {
    areaId?: string;
    vendorId?: string;
    category?: string;
    search?: string;
  } = {}
): Promise<CatalogProduct[]> {
  return request<CatalogProduct[]>(
    `/admin/conversations/${id}/catalog/products${qs(params)}`
  );
}

/**
 * Build the basket for this buyer and get a payment link back.
 *
 * Buyer details left out are taken from what the conversation already knows, so the
 * usual call is items alone. Requires the conversation to be yours.
 */
export async function placeConversationOrder(
  id: string,
  payload: PlaceAdminOrderPayload
): Promise<PlacedAdminOrder> {
  return request<PlacedAdminOrder>(`/admin/conversations/${id}/order`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * The order this conversation last placed, or null.
 *
 * Keyed on the orders the conversation owns rather than the pending-payment marker,
 * which is cleared the moment the money lands — so it stays visible as it progresses.
 */
export async function getConversationOrder(
  id: string
): Promise<ConversationOrder | null> {
  return request<ConversationOrder | null>(`/admin/conversations/${id}/order`);
}

export async function sendConversationMessage(
  id: string,
  text: string
): Promise<{ text: string; messageId?: string; createdAt?: string }> {
  return request(`/admin/conversations/${id}/messages`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

/**
 * Best-effort. A buyer who believes they are talking to software will wait through
 * "typing…" and will not wait through silence.
 */
export async function setConversationTyping(
  id: string,
  isTyping: boolean
): Promise<void> {
  await request(`/admin/conversations/${id}/typing`, {
    method: "POST",
    body: JSON.stringify({ isTyping }),
  });
}
