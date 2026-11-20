import { render, screen } from "@testing-library/react";
import {
  senderKey,
  isStaff,
  staffCanOpen,
  staffHome,
  staffRoleLabel,
} from "@/lib/staff-access";

const replace = jest.fn();
let pathname = "/admin/vendors";
let user: { id: string; role: string } | null = null;

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => pathname,
}));
jest.mock("@/hooks", () => ({
  useCurrentUser: () => ({ data: user, isLoading: false }),
}));

import AdminGuard from "@/components/organisms/AdminGuard";

describe("who may use which part of the admin panel", () => {
  it("lets admins, the super admin and customer service in — nobody else", () => {
    expect(isStaff("ADMIN")).toBe(true);
    expect(isStaff("SUPER_ADMIN")).toBe(true);
    expect(isStaff("SUPPORT")).toBe(true);
    expect(isStaff("SELLER")).toBe(false);
    expect(isStaff("BUYER")).toBe(false);
    expect(isStaff(undefined)).toBe(false);
  });

  it("keeps customer service to Conversations", () => {
    expect(staffCanOpen("SUPPORT", "/admin/conversations")).toBe(true);
    expect(staffCanOpen("SUPPORT", "/admin/conversations/c1")).toBe(true);
    for (const page of ["/admin", "/admin/vendors", "/admin/kyc", "/admin/withdrawals", "/admin/admins"]) {
      expect(staffCanOpen("SUPPORT", page)).toBe(false);
    }
    // Not fooled by a page that only starts with the same letters.
    expect(staffCanOpen("SUPPORT", "/admin/conversations-export")).toBe(false);
  });

  it("lets admins open everything", () => {
    expect(staffCanOpen("ADMIN", "/admin/kyc")).toBe(true);
    expect(staffCanOpen("SUPER_ADMIN", "/admin/admins")).toBe(true);
  });

  it("lands each where their work is", () => {
    expect(staffHome("SUPPORT")).toBe("/admin/conversations");
    expect(staffHome("ADMIN")).toBe("/admin");
  });

  it("names the roles as the team says them", () => {
    expect(staffRoleLabel("SUPPORT")).toBe("Customer Service");
    expect(staffRoleLabel("ADMIN")).toBe("Admin");
    expect(staffRoleLabel("SUPER_ADMIN")).toBe("Super Admin");
  });
});

describe("AdminGuard", () => {
  beforeEach(() => replace.mockReset());

  it("sends customer service from another admin page to Conversations", () => {
    user = { id: "s1", role: "SUPPORT" };
    pathname = "/admin/vendors";

    render(
      <AdminGuard>
        <p>Vendors page</p>
      </AdminGuard>
    );

    expect(screen.queryByText("Vendors page")).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith("/admin/conversations");
  });

  it("shows customer service the conversations", () => {
    user = { id: "s1", role: "SUPPORT" };
    pathname = "/admin/conversations/c1";

    render(
      <AdminGuard>
        <p>A conversation</p>
      </AdminGuard>
    );

    expect(screen.getByText("A conversation")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("still shows admins any page", () => {
    user = { id: "a1", role: "ADMIN" };
    pathname = "/admin/vendors";

    render(
      <AdminGuard>
        <p>Vendors page</p>
      </AdminGuard>
    );

    expect(screen.getByText("Vendors page")).toBeInTheDocument();
  });
});

describe("who sent each message", () => {
  it("tells two agents apart, and both apart from the assistant", () => {
    const amaka = senderKey({ author: "ASSISTANT", adminId: "agent-1" });
    const danny = senderKey({ author: "ASSISTANT", adminId: "agent-2" });
    const assistant = senderKey({ author: "ASSISTANT", adminId: null });

    // Different senders break the run, so each keeps their own name under the bubble.
    expect(amaka).not.toBe(danny);
    expect(amaka).not.toBe(assistant);
    expect(senderKey({ author: "ASSISTANT", adminId: "agent-1" })).toBe(amaka);
    expect(senderKey({ author: "BUYER" })).toBe("buyer");
  });
});
