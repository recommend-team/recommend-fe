"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import {
  currentPushState,
  enablePush,
  type PushState,
} from "@/lib/adminAlerts";
import { playChime } from "@/lib/chime";
import { useAlertSound } from "@/hooks/useAlertSound";

/** What to say about push in each state, and whether there is anything to press. */
const PUSH_COPY: Record<PushState, string> = {
  unsupported: "This browser can't show alerts while the panel is closed.",
  unconfigured: "Alerts are switched off on the server.",
  available: "Get alerts even when this tab is closed.",
  granted: "Alerts arrive even when this tab is closed.",
  denied: "Alerts are blocked. Allow notifications for this site in the browser's settings.",
};

/**
 * Alert settings, in the sidebar: desktop notifications for this browser, and the chime.
 *
 * Asking for notification permission only ever happens from the button. Browsers ask once
 * and remember a refusal for good, so a prompt on page load would cost the one chance.
 */
export default function AdminAlertSettings() {
  const { muted, setMuted } = useAlertSound();
  const [push, setPush] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void currentPushState().then((state) => {
      if (!cancelled) setPush(state);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const enable = async () => {
    setBusy(true);
    try {
      setPush(await enablePush());
    } catch {
      // The server refused the subscription; leave the button to try again.
      setPush("available");
    } finally {
      setBusy(false);
    }
  };

  const soundOn = !muted;
  const toggleSound = () => {
    setMuted(soundOn);
    // Turning it on plays it once — the admin learns what to listen for.
    if (!soundOn) playChime();
  };

  return (
    <div className="px-3 pb-3 space-y-2">
      <p className="text-[11px] font-bold font-dm uppercase tracking-wide text-gray-400">
        Alerts
      </p>

      {push && (
        <div className="space-y-1.5">
          <p className="text-xs font-dm text-gray-600">{PUSH_COPY[push]}</p>
          {push === "available" && (
            <button
              onClick={() => void enable()}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-recommend-orange px-3 py-2 text-xs font-bold font-dm text-white transition-opacity disabled:opacity-60"
            >
              <Bell size={14} />
              {busy ? "Turning on…" : "Turn on alerts"}
            </button>
          )}
        </div>
      )}

      <button
        role="switch"
        aria-checked={soundOn}
        aria-label="Alert sound"
        onClick={toggleSound}
        className="flex w-full items-center justify-between rounded-xl px-1 py-1.5 text-xs font-dm text-gray-700 hover:bg-amber-100"
      >
        <span className="flex items-center gap-2">
          {soundOn ? <Bell size={14} /> : <BellOff size={14} />}
          Alert sound
        </span>
        <span
          aria-hidden
          className={`relative h-5 w-9 rounded-full transition-colors ${
            soundOn ? "bg-recommend-orange" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
              soundOn ? "left-[18px]" : "left-0.5"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
