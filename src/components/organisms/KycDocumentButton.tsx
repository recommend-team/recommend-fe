"use client";

import { useState } from "react";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { getKycDocumentLink } from "@/services";
import { ApiError } from "@/lib/api";
import type { KycDocumentField } from "@/types";

/**
 * Opens one identity document. They are stored privately, so there is no link to keep:
 * each click asks the backend for one that works for five minutes (and records who
 * looked), then opens it in a new tab.
 */
export default function KycDocumentButton({
  userId,
  document,
  label,
  compact = false,
}: {
  userId: string;
  document: KycDocumentField;
  label: string;
  /** The KYC queue's small chips, rather than the "View" button on a document row. */
  compact?: boolean;
}) {
  const [opening, setOpening] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const open = async () => {
    setFailure(null);
    setOpening(true);
    // Opened now, while the click still counts, so a popup blocker lets it through; the
    // address follows once the link arrives.
    const tab = window.open("", "_blank");
    try {
      const { url } = await getKycDocumentLink(userId, document);
      if (tab) {
        tab.opener = null;
        tab.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (cause) {
      tab?.close();
      setFailure(
        cause instanceof ApiError ? cause.message : "Couldn't open it."
      );
    } finally {
      setOpening(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-0.5">
      <button
        type="button"
        onClick={() => void open()}
        disabled={opening}
        aria-label={`View ${label}`}
        className={
          compact
            ? "inline-flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-dm text-gray-700 hover:border-recommend-orange hover:text-recommend-orange transition-colors disabled:opacity-50"
            : "inline-flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-bold font-dm text-gray-700 hover:border-recommend-orange hover:text-recommend-orange disabled:opacity-50"
        }
      >
        {opening ? (
          <Loader2 size={11} className="animate-spin" />
        ) : compact ? (
          <FileText size={12} />
        ) : null}
        {compact ? label : "View"}
        {!opening && <ExternalLink size={compact ? 10 : 11} />}
      </button>
      {failure && (
        <span className="font-dm text-[11px] font-semibold text-red-600">
          {failure}
        </span>
      )}
    </span>
  );
}
