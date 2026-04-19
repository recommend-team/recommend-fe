"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Upload, FileCheck2, ExternalLink } from "lucide-react";
import { uploadFile } from "@/services";

interface KycDocFieldProps {
  label: string;
  hint?: string;
  /** URL already stored for this doc (from the vendor's profile). */
  currentUrl?: string | null;
  /** URL picked during this session but not yet submitted. */
  pendingUrl?: string;
  onUploaded: (url: string) => void;
  disabled?: boolean;
}

export default function KycDocField({
  label,
  hint,
  currentUrl,
  pendingUrl,
  onUploaded,
  disabled,
}: KycDocFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayed = pendingUrl ?? currentUrl;

  const onPick = () => fileRef.current?.click();

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be 10 MB or smaller.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadFile(file, "kyc");
      onUploaded(uploaded.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-3 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold font-dm text-gray-900">{label}</p>
          {hint && (
            <p className="text-xs font-dm text-gray-500 mt-0.5">{hint}</p>
          )}
        </div>
        {displayed && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold font-dm shrink-0 ${
              pendingUrl ? "text-recommend-orange" : "text-recommend-green"
            }`}
          >
            <FileCheck2 size={14} />
            {pendingUrl ? "Ready to submit" : "On file"}
          </span>
        )}
      </div>

      {displayed && (
        <Link
          href={displayed}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1 text-xs font-dm text-gray-600 underline hover:text-recommend-orange"
        >
          View current file <ExternalLink size={11} />
        </Link>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf"
        onChange={onFilePicked}
        className="sr-only"
      />
      <button
        type="button"
        onClick={onPick}
        disabled={uploading || disabled}
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold font-dm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <Upload size={13} />
        {uploading
          ? "Uploading…"
          : displayed
            ? "Replace file"
            : "Upload file"}
      </button>

      {error && (
        <p className="text-xs font-dm text-red-600 bg-red-50 rounded-md p-2">
          {error}
        </p>
      )}
    </div>
  );
}
