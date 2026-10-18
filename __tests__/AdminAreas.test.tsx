import { act, fireEvent, render, screen, within } from "@testing-library/react";
import AreasPage from "@/app/admin/(guarded)/areas/page";
import type { StateOverview, UnplacedLocation } from "@/types";

const addAlias = jest.fn();
const removeAlias = jest.fn();
const place = jest.fn();
const dismiss = jest.fn();
const setActive = jest.fn();
const confirm = jest.fn();

let states: StateOverview[] = [];
let unplaced: UnplacedLocation[] = [];

const mutation = (fn: jest.Mock) => ({ mutate: fn, isPending: false });

jest.mock("@/components/organisms/DialogProvider", () => ({
  useConfirm: () => confirm,
}));
jest.mock("@/hooks", () => ({
  useAreasOverview: () => ({ data: states, isLoading: false, isError: false }),
  useUnplacedLocations: () => ({ data: unplaced, refetch: jest.fn() }),
  useAddAreaAlias: () => mutation(addAlias),
  useRemoveAreaAlias: () => mutation(removeAlias),
  useCreateArea: () => mutation(jest.fn()),
  useRenameArea: () => mutation(jest.fn()),
  useSetAreaActive: () => mutation(setActive),
  usePlaceUnplaced: () => mutation(place),
  useDismissUnplaced: () => mutation(dismiss),
}));

describe("Areas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    states = [
      {
        id: "lagos",
        name: "Lagos",
        isActive: true,
        areas: [
          {
            id: "ajah",
            name: "Ajah",
            isActive: true,
            vendorCount: 1,
            aliases: [],
          },
          {
            id: "lekki",
            name: "Lekki",
            isActive: true,
            vendorCount: 0,
            aliases: [{ id: "al1", name: "Chevron" }],
          },
        ],
      },
    ];
    unplaced = [
      {
        id: "u1",
        text: "Badore",
        timesSeen: 12,
        lastSeenAt: "2026-10-18T10:00:00.000Z",
      },
    ];
  });

  it("lists each area with its vendors and the other names of places in it", () => {
    render(<AreasPage />);

    expect(screen.getByRole("button", { name: "Ajah" })).toBeInTheDocument();
    expect(screen.getByText("1 vendor")).toBeInTheDocument();
    expect(screen.getByText("Chevron")).toBeInTheDocument();
  });

  it("puts a place buyers typed in an area with one click", () => {
    render(<AreasPage />);

    expect(screen.getByText("Badore")).toBeInTheDocument();
    expect(screen.getByText(/×12/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Area for Badore"), {
      target: { value: "ajah" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add to area" }));

    expect(place).toHaveBeenCalledWith(
      { id: "u1", areaId: "ajah" },
      expect.anything(),
    );
  });

  it("adds and removes another name for an area", () => {
    render(<AreasPage />);

    const input = screen.getByLabelText("Add a place in Ajah");
    fireEvent.change(input, { target: { value: "Thomas Estate" } });
    fireEvent.submit(input);
    expect(addAlias).toHaveBeenCalledWith(
      { areaId: "ajah", name: "Thomas Estate" },
      expect.anything(),
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Remove Chevron from Lekki" }),
    );
    expect(removeAlias).toHaveBeenCalledWith("al1");
  });

  it("asks before switching off an area vendors deliver to", async () => {
    confirm.mockResolvedValue(false);
    render(<AreasPage />);

    await act(async () => {
      fireEvent.click(screen.getByLabelText("Ajah switched on"));
    });
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Switch off Ajah?" }),
    );
    expect(setActive).not.toHaveBeenCalled();
  });

  it("finds an area by a place in it", () => {
    render(<AreasPage />);

    fireEvent.change(screen.getByLabelText("Find an area"), {
      target: { value: "chevron" },
    });
    const list = screen.getByText("Lagos").parentElement as HTMLElement;
    expect(within(list).getByText("Lekki")).toBeInTheDocument();
    expect(within(list).queryByText("Ajah")).toBeNull();
  });

  describe("pages", () => {
    const many = (n: number) =>
      Array.from({ length: n }, (_, i) => ({
        id: `a${i}`,
        name: `Area ${String(i + 1).padStart(2, "0")}`,
        isActive: true,
        vendorCount: 0,
        aliases: [],
      }));

    it("shows twenty areas a page, and moves between pages", () => {
      states = [
        { id: "lagos", name: "Lagos", isActive: true, areas: many(45) },
      ];
      unplaced = [];
      render(<AreasPage />);

      expect(screen.getByText("Showing 20 of 45 areas")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Area 01" }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Area 21" })).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(
        screen.getByRole("button", { name: "Area 21" }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Area 01" })).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByText("Showing 5 of 45 areas")).toBeInTheDocument();
    });

    it("goes back to the first page when searching", () => {
      states = [
        { id: "lagos", name: "Lagos", isActive: true, areas: many(45) },
      ];
      unplaced = [];
      render(<AreasPage />);

      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.change(screen.getByLabelText("Find an area"), {
        target: { value: "Area 0" },
      });
      // Area 01–09: one page, no paginator.
      expect(
        screen.getByRole("button", { name: "Area 01" }),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Showing/)).toBeNull();
    });

    it("shows ten places to place at a time", () => {
      unplaced = Array.from({ length: 12 }, (_, i) => ({
        id: `u${i}`,
        text: `Place ${i + 1}`,
        timesSeen: 12 - i,
        lastSeenAt: "2026-10-18T10:00:00.000Z",
      }));
      render(<AreasPage />);

      expect(screen.getByText("Showing 10 of 12 places")).toBeInTheDocument();
      expect(screen.queryByText("Place 11")).toBeNull();
    });
  });
});
