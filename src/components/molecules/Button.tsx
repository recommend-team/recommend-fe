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
      bg: "bg-recommend-green text-white hover:bg-recommend-green-hover active:bg-recommend-green-active",
      disabledBg: "bg-recommend-green opacity-50 cursor-not-allowed",
    },
    gradient: {
      cardVariant: "gradient" as const,
      bg: "bg-recommend-amber text-black hover:bg-recommend-amber-hover active:bg-recommend-amber-active",
      disabledBg: "bg-recommend-amber opacity-50 cursor-not-allowed",
    },
  };

  const currentStyles = disabled
    ? variants[variant].disabledBg
    : variants[variant].bg;

  return (
    <Card
      variant={variants[variant].cardVariant}
      rounded="sm"
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
