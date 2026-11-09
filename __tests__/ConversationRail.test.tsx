import { act, fireEvent, render, screen } from "@testing-library/react";
import ConversationRail from "@/components/organisms/ConversationRail";
import type { ConversationSummary } from "@/types";

let items: ConversationSummary[] = [];
const lastFilters: { deleted?: boolean }[] = [];
const deleteMany = jest.fn();
const confirm = jest.fn();
jest.mock("@/hooks", () => ({
  useConversations: (filters: { deleted?: boolean }) => {
    lastFilters.push(filters);
    return {
      data: {
        items,
        total: items.length,
        needingAttention: 1,
        page: 1,
        limit: 50,
      },
      isLoading: false,
    };
  },
  useDeleteConversations: () => ({ mutateAsync: deleteMany, isPending: false }),
}));
jest.mock("@/components/organisms/DialogProvider", () => ({
  useConfirm: () => confirm,
}));

const minutesAgo = (n: number) =>
  new Date(Date.now() - n * 60_000).toISOString();

const row = (over: Partial<ConversationSummary> = {}): ConversationSummary =>
  ({
    id: "c1",
    channel: "PWA",
    state: "DISCOVERY",
    buyerName: "Ada Obi",
    buyerPhone: null,
    lastMessageAt: minutesAgo(1),
    lastMessage: "Where is my order?",
    heldByAdminId: null,
    needsAttentionAt: null,
    attentionReason: null,
    handoverRequestedAt: null,
    handoverReason: null,
    createdAt: minutesAgo(30),
    ...over,
  }) as ConversationSummary;

describe("ConversationRail", () => {
  it("marks a buyer the assistant handed over as waiting for you", () => {
    items = [
      row({
        handoverRequestedAt: minutesAgo(2),
        // A handover flags the conversation too — only one badge should show.
        needsAttentionAt: minutesAgo(2),
        attentionReason: "Wants a refund",
      }),
    ];

    render(<ConversationRail activeId={null} />);

    expect(screen.getByText(/Waiting for you · 2m/)).toBeInTheDocument();
    expect(screen.queryByText(/2m waiting/)).not.toBeInTheDocument();
  });

  it("shows a flag on its own as before", () => {
    items = [row({ needsAttentionAt: minutesAgo(4) })];

    render(<ConversationRail activeId={null} />);

    expect(screen.getByText("4m waiting")).toBeInTheDocument();
    expect(screen.queryByText(/Waiting for you/)).not.toBeInTheDocument();
  });

  it("stops saying waiting once an admin is answering", () => {
    items = [
      row({ handoverRequestedAt: minutesAgo(2), heldByAdminId: "admin-1" }),
    ];

    render(<ConversationRail activeId={null} />);

    expect(screen.queryByText(/Waiting for you/)).not.toBeInTheDocument();
    expect(screen.getByText("Answering")).toBeInTheDocument();
  });

  describe("deleting", () => {
    beforeEach(() => {
      deleteMany.mockReset();
      confirm.mockReset().mockResolvedValue(true);
      lastFilters.length = 0;
    });

    it("ticks chats and deletes them, after asking", async () => {
      items = [
        row({ id: "c1", buyerName: "Ada Obi" }),
        row({ id: "c2", buyerName: "Bayo" }),
      ];
      deleteMany.mockResolvedValue({ deleted: ["c1", "c2"], refused: [] });

      render(<ConversationRail activeId={null} />);
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
      fireEvent.click(screen.getByRole("checkbox", { name: "Select Ada Obi" }));
      fireEvent.click(screen.getByRole("checkbox", { name: "Select Bayo" }));
      expect(screen.getByText("2 selected")).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Delete" }));
      });

      expect(confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Delete 2 conversations?",
          variant: "danger",
        }),
      );
      expect(deleteMany).toHaveBeenCalledWith(["c1", "c2"]);
      expect(screen.getByRole("status")).toHaveTextContent("Deleted 2.");
    });

    it("keeps a chat with orders ticked, and says why", async () => {
      items = [
        row({ id: "c1", buyerName: "Ada Obi" }),
        row({ id: "c2", buyerName: "Bayo" }),
      ];
      deleteMany.mockResolvedValue({
        deleted: ["c1"],
        refused: [{ id: "c2", reason: "This chat has orders" }],
      });

      render(<ConversationRail activeId={null} />);
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
      fireEvent.click(screen.getByRole("checkbox", { name: "Select Ada Obi" }));
      fireEvent.click(screen.getByRole("checkbox", { name: "Select Bayo" }));
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Delete" }));
      });

      expect(screen.getByRole("status")).toHaveTextContent(
        "Deleted 1. The 1 still ticked has orders, so it stays.",
      );
      expect(
        screen.getByRole("checkbox", { name: "Select Bayo" }),
      ).toHaveAttribute("aria-checked", "true");
      expect(
        screen.getByRole("checkbox", { name: "Select Ada Obi" }),
      ).toHaveAttribute("aria-checked", "false");
    });

    it("deletes nothing when the admin backs out", async () => {
      items = [row({ id: "c1", buyerName: "Ada Obi" })];
      confirm.mockResolvedValue(false);

      render(<ConversationRail activeId={null} />);
      fireEvent.click(screen.getByRole("button", { name: "Select" }));
      fireEvent.click(screen.getByRole("checkbox", { name: "Select Ada Obi" }));
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Delete" }));
      });

      expect(deleteMany).not.toHaveBeenCalled();
    });

    it("lists the deleted ones under Deleted, marked, with nothing waiting", () => {
      items = [
        row({
          deletedAt: minutesAgo(120),
          handoverRequestedAt: minutesAgo(200),
        }),
      ];

      render(<ConversationRail activeId={null} />);
      fireEvent.click(screen.getByRole("button", { name: "Deleted" }));

      expect(lastFilters[lastFilters.length - 1]).toEqual(
        expect.objectContaining({ deleted: true }),
      );
      expect(screen.getByText("Deleted 2h ago")).toBeInTheDocument();
      expect(screen.queryByText(/Waiting for you/)).not.toBeInTheDocument();
      // Nothing to select among deleted ones.
      expect(
        screen.queryByRole("button", { name: "Select" }),
      ).not.toBeInTheDocument();
    });
  });
});
