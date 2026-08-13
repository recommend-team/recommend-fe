import { request } from "@/lib/api";
import type {
  ConversationDetail,
  ConversationFeed,
  ConversationListFilters,
  ConversationSummary,
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
