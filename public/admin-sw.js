/**
 * The admin panel's service worker — push and nothing else.
 *
 * No caching, no offline: the marketing site and storefronts share this origin, and a
 * worker that intercepted their requests would be a risk for no gain. Registered with scope
 * `/admin/` by `src/lib/adminAlerts.ts`.
 *
 * Mirrors the vendor app's `sw.ts` (recommend_vendors): an admin with the panel on screen
 * gets the alert in the page, which chimes and shows a banner; otherwise the system
 * notification is the alert and the device's own tone is the sound.
 */

const PUSH_RECEIVED = "recommend:admin-push-received";
const NAVIGATE = "recommend:admin-navigate";
const FALLBACK_PATH = "/admin";

self.addEventListener("install", () => {
  // Nothing to precache, so nothing to wait for.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  event.waitUntil(deliver(parse(readJson(event.data))));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { url } = parse(event.notification.data);
  event.waitUntil(open(url));
});

/** Windows on the admin panel. The marketing site shares the origin and is not one. */
async function adminWindows() {
  const windows = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  return windows.filter((client) => {
    const { pathname } = new URL(client.url);
    return pathname === "/admin" || pathname.startsWith("/admin/");
  });
}

async function deliver(alert) {
  const visible = (await adminWindows()).filter(
    (client) => client.visibilityState === "visible"
  );

  if (visible.length > 0) {
    for (const client of visible) {
      client.postMessage({ type: PUSH_RECEIVED, alert });
    }
    return;
  }

  await self.registration.showNotification(alert.title, {
    body: alert.body,
    icon: "/logo-minimal.svg",
    data: { url: alert.url },
    ...(alert.tag ? { tag: alert.tag } : {}),
  });
}

async function open(path) {
  const [existing] = await adminWindows();

  if (existing) {
    await existing.focus();
    existing.postMessage({ type: NAVIGATE, url: path });
    return;
  }

  await self.clients.openWindow(path);
}

/** Defensive: this comes off the network into code that opens windows. */
function parse(raw) {
  const value = raw && typeof raw === "object" ? raw : {};
  const text = (field) =>
    typeof field === "string" && field.trim() ? field : null;
  const data = value.data && typeof value.data === "object" ? value.data : {};

  return {
    id: text(data.alertId),
    kind: text(value.type),
    title: text(value.title) || "Recommend Admin",
    body: text(value.body) || "",
    url: safeAdminPath(value.url),
    tag: text(value.tag),
  };
}

/** Only a path inside the admin panel. Kept in step with `safeAdminPath` in adminAlerts.ts. */
function safeAdminPath(candidate) {
  if (typeof candidate !== "string") return FALLBACK_PATH;
  if (candidate.includes("\\")) return FALLBACK_PATH;
  if (candidate !== "/admin" && !candidate.startsWith("/admin/")) {
    return FALLBACK_PATH;
  }
  return candidate;
}

function readJson(data) {
  if (!data) return null;
  try {
    return data.json();
  } catch {
    return { body: data.text() };
  }
}
