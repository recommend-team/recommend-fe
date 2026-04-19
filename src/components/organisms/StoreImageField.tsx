"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadFile } from "@/services";

interface StoreImageFieldProps {
  label: string;
  hint?: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  aspect?: "square" | "banner";
}

export default function StoreImageField({
  label,
  hint,
  value,
  onChange,
  aspect = "square",
}: StoreImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be 10 MB or smaller.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadFile(file, "profile");
      onChange(uploaded.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-bold font-dm text-gray-700">{label}</p>
        {hint && <p className="text-xs font-dm text-gray-500">{hint}</p>}
      </div>
      <div
        className={`relative ${aspect === "banner" ? "aspect-[3/1]" : "aspect-square"} w-full rounded-xl border-2 border-dashed overflow-hidden ${
          value ? "border-[#FFD91D]" : "border-gray-200"
        }`}
      >
        {value ? (
          <Image src={value} alt={label} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-400">
            <Upload size={20} />
            <span className="text-xs font-dm">No image yet</span>
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
            title="Remove"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="sr-only"
      />
      <button
        type="button"
        onClick={onPick}
        disabled={uploading}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold font-dm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
      </button>
      {error && (
        <p className="text-xs font-dm text-red-600 bg-red-50 rounded-md p-2">
          {error}
        </p>
      )}
    </div>
  );
}
