import { act, render, screen, within } from "@testing-library/react";
import NoAppSection from "@/components/templates/NoAppSection";

jest.mock("@/lib/links", () => ({ CUSTOMER_APP_URL: "https://order.example" }));
// The background is a decorative image; next/image needs a loader jsdom does not have.
jest.mock("@/components/templates/BackgroundThree", () => ({
  BackgroundThree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ─── Browser doubles ──────────────────────────────────────────────────────────

let reducedMotion = false;
let onIntersect: ((entries: { isIntersecting: boolean }[]) => void) | null = null;

beforeEach(() => {
  reducedMotion = false;
  onIntersect = null;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: reducedMotion,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }),
  });
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    value: class {
      constructor(callback: typeof onIntersect) {
        onIntersect = callback;
      }
      observe() {}
      disconnect() {}
    },
  });
});

afterEach(() => jest.useRealTimers());

const scrollIntoView = () => act(() => onIntersect?.([{ isIntersecting: true }]));
const pickFromList = (name: RegExp) =>
  within(screen.getByRole("list")).getByRole("button", { name }).click();
const currentStep = () =>
  screen.getAllByRole("button", { current: "step" }).map((b) => b.textContent);

describe("NoAppSection", () => {
  it("opens on the first step of a real order", () => {
    render(<NoAppSection />);

    expect(screen.getByText("Hi, what can I eat around Egbeda?")).toBeInTheDocument();
    expect(screen.getAllByText("Mama Ngozi Kitchen").length).toBeGreaterThan(0);
  });

  it("jumps to a step the visitor picks", () => {
    render(<NoAppSection />);

    act(() => pickFromList(/Pay securely/));

    expect(screen.getByText("Pay ₦8,500")).toBeInTheDocument();
  });

  it("steps forward and wraps around with the arrows", () => {
    render(<NoAppSection />);

    act(() => screen.getByRole("button", { name: "Previous step" }).click());
    expect(screen.getByText("STEP 6 OF 6")).toBeInTheDocument();
    expect(screen.getByText("UWEUSB")).toBeInTheDocument();

    act(() => screen.getByRole("button", { name: "Next step" }).click());
    expect(screen.getByText("STEP 1 OF 6")).toBeInTheDocument();
  });

  it("plays by itself once on screen", () => {
    jest.useFakeTimers();
    render(<NoAppSection />);

    act(() => jest.advanceTimersByTime(4000));
    expect(screen.getByText("STEP 1 OF 6")).toBeInTheDocument();

    scrollIntoView();
    act(() => jest.advanceTimersByTime(3800));
    expect(screen.getByText("STEP 2 OF 6")).toBeInTheDocument();
  });

  it("stops playing for good once the visitor picks a step", () => {
    jest.useFakeTimers();
    render(<NoAppSection />);
    scrollIntoView();

    act(() => pickFromList(/Check out in the chat/));
    act(() => jest.advanceTimersByTime(20_000));

    expect(screen.getByText("STEP 3 OF 6")).toBeInTheDocument();
    expect(currentStep()).toContain("3Check out in the chatYour name, number, and delivery or pickup.");
  });

  it("never plays for a visitor who asked for reduced motion", () => {
    reducedMotion = true;
    jest.useFakeTimers();
    render(<NoAppSection />);
    scrollIntoView();

    act(() => jest.advanceTimersByTime(20_000));

    expect(screen.getByText("STEP 1 OF 6")).toBeInTheDocument();
  });

  it("links Start Ordering to the customer app", () => {
    render(<NoAppSection />);

    expect(screen.getByRole("link", { name: /Start Ordering/ })).toHaveAttribute(
      "href",
      "https://order.example"
    );
  });
});
