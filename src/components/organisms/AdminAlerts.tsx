"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { BellRing, X } from "lucide-react";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import {
  SW_NAVIGATE,
  SW_PUSH_RECEIVED,
  SeenAlerts,
  isAboutCurrentPage,
  parseAlert,
  registerAdminWorker,
  safeAdminPath,
  setLiveAlertsState,
  type AdminAlert,
} from "@/lib/adminAlerts";
import { armChime, playChime } from "@/lib/chime";
import { readMuted } from "@/hooks/useAlertSound";

const BANNER_MS = 10_000;
const MAX_BANNERS = 3;

/** What each kind of alert makes stale, so the page behind the banner is current too. */
const STALE: Record<string, readonly (readonly string[])[]> = {
  CONVERSATION_HANDED_OVER: [["admin", "conversations"]],
  CONVERSATION_FLAGGED: [["admin", "conversations"]],
  HELD_CONVERSATION_MESSAGE: [["admin", "conversations"]],
  NEW_PAID_ORDER: [
    ["admin", "transactions"],
    ["admin", "orders"],
    ["admin", "stats"],
  ],
  VENDOR_ORDER_READY: [
    ["admin", "transactions"],
    ["admin", "orders"],
  ],
  WITHDRAWAL_FAILED: [["admin", "vendors"]],
};

interface Banner {
  key: number;
  alert: AdminAlert;
}

/**
 * Alerts, while the panel is open: a chime and a banner.
 *
 * Two ways in, one way out. The `/admin-chat` socket delivers an alert the moment it
 * happens; the service worker passes along a push that arrived while the panel was on
 * screen. The same alert usually comes both ways, so each id is shown once.
 *
 * Mounted once, in the guarded admin layout.
 */
export default function AdminAlerts() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [banners, setBanners] = useState<Banner[]>([]);

  const seen = useRef(new SeenAlerts());
  const nextKey = useRef(0);
  // Read through a ref so the socket is not reopened on every navigation.
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const receive = useCallback(
    (raw: unknown) => {
      const alert = parseAlert(raw);
      if (!seen.current.firstTime(alert.id)) return;

      for (const queryKey of STALE[alert.kind ?? ""] ?? []) {
        void queryClient.invalidateQueries({ queryKey: [...queryKey] });
      }

      // Already looking at it — the page itself shows what changed.
      if (isAboutCurrentPage(alert, pathnameRef.current)) return;

      const key = nextKey.current++;
      setBanners((current) => [{ key, alert }, ...current].slice(0, MAX_BANNERS));
      window.setTimeout(() => {
        setBanners((current) => current.filter((banner) => banner.key !== key));
      }, BANNER_MS);

      if (!readMuted()) playChime();
    },
    [queryClient]
  );

  useEffect(() => armChime(), []);

  // The worker must be registered for it to forward pushes or route taps — including for
  // an admin who enabled alerts on an earlier visit.
  useEffect(() => {
    void registerAdminWorker();
  }, []);

  useEffect(() => {
    // The REST base carries `/api/v1`; the socket namespace hangs off the origin.
    const origin = API_URL.replace(/\/api\/v\d+\/?$/, "");
    const socket = io(`${origin}/admin-chat`, {
      // Read on every (re)connect, never captured once: an access token refreshed while
      // the panel was open must be the one the next attempt sends. A captured token that
      // had expired used to leave the panel silently deaf until a full reload.
      auth: (send) => send({ token: getAccessToken() ?? "" }),
      transports: ["websocket", "polling"],
    });

    let retry: number | undefined;

    socket.on("connect", () => setLiveAlertsState("connected"));
    socket.on("connect_error", () => setLiveAlertsState("connecting"));
    socket.on("admin:error", () => setLiveAlertsState("refused"));
    socket.on("disconnect", (reason) => {
      // Socket.IO reconnects by itself after a dropped connection, but not after the
      // server closes it — which is what a rejected token does. Try again shortly, with
      // whatever token is current by then.
      if (reason === "io server disconnect") {
        retry = window.setTimeout(() => socket.connect(), 15_000);
      } else {
        setLiveAlertsState("connecting");
      }
    });
    socket.on("admin:alert", receive);

    return () => {
      window.clearTimeout(retry);
      socket.removeAllListeners();
      socket.disconnect();
      setLiveAlertsState("connecting");
    };
  }, [receive]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; alert?: unknown; url?: unknown } | null;
      if (data?.type === SW_PUSH_RECEIVED) receive(data.alert);
      else if (data?.type === SW_NAVIGATE) router.push(safeAdminPath(data.url));
    };

    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, [receive, router]);

  const dismiss = (key: number) =>
    setBanners((current) => current.filter((banner) => banner.key !== key));

  if (banners.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-16 right-4 left-4 z-[60] flex flex-col items-end gap-2 md:top-4 md:left-auto md:w-96">
      {banners.map(({ key, alert }) => (
        <div
          key={key}
          role="status"
          className="pointer-events-auto flex w-full items-start gap-2 rounded-2xl border border-[#FFD91D] bg-white p-2 shadow-lg"
        >
          <button
            onClick={() => {
              dismiss(key);
              router.push(alert.url);
            }}
            className="flex min-w-0 flex-1 items-start gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-amber-50"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-recommend-orange text-white">
              <BellRing size={16} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold font-dm text-gray-900">
                {alert.title}
              </span>
              <span className="mt-0.5 line-clamp-2 block text-xs font-dm text-gray-600">
                {alert.body}
              </span>
            </span>
          </button>
          <button
            onClick={() => dismiss(key)}
            aria-label="Dismiss"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
