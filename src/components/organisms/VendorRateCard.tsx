"use client";

import { useState, type FormEvent } from "react";
import { History, Percent } from "lucide-react";
import { useCurrentUser, useSetVendorRate, useVendorRate } from "@/hooks";
import { useConfirm } from "@/components/organisms/DialogProvider";
import { describeVendorRateChange, percentText, rateBasisText } from "@/lib/categories";

function when(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * What Recommend keeps of this vendor's sales, and why. The Super Admin can agree a rate
 * of the vendor's own, or remove it so their category's applies again.
 */
export default function VendorRateCard({ vendorId }: { vendorId: string }) {
  const { data: me } = useCurrentUser();
  const isSuperAdmin = me?.role === "SUPER_ADMIN";
  const rate = useVendorRate(vendorId);
  const setRate = useSetVendorRate();
  const confirm = useConfirm();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = rate.data;

  const save = async (next: number | null) => {
    if (!data) return;
    setError(null);
    const fallback = data.categoryPercent ?? data.standardPercent;
    const after = next ?? fallback;
    const ok = await confirm({
      title:
        next === null
          ? `Remove their own rate of ${percentText(data.percent)}?`
          : `Give them their own rate of ${percentText(next)}?`,
      message:
        `Recommend will keep ${percentText(after)} of their sales from their next order` +
        (after > data.percent ? ", and they'll be told it went up." : ".") +
        " Orders already placed are not affected.",
      confirmLabel: next === null ? "Remove" : `Set ${percentText(next)}`,
    });
    if (!ok) return;
    try {
      await setRate.mutateAsync({ vendorId, feePercent: next });
      setEditing(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't change their rate.");
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = Number(value);
    if (value.trim() === "" || !Number.isFinite(next)) {
      setError("Enter the percentage as a number, like 10.");
      return;
    }
    void save(next);
  };

  return (
    <section className="rounded-2xl border border-[#FFD91D] bg-white p-5 font-dm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Recommend&apos;s fee</h2>
          <p className="text-xs text-gray-500">
            {data ? rateBasisText(data) : rate.isError ? "Couldn't load their rate." : "Loading…"}
          </p>
        </div>
        {data && (
          <p className="text-2xl font-bold text-recommend-green">{percentText(data.percent)}</p>
        )}
      </div>

      {data && editing && (
        <form onSubmit={submit} className="mt-3 flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-gray-700">Their own rate (%)</span>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              inputMode="decimal"
              aria-label="Their own rate"
              className="h-10 w-28 rounded-lg border border-gray-200 px-3 outline-none focus:border-recommend-green"
            />
          </label>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="h-10 rounded-full px-4 text-sm font-semibold text-gray-600 hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={setRate.isPending}
            className="h-10 rounded-full bg-recommend-green px-5 text-sm font-bold text-white hover:bg-recommend-green-hover disabled:opacity-40"
          >
            Save
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {data && !editing && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                setValue(String(data.customPercent ?? data.percent));
                setError(null);
                setEditing(true);
              }}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-gray-700 hover:bg-black/5"
            >
              <Percent size={14} />
              {data.basis === "CUSTOM" ? "Change their rate" : "Give them their own rate"}
            </button>
          )}
          {isSuperAdmin && data.basis === "CUSTOM" && (
            <button
              type="button"
              onClick={() => void save(null)}
              disabled={setRate.isPending}
              className="inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold text-gray-700 hover:bg-black/5 disabled:opacity-50"
            >
              Remove their own rate
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowHistory((shown) => !shown)}
            aria-expanded={showHistory}
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-gray-700 hover:bg-black/5"
          >
            <History size={14} />
            {showHistory ? "Hide history" : "Rate history"}
          </button>
        </div>
      )}

      {data && showHistory && (
        <div className="mt-2 rounded-xl bg-black/[0.03] px-3 py-2">
          {data.history.length === 0 ? (
            <p className="text-xs text-gray-500">
              They have never had a rate of their own.
            </p>
          ) : (
            <ol className="flex flex-col gap-1.5">
              {data.history.map((change) => (
                <li key={change.id} className="text-xs text-gray-700">
                  <span className="text-gray-400">{when(change.createdAt)} · </span>
                  {describeVendorRateChange(change)}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
