import { act, fireEvent, render, screen } from "@testing-library/react";
import NotificationBell from "@/components/organisms/NotificationBell";
import type { AdminNotification, AdminNotificationFeed } from "@/types";

// ─── Doubles ──────────────────────────────────────────────────────────────────

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

let feed: Partial<{ data: AdminNotificationFeed; isLoading: boolean; isError: boolean }> =
  {};
const markRead = jest.fn();
const markAllRead = jest.fn();
jest.mock("@/hooks", () => ({
  useAdminNotifications: () => feed,
  useMarkNotificationRead: () => ({ mutate: markRead }),
  useMarkAllNotificationsRead: () => ({ mutate: markAllRead, isPending: false }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const entry = (over: Partial<AdminNotification> = {}): AdminNotification => ({
  id: "n1",
  type: "ADMIN_NEW_PAID_ORDER",
  title: "New paid order",
  body: "Ada paid ₦6,500 — Mama Put. Delivery.",
  data: { alertId: "a1", kind: "NEW_PAID_ORDER", url: "/admin/transactions" },
  readAt: null,
  createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  ...over,
});

const withItems = (items: AdminNotification[]) => {
  feed = {
    data: {
      items,
      total: items.length,
      unread: items.filter((item) => !item.readAt).length,
      page: 1,
      limit: 20,
    },
    isLoading: false,
    isError: false,
  };
};

const openBell = () =>
  act(() => screen.getByRole("button", { name: /^Notifications/ }).click());

describe("NotificationBell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    feed = {};
  });

  it("shows the unread count on the bell", () => {
    withItems([entry(), entry({ id: "n2" }), entry({ id: "n3", readAt: "2026-10-01" })]);
    render(<NotificationBell />);

    expect(
      screen.getByRole("button", { name: "Notifications, 2 unread" })
    ).toHaveTextContent("2");
  });

  it("caps the count at 9+", () => {
    withItems(Array.from({ length: 12 }, (_, i) => entry({ id: `n${i}` })));
    render(<NotificationBell />);

    expect(screen.getByRole("button", { name: /12 unread/ })).toHaveTextContent("9+");
  });

  it("shows no badge when everything is read", () => {
    withItems([entry({ readAt: "2026-10-01" })]);
    render(<NotificationBell />);

    expect(screen.getByRole("button", { name: "Notifications" })).toHaveTextContent("");
  });

  it("lists notifications when opened", () => {
    withItems([entry()]);
    render(<NotificationBell />);

    openBell();

    expect(screen.getByRole("dialog", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByText("Ada paid ₦6,500 — Mama Put. Delivery.")).toBeInTheDocument();
    expect(screen.getByText(/5 min ago/)).toBeInTheDocument();
  });

  it("marks an unread notification read and opens what it is about", () => {
    withItems([entry()]);
    render(<NotificationBell />);
    openBell();

    act(() => screen.getByText("New paid order").click());

    expect(markRead).toHaveBeenCalledWith("n1");
    expect(push).toHaveBeenCalledWith("/admin/transactions");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not mark an already-read notification again", () => {
    withItems([entry({ readAt: "2026-10-01" })]);
    render(<NotificationBell />);
    openBell();

    act(() => screen.getByText("New paid order").click());

    expect(markRead).not.toHaveBeenCalled();
  });

  it("never follows a link out of the admin panel", () => {
    withItems([entry({ data: { url: "https://evil.example/" } })]);
    render(<NotificationBell />);
    openBell();

    act(() => screen.getByText("New paid order").click());

    expect(push).toHaveBeenCalledWith("/admin");
  });

  it("marks everything read", () => {
    withItems([entry(), entry({ id: "n2" })]);
    render(<NotificationBell />);
    openBell();

    act(() => screen.getByRole("button", { name: "Mark all as read" }).click());

    expect(markAllRead).toHaveBeenCalled();
  });

  it("says so when there is nothing yet", () => {
    withItems([]);
    render(<NotificationBell />);
    openBell();

    expect(screen.getByText("No notifications yet.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Mark all as read" })
    ).not.toBeInTheDocument();
  });

  it("closes on Escape", () => {
    withItems([entry()]);
    render(<NotificationBell />);
    openBell();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
