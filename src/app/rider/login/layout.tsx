import { NO_INDEX } from "@/lib/site";

// A sign-in form: the rider page is what searchers should land on.
export const metadata = { robots: NO_INDEX };

export default function RiderLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
