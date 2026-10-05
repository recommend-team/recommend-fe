import { act, render, screen } from "@testing-library/react";
import OrderFlowPhone from "@/components/organisms/OrderFlowPhone";

const ASK = "Hi, what can I eat around Egbeda?";
const NAME = "Lovely. What name should I put on the order?";
const layerOf = (text: string) => screen.getByText(text).closest(".absolute.inset-0");

describe("OrderFlowPhone", () => {
  afterEach(() => jest.useRealTimers());

  it("keeps the old screen while the new one arrives, then lets it go", () => {
    jest.useFakeTimers();
    const view = render(<OrderFlowPhone step={1} />);

    view.rerender(<OrderFlowPhone step={3} />);
    expect(screen.getByText(ASK)).toBeInTheDocument();
    expect(screen.getByText(NAME)).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(750));
    expect(screen.queryByText(ASK)).not.toBeInTheDocument();
    expect(screen.getByText(NAME)).toBeInTheDocument();
  });

  it("turns the page away going forward", () => {
    const view = render(<OrderFlowPhone step={1} transition="book" />);

    view.rerender(<OrderFlowPhone step={2} transition="book" />);

    expect(layerOf(ASK)).toHaveClass("flow-page-turn-away");
  });

  it("swings the earlier page back going backward", () => {
    const view = render(<OrderFlowPhone step={3} transition="book" />);

    view.rerender(<OrderFlowPhone step={1} transition="book" />);

    expect(layerOf(ASK)).toHaveClass("flow-page-turn-back");
    expect(layerOf(NAME)).toHaveClass("flow-page-dim");
  });

  it("reads the autoplay's wrap from the last step to the first as forward", () => {
    const view = render(<OrderFlowPhone step={6} transition="slide" />);

    view.rerender(<OrderFlowPhone step={1} transition="slide" />);

    expect(layerOf(ASK)).toHaveClass("flow-slide-in-next");
  });

  it("does not animate the first screen", () => {
    render(<OrderFlowPhone step={1} />);

    expect(layerOf(ASK)?.className).not.toMatch(/flow-/);
  });
});
