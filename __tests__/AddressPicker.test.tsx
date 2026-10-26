import { act, fireEvent, render, screen } from "@testing-library/react";
import { AddressPicker } from "@/components/storefront/AddressPicker";
import type { PickedPlace } from "@/types";

const suggestPlaces = jest.fn();
const resolvePlace = jest.fn();
jest.mock("@/services", () => ({
  suggestPlaces: (...args: unknown[]) => suggestPlaces(...args),
  resolvePlace: (...args: unknown[]) => resolvePlace(...args),
}));

const PICKED: PickedPlace = {
  place: {
    placeId: "ChIJabc",
    address: "Abraham Adesanya, Ajah, Lekki 106104, Lagos, Nigeria",
    latitude: 6.469065,
    longitude: 3.585036,
    areaId: "ajah",
    areaName: "Ajah",
  },
  token: "signed.token",
};

describe("AddressPicker", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    suggestPlaces.mockReset().mockResolvedValue([
      {
        placeId: "ChIJabc",
        text: "Abraham Adesanya, Ajah, Lekki, Nigeria",
        main: "Abraham Adesanya",
        secondary: "Ajah, Lekki, Nigeria",
      },
    ]);
    resolvePlace.mockReset().mockResolvedValue(PICKED);
  });
  afterEach(() => jest.useRealTimers());

  const type = async (text: string) => {
    fireEvent.change(screen.getByLabelText("Search for your address"), {
      target: { value: text },
    });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
  };

  it("asks Google only after a pause, and only from three letters", async () => {
    render(
      <AddressPicker
        picked={null}
        onPick={jest.fn()}
        onClear={jest.fn()}
        onUnavailable={jest.fn()}
      />,
    );

    await type("Ab");
    expect(suggestPlaces).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Search for your address"), {
      target: { value: "Abra" },
    });
    fireEvent.change(screen.getByLabelText("Search for your address"), {
      target: { value: "Abraham" },
    });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    // Typing on cancels the earlier search: one request, for the latest text.
    expect(suggestPlaces).toHaveBeenCalledTimes(1);
    expect(suggestPlaces).toHaveBeenCalledWith(
      "Abraham",
      expect.any(String),
      undefined,
    );
    expect(screen.getByText("Abraham Adesanya")).toBeInTheDocument();
  });

  it("hands back the picked place, in the same search session", async () => {
    const onPick = jest.fn();
    render(
      <AddressPicker
        picked={null}
        onPick={onPick}
        onClear={jest.fn()}
        onUnavailable={jest.fn()}
      />,
    );

    await type("Abraham");
    await act(async () => {
      fireEvent.click(screen.getByRole("option", { name: /Abraham Adesanya/ }));
    });

    const [, session] = suggestPlaces.mock.calls[0] as [string, string];
    expect(resolvePlace).toHaveBeenCalledWith("ChIJabc", session);
    expect(onPick).toHaveBeenCalledWith(PICKED);
  });

  it("shows the pick, with a way to change it", () => {
    const onClear = jest.fn();
    render(
      <AddressPicker
        picked={PICKED}
        onPick={jest.fn()}
        onClear={onClear}
        onUnavailable={jest.fn()}
      />,
    );

    expect(screen.getByText(PICKED.place.address)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Change" }));
    expect(onClear).toHaveBeenCalled();
  });

  it("lets the page fall back to typing when Google can't be reached", async () => {
    suggestPlaces.mockRejectedValue(new Error("503"));
    const onUnavailable = jest.fn();
    render(
      <AddressPicker
        picked={null}
        onPick={jest.fn()}
        onClear={jest.fn()}
        onUnavailable={onUnavailable}
      />,
    );

    await type("Abraham");
    expect(onUnavailable).toHaveBeenCalled();
  });

  it("says when a search found nothing", async () => {
    suggestPlaces.mockResolvedValue([]);
    render(
      <AddressPicker
        picked={null}
        onPick={jest.fn()}
        onClear={jest.fn()}
        onUnavailable={jest.fn()}
      />,
    );

    await type("Zzzqq");
    expect(screen.getByText(/No matches yet/)).toBeInTheDocument();
  });
});
