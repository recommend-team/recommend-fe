import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to conditionally combine class names and resolve Tailwind CSS conflicts.
// Later classes override earlier ones safely.
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
