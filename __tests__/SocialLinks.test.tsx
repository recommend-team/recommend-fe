import { render, screen, within } from "@testing-library/react";
import FooterSection from "@/components/templates/FooterSection";
import { SOCIAL_LINKS } from "@/lib/social";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt } = props as { src: string; alt: string };
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

const EXPECTED = {
  Instagram: "https://www.instagram.com/chatrecommend/",
  X: "https://x.com/heyrecommend",
  LinkedIn: "https://www.linkedin.com/company/userecommend/",
  TikTok: "https://www.tiktok.com/@userecommend01",
};

describe("social links", () => {
  it("are the real accounts, without share-sheet tracking", () => {
    expect(Object.fromEntries(SOCIAL_LINKS.map((s) => [s.label, s.href]))).toEqual(EXPECTED);
    for (const { href } of SOCIAL_LINKS) expect(href).not.toMatch(/[?&](_r|_t|stkn)=/);
  });

  it("open from the footer in a new tab", () => {
    render(<FooterSection />);

    for (const [label, href] of Object.entries(EXPECTED)) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("leaves no footer link pointing nowhere", () => {
    const { container } = render(<FooterSection />);

    expect(container.querySelector('a[href="#"]')).toBeNull();
    expect(screen.getByRole("link", { name: "Vendors" })).toHaveAttribute("href", "/vendor");
    expect(screen.getByRole("link", { name: "FAQs" })).toHaveAttribute("href", "/#faq");
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
    // No page yet — listed, not linked.
    expect(within(container).queryByRole("link", { name: "Blog" })).toBeNull();
  });
});
