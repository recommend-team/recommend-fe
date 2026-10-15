import { NO_INDEX } from "@/lib/site";

// Reached only from an emailed link, with a token in the URL — nothing to find in search.
export const metadata = { robots: NO_INDEX };

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
