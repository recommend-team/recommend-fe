"use client";

import { usePathname } from "next/navigation";
import GeneralHeader from "./GeneralHeader";

// `/vendor` is the pitch page and keeps the header. Vendor sign-up, sign-in and the
// dashboard all live in the vendor app now, so there is nothing else here to hide.
const HIDDEN_ON = ["/rider/signup", "/rider/login"];

export default function ConditionalHeader() {
  const pathname = usePathname();
  const shouldHide = HIDDEN_ON.some((path) => pathname.startsWith(path));
  if (shouldHide) return null;
  return <GeneralHeader />;
}