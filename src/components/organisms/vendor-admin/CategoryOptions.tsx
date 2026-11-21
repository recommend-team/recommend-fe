"use client";

import { useCategoryOptions } from "@/hooks";
import { percentText } from "@/lib/categories";

/**
 * The categories, offered under a "What they sell" box. Picking one puts the vendor in
 * that category and at its rate; anything else typed leaves them in none, for sorting
 * on the Categories page.
 */
export default function CategoryOptions({ id }: { id: string }) {
  const options = useCategoryOptions();
  return (
    <datalist id={id}>
      {(options.data ?? []).map((option) => (
        <option key={option.id} value={option.name}>
          {`Recommend keeps ${percentText(option.feePercent)}`}
        </option>
      ))}
    </datalist>
  );
}

/** Shown beside the label: picking from the list is what links them to a category. */
export const CATEGORY_HINT = "Pick from the list";
