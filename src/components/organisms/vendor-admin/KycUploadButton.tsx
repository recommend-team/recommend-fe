"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useUpdateVendorKyc } from "@/hooks";
import { uploadFile } from "@/services";
import type { KycDocumentKey } from "@/types";

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Upload one KYC document for a vendor — a photo or a PDF — and attach it. Replaces the
 * one already there. Logged, and the vendor is told.
 */
export default function KycUploadButton({
  vendorId,
  documentKey,
  label,
  replacing,
}: {
  vendorId: string;
  documentKey: KycDocumentKey;
  label: string;
  replacing: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const attach = useUpdateVendorKyc(vendorId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("A photo or a PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Over 10 MB — choose a smaller file.");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadFile(file, "kyc");
      await attach.mutateAsync({ [documentKey]: uploaded.secureUrl });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={uploading}
        aria-label={`${replacing ? "Replace" : "Upload"} ${label}`}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 font-dm text-xs font-bold text-gray-700 hover:border-recommend-green hover:text-recommend-green disabled:opacity-50"
      >
        {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
        {uploading ? "Uploading…" : replacing ? "Replace" : "Upload"}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => void pick(event.target.files?.[0])}
      />
      {error && <span className="font-dm text-[11px] font-semibold text-red-600">{error}</span>}
    </span>
  );
}
