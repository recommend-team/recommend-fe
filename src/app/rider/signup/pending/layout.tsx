import { NO_INDEX } from "@/lib/site";

// Shown after a rider signs up — a dead end for anyone arriving from search.
export const metadata = { robots: NO_INDEX };

export default function RiderPendingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
