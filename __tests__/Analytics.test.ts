import { bootstrap, isUntracked } from "@/components/organisms/Analytics";

describe("isUntracked", () => {
  it("keeps the staff console and URLs carrying secrets out of analytics", () => {
    expect(isUntracked("/admin")).toBe(true);
    expect(isUntracked("/admin/orders/123")).toBe(true);
    expect(isUntracked("/reset-password")).toBe(true);
    expect(isUntracked("/rider/signup/verify")).toBe(true);
  });

  it("tracks the public site", () => {
    for (const path of ["/", "/about", "/terms", "/privacy", "/rider", "/rider/signup", "/store/mama-put"]) {
      expect(isUntracked(path)).toBe(false);
    }
    // A prefix match must end at a path segment.
    expect(isUntracked("/administrators")).toBe(false);
  });
});

describe("bootstrap", () => {
  it("sets consent to denied before loading Cookie-Script, and both before GTM", () => {
    const code = bootstrap("GTM-TEST", "abc123");
    const consent = code.indexOf("'consent', 'default'");
    const cookieScript = code.indexOf("cdn.cookie-script.com");
    const gtm = code.indexOf("googletagmanager.com/gtm.js");

    expect(consent).toBeGreaterThan(-1);
    expect(consent).toBeLessThan(cookieScript);
    expect(cookieScript).toBeLessThan(gtm);
    expect(code).toContain("analytics_storage: 'denied'");
    expect(code).toContain('"GTM-TEST"');
    expect(code).toContain('"abc123"');
  });

  it("leaves out whatever is not configured", () => {
    expect(bootstrap(undefined, "abc123")).not.toContain("googletagmanager");
    expect(bootstrap("GTM-TEST", undefined)).not.toContain("cookie-script");
  });
});
