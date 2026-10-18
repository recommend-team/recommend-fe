import { fireEvent, render, screen } from "@testing-library/react";
import { ItemSheet } from "@/components/storefront/ItemSheet";
import {
  packDetails,
  parseCart,
  pricePack,
  toCheckoutLine,
  type PricedLine,
} from "@/lib/storefront-cart";
import type { Product } from "@/types";

jest.mock("@/components/storefront/ProductPhoto", () => ({ ProductPhoto: () => null }));

// Mama Tee's Kitchen, from PRODUCT_OPTIONS_PLAN.md.
const product = (over: Partial<Product>): Product => ({
  id: "p",
  name: "Item",
  description: null,
  price: 1000,
  imageUrl: null,
  isAvailable: true,
  isAddOn: false,
  unit: null,
  extraIds: [],
  choices: [],
  ...over,
});
const beef = product({ id: "beef", name: "Beef", price: 1000, isAddOn: true });
const takeaway = product({ id: "takeaway", name: "Takeaway pack", price: 200, isAddOn: true });
const water = product({ id: "water", name: "Water", price: 300, isAddOn: true });
const beans = product({
  id: "beans",
  name: "Rice and beans",
  price: 1000,
  unit: "portion",
  extraIds: ["beef", "takeaway", "water"],
});
const stew = product({
  id: "stew",
  name: "Rice and stew",
  price: 1500,
  unit: "portion",
  extraIds: ["water"],
  choices: [
    {
      id: "protein",
      name: "Choose your protein",
      required: true,
      minPick: 1,
      maxPick: 1,
      options: [
        { id: "chicken", name: "Chicken", priceDelta: 0, isAvailable: true },
        { id: "fish", name: "Fish", priceDelta: 300, isAvailable: true },
        { id: "goat", name: "Goat", priceDelta: 500, isAvailable: false },
      ],
    },
  ],
});
const MENU = [beans, stew, beef, takeaway, water];
const byId = new Map(MENU.map((p) => [p.id, p]));

describe("storefront packs — pricing", () => {
  it("prices Ada's pack: (portions × price + extras) × packs", () => {
    const priced = pricePack(
      beans,
      {
        quantity: 2,
        packs: 2,
        extras: [
          { productId: "beef", quantity: 2 },
          { productId: "takeaway", quantity: 1 },
        ],
      },
      byId
    );
    // One pack: 2 × 1,000 + 2 × 1,000 + 200 = 4,200. Two packs: 8,400.
    expect(priced.packTotal).toBe(4200);
    expect(priced.lineTotal).toBe(8400);
    expect(priced.problem).toBeNull();
  });

  it("adds an option's cost per portion, and flags a required choice left unanswered", () => {
    expect(
      pricePack(stew, { quantity: 2, choices: [{ groupId: "protein", optionIds: ["fish"] }] }, byId)
        .lineTotal
    ).toBe(3600);
    expect(pricePack(stew, { quantity: 2 }, byId).problem).toBe("Choose your protein — pick one");
  });

  it("drops an extra the dish no longer offers, and a sold-out option needs picking again", () => {
    const priced = pricePack(
      stew,
      {
        quantity: 1,
        extras: [{ productId: "beef", quantity: 1 }],
        choices: [{ groupId: "protein", optionIds: ["goat"] }],
      },
      byId
    );
    expect(priced.extras).toEqual([]);
    expect(priced.problem).toMatch(/pick one/);
  });

  it("sends a pack whole to checkout, with the prices the buyer saw", () => {
    const item: PricedLine = {
      key: "k",
      line: { key: "k", productId: "beans", quantity: 2, packs: 2 },
      product: beans,
      isPack: true,
      ...pricePack(beans, { quantity: 2, packs: 2, extras: [{ productId: "beef", quantity: 2 }] }, byId),
    };
    expect(toCheckoutLine(item)).toEqual({
      productId: "beans",
      quantity: 2,
      expectedUnitPrice: 1000,
      packs: 2,
      extras: [{ productId: "beef", quantity: 2, expectedUnitPrice: 1000 }],
      choices: [],
    });
    expect(packDetails(item)).toEqual(["2 portions each", "+ Beef ×2"]);
  });

  it("reads a cart saved before packs as plain lines", () => {
    expect(parseCart(JSON.stringify([{ productId: "jollof", quantity: 3 }]))).toEqual([
      { key: "jollof", productId: "jollof", quantity: 3 },
    ]);
    // A pack past the limits is not trusted.
    expect(
      parseCart(JSON.stringify([{ key: "a", productId: "beans", quantity: 2, packs: 99 }]))
    ).toEqual([]);
  });
});

