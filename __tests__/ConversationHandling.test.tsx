import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ConversationHandlingStrip, {
  describeHandling,
  durationText,
} from "@/components/organisms/ConversationHandlingStrip";
import SupportTeamPage from "@/app/admin/(guarded)/support-team/page";
import { staffCanOpen } from "@/lib/staff-access";
import type {
  ConversationDetail,
  ConversationHandling,
  SupportAgent,
} from "@/types";

const reassign = jest.fn();
const release = jest.fn();
const confirm = jest.fn();
let agents: SupportAgent[] = [];
let history: ConversationHandling[] = [];

jest.mock("@/hooks", () => ({
  useConversationHistory: () => ({ data: history, isLoading: false }),
  useReassignConversation: () => ({ mutateAsync: reassign, isPending: false }),
  useReleaseConversation: () => ({ mutateAsync: release, isPending: false }),
  useSupportTeam: () => ({
    data: { days: 7, from: "", to: "", agents },
    isLoading: false,
    isError: false,
  }),
}));
jest.mock("@/components/organisms/DialogProvider", () => ({
  useConfirm: () => confirm,
}));

const agent = (over: Partial<SupportAgent>): SupportAgent => ({
  adminId: "a",
  name: "Someone",
  role: "SUPPORT",
  active: true,
  openNow: 0,
  handled: 0,
  avgPickupSeconds: null,
  avgFirstReplySeconds: null,
  wentIdle: 0,
  ...over,
});

const chat = (over: Partial<ConversationDetail> = {}): ConversationDetail =>
  ({
    id: "c1",
    heldByAdminId: "agent-1",
    heldByName: "Amaka N.",
    deletedAt: null,
    messages: [],
    ...over,
  }) as ConversationDetail;

const spell = (over: Partial<ConversationHandling>): ConversationHandling => ({
  id: "h1",
  adminId: "agent-1",
  adminName: "Amaka N.",
  waitingSince: "2026-11-20T10:00:00Z",
  takenAt: "2026-11-20T10:04:00Z",
  firstReplyAt: "2026-11-20T10:04:40Z",
  assignedByName: null,
  endedAt: null,
  endReason: null,
  endedByName: null,
  ...over,
});

beforeEach(() => {
  reassign.mockReset().mockResolvedValue({});
  release.mockReset().mockResolvedValue({});
  confirm.mockReset().mockResolvedValue(true);
  agents = [
    agent({ adminId: "agent-1", name: "Amaka N.", openNow: 3 }),
    agent({ adminId: "agent-2", name: "Bayo K.", openNow: 0 }),
  ];
  history = [];
});

describe("a chat's history, in words", () => {
  it("says how long the buyer waited, how fast the reply came, and that they still have it", () => {
    expect(describeHandling(spell({}))).toBe(
      "Amaka N. took it after the buyer waited 4m · first reply in 40s · still answering"
    );
  });

  it("says when it was passed on, or went back after they went quiet", () => {
    expect(
      describeHandling(
        spell({
          endedAt: "2026-11-20T11:00:00Z",
          endReason: "REASSIGNED",
          endedByName: "Ada O.",
        })
      )
    ).toMatch(/passed on by Ada O\.$/);
    expect(
      describeHandling(
        spell({ firstReplyAt: null, endedAt: "2026-11-20T11:00:00Z", endReason: "IDLE" })
      )
    ).toMatch(/no reply yet · went quiet, so it went back to the assistant$/);
    expect(
      describeHandling(spell({ assignedByName: "Ada O.", waitingSince: null }))
    ).toMatch(/^Amaka N\. was given it by Ada O\./);
  });

  it("reads durations at a glance", () => {
    expect(durationText(40)).toBe("40s");
    expect(durationText(360)).toBe("6m");
    expect(durationText(7500)).toBe("2h 5m");
    expect(durationText(null)).toBe("—");
  });
});

describe("stepping in on a stuck chat", () => {
  it("lets an admin pass a colleague's chat to someone else", async () => {
    render(
      <ConversationHandlingStrip
        conversation={chat()}
        me={{ id: "admin-9", role: "ADMIN" }}
        onError={jest.fn()}
      />
    );

    // The person who has it is not offered as a destination.
    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options).toEqual(["Pass to…", "Bayo K. · free"]);

    fireEvent.change(screen.getByLabelText("Pass to a colleague"), {
      target: { value: "agent-2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Pass$/ }));

    await waitFor(() =>
      expect(reassign).toHaveBeenCalledWith({ id: "c1", adminId: "agent-2" })
    );
  });

  it("lets an admin hand it back to the assistant for them", async () => {
    render(
      <ConversationHandlingStrip
        conversation={chat()}
        me={{ id: "admin-9", role: "ADMIN" }}
        onError={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Hand back for Amaka N." }));

    await waitFor(() => expect(release).toHaveBeenCalledWith("c1"));
  });

  it("gives customer service the history, but no way to move a colleague's chat", () => {
    history = [spell({})];
    render(
      <ConversationHandlingStrip
        conversation={chat()}
        me={{ id: "agent-2", role: "SUPPORT" }}
        onError={jest.fn()}
      />
    );

    expect(screen.queryByRole("button", { name: /Hand back for/ })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Pass to a colleague")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Who answered" }));
    expect(screen.getByText(/Amaka N\. took it after the buyer waited 4m/)).toBeInTheDocument();
  });

  it("offers nothing to step into when nobody has the chat", () => {
    render(
      <ConversationHandlingStrip
        conversation={chat({ heldByAdminId: null, heldByName: null })}
        me={{ id: "admin-9", role: "ADMIN" }}
        onError={jest.fn()}
      />
    );

    expect(screen.queryByLabelText("Pass to a colleague")).not.toBeInTheDocument();
  });
});

describe("the team page", () => {
  it("shows each person's figures, and the team's together", () => {
    agents = [
      agent({
        adminId: "agent-1",
        name: "Amaka N.",
        openNow: 2,
        handled: 10,
        avgPickupSeconds: 120,
        avgFirstReplySeconds: 30,
        wentIdle: 1,
      }),
      agent({
        adminId: "agent-2",
        name: "Bayo K.",
        handled: 30,
        avgPickupSeconds: 240,
        avgFirstReplySeconds: 60,
      }),
    ];

    render(<SupportTeamPage />);

    expect(screen.getByText("Amaka N.")).toBeInTheDocument();
    expect(screen.getByText("Bayo K.")).toBeInTheDocument();
    // Weighted by chats handled: (120×10 + 240×30) / 40 = 210s ≈ 4m.
    expect(screen.getByText("Average wait for a person").nextSibling).toHaveTextContent("4m");
    expect(screen.getByText("Chats handled").nextSibling).toHaveTextContent("40");
  });

  it("is for admins only", () => {
    expect(staffCanOpen("SUPPORT", "/admin/support-team")).toBe(false);
    expect(staffCanOpen("ADMIN", "/admin/support-team")).toBe(true);
  });
});
