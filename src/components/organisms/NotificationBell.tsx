"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import {
  useAdminNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/hooks";
import { safeAdminPath } from "@/lib/adminAlerts";
import type { AdminNotification } from "@/types";

/**
 * The bell: every alert, kept, for the admin who missed the banner.
 *
 * A banner lasts ten seconds and a push can be dismissed unread; this is the record that
 * survives both. The count is capped at 9+ — forty unread means "open it", not a number
 * to read, as in the vendor app.
 *
 * `align` is which edge the panel hangs from: the left in the desktop sidebar, so it opens
 * over the page, and the right in the mobile bar, where the bell sits at the edge.
 */
export default function NotificationBell({
  align = "left",
}: {
  align?: "left" | "right";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useAdminNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unread = data?.unread ?? 0;
  const items = data?.items ?? [];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openEntry = (entry: AdminNotification) => {
    if (!entry.readAt) markRead.mutate(entry.id);
    setOpen(false);
    router.push(safeAdminPath(entry.data?.url));
  };

  return (
    <div ref={root} className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative grid h-9 w-9 place-items-center rounded-full text-gray-700 transition-colors hover:bg-amber-100"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-recommend-orange px-1 text-[10px] font-bold font-dm leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className={`absolute top-11 z-[70] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#FFD91D] bg-white shadow-xl ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-bold font-dm text-gray-900">Notifications</p>
            {unread > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="text-xs font-bold font-dm text-recommend-orange hover:underline disabled:opacity-60"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-center text-xs font-dm text-gray-500">
                Loading…
              </p>
            ) : isError ? (
              <p className="px-4 py-6 text-center text-xs font-dm text-gray-500">
                Couldn&apos;t load notifications. Try again shortly.
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs font-dm text-gray-500">
                No notifications yet.
              </p>
            ) : (
              <ul>
                {items.map((entry) => (
                  <li key={entry.id}>
                    <button
                      onClick={() => openEntry(entry)}
                      className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-amber-50 ${
                        entry.readAt ? "" : "bg-amber-50/60"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          entry.readAt ? "bg-transparent" : "bg-recommend-orange"
                        }`}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm font-dm text-gray-900 ${
                            entry.readAt ? "" : "font-bold"
                          }`}
                        >
                          {entry.title}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-xs font-dm text-gray-600">
                          {entry.body}
                        </span>
                        <span className="mt-1 block text-[11px] font-dm text-gray-400">
                          {timeAgo(entry.createdAt)}
                          {entry.readAt ? "" : " · Unread"}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}
