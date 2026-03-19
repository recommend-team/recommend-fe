"use client"
import React, { ReactNode, useState } from "react";
import { Card } from "../atoms/Card";
import { cn } from "@/lib/utilities";

type ButtonProps = {
  text: string;
  icon?: ReactNode;
  variant: "green" | "gradient";
  disabled?: boolean;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ text, icon, variant, disabled = false, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    green: {
      cardVariant: "regular" as const,
      bg: "bg-[#006837]",
      textColor: "text-white",
      pressedBg: "bg-[#00552a]",
      disabledBg: "bg-[#006837] opacity-50",
    },
    gradient: {
      cardVariant: "gradient" as const,
      bg: "bg-[#FFFFDC]",
      textColor: "text-black",
      pressedBg: "bg-[#e6e6b8]",
      disabledBg: "bg-[#FFFFDC] opacity-50",
    },
  };

  const currentBg = disabled
    ? variants[variant].disabledBg
    : isPressed
    ? variants[variant].pressedBg
    : variants[variant].bg;

  return (
    <Card
      variant={variants[variant].cardVariant}
      rounded="lg"
      padding="small"
      className={currentBg}
    >
      <button
        disabled={disabled}
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={cn("flex items-center gap-2 px-3", variants[variant].textColor)}
      >
        {icon && <span className="w-6 h-6 flex items-center justify-center">{icon}</span>}
        {text}
      </button>
    </Card>
  );
};

export { Button };