import { render, screen, within } from "@testing-library/react";

jest.mock("@/components/templates/BackgroundThree", () => ({
  BackgroundThree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const load = (url: string) => {
  jest.resetModules();
  jest.doMock("@/lib/links", () => ({ CUSTOMER_APP_URL: url }));
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/components/templates/WhatYouCanOrderSection").default as React.FC;
};

describe("WhatYouCanOrderSection", () => {
  it("shows every category at once, with what is live and what is coming", () => {
    const Section = load("https://order.example");
    render(<Section />);

    expect(screen.getByRole("heading", { name: /Anything near you/ })).toBeInTheDocument();
    for (const title of ["Grab a bite", "Everyday essentials", "Medicine & wellness"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(screen.getByText("COMING SOON")).toBeInTheDocument();
    expect(screen.getByText("Fresh from market")).toBeInTheDocument();
    expect(screen.getByText("Beauty & fashion")).toBeInTheDocument();
  });

  it("lists real dishes with their vendors and prices", () => {
    const Section = load("https://order.example");
    render(<Section />);

    const jollof = screen.getByText("Jollof Rice with Chicken").closest("li")!;
    expect(within(jollof).getByText("Mama Ngozi Kitchen")).toBeInTheDocument();
    expect(within(jollof).getByText("₦3,500")).toBeInTheDocument();
  });

  it("sends every ask into the customer app, in a new tab", () => {
    const Section = load("https://order.example");
    render(<Section />);

    for (const name of [/Ask for food/, /Ask for essentials/, /Ask a pharmacy/, /Start Ordering/]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("href", "https://order.example");
      expect(link).toHaveAttribute("target", "_blank");
    }
  });

  it("does not render dead links when the app URL is missing", () => {
    const Section = load("");
    render(<Section />);

    expect(screen.queryByRole("link", { name: /Ask for food/ })).not.toBeInTheDocument();
    expect(screen.getByText("Ask for food")).toBeInTheDocument();
  });
});
