"use client";

/**
 * The pieces every vendor-admin form shares: a labelled field, the input style, the
 * error line and the Cancel / Save row — so the dialogs read the same.
 */

export const INPUT =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-dm text-sm focus:border-recommend-green focus:outline-none focus:ring-1 focus:ring-recommend-green";

export const TEXTAREA =
  "w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 font-dm text-sm focus:border-recommend-green focus:outline-none focus:ring-1 focus:ring-recommend-green";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 font-dm text-sm font-bold text-gray-700">
      <span>
        {label} {hint && <span className="font-normal text-gray-400">{hint}</span>}
      </span>
      {children}
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-red-50 p-3 font-dm text-sm text-red-600">
      {message}
    </p>
  );
}

export function FormActions({
  onCancel,
  saving,
  label = "Save",
  disabled = false,
}: {
  onCancel: () => void;
  saving: boolean;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 pt-1">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full px-4 py-2 font-dm text-sm font-bold text-gray-600 hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving || disabled}
        className="rounded-full bg-recommend-green px-5 py-2 font-dm text-sm font-bold text-white hover:bg-recommend-green-hover disabled:opacity-50"
      >
        {saving ? "Saving…" : label}
      </button>
    </div>
  );
}

/**
 * Only what the admin actually changed. The server logs and tells the vendor about each
 * field sent, so sending the whole form would report changes nobody made.
 */
export function changed<T extends Record<string, unknown>>(
  before: Partial<Record<keyof T, unknown>>,
  after: T
): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(after) as (keyof T)[]) {
    const was = before[key] ?? null;
    const now = after[key] ?? null;
    if (JSON.stringify(was) !== JSON.stringify(now)) out[key] = after[key];
  }
  return out;
}
