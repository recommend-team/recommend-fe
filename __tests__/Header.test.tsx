import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { LandingHeader } from "@/components/organisms/Header";
import GeneralHeader from "@/components/organisms/GeneralHeader";

jest.mock("@/lib/links", () => ({ CUSTOMER_APP_URL: "https://order.example" }));
jest.mock("next/image", () => ({
  __esModule: true,
  // `priority` and `fill` are next/image props an <img> would warn about.
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));
let pathname = "/";
jest.mock("next/navigation", () => ({ usePathname: () => pathname }));

const openMenu = () => act(() => screen.getByRole("button", { name: "Open menu" }).click());
const menu = () => screen.queryByRole("dialog", { name: "Menu" });

describe("LandingHeader", () => {
  beforeEach(() => {
    pathname = "/";
    document.body.style.overflow = "";
  });

  it("lays the desktop bar out as brand, links, then the way in", () => {
    render(<LandingHeader />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    const [brand, , action] = Array.from(nav.parentElement!.children);

    expect(within(brand as HTMLElement).getByRole("link")).toHaveAccessibleName("Recommend home");
    expect(within(nav).getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Vendor",
      "Rider",
      "About us",
      "Contact us",
    ]);
    expect(within(action as HTMLElement).getByRole("link", { name: /Start Ordering/ })).toHaveAttribute(
      "href",
      "https://order.example"
    );
  });

  it("marks the page you are on", () => {
    pathname = "/rider";
    render(<LandingHeader />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Rider" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Vendor" })).not.toHaveAttribute("aria-current");
  });

  describe("the mobile menu", () => {
    it("opens as a dialog, holds the page still, and puts focus inside", () => {
      render(<LandingHeader />);

      openMenu();

      expect(menu()).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "true");
      expect(document.body.style.overflow).toBe("hidden");
      expect(screen.getByRole("button", { name: "Close menu" })).toHaveFocus();
    });

    it("closes on Escape and lets the page scroll again", async () => {
      render(<LandingHeader />);
      openMenu();

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => expect(menu()).not.toBeInTheDocument());
      expect(document.body.style.overflow).toBe("");
      expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
    });

    it("closes from the close button", async () => {
      render(<LandingHeader />);
      openMenu();

      act(() => screen.getByRole("button", { name: "Close menu" }).click());

      await waitFor(() => expect(menu()).not.toBeInTheDocument());
    });

    it("closes once you have gone somewhere", async () => {
      const view = render(<LandingHeader />);
      openMenu();

      pathname = "/vendor";
      view.rerender(<LandingHeader />);

      await waitFor(() => expect(menu()).not.toBeInTheDocument());
    });

    it("lists every page and the way in", () => {
      render(<LandingHeader />);
      openMenu();

      const panel = menu()!;
      for (const name of ["Vendor", "Rider", "About us", "Contact us"]) {
        expect(within(panel).getByRole("link", { name: new RegExp(name) })).toBeInTheDocument();
      }
      expect(within(panel).getByRole("link", { name: /Start Ordering/ })).toBeInTheDocument();
    });
  });
});

describe("GeneralHeader", () => {
  it("stays on screen however far the page scrolls", () => {
    render(<GeneralHeader />);
    const header = screen.getByRole("banner");

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, value: 2000 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(header).toHaveClass("fixed");
    expect(header.className).not.toMatch(/translate-y/);
  });

  it("stays out of the admin panel", () => {
    pathname = "/admin/orders";
    render(<GeneralHeader />);

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    pathname = "/";
  });
});
