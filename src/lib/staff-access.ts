/**
 * Who may use which part of the admin panel. One place, so the login page, the route
 * guard and the sidebar can never disagree.
 *
 * Customer service (`SUPPORT`) answer buyers in Conversations and see nothing else; the
 * backend refuses them everywhere else too — this only keeps them off pages that would
 * fail to load.
 */

export type StaffRole = "SUPER_ADMIN" | "ADMIN" | "SUPPORT";

const STAFF: readonly string[] = ["SUPER_ADMIN", "ADMIN", "SUPPORT"];

export function isStaff(role: string | null | undefined): role is StaffRole {
  return !!role && STAFF.includes(role);
}

export function isSupport(role: string | null | undefined): boolean {
  return role === "SUPPORT";
}

const CONVERSATIONS = "/admin/conversations";

/** Whether someone with `role` may open this admin page. */
export function staffCanOpen(role: string | null | undefined, pathname: string): boolean {
  if (!isStaff(role)) return false;
  if (!isSupport(role)) return true;
  return pathname === CONVERSATIONS || pathname.startsWith(`${CONVERSATIONS}/`);
}

/** Where someone lands after signing in, or when sent away from a page they can't use. */
export function staffHome(role: string | null | undefined): string {
  return isSupport(role) ? CONVERSATIONS : "/admin";
}

export function staffRoleLabel(role: string | null | undefined): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "SUPPORT":
      return "Customer Service";
    default:
      return "Admin";
  }
}

/**
 * Who wrote a chat message: the buyer, the assistant, or one particular person on the
 * team. The transcript starts a new run of bubbles whenever this changes, so every reply
 * is stamped with who sent it — two agents answering back to back each keep their name.
 */
export function senderKey(message: { author: string; adminId?: string | null }): string {
  if (message.author === "BUYER") return "buyer";
  return message.adminId ? `admin:${message.adminId}` : "assistant";
}
