import type { CategoryRateChange, RateBasis } from "@/types";

/** "hair, wig\nbraids" → ["hair", "wig", "braids"]: commas or new lines, blanks dropped. */
export function parseWords(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[,\n]/)
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];
}

/** 25 → "25%", 7.5 → "7.5%". */
export function percentText(value: number): string {
  return `${Number(value.toFixed(2))}%`;
}

/** One change to a category's rate as a sentence: who moved it from what to what. */
export function describeRateChange(change: CategoryRateChange): string {
  const who = change.changedByName ?? "Recommend";
  const to = change.newPercent === null ? "—" : percentText(change.newPercent);
  return change.previousPercent === null
    ? `${who} started it at ${to}`
    : `${who} changed it from ${percentText(change.previousPercent)} to ${to}`;
}

/** One change to a vendor's own rate as a sentence. */
export function describeVendorRateChange(change: CategoryRateChange): string {
  const who = change.changedByName ?? "Recommend";
  if (change.newPercent === null) {
    const was =
      change.previousPercent === null ? "" : ` of ${percentText(change.previousPercent)}`;
    return `${who} removed their own rate${was}, so their category's applies`;
  }
  return change.previousPercent === null
    ? `${who} gave them their own rate of ${percentText(change.newPercent)}`
    : `${who} changed their own rate from ${percentText(change.previousPercent)} to ${percentText(change.newPercent)}`;
}

/** Where a vendor's rate comes from, in a few words. */
export function rateBasisText(rate: {
  basis: RateBasis;
  categoryName: string | null;
  categoryPercent: number | null;
  standardPercent: number;
}): string {
  if (rate.basis === "CUSTOM") {
    return rate.categoryName && rate.categoryPercent !== null
      ? `Their own rate · ${rate.categoryName} is ${percentText(rate.categoryPercent)}`
      : `Their own rate · the standard is ${percentText(rate.standardPercent)}`;
  }
  if (rate.basis === "CATEGORY") return `${rate.categoryName}'s rate`;
  return "The standard rate — they're in no category yet";
}
