import { earningsOf, rateOf } from "@/lib/earnings";
import type { AdminTransactionSummary } from "@/types";

type Vendor = AdminTransactionSummary["vendors"][number];

const vendor = (over: Partial<Vendor>): Vendor => ({
  orderId: "o1",
  vendorId: "v1",
  vendorName: "Jollof Pot",
  status: "PAID",
  subtotal: 6000,
  vendorAmount: 4500,
  platformFee: 1500,
  feePercent: 25,
  items: [],
  ...over,
});

const payment = (
  vendors: Vendor[],
  status: AdminTransactionSummary["status"] = "PAID"
): AdminTransactionSummary =>
  ({ status, deliveryFee: 1500, vendors }) as unknown as AdminTransactionSummary;

describe("who gets what from a payment", () => {
  it("adds up what the vendors are owed and what Recommend keeps — never the delivery fee", () => {
    const earnings = earningsOf(
      payment([
        vendor({}),
        vendor({
          orderId: "o2",
          vendorName: "Buka",
          subtotal: 4500,
          vendorAmount: 3600,
          platformFee: 900,
          feePercent: 20,
        }),
      ])
    );

    expect(earnings).toMatchObject({
      vendorsGet: 8100,
      recommendKeeps: 2400,
      rateText: "mixed",
      state: "earned",
    });
    expect(earnings.byVendor).toEqual([
      { name: "Jollof Pot", amount: 4500 },
      { name: "Buka", amount: 3600 },
    ]);
  });

  it("shows the one rate when every vendor paid it", () => {
    expect(earningsOf(payment([vendor({})])).rateText).toBe("25%");
  });

  it("leaves out a vendor order cancelled inside a basket that went ahead", () => {
    const earnings = earningsOf(
      payment([vendor({}), vendor({ orderId: "o2", status: "CANCELLED", platformFee: 900 })])
    );
    expect(earnings.recommendKeeps).toBe(1500);
  });

  it("marks unpaid money as expected, and cancelled or refunded money as void", () => {
    expect(earningsOf(payment([vendor({})], "PENDING_PAYMENT")).state).toBe("expected");
    expect(earningsOf(payment([vendor({})], "REFUNDED"))).toMatchObject({
      state: "void",
      recommendKeeps: 1500,
    });
  });

  it("works out the rate of an older order that never recorded one", () => {
    expect(rateOf(vendor({ feePercent: null, subtotal: 1000, platformFee: 200 }))).toBe(20);
    expect(rateOf(vendor({ feePercent: null, subtotal: 0, platformFee: 0 }))).toBeNull();
  });
});
