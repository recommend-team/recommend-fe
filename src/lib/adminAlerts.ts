import { request } from "./api";

/**
 * Admin alerts: what they look like, where they may lead, and web push for the panel.
 *
 * The server (`recommend-be` → `admin-alerts.service.ts`) sends each alert twice — over
 * the `/admin-chat` socket for an open panel, and by web push for a closed one — with one
 * id on both, so the panel can show it once.
 */

export type AdminAlertKind =
  | "CONVERSATION_FLAGGED"
  | "HELD_CONVERSATION_MESSAGE"
  | "NEW_PAID_ORDER"
  | "WITHDRAWAL_FAILED";

export interface AdminAlert {
  id: string | null;
  kind: AdminAlertKind | null;
  title: string;
  body: string;
  /** Always an admin-panel path — see `safeAdminPath`. */
  url: string;
}

/** Messages from `public/admin-sw.js`. */
export const SW_PUSH_RECEIVED = "recommend:admin-push-received";
export const SW_NAVIGATE = "recommend:admin-navigate";

const SW_PATH = "/admin-sw.js";
const SW_SCOPE = "/admin/";
const FALLBACK_PATH = "/admin";

const KINDS = new Set<string>([
  "CONVERSATION_FLAGGED",
  "HELD_CONVERSATION_MESSAGE",
  "NEW_PAID_ORDER",
  "WITHDRAWAL_FAILED",
]);

/**
 * Only a path inside the admin panel survives. A link out of it — another site, or the
 * public storefront — is never opened from an alert. Kept in step with `admin-sw.js`.
 */
export function safeAdminPath(candidate: unknown): string {
  if (typeof candidate !== "string") return FALLBACK_PATH;
  if (candidate.includes("\\")) return FALLBACK_PATH;
  if (candidate !== "/admin" && !candidate.startsWith("/admin/")) {
    return FALLBACK_PATH;
  }
  return candidate;
}

/** An alert off the socket or out of the service worker, read defensively. */
export function parseAlert(raw: unknown): AdminAlert {
  const value = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  const text = (field: unknown) =>
    typeof field === "string" && field.trim() ? field : null;
  const kind = text(value.kind);

  return {
    id: text(value.id),
    kind: kind && KINDS.has(kind) ? (kind as AdminAlertKind) : null,
    title: text(value.title) ?? "Recommend Admin",
    body: text(value.body) ?? "",
    url: safeAdminPath(value.url),
  };
}

/**
 * Remembers which alerts have been shown, so the second copy of one is dropped. Bounded:
 * a panel left open for a week should not grow without limit.
 */
export class SeenAlerts {
  private readonly ids: string[] = [];

  constructor(private readonly capacity = 200) {}

  /** True the first time an id is offered. An alert with no id is always new. */
  firstTime(id: string | null): boolean {
    if (!id) return true;
    if (this.ids.includes(id)) return false;
    this.ids.push(id);
    if (this.ids.length > this.capacity) this.ids.shift();
    return true;
  }
}

/**
 * Whether an alert is about the page the admin is already on. They can see it; a banner
 * and a chime on top would only be noise.
 */
export function isAboutCurrentPage(alert: AdminAlert, pathname: string): boolean {
  if (alert.url === FALLBACK_PATH) return false;
  return pathname === alert.url;
}

// ─── Web push ─────────────────────────────────────────────────────────────────

export type PushState =
  /** No service worker or no push here — an old browser, or an iPhone tab. */
  | "unsupported"
  /** The server has no VAPID keys. */
  | "unconfigured"
  | "available"
  | "granted"
  /** Refused. Browsers do not ask again; only the site settings can undo it. */
  | "denied";

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/** Registers the worker. Safe to call on every load — the browser deduplicates. */
export async function registerAdminWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!pushSupported()) return null;
  try {
    return await navigator.serviceWorker.register(SW_PATH, { scope: SW_SCOPE });
  } catch {
    return null;
  }
}

async function publicKey(): Promise<string | null> {
  try {
    const { publicKey } = await request<{ publicKey: string | null }>(
      "/notifications/push/public-key"
    );
    return publicKey ?? null;
  } catch {
    return null;
  }
}

export async function currentPushState(): Promise<PushState> {
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  if (!(await publicKey())) return "unconfigured";

  if (Notification.permission === "granted") {
    const registration = await registerAdminWorker();
    const existing = await registration?.pushManager.getSubscription();
    // Granted but unsubscribed reads as "on" and delivers nothing — treat it as available.
    return existing ? "granted" : "available";
  }
  return "available";
}

/** Ask, subscribe and register with the server. Call from a click, never on load. */
export async function enablePush(): Promise<PushState> {
  if (!pushSupported()) return "unsupported";

  const key = await publicKey();
  if (!key) return "unconfigured";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";

  const registration = await registerAdminWorker();
  if (!registration) return "unsupported";
  await navigator.serviceWorker.ready;

  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToBytes(key),
    }));

  const json = subscription.toJSON() as {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  };
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return "available";
  }

  await request<null>("/notifications/push/subscribe", {
    method: "POST",
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      userAgent: navigator.userAgent.slice(0, 300),
    }),
  });

  return "granted";
}

/** VAPID keys travel as base64url; `PushManager` wants raw bytes. */
export function base64UrlToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalised = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalised);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
