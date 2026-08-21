"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import {
  getConversation,
  getConversationOrder,
  getConversations,
  placeConversationOrder,
  releaseConversation,
  sendConversationMessage,
  setConversationTyping,
  takeConversation,
} from "@/services";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type {
  ConversationDetail,
  ConversationFeed,
  ConversationListFilters,
  ConversationMessage,
  ConversationOrder,
  PlaceAdminOrderPayload,
  PlacedAdminOrder,
} from "@/types";

const FEED_KEY = ["admin", "conversations"] as const;

export function useConversations(filters: ConversationListFilters = {}) {
  return useQuery<ConversationFeed>({
    queryKey: [...FEED_KEY, filters],
    queryFn: () => getConversations(filters),
    // Buyers arrive while nobody is looking. Short enough that the queue is not stale,
    // long enough that leaving the tab open costs nothing.
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useConversation(id: string | null) {
  return useQuery<ConversationDetail>({
    queryKey: ["admin", "conversation", id],
    queryFn: () => getConversation(id!),
    enabled: !!id,
  });
}

function useConversationAction(action: (id: string) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: (_result, id) => {
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "conversation", id],
      });
    },
  });
}

export function useTakeConversation() {
  return useConversationAction(takeConversation);
}

export function useReleaseConversation() {
  return useConversationAction(releaseConversation);
}

export function useSendConversationMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      sendConversationMessage(id, text),
    onSuccess: (_result, { id }) => {
      // The socket delivers the message itself; this keeps the queue's "last message"
      // column honest for an admin who navigates straight back to it.
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "conversation", id],
      });
    },
  });
}

const ORDER_KEY = (id: string) => ["admin", "conversation", id, "order"];

/**
 * The order this conversation last placed, kept live while it is unpaid.
 *
 * Polled rather than pushed: the socket carries messages, and the transcript is
 * deliberately never refetched from it. Polling stops the moment the money lands, so an
 * admin watching a thread all afternoon costs one request until something happens.
 */
export function useConversationOrder(id: string | null) {
  return useQuery<ConversationOrder | null>({
    queryKey: ORDER_KEY(id ?? ""),
    queryFn: () => getConversationOrder(id!),
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING_PAYMENT" ? 10_000 : false,
  });
}

/**
 * Place an order for the buyer and get their payment link.
 *
 * Invalidates the transcript because the order changes what the conversation knows about
 * the buyer, and the queue because its "last message" column is derived from the thread.
 */
export function usePlaceConversationOrder() {
  const queryClient = useQueryClient();
  return useMutation<
    PlacedAdminOrder,
    Error,
    { id: string; payload: PlaceAdminOrderPayload }
  >({
    mutationFn: ({ id, payload }) => placeConversationOrder(id, payload),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "conversation", id],
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "transactions"],
      });
      void queryClient.invalidateQueries({ queryKey: ORDER_KEY(id) });
    },
  });
}

/**
 * Tell the buyer someone is composing, without telling the server on every keystroke.
 *
 * Sent once when typing starts and once when it stops. The buyer's client only needs to
 * know the state changed, and a request per character would be absurd for a cosmetic.
 */
export function useTypingSignal(conversationId: string | null) {
  const active = useRef(false);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

  return (isTyping: boolean) => {
    if (!conversationId) return;

    if (isTyping) {
      if (stopTimer.current) clearTimeout(stopTimer.current);
      stopTimer.current = setTimeout(() => {
        active.current = false;
        void setConversationTyping(conversationId, false).catch(() => {});
      }, 3000);

      if (active.current) return;
      active.current = true;
    } else {
      if (!active.current) return;
      active.current = false;
    }

    void setConversationTyping(conversationId, isTyping).catch(() => {});
  };
}

/**
 * Watch one conversation as it happens.
 *
 * Messages are pushed into the cached transcript rather than triggering a refetch: an
 * admin mid-reply should not have the transcript blink, and the payload the socket sends
 * is the whole message.
 *
 * Read-only. Taking, replying and releasing stay on REST, so there is one path that
 * changes a conversation and one that observes it.
 */
export function useConversationStream(conversationId: string | null) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const token = getAccessToken();
    if (!token) return;

    // The REST base carries `/api/v1`; the socket namespace hangs off the origin.
    const origin = API_URL.replace(/\/api\/v\d+\/?$/, "");
    const socket = io(`${origin}/admin-chat`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("admin:watch", { conversationId });
    });

    socket.on("admin:message", (message: ConversationMessage & { conversationId: string }) => {
      if (message.conversationId !== conversationId) return;

      queryClient.setQueryData<ConversationDetail>(
        ["admin", "conversation", conversationId],
        (current) => {
          if (!current) return current;
          // The REST reply and the socket can both deliver the same message.
          if (current.messages.some((existing) => existing.id === message.id)) {
            return current;
          }
          return { ...current, messages: [...current.messages, message] };
        }
      );

      void queryClient.invalidateQueries({ queryKey: FEED_KEY });
    });

    return () => {
      socket.emit("admin:unwatch", { conversationId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, queryClient]);
}
