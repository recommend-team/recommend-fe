import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminAlerts from "@/components/organisms/AdminAlerts";
import { liveAlertsState } from "@/lib/adminAlerts";

// ─── Doubles ──────────────────────────────────────────────────────────────────

type Handler = (payload: unknown) => void;
const socketHandlers: Record<string, Handler> = {};
const disconnect = jest.fn();
const connect = jest.fn();
/** The options the socket was opened with — `auth` is checked below. */
let socketOptions: { auth?: (send: (data: unknown) => void) => void } = {};
jest.mock("socket.io-client", () => ({
  io: jest.fn((_url: string, options: typeof socketOptions) => {
    socketOptions = options;
    return {
      on: (name: string, handler: Handler) => {
        socketHandlers[name] = handler;
      },
      off: jest.fn(),
      removeAllListeners: jest.fn(),
      connect,
      disconnect,
    };
  }),
}));

const push = jest.fn();
let pathname = "/admin";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => pathname,
}));

const playChime = jest.fn(() => true);
jest.mock("@/lib/chime", () => ({
  armChime: () => () => undefined,
  playChime: () => playChime(),
}));

jest.mock("@/lib/api", () => ({
  API_URL: "http://localhost:4000/api/v1",
  request: jest.fn(),
}));

let currentToken = "admin-token";
jest.mock("@/lib/auth", () => ({ getAccessToken: () => currentToken }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const alert = (over: Record<string, unknown> = {}) => ({
  id: "a1",
  kind: "CONVERSATION_FLAGGED",
  title: "A buyer needs help",
  body: "Ada — nothing matched what they asked for.",
  url: "/admin/conversations/c1",
  ...over,
});

function mount() {
  const client = new QueryClient();
  const invalidate = jest.spyOn(client, "invalidateQueries");
  render(
    <QueryClientProvider client={client}>
      <AdminAlerts />
    </QueryClientProvider>
  );
  return { invalidate };
}

const fromSocket = (payload: unknown) =>
  act(() => socketHandlers["admin:alert"](payload));

describe("AdminAlerts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    pathname = "/admin";
  });

  it("chimes and shows an alert from the socket", () => {
    mount();

    fromSocket(alert());

    expect(playChime).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Ada — nothing matched what they asked for."
    );
  });

  describe("with a service worker", () => {
    // jsdom has none. A bare EventTarget is all the component listens on.
    const worker = new EventTarget();
    const fromWorker = (data: unknown) =>
      act(() => {
        worker.dispatchEvent(new MessageEvent("message", { data }));
      });

    beforeAll(() => {
      Object.defineProperty(navigator, "serviceWorker", {
        configurable: true,
        value: worker,
      });
    });

    afterAll(() => {
      delete (navigator as { serviceWorker?: unknown }).serviceWorker;
    });

    it("shows a pushed alert", () => {
      mount();

      fromWorker({ type: "recommend:admin-push-received", alert: alert() });

      expect(playChime).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("shows an alert once when it arrives by push and by socket", () => {
      mount();

      fromWorker({ type: "recommend:admin-push-received", alert: alert() });
      fromSocket(alert());

      expect(playChime).toHaveBeenCalledTimes(1);
      expect(screen.getAllByRole("status")).toHaveLength(1);
    });

    it("goes where a tapped notification points", () => {
      mount();

      fromWorker({ type: "recommend:admin-navigate", url: "/admin/transactions" });

      expect(push).toHaveBeenCalledWith("/admin/transactions");
    });
  });

  it("stays quiet about the conversation the admin is already reading", () => {
    pathname = "/admin/conversations/c1";
    mount();

    fromSocket(alert());

    expect(playChime).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("still refreshes the queue behind a quiet alert", () => {
    pathname = "/admin/conversations/c1";
    const { invalidate } = mount();

    fromSocket(alert());

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["admin", "conversations"],
    });
  });

  it("shows but does not chime when the sound is off", () => {
    localStorage.setItem("recommend.admin.alertSoundMuted", "1");
    mount();

    fromSocket(alert());

    expect(playChime).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("opens what the alert is about", () => {
    mount();
    fromSocket(alert());

    act(() => screen.getByText("A buyer needs help").click());

    expect(push).toHaveBeenCalledWith("/admin/conversations/c1");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("never opens a link that leaves the admin panel", () => {
    mount();
    fromSocket(alert({ url: "https://evil.example/" }));

    act(() => screen.getByText("A buyer needs help").click());

    expect(push).toHaveBeenCalledWith("/admin");
  });

  it("refreshes transactions for a paid order", () => {
    const { invalidate } = mount();

    fromSocket(alert({ id: "a2", kind: "NEW_PAID_ORDER", url: "/admin/transactions" }));

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["admin", "transactions"],
    });
  });

  it("closes the socket when the panel goes away", () => {
    const client = new QueryClient();
    const view = render(
      <QueryClientProvider client={client}>
        <AdminAlerts />
      </QueryClientProvider>
    );

    view.unmount();

    expect(disconnect).toHaveBeenCalled();
  });

  describe("the live connection", () => {
    afterEach(() => {
      currentToken = "admin-token";
      jest.useRealTimers();
    });

    it("sends whatever token is current on each connect, not one captured at load", () => {
      // A token refreshed while the panel was open used to be ignored, and an expired
      // one left the panel deaf until a full reload.
      mount();
      currentToken = "refreshed-token";

      let sent: unknown;
      socketOptions.auth?.((data) => {
        sent = data;
      });

      expect(sent).toEqual({ token: "refreshed-token" });
    });

    it("reports connected, and refused when the server rejects the login", () => {
      mount();

      act(() => socketHandlers["connect"](undefined));
      expect(liveAlertsState()).toBe("connected");

      act(() => socketHandlers["admin:error"]({ message: "That token is not valid" }));
      expect(liveAlertsState()).toBe("refused");
    });

    it("tries again after the server closes the connection, which Socket.IO will not", () => {
      jest.useFakeTimers();
      mount();

      act(() => socketHandlers["disconnect"]("io server disconnect"));
      expect(connect).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(15_000));
      expect(connect).toHaveBeenCalledTimes(1);
    });
  });
});
