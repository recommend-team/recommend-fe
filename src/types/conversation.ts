import type { PaginationParams } from "./admin";

export type ChatChannel = "PWA" | "WHATSAPP";

export type ConversationState =
  | "DISCOVERY"
  | "SELECTING_ITEM"
  | "COLLECTING_NAME"
  | "COLLECTING_PHONE"
  | "COLLECTING_EMAIL"
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
  /** "Amaka N." — which colleague typed it. Staff only; the buyer never sees it. */
  adminName?: string | null;
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
  /** Proved with an emailed code — the buyer signed in. Null for a guest. */
  verifiedEmail: string | null;
  lastMessageAt: string | null;
  lastMessage: string | null;
  heldByAdminId: string | null;
  /** Which colleague is answering it — "Amaka N.". Absent on older servers. */
  heldByName?: string | null;
  /** When the buyer started waiting for a person. The queue is longest-waiting first. */
  waitingSince?: string | null;
  /** When the assistant first struggled here. */
  needsAttentionAt: string | null;
  attentionReason: string | null;
  /**
   * The assistant handed this buyer over and is silent until an admin takes it. Sorts
   * above everything flagged.
   */
  handoverRequestedAt: string | null;
  handoverReason: string | null;
  createdAt: string;
  /** Set in the Deleted list. Absent on older servers. */
  deletedAt?: string | null;
}

export interface ConversationDetail {
  id: string;
  channel: ChatChannel;
  state: ConversationState;
  buyerName: string | null;
  buyerPhone: string | null;
  /** Proved with an emailed code — the buyer signed in. Null for a guest. */
  verifiedEmail: string | null;
  heldByAdminId: string | null;
  /** Which colleague is answering it. Absent on older servers. */
  heldByName?: string | null;
  heldAt: string | null;
  lastAdminMessageAt: string | null;
  needsAttentionAt: string | null;
  attentionReason: string | null;
  handoverRequestedAt: string | null;
  handoverReason: string | null;
  /** Deleted by an admin: shown read-only, with Restore. Absent on older servers. */
  deletedAt?: string | null;
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
  /** The deleted ones instead, most recently deleted first. */
  deleted?: boolean;
}

/** What a delete did: chats with orders are never deleted, and say why. */
export interface DeletedConversations {
  deleted: string[];
  refused: { id: string; reason: string }[];
}

/** Someone who left a phone number or email while the chat was paused. */
export interface WaitlistSignup {
  id: string;
  kind: "PHONE" | "EMAIL";
  /** +234… for a phone, lower-case for an email. */
  contact: string;
  conversationId: string | null;
  createdAt: string;
}

export interface WaitlistPage {
  items: WaitlistSignup[];
  total: number;
  page: number;
  limit: number;
}

/** How one person's spell on a chat ended. */
export type HandlingEndReason =
  | "RELEASED"
  | "IDLE"
  | "RELEASED_BY_ADMIN"
  | "REASSIGNED";

/** One person answering a chat, from taking it to letting it go. */
export interface ConversationHandling {
  id: string;
  adminId: string;
  adminName: string | null;
  /** When the buyer started waiting for a person; null if nobody had asked. */
  waitingSince: string | null;
  takenAt: string;
  firstReplyAt: string | null;
  /** Set when an admin passed the chat to them. */
  assignedByName: string | null;
  /** Null while they still have it. */
  endedAt: string | null;
  endReason: HandlingEndReason | null;
  endedByName: string | null;
}

/** One person on the team, and how answering buyers is going for them. */
export interface SupportAgent {
  adminId: string;
  name: string;
  /** "SUPPORT", "ADMIN" or "SUPER_ADMIN"; null for someone who has left. */
  role: string | null;
  active: boolean;
  /** Chats they have right now. */
  openNow: number;
  /** Chats taken in the period. */
  handled: number;
  /** Seconds buyers had waited when they picked them up. */
  avgPickupSeconds: number | null;
  /** Seconds from taking a chat to their first message. */
  avgFirstReplySeconds: number | null;
  /** Handed back automatically after going quiet on a waiting buyer. */
  wentIdle: number;
}

export interface SupportTeam {
  days: number;
  from: string;
  to: string;
  agents: SupportAgent[];
}
