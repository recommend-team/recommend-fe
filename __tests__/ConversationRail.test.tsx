import { render, screen } from "@testing-library/react";
import ConversationRail from "@/components/organisms/ConversationRail";
import type { ConversationSummary } from "@/types";

let items: ConversationSummary[] = [];
jest.mock("@/hooks", () => ({
  useConversations: () => ({
    data: { items, total: items.length, needingAttention: 1, page: 1, limit: 50 },
    isLoading: false,
  }),
}));

const minutesAgo = (n: number) => new Date(Date.now() - n * 60_000).toISOString();

const row = (over: Partial<ConversationSummary> = {}): ConversationSummary => ({
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
} as ConversationSummary);

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
});
