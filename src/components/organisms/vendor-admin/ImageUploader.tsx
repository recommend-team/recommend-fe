"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { RemoteImage } from "@/components/atoms/RemoteImage";
import { uploadFile } from "@/services";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

/**
 * Pick an image, upload it straight away, and hand back its address — a logo, a banner,
 * a product photo. The form saves the address with everything else; nothing changes on
 * the vendor until it does.
 */
export default function ImageUploader({
  label,
  value,
  onChange,
  folder,
  shape = "square",
  removable = false,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: "products" | "profile";
  /** A banner is wide; a logo or product photo square. */
  shape?: "square" | "wide";
  /**
   * Offer "Remove". Only for an image not yet saved: once saved, a vendor's image can be
   * replaced but not cleared.
   */
  removable?: boolean;
}) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Choose an image — JPG, PNG, WEBP or GIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is over 10 MB. Choose a smaller one.");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadFile(file, folder);
      onChange(uploaded.secureUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  };

  const box =
    shape === "wide" ? "aspect-[3/1] w-full" : "h-28 w-28";

  return (
    <div className="flex flex-col gap-1.5 font-dm">
      <label htmlFor={inputId} className="text-sm font-bold text-gray-700">
        {label}
      </label>
      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading}
          aria-label={value ? `Change ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
          className={`relative shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-recommend-green hover:text-recommend-green ${box}`}
        >
          {value ? (
            <RemoteImage src={value} alt="" fill className="object-cover" />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-bold">
              <ImagePlus size={20} />
              Upload
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-recommend-green">
              <Loader2 size={20} className="animate-spin" />
            </span>
          )}
        </button>
        {removable && value && !uploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-red-600"
          >
            <Trash2 size={12} /> Remove
          </button>
        )}
      </div>
      <input
        ref={input}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => void pick(event.target.files?.[0])}
      />
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </div>
  );
}
