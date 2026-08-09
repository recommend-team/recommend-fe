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
  /**
   * Where the button goes.
   *
   * Renders a real anchor rather than a click handler, so it can be middle-clicked,
   * opened in a new tab, and announced as a link by a screen reader.
   *
   * Passing `href=""` counts as *meant to link somewhere, but the value never arrived* —
   * typically an unset environment variable — and renders the button disabled. Better a
   * button that admits it does nothing than one that looks live and swallows the tap.
   */
  href?: string;
  /** Opens in a new tab. For destinations that are not this site. */
  external?: boolean;
  className?: string;
};

const Button = ({
  text,
  icon,
  variant,
  disabled = false,
  onClick,
  href,
  external = false,
  className,
}: ButtonProps) => {
  const isLink = typeof href === "string" && href.length > 0;
  const isDisabled = disabled || (href !== undefined && !isLink);

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

  const currentStyles = isDisabled
    ? variants[variant].disabledBg
    : variants[variant].bg;

  const inner = (
    <>
      <span className="whitespace-nowrap font-bold">{text}</span>
      {icon && <span className="flex items-center justify-center">{icon}</span>}
    </>
  );

  const innerClassName =
    "flex w-full items-center justify-center gap-2 px-3 font-medium outline-none";

  return (
    <div className="flex">
      <Card
        variant={variants[variant].cardVariant}
        rounded="sm"
        padding="small"
        hoverable={!isDisabled}
        className={cn(
          "transition-all duration-200 active:scale-95 select-none",
          isDisabled ? "cursor-not-allowed" : "cursor-pointer",
          currentStyles,
          className,
        )}
      >
        {isLink && !disabled ? (
          <a
            href={href}
            onClick={onClick}
            {...(external
              ? // noreferrer alongside noopener: the destination has no business
                // knowing which page sent the buyer.
                { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={innerClassName}
          >
            {inner}
          </a>
        ) : (
          <button
            disabled={isDisabled}
            onClick={onClick}
            className={innerClassName}
          >
            {inner}
          </button>
        )}
      </Card>
    </div>
  );
};

export { Button };
