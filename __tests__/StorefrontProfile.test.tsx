import { render, screen, within } from "@testing-library/react";
import {
  clockText,
  displayPhone,
  memberSinceText,
  openUntilText,
  opensText,
  phoneHref,
  sellsFood,
  weekRows,
  whatsappHref,
} from "@/lib/storefront-profile";
import type { Product, StorefrontData } from "@/types";

jest.mock("next/navigation", () => ({ useParams: () => ({ slug: "mama-ngozi" }) }));
jest.mock("@/components/atoms/RemoteImage", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  RemoteImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
jest.mock("@/components/storefront/ProductPhoto", () => ({ ProductPhoto: () => null }));

let storefront: StorefrontData;
jest.mock("@/hooks", () => ({
  useStorefront: () => ({ data: storefront, isLoading: false, error: null }),
}));

import StorefrontPage from "@/app/store/[slug]/page";

// Thursday 19 November 2026, 10pm in Lagos.
const THURSDAY_NIGHT = new Date("2026-11-19T22:00:00+01:00");

const week = {
  monday: { isOpen: true, open: "12:00", close: "21:00" },
  tuesday: { isOpen: true, open: "12:00", close: "21:00" },
  wednesday: { isOpen: true, open: "12:00", close: "21:00" },
  thursday: { isOpen: true, open: "12:00", close: "21:00" },
  friday: { isOpen: true, open: "12:00", close: "22:30" },
  saturday: { isOpen: true, open: "00:00", close: "00:00" },
  sunday: { isOpen: false, open: "00:00", close: "00:00" },
};

describe("storefront profile helpers", () => {
  it("opens a WhatsApp chat with the vendor, saying where the buyer came from", () => {
    const href = whatsappHref("08012345678", "Mama Ngozi Kitchen");
    expect(href).toBe(
      "https://wa.me/2348012345678?text=" +
        encodeURIComponent("Hi Mama Ngozi Kitchen, I found your shop on Recommend.")
    );
    expect(whatsappHref("+234 801 234 5678", "X")).toContain("wa.me/2348012345678");
    expect(whatsappHref(null, "X")).toBeNull();
    expect(whatsappHref("12345", "X")).toBeNull();
  });

  it("writes and dials a Nigerian number the usual way", () => {
    expect(displayPhone("+2348012345678")).toBe("+234 801 234 5678");
    expect(phoneHref("0801 234 5678")).toBe("tel:+2348012345678");
  });

  it("reads clock times as people say them", () => {
    expect(clockText("09:00")).toBe("9am");
    expect(clockText("21:30")).toBe("9:30pm");
    expect(clockText("12:00")).toBe("noon");
    expect(clockText("00:00")).toBe("midnight");
  });

  it("says when a closed shop opens, in Lagos time", () => {
    expect(opensText("2026-11-20T11:00:00.000Z", THURSDAY_NIGHT)).toBe("Opens tomorrow at noon");
    expect(opensText("2026-11-23T11:00:00.000Z", THURSDAY_NIGHT)).toBe("Opens Monday at noon");
    expect(opensText(null, THURSDAY_NIGHT)).toBe("Not taking orders for now");
    expect(openUntilText("2026-11-19T20:00:00.000Z")).toBe("Open until 9pm");
  });

  it("lays out the week from Monday with today marked", () => {
    const rows = weekRows(week, THURSDAY_NIGHT)!;
    expect(rows.map((row) => row.day)).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]);
    expect(rows.find((row) => row.today)?.day).toBe("Thursday");
    expect(rows[4].text).toBe("noon – 10:30pm");
    expect(rows[5].text).toBe("Open all day");
    expect(rows[6]).toMatchObject({ text: "Closed", closed: true });
    expect(weekRows(null, THURSDAY_NIGHT)).toBeNull();
  });

  it("knows a kitchen from a shop, and when someone joined", () => {
    expect(sellsFood("Restaurant")).toBe(true);
    expect(sellsFood("Barbecue, food")).toBe(true);
    expect(sellsFood("Gadgets")).toBe(false);
    expect(memberSinceText("2026-03-04T10:00:00.000Z")).toBe("March 2026");
  });
});

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

const shop = (over: Partial<StorefrontData["vendor"]> = {}, products?: Product[]): StorefrontData => ({
  vendor: {
    id: "v1",
    businessName: "Mama Ngozi Kitchen",
    businessDescription: "Home-style Nigerian cooking served hot from noon.",
    businessCategory: "Restaurant",
    serviceAreas: [{ id: "a1", name: "Egbeda" }],
    businessLogoUrl: null,
    businessBannerUrl: null,
    whatsappNumber: "+2348012345678",
    ownerFirstName: "Ngozi",
    memberSince: "2026-03-04T10:00:00.000Z",
    isOpen: false,
    opensAt: "2026-11-20T11:00:00.000Z",
    closesAt: null,
    operatingHours: week,
    slug: "mama-ngozi",
    ...over,
  },
  products: products ?? [
    product({ id: "jollof", name: "Jollof Rice with Chicken", price: 3500, unit: "plate" }),
    product({ id: "suya", name: "Suya Platter", price: 3000 }),
  ],
  deliveryFee: 1500,
  pickupEnabled: true,
  deliveryEtaMinutes: 30,
});

describe("storefront page", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: THURSDAY_NIGHT, doNotFake: ["nextTick", "setImmediate"] });
  });
  afterEach(() => jest.useRealTimers());

  it("puts the person behind the shop, and a way to reach them, up front", () => {
    storefront = shop();
    render(<StorefrontPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Mama Ngozi Kitchen" })).toBeInTheDocument();
    expect(screen.getByText("Run by Ngozi")).toBeInTheDocument();
    expect(
      screen.getByText("Selling on Recommend since March 2026 · Replies on WhatsApp")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Message Ngozi/ })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/2348012345678")
    );
    expect(screen.getByRole("link", { name: /\+234 801 234 5678/ })).toHaveAttribute(
      "href",
      "tel:+2348012345678"
    );
    expect(screen.getByRole("heading", { name: "Talk to Ngozi" })).toBeInTheDocument();
  });

  it("says plainly when a closed shop opens, and shows the week", () => {
    storefront = shop();
    render(<StorefrontPage />);

    expect(screen.getByText("Closed · opens tomorrow at noon")).toBeInTheDocument();
    const today = screen.getByText("(today)").closest("div")!;
    expect(within(today).getByText("noon – 9pm")).toBeInTheDocument();
  });

  it("leaves out what it doesn't know rather than showing an empty button", () => {
    storefront = shop({ whatsappNumber: null, ownerFirstName: null, memberSince: null, operatingHours: null });
    render(<StorefrontPage />);

    expect(screen.queryByRole("link", { name: /Message/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/Run by/)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Opening hours/ })).not.toBeInTheDocument();
    // Still somewhere to ask: Recommend itself.
    expect(screen.getByRole("heading", { name: "Talk to Mama Ngozi Kitchen" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ask Recommend/ })).toBeInTheDocument();
  });

  it("shows a short menu as cards, and a long one as compact rows", () => {
    storefront = shop();
    const { unmount } = render(<StorefrontPage />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
    unmount();

    storefront = shop(
      { businessCategory: "Gadgets" },
      Array.from({ length: 13 }, (_, i) => product({ id: `phone-${i}`, name: `Phone ${i}` }))
    );
    render(<StorefrontPage />);
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("heading", { name: "In the shop" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Add Phone/ })).toHaveLength(13);
  });
});
