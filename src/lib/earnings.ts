import type { AdminTransactionSummary } from "@/types";

type VendorShare = AdminTransactionSummary["vendors"][number];

/**
 * Earned: paid for. Expected: not paid yet, so nobody has earned it. Void: cancelled or
 * refunded, so nobody ever will.
 */
export type EarningsState = "earned" | "expected" | "void";

export interface Earnings {
  /** What the vendors are owed, together. */
  vendorsGet: number;
  /** Recommend's cut of the items. Never the delivery fee. */
  recommendKeeps: number;
  /** "20%", or "mixed" when the vendors were charged different rates. */
  rateText: string | null;
  state: EarningsState;
  /** Each vendor's share, for a basket from more than one. */
  byVendor: { name: string; amount: number }[];
}

const VOID = new Set(["CANCELLED", "REFUNDED"]);

/** 25 → "25%", 7.5 → "7.5%". */
function percentText(value: number): string {
  return `${Number(value.toFixed(2))}%`;
}

/** The rate an order was charged at: as recorded, or worked out for older orders. */
export function rateOf(vendor: VendorShare): number | null {
  if (vendor.feePercent !== null && vendor.feePercent !== undefined) {
    return vendor.feePercent;
  }
  return vendor.subtotal > 0
    ? Math.round((vendor.platformFee / vendor.subtotal) * 10000) / 100
    : null;
}

/**
 * Who gets what from one payment. A vendor order cancelled inside a basket that went
 * ahead earned nothing, so it is left out — unless the whole payment is void, when the
 * figures are what would have been earned.
 */
export function earningsOf(transaction: AdminTransactionSummary): Earnings {
  const state: EarningsState = VOID.has(transaction.status)
    ? "void"
    : transaction.status === "PENDING_PAYMENT"
      ? "expected"
      : "earned";

  const counted =
    state === "void"
      ? transaction.vendors
      : transaction.vendors.filter((vendor) => !VOID.has(vendor.status));

  const rates = [
    ...new Set(
      counted.map(rateOf).filter((rate): rate is number => rate !== null)
    ),
  ];

  return {
    vendorsGet: counted.reduce((sum, vendor) => sum + vendor.vendorAmount, 0),
    recommendKeeps: counted.reduce((sum, vendor) => sum + vendor.platformFee, 0),
    rateText:
      rates.length === 0 ? null : rates.length === 1 ? percentText(rates[0]) : "mixed",
    state,
    byVendor: counted.map((vendor) => ({
      name: vendor.vendorName ?? "Unknown",
      amount: vendor.vendorAmount,
    })),
  };
}

/** Why a figure is grey or struck through, for its tooltip. */
export function earningsHint(state: EarningsState): string | undefined {
  if (state === "expected") return "Expected — not earned until the buyer pays";
  if (state === "void") return "Not earned — this payment was cancelled or refunded";
  return undefined;
}
