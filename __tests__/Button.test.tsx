import { render, screen } from "@testing-library/react";
import { Button } from "@/components/molecules/Button";

describe("Button", () => {
  it.each(["green", "orange"] as const)(
    "keeps %s button text white even with no link to go to",
    (variant) => {
      // href="" is how a missing NEXT_PUBLIC_VENDOR_APP_URL arrives.
      const { container } = render(<Button variant={variant} text="Become a Vendor" href="" />);

      expect(screen.getByRole("button", { name: "Become a Vendor" })).toBeDisabled();
      expect(container.querySelector(".text-white")).not.toBeNull();
    }
  );

  it("is a white-text link when it has somewhere to go", () => {
    const { container } = render(
      <Button variant="green" text="Become a Vendor" href="https://vendors.example/signup" />
    );

    expect(screen.getByRole("link", { name: "Become a Vendor" })).toHaveAttribute(
      "href",
      "https://vendors.example/signup"
    );
    expect(container.querySelector(".text-white")).not.toBeNull();
  });
});
