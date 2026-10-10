import { act, fireEvent, render, screen } from "@testing-library/react";
import CoverageSection from "@/components/templates/CoverageSection";
import BuyerFaqSection, { BUYER_FAQS } from "@/components/templates/BuyerFaqSection";
import JoinUsSection from "@/components/templates/JoinUsSection";
import { LandingSectionOne } from "@/components/organisms/LandingSection1";

jest.mock("@/lib/links", () => ({ CUSTOMER_APP_URL: "https://order.example" }));
jest.mock("@/components/templates/BackgroundThree", () => ({
  BackgroundThree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("@/components/templates/BackgroundTwo", () => ({
  BackgroundTwo: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe("Hero", () => {
  it("says what Recommend is, without promising there is no app", () => {
    render(<LandingSectionOne />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Anything you need.Just chat."
    );
    expect(screen.getByText("Works in your browser")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/no app|whatsapp/i);
    expect(screen.getByRole("link", { name: /See how it works/ })).toHaveAttribute(
      "href",
      "#how-it-works"
    );
  });
});

describe("CoverageSection", () => {
  const ask = (text: string) =>
    act(() => {
      fireEvent.change(screen.getByLabelText("Your street or area"), {
        target: { value: text },
      });
    });

  it("says yes for a Lekki street", () => {
    render(<CoverageSection />);
    ask("Admiralty Way");

    expect(screen.getByText("Yes — we deliver to Admiralty Way.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start Ordering/ })).toHaveAttribute(
      "href",
      "https://order.example"
    );
  });

  it("says not yet for somewhere we are not — and, with pickup off, does not offer it", () => {
    render(<CoverageSection />);
    ask("Yaba");

    expect(screen.getByText("Not in Yaba yet.")).toBeInTheDocument();
    expect(screen.queryByText(/pickup/)).not.toBeInTheDocument();
  });

  it("waits for something to check before answering", () => {
    render(<CoverageSection />);
    ask("Ya");

    expect(screen.queryByText(/^Yes — we deliver to|^Not in /)).not.toBeInTheDocument();
  });

  it("fills the box from an example", () => {
    render(<CoverageSection />);

    act(() => screen.getByRole("button", { name: "Osapa London" }).click());

    expect(screen.getByText("Yes — we deliver to Osapa London.")).toBeInTheDocument();
  });
});

describe("BuyerFaqSection", () => {
  it("opens one answer at a time", () => {
    render(<BuyerFaqSection />);
    const first = screen.getByRole("button", { name: BUYER_FAQS[0].question });
    const second = screen.getByRole("button", { name: BUYER_FAQS[1].question });

    expect(first).toHaveAttribute("aria-expanded", "true");
    act(() => second.click());

    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(BUYER_FAQS[1].answer)).toBeVisible();
  });

  it("never promises there is no app, and names the stores that are coming", () => {
    for (const { answer } of BUYER_FAQS) expect(answer).not.toMatch(/no app|whatsapp/i);
    expect(BUYER_FAQS[0].answer).toMatch(/Play Store and App Store/);
  });
});

describe("JoinUsSection", () => {
  it("sends vendors and riders to their own pages", () => {
    render(<JoinUsSection />);

    expect(screen.getByRole("link", { name: /Become a vendor/ })).toHaveAttribute("href", "/vendor");
    expect(screen.getByRole("link", { name: /Become a rider/ })).toHaveAttribute("href", "/rider");
  });
});
