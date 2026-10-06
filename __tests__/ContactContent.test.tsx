import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ContactContent, { composeEnquiry } from "@/components/templates/ContactContent";

jest.mock("@/lib/links", () => ({ CUSTOMER_APP_URL: "https://order.example" }));
jest.mock("@/components/templates/BackgroundThree", () => ({
  BackgroundThree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("@/components/templates/BackgroundTwo", () => ({
  BackgroundTwo: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const decode = (href: string) => {
  const url = new URL(href);
  return {
    to: url.pathname,
    subject: url.searchParams.get("subject"),
    body: url.searchParams.get("body") ?? "",
  };
};

describe("Contact page", () => {
  it("sends buyers with an order to the chat first", () => {
    render(<ContactContent />);

    const fastest = screen.getByText("FASTEST HELP").parentElement!;
    expect(within(fastest).getByRole("link", { name: /Open the chat/ })).toHaveAttribute(
      "href",
      "https://order.example"
    );
  });

  it("routes vendors, riders and press to the inbox with the right subject", () => {
    render(<ContactContent />);

    const vendor = decode(screen.getByRole("link", { name: /Email vendor support/ }).getAttribute("href")!);
    expect(vendor.to).toBe("contacts.recommend@gmail.com");
    expect(vendor.subject).toBe("Vendor support");
    expect(vendor.body).toContain("Business name:");

    expect(decode(screen.getByRole("link", { name: /Email rider support/ }).getAttribute("href")!).subject).toBe(
      "Rider support"
    );
  });

  it("shows the real details: phone to call, hours, and every social account", () => {
    render(<ContactContent />);
    const details = screen.getByRole("complementary", { name: "Contact details" });

    expect(within(details).getByRole("link", { name: "+234 814 306 7676" })).toHaveAttribute(
      "href",
      "tel:+2348143067676"
    );
    expect(within(details).getByText("Monday – Friday: 8am – 9pm")).toBeInTheDocument();
    for (const name of ["Instagram", "X", "LinkedIn", "TikTok"]) {
      expect(within(details).getByRole("link", { name })).toHaveAttribute("target", "_blank");
    }
  });

  it("asks for an order reference only when the message is about an order", () => {
    render(<ContactContent />);

    expect(screen.getByLabelText(/Order reference/)).toBeInTheDocument();
    act(() => screen.getByRole("button", { name: "Partnership or press" }).click());
    expect(screen.queryByLabelText(/Order reference/)).not.toBeInTheDocument();
  });

  it("will not send an empty message", async () => {
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    render(<ContactContent />);

    fireEvent.submit(screen.getByRole("button", { name: /Send message/ }).closest("form")!);

    expect(await screen.findByText("Please enter your name")).toBeInTheDocument();
    expect(open).not.toHaveBeenCalled();
    open.mockRestore();
  });

  it("hands the email app everything the visitor typed", async () => {
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    render(<ContactContent />);

    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Ada Okafor" } });
    fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/Order reference/), { target: { value: "REC-123" } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: "My jollof never arrived." } });
    fireEvent.submit(screen.getByRole("button", { name: /Send message/ }).closest("form")!);

    await waitFor(() => expect(open).toHaveBeenCalled());
    const sent = decode(open.mock.calls[0][0] as string);
    expect(sent.subject).toBe("Recommend — Order or delivery");
    expect(sent.body).toContain("Name: Ada Okafor");
    expect(sent.body).toContain("Order: REC-123");
    expect(sent.body).toContain("My jollof never arrived.");
    expect(await screen.findByRole("status")).toHaveTextContent("Your email app should open");
    open.mockRestore();
  });
});

describe("composeEnquiry", () => {
  const values = {
    fullName: "Ada",
    email: "ada@example.com",
    phoneNumber: "",
    orderReference: "REC-1",
    message: "Hello there",
  };

  it("leaves out an empty phone and an order reference on non-order topics", () => {
    const body = decode(composeEnquiry("Something else", values)).body;

    expect(body).not.toContain("Phone:");
    expect(body).not.toContain("Order:");
  });
});
