import type { PaginationParams } from "./admin";

export type ChatChannel = "PWA" | "WHATSAPP";

export type ConversationState =
  | "DISCOVERY"
  | "SELECTING_ITEM"
  | "COLLECTING_NAME"
  | "COLLECTING_PHONE"
  | "COLLECTING_FULFILLMENT"
  | "COLLECTING_ADDRESS"
  | "CONFIRMING_ORDER"
  | "AWAITING_PAYMENT";

export type MessageAuthor = "BUYER" | "ASSISTANT" | "SYSTEM";

/**
 * One line of a transcript.
 *
 * `adminId` is the only thing separating a person's reply from the assistant's — the
 * buyer saw both as Recommend, and `author` says `ASSISTANT` either way.
 */
export interface ConversationMessage {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  author: MessageAuthor;
  adminId: string | null;
  text: string;
  payload: { kind: string; data?: Record<string, unknown> } | null;
  createdAt: string;
}

/** A row in the queue. Never the whole transcript. */
export interface ConversationSummary {
  id: string;
  channel: ChatChannel;
  state: ConversationState;
  buyerName: string | null;
  buyerPhone: string | null;
  lastMessageAt: string | null;
  lastMessage: string | null;
  heldByAdminId: string | null;
  /** When the assistant first struggled here. Orders the queue. */
  needsAttentionAt: string | null;
  attentionReason: string | null;
  createdAt: string;
}

export interface ConversationDetail {
  id: string;
  channel: ChatChannel;
  state: ConversationState;
  buyerName: string | null;
  buyerPhone: string | null;
  heldByAdminId: string | null;
  heldAt: string | null;
  lastAdminMessageAt: string | null;
  needsAttentionAt: string | null;
  attentionReason: string | null;
  messages: ConversationMessage[];
}

export interface ConversationFeed {
  items: ConversationSummary[];
  total: number;
  /** Across everything, not just this page — it is a badge, not a count of rows. */
  needingAttention: number;
  page: number;
  limit: number;
}

export interface ConversationListFilters extends PaginationParams {
  search?: string;
  needingAttention?: boolean;
}
