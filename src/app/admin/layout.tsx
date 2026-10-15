import { NO_INDEX } from "@/lib/site";

// The staff console: never in search results (robots.txt also keeps crawlers out).
export const metadata = { robots: NO_INDEX };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
