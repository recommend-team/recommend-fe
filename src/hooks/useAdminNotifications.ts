"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services";
import type { AdminNotificationFeed } from "@/types";

/** Refreshed by `AdminAlerts` whenever a live alert lands — see its STALE map. */
export const NOTIFICATIONS_KEY = ["admin", "notifications"] as const;

/**
 * The bell's feed. Kept current by the live alerts; the slow poll only covers a socket
 * that is down, so the badge is never wrong for long.
 */
export function useAdminNotifications() {
  return useQuery<AdminNotificationFeed>({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => getNotifications(),
    refetchInterval: 60_000,
    staleTime: 15_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

/**
 * Mark read the feed entry behind a live alert, by the alert's id. For a banner the admin
 * clicked: they have seen it, so the bell should not count it. Does nothing if the feed
 * has not loaded that entry — the bell will show it unread, which is merely cautious.
 */
export function useMarkAlertRead(): (alertId: string | null) => void {
  const queryClient = useQueryClient();
  return useCallback(
    (alertId) => {
      if (!alertId) return;
      const feed = queryClient.getQueryData<AdminNotificationFeed>(NOTIFICATIONS_KEY);
      const entry = feed?.items.find(
        (item) => item.data?.alertId === alertId && !item.readAt
      );
      if (!entry) return;
      void markNotificationRead(entry.id)
        .then(() => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }))
        .catch(() => undefined);
    },
    [queryClient]
  );
}
