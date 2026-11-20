"use client";

import { useState } from "react";
import { ArrowRightLeft, Bot, History } from "lucide-react";
import {
  useConversationHistory,
  useReassignConversation,
  useReleaseConversation,
  useSupportTeam,
} from "@/hooks";
import { useConfirm } from "@/components/organisms/DialogProvider";
import { isSupport } from "@/lib/staff-access";
import type { ConversationDetail, ConversationHandling } from "@/types";

/** "40s", "6m", "2h 5m" — how long, to scan rather than read. */
export function durationText(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return "—";
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const minutes = Math.round(s / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function between(from: string | null, to: string | null): number | null {
  if (!from || !to) return null;
  return (new Date(to).getTime() - new Date(from).getTime()) / 1000;
}

function clock(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** One spell as a sentence: who, how they got it, how fast, how it ended. */
export function describeHandling(spell: ConversationHandling): string {
  const who = spell.adminName ?? "Someone";
  const got = spell.assignedByName
    ? `was given it by ${spell.assignedByName}`
    : spell.waitingSince
      ? `took it after the buyer waited ${durationText(between(spell.waitingSince, spell.takenAt))}`
      : "took it";
  const replied = spell.firstReplyAt
    ? `first reply in ${durationText(between(spell.takenAt, spell.firstReplyAt))}`
    : "no reply yet";
  const ended = !spell.endedAt
    ? "still answering"
    : spell.endReason === "IDLE"
      ? "went quiet, so it went back to the assistant"
      : spell.endReason === "REASSIGNED"
        ? `passed on by ${spell.endedByName ?? "an admin"}`
        : spell.endReason === "RELEASED_BY_ADMIN"
          ? `handed back by ${spell.endedByName ?? "an admin"}`
          : "handed it back";
  return `${who} ${got} · ${replied} · ${ended}`;
}

/**
 * Who has answered this chat, and — for admins — stepping in when it is stuck with a
 * colleague: handing it back to the assistant for them, or passing it to someone else.
 */
export default function ConversationHandlingStrip({
  conversation,
  me,
  onError,
}: {
  conversation: ConversationDetail;
  me: { id: string; role: string } | null | undefined;
  onError: (message: string | null) => void;
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [passTo, setPassTo] = useState("");
  const confirm = useConfirm();

  const admin = !!me && !isSupport(me.role);
  const heldByOther =
    !!conversation.heldByAdminId && conversation.heldByAdminId !== me?.id;
  const canStepIn = admin && heldByOther && !conversation.deletedAt;
  const holder = conversation.heldByName ?? "a colleague";

  const history = useConversationHistory(conversation.id, showHistory);
  const team = useSupportTeam(7, canStepIn);
  const release = useReleaseConversation();
  const reassign = useReassignConversation();

  const colleagues = (team.data?.agents ?? []).filter(
    (agent) => agent.active && agent.adminId !== conversation.heldByAdminId
  );

  const run = async (work: () => Promise<unknown>) => {
    onError(null);
    try {
      await work();
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "That didn't work.");
    }
  };

  const handBack = async () => {
    const ok = await confirm({
      title: `Hand this back for ${holder}?`,
      message:
        "The assistant answers the buyer's next message. Use this when they have left a buyer waiting.",
      confirmLabel: "Hand back",
    });
    if (ok) await run(() => release.mutateAsync(conversation.id));
  };

  const pass = async () => {
    const colleague = colleagues.find((agent) => agent.adminId === passTo);
    if (!colleague) return;
    const ok = await confirm({
      title: `Pass this chat to ${colleague.name}?`,
      message: `${colleague.name} is told it's theirs now, and ${holder} can no longer reply. The buyer sees no change.`,
      confirmLabel: `Pass to ${colleague.name}`,
    });
    if (!ok) return;
    await run(async () => {
      await reassign.mutateAsync({ id: conversation.id, adminId: colleague.adminId });
      setPassTo("");
    });
  };

  return (
    <div className="shrink-0 border-b border-black/10 bg-white px-4 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowHistory((open) => !open)}
          aria-expanded={showHistory}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-dm text-xs font-semibold text-gray-600 hover:bg-black/5"
        >
          <History className="h-3.5 w-3.5" />
          {showHistory ? "Hide history" : "Who answered"}
        </button>

        {canStepIn && (
          <>
            <span className="mx-1 hidden h-5 w-px bg-black/10 sm:block" aria-hidden />
            <button
              type="button"
              onClick={() => void handBack()}
              disabled={release.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-black/5 px-3 font-dm text-xs font-bold text-gray-800 hover:bg-black/10 disabled:opacity-50"
            >
              <Bot className="h-3.5 w-3.5" />
              Hand back for {holder}
            </button>
            <label className="sr-only" htmlFor="pass-to">
              Pass to a colleague
            </label>
            <select
              id="pass-to"
              value={passTo}
              onChange={(event) => setPassTo(event.target.value)}
              className="h-9 max-w-[220px] rounded-full border border-black/10 bg-white px-3 font-dm text-xs"
            >
              <option value="">Pass to…</option>
              {colleagues.map((agent) => (
                <option key={agent.adminId} value={agent.adminId}>
                  {agent.name}
                  {agent.openNow > 0 ? ` · ${agent.openNow} open` : " · free"}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void pass()}
              disabled={!passTo || reassign.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-recommend-green px-3 font-dm text-xs font-bold text-white hover:bg-recommend-green-hover disabled:opacity-40"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              {reassign.isPending ? "Passing…" : "Pass"}
            </button>
          </>
        )}
      </div>

      {showHistory && (
        <div className="mt-2 rounded-xl bg-black/[0.03] px-3 py-2">
          {history.isLoading ? (
            <p className="font-dm text-xs text-gray-400">Loading…</p>
          ) : !history.data?.length ? (
            <p className="font-dm text-xs text-gray-500">
              Nobody has answered this chat yet — the assistant has handled it.
            </p>
          ) : (
            <ol className="flex flex-col gap-1.5">
              {history.data.map((spell) => (
                <li key={spell.id} className="font-dm text-xs text-gray-700">
                  <span className="text-gray-400">{clock(spell.takenAt)} · </span>
                  {describeHandling(spell)}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
