import {
  SeenAlerts,
  isAboutCurrentPage,
  parseAlert,
  safeAdminPath,
} from "@/lib/adminAlerts";

describe("safeAdminPath", () => {
  it.each(["/admin", "/admin/conversations/c1", "/admin/transactions"])(
    "keeps the admin path %s",
    (path) => {
      expect(safeAdminPath(path)).toBe(path);
    }
  );

  it.each([
    "https://evil.example/admin",
    "//evil.example/admin",
    "/store/mama-put",
    "/administrator",
    "/admin\\..\\store",
    "javascript:alert(1)",
    42,
    undefined,
  ])("refuses %p and falls back to the dashboard", (candidate) => {
    expect(safeAdminPath(candidate)).toBe("/admin");
  });
});

describe("parseAlert", () => {
  it("reads what the socket sends", () => {
    expect(
      parseAlert({
        id: "a1",
        kind: "CONVERSATION_FLAGGED",
        title: "A buyer needs help",
        body: "Ada — stuck.",
        url: "/admin/conversations/c1",
      })
    ).toEqual({
      id: "a1",
      kind: "CONVERSATION_FLAGGED",
      title: "A buyer needs help",
      body: "Ada — stuck.",
      url: "/admin/conversations/c1",
    });
  });

  it("survives junk without throwing", () => {
    expect(parseAlert("nonsense")).toEqual({
      id: null,
      kind: null,
      title: "Recommend Admin",
      body: "",
      url: "/admin",
    });
  });

  it("drops a kind it does not know", () => {
    expect(parseAlert({ kind: "SOMETHING_NEW" }).kind).toBeNull();
  });
});

describe("SeenAlerts", () => {
  it("shows an alert once, however many ways it arrives", () => {
    const seen = new SeenAlerts();
    expect(seen.firstTime("a1")).toBe(true);
    expect(seen.firstTime("a1")).toBe(false);
  });

  it("always shows one with no id", () => {
    const seen = new SeenAlerts();
    expect(seen.firstTime(null)).toBe(true);
    expect(seen.firstTime(null)).toBe(true);
  });

  it("forgets the oldest past its capacity", () => {
    const seen = new SeenAlerts(2);
    seen.firstTime("a1");
    seen.firstTime("a2");
    seen.firstTime("a3");
    expect(seen.firstTime("a1")).toBe(true);
  });
});

describe("isAboutCurrentPage", () => {
  const alert = parseAlert({ url: "/admin/conversations/c1" });

  it("recognises the conversation already open", () => {
    expect(isAboutCurrentPage(alert, "/admin/conversations/c1")).toBe(true);
  });

  it("does not hide it anywhere else", () => {
    expect(isAboutCurrentPage(alert, "/admin/conversations")).toBe(false);
  });

  it("never hides an alert that only points at the dashboard", () => {
    expect(isAboutCurrentPage(parseAlert({}), "/admin")).toBe(false);
  });
});
