import { cn } from "@/lib/utilities";
import { ReactNode } from "react";

// Types
type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "regular" | "gradient" | "none";
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
  sm: "rounded-[1.1rem]",
  lg: "rounded-3xl",
};

const radiusInner = {
  sm: "rounded-[1rem]",
  lg: "rounded-[1.4rem]",
};


const Card = ({
  children,
  className,
  variant = "regular",
  padding = "medium",
  rounded = "lg",
  hoverable = true,
}: CardProps) => {
  // Hover & Transition Logic
  const hoverClasses = hoverable
    ? "hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-out"
    : "";

  const varis = {
    gradient: cn(
      "p-0.5 bg-brand-gradient shadow-lg shadow-pink-200/50",
      "hover:brightness-110 hover:shadow-pink-300/60",
      hoverClasses,
    ),

    regular: cn(
      "border-2 border-gray-100 bg-white shadow-md",
      "hover:border-gray-200",
      hoverClasses,
    ),
    none: cn("bg-white shadow-md", hoverClasses),
  };

  if (variant === "gradient") {
    return (
      <div className={cn(radius[rounded], varis[variant])}>
      <div
        className={cn(
          "bg-white",
          radiusInner[rounded],
          paddings[padding],
          className,
        )}
      >
        {children}
      </div>
      </div>
    );
  }

  // Standard return for regular/none to keep DOM tree shallow and avoid double shadows
  return (
    <div
      className={cn(
        radius[rounded],
        varis[variant],
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
};

export { Card };
