import { cn } from "@/lib/utilities";
import { ReactNode } from "react";


// Types
type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "regular" | "gradient";
  padding?: "small" | "medium" | "large";
  rounded?: "sm" | "lg";
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
}: CardProps) => {
    const isGradient = variant === "gradient";

  return (
    <div
      className={cn(
        radius[rounded],
        isGradient
          ? "p-0.5 bg-linear-to-r from-[#EF5A22] via-pink-500 to-green-600 shadow-lg shadow-pink-200"
          : "border-2 border-gray-100 bg-white shadow-md"
      )}
    >
      <div
        className={cn(
          "bg-white",
          radius[rounded],
          paddings[padding],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { Card };