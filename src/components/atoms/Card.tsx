import { cn } from "@/lib/utilities";
import { ReactNode } from "react";

// Types
type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "regular" | "gradient";
  padding?: "small" | "medium" | "large";
  rounded?: "sm" | "lg";
  hoverable?: boolean;
};

// Variants
const paddings = {
  small: "p-2",
  medium: "p-5",
  large: "p-10",
};

const radius = {
  sm: "rounded-xl",
  lg: "rounded-3xl",
};

const Card = ({
  children,
  className,
  variant = "regular",
  padding = "medium",
  rounded = "lg",
  hoverable = true,
}: CardProps) => {
  const isGradient = variant === "gradient";

  const hoverClasses = hoverable
    ? "hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150"
    : "";
  return (
    <div
      className={cn(
        radius[rounded],
        isGradient
          ? `p-0.5 bg-linear-to-r from-[#EF5A22] via-pink-500 to-green-600 shadow-lg shadow-pink-200 ${hoverClasses}`
          : `border-2 border-gray-100 bg-white shadow-md ${hoverClasses}`,
      )}
    >
      <div
        className={cn(
          "bg-white",
          radius[rounded],
          paddings[padding],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { Card };
