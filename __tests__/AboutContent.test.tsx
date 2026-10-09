import { render, screen, within } from "@testing-library/react";
import AboutContent from "@/components/templates/AboutContent";

jest.mock("@/lib/links", () => ({
  CUSTOMER_APP_URL: "https://order.example",
  vendorApp: (path = "") => `https://vendors.example${path}`,
}));
jest.mock("@/components/templates/BackgroundThree", () => ({
  BackgroundThree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("@/components/templates/BackgroundTwo", () => ({
  BackgroundTwo: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

describe("About page", () => {
  it("tells the story in order: who, story, mission, what, who for, values, trust, next", () => {
    render(<AboutContent />);

    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "It started with a 45-second problem.",
      "One conversation, start to finish.",
      "Good for everyone in the order.",
      "Four words. Everything we do.",
      "Built so you can rely on it.",
      "Ready when you are.",
    ]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "We connect Lagos to the vendors next door."
    );
  });

  it("shows the founder by name, with his photo", () => {
    render(<AboutContent />);

    expect(screen.getByRole("img", { name: "Chanor James, founder of Recommend" })).toHaveAttribute(
      "src",
      "/images/about/chanor-james-portrait.webp"
    );
    expect(screen.getAllByText(/Chanor James/).length).toBeGreaterThan(0);
  });

  it("makes no claims it cannot back", () => {
    const { container } = render(<AboutContent />);

    expect(container.textContent).not.toMatch(/10M|98%|500\+|whatsapp|no app/i);
  });

  it("sends each kind of visitor to the right place", () => {
    render(<AboutContent />);
    const next = screen.getByRole("heading", { name: "Ready when you are." }).closest("section")!;

    expect(within(next).getByRole("link", { name: /Start Ordering/ })).toHaveAttribute("href", "https://order.example");
    expect(within(next).getByRole("link", { name: "Become a vendor" })).toHaveAttribute(
      "href",
      "https://vendors.example/signup"
    );
    expect(within(next).getByRole("link", { name: "Become a rider" })).toHaveAttribute("href", "/rider/signup");
    expect(within(next).getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact");
  });
});
