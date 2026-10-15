import { pageMetadata } from "@/lib/site";

// The sign-up page is a client component, so its title lives here. The steps after it
// (register) share it; verify and pending opt out of search in their own layouts.
export const metadata = pageMetadata({
  title: "Become a Recommend rider — sign up",
  description:
    "Sign up to deliver with Recommend in Lagos. Choose how you ride, add your details, and start earning once you're approved.",
  path: "/rider/signup",
});

export default function RiderSignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
