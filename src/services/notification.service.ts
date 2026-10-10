import { request } from "@/lib/api";
import type { AdminNotification, AdminNotificationFeed } from "@/types";

/** The most recent notifications, newest first, with the unread count. */
export async function getNotifications(limit = 20): Promise<AdminNotificationFeed> {
  return request<AdminNotificationFeed>(`/notifications?limit=${limit}`);
}

export async function markNotificationRead(id: string): Promise<AdminNotification> {
  return request<AdminNotification>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  return request<{ updated: number }>("/notifications/read-all", {
    method: "PATCH",
  });
}
