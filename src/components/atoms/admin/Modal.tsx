"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";

/**
 * A dialog shell for admin forms — the same look as `DialogProvider`'s confirm and prompt,
 * for content they can't hold (a rider picker, a form). Closes on Escape, the backdrop or ✕.
 */
export default function Modal({
  title,
  description,
  onClose,
  children,
  width = "max-w-md",
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:p-7 ${width}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h2 id={titleId} className="mb-1 pr-6 font-dm text-lg font-bold text-gray-900">
          {title}
        </h2>
        {description && <p className="mb-4 font-dm text-sm text-gray-600">{description}</p>}
        {children}
      </div>
    </div>
  );
}
