import { act, render, screen } from "@testing-library/react";
import { StoreBadges } from "@/components/molecules/StoreBadges";
import FaqSection from "@/components/templates/FaqSection";

jest.mock("@/components/templates/BackgroundThree", () => ({
  BackgroundThree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

describe("StoreBadges", () => {
  afterEach(() => jest.useRealTimers());

  it("says coming soon when tapped, instead of jumping the page", () => {
    jest.useFakeTimers();
    render(<StoreBadges />);
    const play = screen.getByRole("button", { name: "Google Play — coming soon" });

    expect(play).toHaveTextContent("Download on Google Play");
    act(() => play.click());
    expect(play).toHaveTextContent("Coming soon");
    expect(screen.getByText("Google Play app coming soon")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(2500));
    expect(play).toHaveTextContent("Download on Google Play");
  });

  it("is a button, not a link to nowhere", () => {
    render(<StoreBadges />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});

describe("FaqSection", () => {
  const questions = () => screen.getAllByRole("button").map((b) => b.textContent);

  it("never mentions WhatsApp, for anyone", () => {
    for (const audience of ["general", "vendor"] as const) {
      const { container, unmount } = render(<FaqSection audience={audience} />);
      for (const button of screen.getAllByRole("button")) act(() => button.click());
      expect(container.textContent).not.toMatch(/whatsapp|no app needed/i);
      unmount();
    }
  });

  it("answers vendor questions on the vendor page", () => {
    render(<FaqSection audience="vendor" />);

    expect(questions()).toEqual(
      expect.arrayContaining([
        "Can I sell if my business isn't registered?",
        "When do I get paid?",
        "How does pickup work?",
      ])
    );
  });

  it("answers buyer questions everywhere else", () => {
    render(<FaqSection />);

    expect(questions()).toContain("How do I place an order?");
    expect(questions()).not.toContain("When do I get paid?");
  });
});
