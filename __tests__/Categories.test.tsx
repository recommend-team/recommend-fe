import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CategoriesPage from "@/app/admin/(guarded)/categories/page";
import { describeRateChange, parseWords, percentText } from "@/lib/categories";
import { staffCanOpen } from "@/lib/staff-access";
import type { Category, UncategorisedVendor } from "@/types";

const create = jest.fn();
const update = jest.fn();
const changeRate = jest.fn();
const confirm = jest.fn();
const assign = jest.fn();
let uncategorised: UncategorisedVendor[] = [];
let role = "ADMIN";
let categories: Category[] = [];

jest.mock("@/hooks", () => ({
  useCurrentUser: () => ({ data: { id: "me", role } }),
  useCategories: () => ({
    data: { categories, standardPercent: 20, uncategorisedVendors: 3 },
    isLoading: false,
    isError: false,
  }),
  useCategoryRateHistory: () => ({ data: [], isLoading: false }),
  useCreateCategory: () => ({ mutateAsync: create, isPending: false }),
  useUpdateCategory: () => ({ mutateAsync: update, isPending: false }),
  useChangeCategoryRate: () => ({ mutateAsync: changeRate, isPending: false }),
  useUncategorisedVendors: () => ({ data: uncategorised, isLoading: false }),
  useAssignVendorsToCategory: () => ({ mutateAsync: assign, isPending: false }),
}));
jest.mock("@/components/organisms/DialogProvider", () => ({
  useConfirm: () => confirm,
}));

const category = (over: Partial<Category> = {}): Category => ({
  id: "cat-beauty",
  name: "Beauty",
  feePercent: 20,
  keywords: ["hair", "wig"],
  isActive: true,
  vendorCount: 4,
  createdAt: "2026-11-01T00:00:00Z",
  updatedAt: "2026-11-01T00:00:00Z",
  ...over,
});

beforeEach(() => {
  role = "ADMIN";
  categories = [category()];
  create.mockReset().mockResolvedValue({});
  update.mockReset().mockResolvedValue({});
  changeRate.mockReset().mockResolvedValue({});
  confirm.mockReset().mockResolvedValue(true);
  assign.mockReset().mockResolvedValue({ moved: 1 });
  uncategorised = [];
});

describe("reading categories", () => {
  it("reads words typed with commas or on new lines", () => {
    expect(parseWords("Dog food, cat litter\nleash,, dog food ")).toEqual([
      "dog food",
      "cat litter",
      "leash",
    ]);
  });

  it("writes rates and their history plainly", () => {
    expect(percentText(25)).toBe("25%");
    expect(percentText(7.5)).toBe("7.5%");
    expect(
      describeRateChange({
        id: "r",
        createdAt: "",
        previousPercent: 20,
        newPercent: 10,
        changedByName: "Ada O.",
      })
    ).toBe("Ada O. changed it from 20% to 10%");
    expect(
      describeRateChange({
        id: "r",
        createdAt: "",
        previousPercent: null,
        newPercent: 20,
        changedByName: null,
      })
    ).toBe("Recommend started it at 20%");
  });
});

describe("an admin", () => {
  it("sees each category's rate and vendors, but can't change the rate", () => {
    render(<CategoriesPage />);

    expect(screen.getByText("Beauty")).toBeInTheDocument();
    expect(screen.getByText("4 vendors")).toBeInTheDocument();
    expect(screen.getByText(/3 vendors aren't in a category yet/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Change rate/ })).not.toBeInTheDocument();
  });

  it("creates a category at the standard rate, with its words", async () => {
    render(<CategoriesPage />);

    fireEvent.click(screen.getByRole("button", { name: /New category/ }));
    expect(screen.getByText("20% to start")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Pets"), { target: { value: "Pets" } });
    fireEvent.change(screen.getByPlaceholderText(/dog food/), {
      target: { value: "Dog food, cat litter" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create category" }));

    await waitFor(() =>
      expect(create).toHaveBeenCalledWith({
        name: "Pets",
        keywords: ["dog food", "cat litter"],
        feePercent: undefined,
      })
    );
  });

  it("archives a category after saying its vendors keep selling", async () => {
    render(<CategoriesPage />);

    fireEvent.click(screen.getByRole("button", { name: /Archive/ }));

    await waitFor(() =>
      expect(update).toHaveBeenCalledWith({ id: "cat-beauty", changes: { isActive: false } })
    );
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringMatching(/keep selling, at 20%/) })
    );
  });
});

describe("the Super Admin", () => {
  beforeEach(() => {
    role = "SUPER_ADMIN";
  });

  it("changes a rate after confirming what it applies to", async () => {
    render(<CategoriesPage />);

    fireEvent.click(screen.getByRole("button", { name: /Change rate/ }));
    fireEvent.change(screen.getByLabelText("New percentage for Beauty"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Change rate" }));

    await waitFor(() =>
      expect(changeRate).toHaveBeenCalledWith({ id: "cat-beauty", feePercent: 10 })
    );
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Change Beauty from 20% to 10%?",
        message: expect.stringMatching(/Orders already placed stay at 20%/),
      })
    );
  });

  it("can create a category at its own rate", async () => {
    render(<CategoriesPage />);

    fireEvent.click(screen.getByRole("button", { name: /New category/ }));
    fireEvent.change(screen.getByPlaceholderText("Pets"), { target: { value: "Gadgets 2" } });
    fireEvent.change(screen.getByPlaceholderText("20"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Create category" }));

    await waitFor(() =>
      expect(create).toHaveBeenCalledWith(expect.objectContaining({ feePercent: 3 }))
    );
  });
});

it("is closed to customer service", () => {
  expect(staffCanOpen("SUPPORT", "/admin/categories")).toBe(false);
  expect(staffCanOpen("ADMIN", "/admin/categories")).toBe(true);
});

describe("vendors in no category", () => {
  const stray = (over: Partial<UncategorisedVendor>): UncategorisedVendor => ({
    id: "v1",
    businessName: "Ada Hair",
    businessCategory: "Hair & wigs",
    status: "APPROVED",
    suggestedCategoryId: "cat-beauty",
    suggestedCategoryName: "Beauty",
    ...over,
  });

  it("lists them with what they wrote, and the suggested category picked", () => {
    uncategorised = [stray({})];
    render(<CategoriesPage />);

    expect(screen.getByText("Needs a category · 1")).toBeInTheDocument();
    expect(screen.getByText('wrote "Hair & wigs"')).toBeInTheDocument();
    expect(screen.getByLabelText("Category for Ada Hair")).toHaveValue("cat-beauty");
  });

  it("moves one vendor to the category chosen", async () => {
    uncategorised = [stray({})];
    render(<CategoriesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Move" }));

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith({ categoryId: "cat-beauty", vendorIds: ["v1"] })
    );
  });

  it("accepts every suggestion, one request per category", async () => {
    uncategorised = [
      stray({ id: "v1" }),
      stray({ id: "v2" }),
      stray({ id: "v3", suggestedCategoryId: null, suggestedCategoryName: null }),
    ];
    render(<CategoriesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Accept 2 suggestions" }));

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith({ categoryId: "cat-beauty", vendorIds: ["v1", "v2"] })
    );
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("shows nothing when every vendor has a category", () => {
    render(<CategoriesPage />);
    expect(screen.queryByText(/Needs a category/)).not.toBeInTheDocument();
  });
});