describe("storefront packs — the builder", () => {
  const open = (over: Partial<React.ComponentProps<typeof ItemSheet>> = {}) => {
    const props = {
      product: stew,
      products: MENU,
      storeName: "Mama Tee's Kitchen",
      inCart: 0,
      locked: null,
      etaText: "20–30 min",
      onSave: jest.fn(),
      onSavePack: jest.fn(),
      onRemove: jest.fn(),
      onClose: jest.fn(),
      ...over,
    };
    render(<ItemSheet {...props} />);
    return props;
  };

  it("won't add a dish until its required choice is answered", () => {
    const props = open();
    const add = screen.getByRole("button", { name: /Add to cart/ });

    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(add).toBeDisabled();
    expect(screen.getByRole("radio", { name: /Goat/ })).toBeDisabled();

    fireEvent.click(screen.getByRole("radio", { name: /Fish/ }));
    fireEvent.click(screen.getByRole("button", { name: "One more portion" }));
    fireEvent.click(screen.getByRole("button", { name: "One more Water" }));
    fireEvent.click(screen.getByRole("button", { name: "One more pack" }));

    // (1,500 + 300) × 2 + 300 = 3,900 a pack; two packs.
    expect(add).toHaveTextContent("₦7,800");
    fireEvent.click(add);
    expect(props.onSavePack).toHaveBeenCalledWith({
      productId: "stew",
      quantity: 2,
      packs: 2,
      extras: [{ productId: "water", quantity: 1 }],
      choices: [{ groupId: "protein", optionIds: ["fish"] }],
    });
  });

  it("shows an option's cost per portion", () => {
    open();
    expect(screen.getByText("+₦300 per portion")).toBeInTheDocument();
  });

  it("opens a pack from the cart as it was built, to change or remove", () => {
    const props = open({
      product: beans,
      editing: {
        key: "k1",
        productId: "beans",
        quantity: 3,
        packs: 1,
        extras: [{ productId: "beef", quantity: 2 }],
        choices: [],
      },
    });

    expect(screen.getByRole("group", { name: "portions" })).toHaveTextContent("3");
    expect(screen.getByRole("group", { name: "Beef" })).toHaveTextContent("2");
    fireEvent.click(screen.getByRole("button", { name: "One more Beef" }));
    fireEvent.click(screen.getByRole("button", { name: /Update cart/ }));
    expect(props.onSavePack).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 3, extras: [{ productId: "beef", quantity: 3 }] })
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(props.onRemove).toHaveBeenCalled();
  });

  it("stops each extra at 5 in a pack", () => {
    open({ product: beans });
    const more = screen.getByRole("button", { name: "One more Beef" });
    for (let i = 0; i < 7; i++) fireEvent.click(more);
    expect(screen.getByRole("group", { name: "Beef" })).toHaveTextContent("5");
    expect(more).toBeDisabled();
  });

  it("keeps the simple sheet for a product with nothing to build", () => {
    const props = open({ product: product({ id: "jollof", name: "Jollof" }) });
    fireEvent.click(screen.getByRole("button", { name: "One more Jollof" }));
    fireEvent.click(screen.getByRole("button", { name: /Add to cart/ }));
    expect(props.onSave).toHaveBeenCalledWith(2);
  });
});
