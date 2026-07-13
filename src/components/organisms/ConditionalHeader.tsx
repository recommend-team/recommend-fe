"use client";

import { usePathname } from "next/navigation";
import GeneralHeader from "./GeneralHeader";

const HIDDEN_ON = [
  "/vendor/signup",
  "/vendor/login",
  "/vendor/dashboard",
  "/rider/signup",
  "/rider/login",
];

export default function ConditionalHeader() {
  const pathname = usePathname();
  const shouldHide = HIDDEN_ON.some((path) => pathname.startsWith(path));
  if (shouldHide) return null;
  return <GeneralHeader />;
}