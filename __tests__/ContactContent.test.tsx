import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ContactContent, { contactPayload } from "@/components/templates/ContactContent";
import { sendContactMessage } from "@/services/contact.service";
import { ApiError } from "@/lib/api";

jest.mock("@/lib/links", () => ({ CUSTOMER_APP_URL: "https://order.example" }));
jest.mock("@/services/contact.service", () => ({ sendContactMessage: jest.fn() }));
jest.mock("@/lib/api", () => {
  class ApiError extends Error {
    constructor(message: string, readonly status: number, readonly fieldErrors?: { field: string; message: string }[]) {
      super(message);
    }
  }
  return { ApiError, request: jest.fn() };
});
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
  beforeEach(() => jest.mocked(sendContactMessage).mockReset());

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
    render(<ContactContent />);

    fireEvent.submit(screen.getByRole("button", { name: /Send message/ }).closest("form")!);

    expect(await screen.findByText("Please enter your name")).toBeInTheDocument();
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  const fillIn = () => {
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Ada Okafor" } });
    fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/Order reference/), { target: { value: "REC-123" } });
    fireEvent.change(screen.getByLabelText(/^Message/), { target: { value: "My jollof never arrived." } });
    fireEvent.submit(screen.getByRole("button", { name: /Send message/ }).closest("form")!);
  };

  it("sends the message to the team and says so, by name", async () => {
    jest.mocked(sendContactMessage).mockResolvedValue();
    render(<ContactContent />);

    fillIn();

    await waitFor(() => expect(sendContactMessage).toHaveBeenCalledTimes(1));
    expect(sendContactMessage).toHaveBeenCalledWith({
      fullName: "Ada Okafor",
      email: "ada@example.com",
      topic: "Order or delivery",
      orderReference: "REC-123",
      message: "My jollof never arrived.",
      website: "",
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Thanks, Ada. We've got your message.");
    expect(screen.getByRole("status")).toHaveTextContent("ada@example.com");
  });

  it("keeps what the visitor typed when sending fails, and says why", async () => {
    jest.mocked(sendContactMessage).mockRejectedValue(
      new ApiError("We couldn't send your message just now. Please try again in a moment.", 503)
    );
    render(<ContactContent />);

    fillIn();

    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't send your message just now");
    expect(screen.getByRole("alert")).toHaveTextContent("Your message is still here");
    expect(screen.getByLabelText(/^Message/)).toHaveValue("My jollof never arrived.");
  });

  it("tells the visitor when they are offline", async () => {
    jest.mocked(sendContactMessage).mockRejectedValue(new ApiError("Network request failed.", 0));
    render(<ContactContent />);

    fillIn();

    expect(await screen.findByRole("alert")).toHaveTextContent("couldn't reach our server");
  });
});

describe("contactPayload", () => {
  const values = {
    fullName: " Ada ",
    email: "ada@example.com",
    phoneNumber: "",
    orderReference: "REC-1",
    message: "Hello there",
    website: "",
  };

  it("leaves out an empty phone, and the order reference on other topics", () => {
    const payload = contactPayload("Something else", values);

    expect(payload).not.toHaveProperty("phoneNumber");
    expect(payload).not.toHaveProperty("orderReference");
    expect(payload.fullName).toBe("Ada");
  });
});
