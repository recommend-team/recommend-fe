import { act, fireEvent, render, screen } from "@testing-library/react";
import OrderBuilder from "@/components/organisms/OrderBuilder";
import type { CatalogProduct, ConversationDetail } from "@/types";

const place = jest.fn();

const stew: CatalogProduct = {
  id: "stew",
  name: "Rice and stew",
  description: null,
  price: 1500,
  imageUrl: null,
  vendorId: "v1",
  vendorName: "Mama Tee",
  vendorSlug: "mama-tee",
  isAddOn: false,
  unit: "portion",
  extras: [{ id: "water", name: "Water", price: 300 }],
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
      ],
    },
  ],
};
const moimoi: CatalogProduct = {
  ...stew,
  id: "moimoi",
  name: "Moi moi",
  price: 800,
  unit: null,
  extras: [],
  choices: [],
};

jest.mock("@/components/atoms/RemoteImage", () => ({
  RemoteImage: () => null,
}));
jest.mock("@/hooks", () => ({
  useCatalogAreas: () => ({
    data: { areaId: "a1", area: { id: "a1", name: "Ikeja" }, areas: [] },
  }),
  useCatalogCategories: () => ({ data: [] }),
  useCatalogStores: () => ({
    data: [
      {
        id: "v1",
        name: "Mama Tee",
        category: "Food",
        isOpen: true,
        logoUrl: null,
      },
    ],
    isFetching: false,
  }),
  useCatalogProducts: () => ({ data: [stew, moimoi], isFetching: false }),
  usePlaceConversationOrder: () => ({ mutateAsync: place, isPending: false }),
  useSetConversationArea: () => ({ mutateAsync: jest.fn() }),
}));

const conversation = {
  id: "c1",
  buyerName: "Ada",
  buyerPhone: "+2348031234567",
} as ConversationDetail;

describe("OrderBuilder — packs", () => {
  beforeEach(() => {
    place.mockReset().mockResolvedValue({
      reference: "REC-1",
      totalAmount: 5400,
      authorizationUrl: "https://pay",
      sent: true,
    });
    render(<OrderBuilder conversation={conversation} />);
    fireEvent.click(screen.getByText("Order for this buyer"));
    fireEvent.click(screen.getByText("Mama Tee"));
  });

  it("builds a dish as a pack, with its required choice and extras", async () => {
    fireEvent.click(screen.getByText("Rice and stew"));
    const add = screen.getByRole("button", { name: /^Add ·/ });
    expect(add).toBeDisabled();

    fireEvent.click(screen.getByRole("radio", { name: /Fish/ }));
    fireEvent.click(
      screen.getByRole("button", { name: "One more — portions" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "One more — Water" }));
    // (1,500 + 300) × 2 + 300.
    expect(add).toHaveTextContent("₦3,900");
    fireEvent.click(add);

    expect(
      screen.getByText(/2 portions · Protein: Fish · \+ Water ×1/),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "One more pack of Rice and stew" }),
    );
    fireEvent.click(screen.getByText("Moi moi"));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Place order" }));
    });
    expect(place).toHaveBeenCalledWith({
      id: "c1",
      payload: expect.objectContaining({
        items: [
          {
            productId: "stew",
            quantity: 2,
            packs: 2,
            extras: [{ productId: "water", quantity: 1 }],
            choices: [{ groupId: "protein", optionIds: ["fish"] }],
          },
          { productId: "moimoi", quantity: 1 },
        ],
      }),
    });
  });

  it("opens a pack from the basket to change it", () => {
    fireEvent.click(screen.getByText("Rice and stew"));
    fireEvent.click(screen.getByRole("radio", { name: /Chicken/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Add ·/ }));

    fireEvent.click(screen.getByRole("button", { name: "Edit Rice and stew" }));
    fireEvent.click(screen.getByRole("radio", { name: /Fish/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Update ·/ }));

    expect(screen.getByText(/1 portion · Protein: Fish/)).toBeInTheDocument();
    expect(screen.queryByText(/Protein: Chicken/)).not.toBeInTheDocument();
  });
});
