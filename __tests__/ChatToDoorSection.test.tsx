import { render, screen, within } from "@testing-library/react";
import ChatToDoorSection from "@/components/templates/ChatToDoorSection";

jest.mock("@/components/templates/BackgroundThree", () => ({
  BackgroundThree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
// next/image needs a loader jsdom does not have; a plain <img> is all these tests need.
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe("ChatToDoorSection", () => {
  it("walks through the three hand-offs in order", () => {
    render(<ChatToDoorSection />);

    expect(screen.getByRole("heading", { name: /From your chat to your door/ })).toBeInTheDocument();
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual([
      "Order and pay in the chat",
      "Gets it and starts right away",
      "Brings it to your door",
    ]);
  });

  it("explains the delivery code before the buyer meets it at the door", () => {
    render(<ChatToDoorSection />);

    const rider = screen.getByText("Brings it to your door").closest("li")!;
    expect(within(rider).getByText("UWEUSB")).toBeInTheDocument();
    expect(within(rider).getByText(/No code, no hand-over/)).toBeInTheDocument();
  });

  it("uses the small WebP illustrations, not the multi-megabyte SVGs", () => {
    const { container } = render(<ChatToDoorSection />);

    const sources = Array.from(container.querySelectorAll("img")).map((img) =>
      img.getAttribute("src")
    );
    expect(sources).toHaveLength(3);
    for (const src of sources) expect(src).toMatch(/^\/images\/journey\/.+\.webp$/);
  });
});
