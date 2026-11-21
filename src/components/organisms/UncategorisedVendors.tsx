"use client";

import { useState } from "react";
import Link from "next/link";
import { useAssignVendorsToCategory, useUncategorisedVendors } from "@/hooks";
import { percentText } from "@/lib/categories";
import type { Category, UncategorisedVendor } from "@/types";

/** Vendors per suggested category — so all the suggestions go in one request each. */
export function groupSuggestions(vendors: UncategorisedVendor[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const vendor of vendors) {
    if (!vendor.suggestedCategoryId) continue;
    groups.set(vendor.suggestedCategoryId, [
      ...(groups.get(vendor.suggestedCategoryId) ?? []),
      vendor.id,
    ]);
  }
  return groups;
}

/**
 * Vendors in no category yet — they pay the standard rate, and the assistant can't place
 * them. Each comes with the category their own description points at, when there is one;
 * an admin confirms it, or picks another.
 */
export default function UncategorisedVendors({
  categories,
  standardPercent,
}: {
  /** The active ones: where a vendor can be put. */
  categories: Category[];
  standardPercent: number;
}) {
  const list = useUncategorisedVendors();
  const assign = useAssignVendorsToCategory();
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const vendors = list.data ?? [];
  if (list.isLoading || vendors.length === 0) return null;

  const suggestions = groupSuggestions(vendors);
  const suggested = [...suggestions.values()].reduce((sum, ids) => sum + ids.length, 0);
  const pick = (vendor: UncategorisedVendor) =>
    chosen[vendor.id] ?? vendor.suggestedCategoryId ?? "";

  const run = async (work: () => Promise<unknown>) => {
    setError(null);
    try {
      await work();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't move them.");
    }
  };

  const acceptAll = () =>
    run(async () => {
      for (const [categoryId, vendorIds] of suggestions) {
        await assign.mutateAsync({ categoryId, vendorIds });
      }
    });

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 font-dm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Needs a category · {vendors.length}
          </h2>
          <p className="text-xs text-gray-600">
            These vendors pay the standard {percentText(standardPercent)} until they&apos;re
            in a category. Anyone who ends up paying more is told.
          </p>
        </div>
        {suggested > 0 && (
          <button
            type="button"
            onClick={() => void acceptAll()}
            disabled={assign.isPending}
            className="h-9 rounded-full bg-recommend-green px-4 text-xs font-bold text-white hover:bg-recommend-green-hover disabled:opacity-40"
          >
            Accept {suggested} suggestion{suggested === 1 ? "" : "s"}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <ul className="flex flex-col divide-y divide-amber-100">
        {vendors.map((vendor) => (
          <li key={vendor.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
            <span className="min-w-0 flex-1">
              <Link
                href={`/admin/vendors/${vendor.id}`}
                className="font-bold text-gray-900 hover:underline"
              >
                {vendor.businessName || "Unnamed store"}
              </Link>
              <span className="ml-2 text-xs text-gray-500">
                {vendor.businessCategory
                  ? `wrote "${vendor.businessCategory}"`
                  : "didn't say what they sell"}
              </span>
            </span>
            <select
              value={pick(vendor)}
              onChange={(event) =>
                setChosen((current) => ({ ...current, [vendor.id]: event.target.value }))
              }
              aria-label={`Category for ${vendor.businessName || "this vendor"}`}
              className="h-8 rounded-full border border-gray-200 bg-white px-3 text-xs"
            >
              <option value="">Choose a category…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} · {percentText(category.feePercent)}
                  {category.id === vendor.suggestedCategoryId ? " (suggested)" : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!pick(vendor) || assign.isPending}
              onClick={() =>
                void run(() =>
                  assign.mutateAsync({ categoryId: pick(vendor), vendorIds: [vendor.id] })
                )
              }
              className="h-8 rounded-full bg-recommend-green px-3 text-xs font-bold text-white disabled:opacity-40"
            >
              Move
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
