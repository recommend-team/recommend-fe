import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import VendorRateCard from "@/components/organisms/VendorRateCard";
import { describeVendorRateChange, rateBasisText } from "@/lib/categories";
import type { VendorRate } from "@/types";

const setRate = jest.fn();
const confirm = jest.fn();
let role = "ADMIN";
let rate: VendorRate;

jest.mock("@/hooks", () => ({
  useCurrentUser: () => ({ data: { id: "me", role } }),
  useVendorRate: () => ({ data: rate, isError: false }),
  useSetVendorRate: () => ({ mutateAsync: setRate, isPending: false }),
}));
jest.mock("@/components/organisms/DialogProvider", () => ({
  useConfirm: () => confirm,
}));

beforeEach(() => {
  role = "ADMIN";
  rate = {
    percent: 25,
    basis: "CATEGORY",
    categoryId: "cat-food",
    categoryName: "Restaurant",
    categoryPercent: 25,
    customPercent: null,
    standardPercent: 20,
    history: [],
  };
  setRate.mockReset().mockResolvedValue({});
  confirm.mockReset().mockResolvedValue(true);
});

describe("a vendor's rate, in words", () => {
  it("says where it comes from", () => {
    expect(rateBasisText(rate)).toBe("Restaurant's rate");
    expect(rateBasisText({ ...rate, basis: "CUSTOM" })).toBe(
      "Their own rate · Restaurant is 25%"
    );
    expect(
      rateBasisText({ ...rate, basis: "STANDARD", categoryName: null, categoryPercent: null })
    ).toBe("The standard rate — they're in no category yet");
  });

  it("tells the history of their own rate", () => {
    const change = { id: "r", createdAt: "", changedByName: "Ada O." };
    expect(describeVendorRateChange({ ...change, previousPercent: null, newPercent: 12 })).toBe(
      "Ada O. gave them their own rate of 12%"
    );
    expect(describeVendorRateChange({ ...change, previousPercent: 12, newPercent: null })).toBe(
      "Ada O. removed their own rate of 12%, so their category's applies"
    );
  });
});

describe("the fee card", () => {
  it("shows an admin the rate, but no way to change it", () => {
    render(<VendorRateCard vendorId="v1" />);

    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("Restaurant's rate")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /own rate/ })).not.toBeInTheDocument();
  });

  it("lets the Super Admin give them their own rate", async () => {
    role = "SUPER_ADMIN";
    render(<VendorRateCard vendorId="v1" />);

    fireEvent.click(screen.getByRole("button", { name: "Give them their own rate" }));
    fireEvent.change(screen.getByLabelText("Their own rate"), { target: { value: "12" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(setRate).toHaveBeenCalledWith({ vendorId: "v1", feePercent: 12 }));
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringMatching(/keep 12% of their sales/) })
    );
  });

  it("warns that removing a lower rate of their own means telling them it went up", async () => {
    role = "SUPER_ADMIN";
    rate = { ...rate, basis: "CUSTOM", percent: 12, customPercent: 12 };
    render(<VendorRateCard vendorId="v1" />);

    fireEvent.click(screen.getByRole("button", { name: "Remove their own rate" }));

    await waitFor(() =>
      expect(setRate).toHaveBeenCalledWith({ vendorId: "v1", feePercent: null })
    );
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringMatching(/keep 25%.*told it went up/) })
    );
  });
});
