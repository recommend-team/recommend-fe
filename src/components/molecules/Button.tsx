import React, { ReactNode } from "react";
import { Card } from "../atoms/Card";
import { cn } from "@/lib/utilities";

type ButtonProps = {
  text: string;
  icon?: ReactNode;
  variant: "green" | "gradient";
};

const Button: React.FC<ButtonProps> = ({ text, icon, variant }) => {
  const variants = {
    green: {
      cardVariant: "regular" as const,
      bg: "bg-[#006837]",
      textColor: "text-white",
    },
    gradient: {
      cardVariant: "gradient" as const,
      bg: "bg-[#FFFFDC]",
      textColor: "text-black",
    },
  };

  return (
    <Card
      variant={variants[variant].cardVariant}
      rounded="lg"
      padding="small"
      className={variants[variant].bg}
    >
      <button className={cn("flex items-center gap-2 px-3", variants[variant].textColor)}>
        {icon && <span className="w-6 h-6 flex items-center justify-center">{icon}</span>}
        {text}
      </button>
    </Card>
  );
};

export { Button };
