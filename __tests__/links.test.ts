const ORIGINAL = { ...process.env };

function load(env: Record<string, string | undefined>) {
  jest.resetModules();
  process.env = { ...ORIGINAL, ...env } as NodeJS.ProcessEnv;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/lib/links") as typeof import("@/lib/links");
}

describe("links", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL };
    jest.restoreAllMocks();
  });

  it("uses the configured vendor app", () => {
    const links = load({ NEXT_PUBLIC_VENDOR_APP_URL: "https://vendors.example/" });

    expect(links.vendorApp("/signup")).toBe("https://vendors.example/signup");
  });

  it("falls back to staging outside production, so the buttons work without setup", () => {
    const links = load({
      NODE_ENV: "development",
      NEXT_PUBLIC_VENDOR_APP_URL: undefined,
      NEXT_PUBLIC_CUSTOMER_APP_URL: undefined,
    });

    expect(links.vendorApp("/login")).toBe("https://recommend-vendors.vercel.app/login");
    expect(links.CUSTOMER_APP_URL).toBe("https://recommend-customer-app.vercel.app");
  });

  it("never sends production visitors to staging — it disables the buttons and says why", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const links = load({ NODE_ENV: "production", NEXT_PUBLIC_VENDOR_APP_URL: undefined });

    expect(links.vendorApp("/signup")).toBe("");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("NEXT_PUBLIC_VENDOR_APP_URL is not set"));
  });
});
