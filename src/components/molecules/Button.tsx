"use client";
import { ReactNode } from "react";
import { Card } from "../atoms/Card";
import { cn } from "@/lib/utilities";

type ButtonProps = {
  text: string;
  icon?: ReactNode;
  variant: "green" | "gradient";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const Button = ({
  text,
  icon,
  variant,
  disabled = false,
  onClick,
  className,
}: ButtonProps) => {
  const variants = {
    green: {
      cardVariant: "none" as const,
      bg: "bg-[#006837] text-white hover:bg-[#007a41] active:bg-[#00552a]",
      disabledBg: "bg-[#006837] opacity-50 cursor-not-allowed",
    },
    gradient: {
      cardVariant: "gradient" as const,
      bg: "bg-[#FFFFDC] text-black hover:bg-[#fffff0] active:bg-[#e6e6b8]",
      disabledBg: "bg-[#FFFFDC] opacity-50 cursor-not-allowed",
    },
  };

  const currentStyles = disabled
    ? variants[variant].disabledBg
    : variants[variant].bg;

  return (
    <Card
      variant={variants[variant].cardVariant}
      rounded="lg"
      padding="small"
      hoverable={!disabled}
      className={cn(
        "transition-all duration-200 active:scale-95 select-none cursor-pointer",
        currentStyles,
        className,
      )}
    >
      <button
        disabled={disabled}
        onClick={onClick}
        className="flex w-full items-center justify-center gap-2 px-3 font-medium outline-none"
      >
        {icon && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
        <span className="whitespace-nowrap">{text}</span>
      </button>
    </Card>
  );
};

export { Button };
