import { NO_INDEX } from "@/lib/site";

// Mid-sign-up, with the rider's email in the URL.
export const metadata = { robots: NO_INDEX };

export default function RiderVerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
