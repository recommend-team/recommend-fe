"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  Hand,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useConversations, useDeleteConversations } from "@/hooks";
import { useConfirm } from "@/components/organisms/DialogProvider";
import { ApiError } from "@/lib/api";
import type { ConversationSummary } from "@/types";

/** Short and relative — scanning a queue is about "how long", never "when". */
function ago(iso: string | null | undefined): string {
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

type View = "all" | "attention" | "deleted";

/**
 * The queue, as a rail beside the conversation rather than a page before it.
 *
 * Triage is comparative: an admin answering one buyer needs to see how many others are
 * waiting and for how long. A list that disappears the moment you open something is a
 * list you have to keep going back to.
 *
 * "Select" clears out the chats that went nowhere, several at a time. Deleted ones move
 * to their own filter, where each can be opened and restored.
 */
export default function ConversationRail({
  activeId,
}: {
  activeId: string | null;
}) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("all");
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const confirm = useConfirm();
  const remove = useDeleteConversations();

  const { data, isLoading } = useConversations({
    search: search.trim() || undefined,
    needingAttention: view === "attention",
    deleted: view === "deleted",
    limit: 50,
  });

  const items = data?.items ?? [];
  const waiting = data?.needingAttention ?? 0;

  const show = (next: View) => {
    setView(next);
    setSelecting(false);
    setSelected(new Set());
    setNotice(null);
  };

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const deleteSelected = async () => {
    const ids = [...selected];
    const ok = await confirm({
      title: `Delete ${ids.length} conversation${ids.length === 1 ? "" : "s"}?`,
      message:
        "They leave the inbox and can be restored from Deleted. Chats with orders are never deleted.",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!ok) return;

    try {
      const result = await remove.mutateAsync(ids);
      // What could not go stays ticked, so the admin sees which.
      setSelected(new Set(result.refused.map((refusal) => refusal.id)));
      setNotice(
        result.refused.length === 0
          ? `Deleted ${result.deleted.length}.`
          : `Deleted ${result.deleted.length}. The ${result.refused.length} still ticked ${
              result.refused.length === 1 ? "has" : "have"
            } orders, so ${result.refused.length === 1 ? "it stays" : "they stay"}.`
      );
      if (result.refused.length === 0) setSelecting(false);
    } catch (cause) {
      setNotice(cause instanceof ApiError ? cause.message : "That didn't work.");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-3 border-b border-black/5 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="font-dm text-lg font-bold text-gray-900">
            Conversations
          </h1>
          <span className="flex items-center gap-2">
            {waiting > 0 && view !== "deleted" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-recommend-orange/10 px-2 py-0.5 font-dm text-xs font-bold text-recommend-orange">
                {waiting} waiting
              </span>
            )}
            {view !== "deleted" && items.length > 0 && (
              <button
                onClick={() => {
                  setSelecting((on) => !on);
                  setSelected(new Set());
                  setNotice(null);
                }}
                className="font-dm text-xs font-bold text-recommend-green hover:underline"
              >
                {selecting ? "Cancel" : "Select"}
              </button>
            )}
          </span>
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
          <Filter active={view === "all"} onClick={() => show("all")}>
            All
          </Filter>
          <Filter
            active={view === "attention"}
            onClick={() => show("attention")}
          >
            Needs a person
          </Filter>
          <Filter active={view === "deleted"} onClick={() => show("deleted")}>
            Deleted
          </Filter>
        </div>

        {selecting && (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-black/[0.03] px-3 py-2">
            <span className="font-dm text-xs text-gray-600">
              {selected.size === 0
                ? "Tick the chats to delete"
                : `${selected.size} selected`}
            </span>
            <button
              onClick={() => void deleteSelected()}
              disabled={selected.size === 0 || remove.isPending}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 font-dm text-xs font-bold text-white hover:bg-red-700 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {remove.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}

        {notice && (
          <p role="status" className="font-dm text-xs text-gray-600">
            {notice}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <p className="p-6 text-center font-dm text-sm text-gray-400">
            Loading…
          </p>
        )}

        {data && items.length === 0 && (
          <p className="p-6 text-center font-dm text-sm text-gray-400">
            {view === "attention"
              ? "Nothing needs a person right now."
              : view === "deleted"
                ? "No deleted conversations."
                : "No conversations yet."}
          </p>
        )}

        {items.map((conversation) => (
          <RailRow
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeId}
            selecting={selecting}
            selected={selected.has(conversation.id)}
            onToggle={() => toggle(conversation.id)}
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
  selecting,
  selected,
  onToggle,
}: {
  conversation: ConversationSummary;
  active: boolean;
  selecting: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  // Handed over by the assistant, which is now silent: a buyer waiting on a person with a
  // clock running. Outranks a flag — and a handed-over conversation is flagged too, so
  // only one badge is shown. A deleted one is waiting for nobody.
  const deleted = !!conversation.deletedAt;
  const waiting =
    !deleted &&
    !!conversation.handoverRequestedAt &&
    !conversation.heldByAdminId;
  const flagged = !deleted && !!conversation.needsAttentionAt && !waiting;

  const className = [
    "flex w-full gap-3 border-b border-black/5 px-4 py-3 text-left transition",
    active || selected ? "bg-recommend-green/8" : "hover:bg-black/[0.03]",
    deleted ? "opacity-70" : "",
  ].join(" ");

  const body = (
    <>
      {/* The stripe is the whole triage signal: scannable down the edge of the rail
          without reading a word. */}
      <span
        aria-hidden
        className={[
          "-my-3 -ml-4 w-1 shrink-0",
          waiting
            ? "bg-red-500"
            : flagged
              ? "bg-recommend-orange"
              : active
                ? "bg-recommend-green"
                : "bg-transparent",
        ].join(" ")}
      />

      {selecting ? (
        <input
          type="checkbox"
          checked={selected}
          readOnly
          tabIndex={-1}
          aria-hidden
          className="mt-2.5 h-4 w-4 shrink-0 accent-[#006837]"
        />
      ) : (
        <span
          className={[
            "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full font-dm text-xs font-bold",
            waiting
              ? "bg-red-500/15 text-red-600"
              : flagged
                ? "bg-recommend-orange/15 text-recommend-orange"
                : "bg-recommend-green/10 text-recommend-green",
          ].join(" ")}
        >
          {initials(conversation.buyerName)}
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-dm text-sm font-bold text-gray-900">
            {conversation.buyerName ??
              conversation.verifiedEmail ??
              "Unnamed buyer"}
          </span>
          <span className="shrink-0 font-dm text-[11px] text-gray-400">
            {ago(conversation.lastMessageAt)}
          </span>
        </span>

        <span className="mt-0.5 block truncate font-dm text-[13px] text-gray-500">
          {conversation.lastMessage ?? "No messages yet"}
        </span>

        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          {deleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-1.5 py-0.5 font-dm text-[10px] font-bold text-gray-600">
              <Trash2 className="h-2.5 w-2.5" />
              Deleted {ago(conversation.deletedAt)} ago
            </span>
          )}
          {conversation.verifiedEmail && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-recommend-green/10 px-1.5 py-0.5 font-dm text-[10px] font-bold text-recommend-green"
              title={`Signed in as ${conversation.verifiedEmail}`}
            >
              <BadgeCheck className="h-2.5 w-2.5" />
              Verified
            </span>
          )}
          {waiting && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 font-dm text-[10px] font-bold text-red-600">
              <Hand className="h-2.5 w-2.5" />
              Waiting for you · {ago(conversation.handoverRequestedAt)}
            </span>
          )}
          {flagged && (
            <span className="inline-flex items-center gap-1 rounded-full bg-recommend-orange/10 px-1.5 py-0.5 font-dm text-[10px] font-bold text-recommend-orange">
              <AlertTriangle className="h-2.5 w-2.5" />
              {ago(conversation.needsAttentionAt)} waiting
            </span>
          )}
          {!deleted && conversation.heldByAdminId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-recommend-green/10 px-1.5 py-0.5 font-dm text-[10px] font-bold text-recommend-green">
              <UserCheck className="h-2.5 w-2.5" />
              Answering
            </span>
          )}
        </span>
      </span>
    </>
  );

  // While selecting, a tap ticks the row rather than opening it.
  return selecting ? (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={`Select ${conversation.buyerName ?? "Unnamed buyer"}`}
      onClick={onToggle}
      className={className}
    >
      {body}
    </button>
  ) : (
    <Link href={`/admin/conversations/${conversation.id}`} className={className}>
      {body}
    </Link>
  );
}
