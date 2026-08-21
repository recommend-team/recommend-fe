"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  UserCheck,
} from "lucide-react";
import {
  useConversation,
  useConversationStream,
  useCurrentUser,
  useReleaseConversation,
  useSendConversationMessage,
  useTakeConversation,
  useTypingSignal,
} from "@/hooks";
import OrderBuilder from "@/components/organisms/OrderBuilder";
import ConversationOrderStrip from "@/components/organisms/ConversationOrderStrip";
import { ApiError } from "@/lib/api";
import type { ConversationMessage } from "@/types";

const STATE_LABELS: Record<string, string> = {
  DISCOVERY: "Browsing",
  SELECTING_ITEM: "Choosing an item",
  COLLECTING_NAME: "Giving their name",
  COLLECTING_PHONE: "Giving their number",
  COLLECTING_FULFILLMENT: "Delivery or pickup",
  COLLECTING_ADDRESS: "Giving an address",
  CONFIRMING_ORDER: "Confirming the order",
  AWAITING_PAYMENT: "Paying",
};

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
  });
}

export default function AdminConversationPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? null;

  const { data: me } = useCurrentUser();
  const { data: conversation, isLoading, isError } = useConversation(id);
  const take = useTakeConversation();
  const release = useReleaseConversation();
  const send = useSendConversationMessage();
  const signalTyping = useTypingSignal(id);

  useConversationStream(id);

  const [draft, setDraft] = useState("");
  const [failure, setFailure] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const heldByMe =
    !!conversation?.heldByAdminId && conversation.heldByAdminId === me?.id;
  const heldByOther =
    !!conversation?.heldByAdminId && conversation.heldByAdminId !== me?.id;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  const act = async (action: () => Promise<unknown>) => {
    setFailure(null);
    try {
      await action();
    } catch (cause) {
      setFailure(
        cause instanceof ApiError ? cause.message : "That didn't work."
      );
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    signalTyping(false);
    await act(() => send.mutateAsync({ id, text }));
  };

  if (isLoading) {
    return (
      <p className="grid h-full place-items-center font-dm text-sm text-gray-400">
        Loading conversation…
      </p>
    );
  }

  if (isError || !conversation) {
    return (
      <p className="grid h-full place-items-center font-dm text-sm text-gray-400">
        Couldn&apos;t load that conversation.
      </p>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-black/10 px-4 py-3">
        <Link
          href="/admin/conversations"
          aria-label="Back to conversations"
          className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-black/5 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="truncate font-dm font-bold text-gray-900">
            {conversation.buyerName ?? "Unnamed buyer"}
          </p>
          <p className="truncate font-dm text-xs text-gray-500">
            {conversation.buyerPhone ?? "No number yet"} ·{" "}
            {STATE_LABELS[conversation.state] ?? conversation.state}
          </p>
        </div>

        {heldByOther && (
          <span className="rounded-full bg-black/5 px-3 py-1.5 font-dm text-xs font-semibold text-gray-600">
            Another admin is answering
          </span>
        )}

        {heldByMe ? (
          <button
            onClick={() => void act(() => release.mutateAsync(conversation.id))}
            disabled={release.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 font-dm text-sm font-bold text-gray-800 transition hover:bg-black/10 disabled:opacity-50"
          >
            <Bot className="h-4 w-4" />
            Hand back
          </button>
        ) : (
          <button
            onClick={() => void act(() => take.mutateAsync(conversation.id))}
            disabled={take.isPending || heldByOther}
            className="inline-flex items-center gap-2 rounded-full bg-recommend-green px-4 py-2 font-dm text-sm font-bold text-white transition hover:bg-recommend-green-hover disabled:opacity-40"
          >
            <UserCheck className="h-4 w-4" />
            Take over
          </button>
        )}
      </header>

      {conversation.attentionReason && !heldByMe && (
        <p className="flex shrink-0 items-center gap-2 bg-recommend-orange/10 px-4 py-2.5 font-dm text-xs font-semibold text-recommend-orange">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {conversation.attentionReason}
        </p>
      )}

      {heldByMe && (
        <p className="flex shrink-0 items-center gap-2 bg-recommend-green/10 px-4 py-2.5 font-dm text-xs font-semibold text-recommend-green">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          The assistant is silent. Everything you send arrives as Recommend.
        </p>
      )}

      {/* A column, not the full width. Bubbles pinned to opposite edges of a 1400px
          screen read as two unrelated lists rather than one conversation. */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-recommend-amber/40 px-4 py-5">
        <div className="mx-auto flex max-w-2xl flex-col gap-0.5">
          {conversation.messages.map((message, index) => {
            const previous = conversation.messages[index - 1];
            const newDay =
              !previous ||
              dayLabel(previous.createdAt) !== dayLabel(message.createdAt);
            // Consecutive messages from the same side belong together; only the last of
            // a run is stamped, so a burst of three does not carry three timestamps.
            const next = conversation.messages[index + 1];
            const endsRun = !next || sameSide(next) !== sameSide(message);

            return (
              <div key={message.id}>
                {newDay && <DaySeparator label={dayLabel(message.createdAt)} />}
                <Bubble message={message} showMeta={endsRun} />
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </div>

      {/* Only while you hold the conversation — ordering for a buyer the assistant is
          still serving would write a checkout underneath a running flow, and the
          endpoint refuses it anyway. */}
      {(heldByMe || !!conversation.buyerPhone) && (
        <div className="shrink-0 border-t border-black/10 bg-white px-4 pt-3">
          <div className="mx-auto flex max-w-2xl flex-col gap-2">
            {/* Visible to any admin looking, held or not — "did they pay?" is the
                question anyone opening this thread is here to answer. */}
            <ConversationOrderStrip conversationId={conversation.id} />
            {heldByMe && <OrderBuilder conversation={conversation} />}
          </div>
        </div>
      )}

      <form
        onSubmit={submit}
        className="shrink-0 border-t border-black/10 bg-white px-4 py-3"
      >
        {failure && (
          <p role="alert" className="mb-2 font-dm text-xs text-red-600">
            {failure}
          </p>
        )}

        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <input
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              signalTyping(event.target.value.length > 0);
            }}
            disabled={!heldByMe}
            placeholder={
              heldByMe
                ? "Reply as Recommend…"
                : heldByOther
                  ? "Another admin is answering this one"
                  : "Take over to reply"
            }
            className="min-h-11 flex-1 rounded-full border border-black/10 bg-white px-4 font-dm text-sm outline-none focus:border-recommend-green disabled:bg-black/[0.03] disabled:text-gray-400"
          />
          <button
            type="submit"
            disabled={!heldByMe || !draft.trim() || send.isPending}
            aria-label="Send"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-recommend-green text-white transition hover:bg-recommend-green-hover disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function sameSide(message: ConversationMessage): "buyer" | "us" {
  return message.author === "BUYER" ? "buyer" : "us";
}

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <span className="h-px flex-1 bg-black/10" />
      <span className="font-dm text-[11px] font-bold tracking-wide text-gray-400 uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}

function Bubble({
  message,
  showMeta,
}: {
  message: ConversationMessage;
  showMeta: boolean;
}) {
  const fromBuyer = message.author === "BUYER";
  const byPerson = !!message.adminId;

  return (
    <div className={fromBuyer ? "flex justify-start" : "flex justify-end"}>
      <div className={fromBuyer ? "max-w-[80%]" : "max-w-[80%] text-right"}>
        <div
          className={[
            "inline-block rounded-2xl px-3.5 py-2.5 text-left",
            fromBuyer
              ? "rounded-bl-md border border-black/5 bg-white text-gray-900"
              : byPerson
                ? // An admin reply and a bot reply are identical to the buyer, so they
                  // look alike here too — the marker below is for us, not them.
                  "rounded-br-md bg-recommend-green text-white ring-2 ring-recommend-orange/50"
                : "rounded-br-md bg-recommend-green text-white",
          ].join(" ")}
        >
          <p className="font-dm text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        </div>

        {showMeta && (
          <p className="mt-1 px-1 font-dm text-[11px] text-gray-400">
            {fromBuyer ? "Buyer" : byPerson ? "You, as Recommend" : "Assistant"}
            {" · "}
            {new Date(message.createdAt).toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
