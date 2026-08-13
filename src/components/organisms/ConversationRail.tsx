"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Search, UserCheck } from "lucide-react";
import { useConversations } from "@/hooks";
import type { ConversationSummary } from "@/types";

/** Short and relative — scanning a queue is about "how long", never "when". */
function ago(iso: string | null): string {
  if (!iso) return "";
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The queue, as a rail beside the conversation rather than a page before it.
 *
 * Triage is comparative: an admin answering one buyer needs to see how many others are
 * waiting and for how long. A list that disappears the moment you open something is a
 * list you have to keep going back to.
 */
export default function ConversationRail({
  activeId,
}: {
  activeId: string | null;
}) {
  const [search, setSearch] = useState("");
  const [onlyAttention, setOnlyAttention] = useState(false);

  const { data, isLoading } = useConversations({
    search: search.trim() || undefined,
    needingAttention: onlyAttention,
    limit: 50,
  });

  const items = data?.items ?? [];
  const waiting = data?.needingAttention ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-3 border-b border-black/5 p-4">
        <div className="flex items-baseline justify-between">
          <h1 className="font-dm text-lg font-bold text-gray-900">
            Conversations
          </h1>
          {waiting > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-recommend-orange/10 px-2 py-0.5 font-dm text-xs font-bold text-recommend-orange">
              {waiting} waiting
            </span>
          )}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, phone or email"
            className="w-full rounded-lg border border-black/10 bg-white py-2 pr-3 pl-9 font-dm text-sm outline-none focus:border-recommend-green"
          />
        </div>

        <div className="flex gap-1.5">
          <Filter
            active={!onlyAttention}
            onClick={() => setOnlyAttention(false)}
          >
            All
          </Filter>
          <Filter active={onlyAttention} onClick={() => setOnlyAttention(true)}>
            Needs a person
          </Filter>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <p className="p-6 text-center font-dm text-sm text-gray-400">
            Loading…
          </p>
        )}

        {data && items.length === 0 && (
          <p className="p-6 text-center font-dm text-sm text-gray-400">
            {onlyAttention
              ? "Nothing needs a person right now."
              : "No conversations yet."}
          </p>
        )}

        {items.map((conversation) => (
          <RailRow
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeId}
          />
        ))}
      </div>
    </div>
  );
}

function Filter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 font-dm text-xs font-semibold transition",
        active
          ? "bg-recommend-green text-white"
          : "bg-black/5 text-gray-600 hover:bg-black/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function RailRow({
  conversation,
  active,
}: {
  conversation: ConversationSummary;
  active: boolean;
}) {
  const flagged = !!conversation.needsAttentionAt;

  return (
    <Link
      href={`/admin/conversations/${conversation.id}`}
      className={[
        "flex gap-3 border-b border-black/5 px-4 py-3 transition",
        active ? "bg-recommend-green/8" : "hover:bg-black/[0.03]",
      ].join(" ")}
    >
      {/* The stripe is the whole triage signal: scannable down the edge of the rail
          without reading a word. */}
      <span
        aria-hidden
        className={[
          "-my-3 -ml-4 w-1 shrink-0",
          flagged
            ? "bg-recommend-orange"
            : active
              ? "bg-recommend-green"
              : "bg-transparent",
        ].join(" ")}
      />

      <span
        className={[
          "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full font-dm text-xs font-bold",
          flagged
            ? "bg-recommend-orange/15 text-recommend-orange"
            : "bg-recommend-green/10 text-recommend-green",
        ].join(" ")}
      >
        {initials(conversation.buyerName)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-dm text-sm font-bold text-gray-900">
            {conversation.buyerName ?? "Unnamed buyer"}
          </span>
          <span className="shrink-0 font-dm text-[11px] text-gray-400">
            {ago(conversation.lastMessageAt)}
          </span>
        </span>

        <span className="mt-0.5 block truncate font-dm text-[13px] text-gray-500">
          {conversation.lastMessage ?? "No messages yet"}
        </span>

        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          {flagged && (
            <span className="inline-flex items-center gap-1 rounded-full bg-recommend-orange/10 px-1.5 py-0.5 font-dm text-[10px] font-bold text-recommend-orange">
              <AlertTriangle className="h-2.5 w-2.5" />
              {ago(conversation.needsAttentionAt)} waiting
            </span>
          )}
          {conversation.heldByAdminId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-recommend-green/10 px-1.5 py-0.5 font-dm text-[10px] font-bold text-recommend-green">
              <UserCheck className="h-2.5 w-2.5" />
              Answering
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}
