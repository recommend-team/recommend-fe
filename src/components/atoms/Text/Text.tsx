import React from "react";
import { TextProps, TextVariant, TextColor } from "./Text.types";

const variantStyles: Record<TextVariant, string> = {
  "hero-heading":
    "font-champ font-black text-[40px] leading-[60px] md:text-[64px] md:leading-[96px] lg:text-[96px] lg:leading-[108px] text-center",

  "hero-subtext":
    "font-dm font-extrabold text-[16px] leading-[24px] md:text-[20px] md:leading-[28px] text-center",

  "section-heading-96":
    "font-champ font-black text-[48px] md:text-[72px] lg:text-[96px] leading-none",

  "section-heading-48":
    "font-champ font-black text-[32px] md:text-[40px] lg:text-[48px] leading-none",

  "section-heading-48-right":
    "font-champ font-black text-[32px] md:text-[40px] lg:text-[48px] text-right leading-none",

  "section-heading-48-center":
    "font-champ font-black text-[32px] md:text-[40px] lg:text-[48px] text-center leading-none",

  "cta-label":
    "font-champ font-black text-[18px] md:text-[20px] lg:text-[24px] text-center leading-none",

  "cta-sublabel":
    "font-dm font-extrabold text-[14px] md:text-[16px] text-center leading-none",

  ticker:
    "font-champ font-black text-[24px] md:text-[36px] lg:text-[48px] whitespace-nowrap leading-none",

  "neighborhoods-title":
    "font-dm font-extrabold text-[18px] md:text-[20px] leading-none",

  "neighborhoods-list":
    "font-dm font-extrabold text-[14px] md:text-[16px] leading-none",
};

const colorStyles: Record<TextColor, string> = {
  orange: "text-[#EF5A22]",
  dark: "text-[#1A1A1A]",
  green: "text-[#006837]",
  white: "text-white",
  inherit: "text-inherit",
};

const defaultTag: Record<TextVariant, React.ElementType> = {
  "hero-heading": "h1",
  "hero-subtext": "p",
  "section-heading-96": "h2",
  "section-heading-48": "h2",
  "section-heading-48-right": "h2",
  "section-heading-48-center": "h2",
  "cta-label": "span",
  "cta-sublabel": "span",
  ticker: "span",
  "neighborhoods-title": "h3",
  "neighborhoods-list": "p",
};

export const Text: React.FC<TextProps> = ({
  variant,
  color = "dark",
  as,
  className = "",
  children,
}) => {
  const Tag = (as ?? defaultTag[variant] ?? "p") as React.ElementType;

  return (
    <Tag
      className={`break-words ${variantStyles[variant]} ${colorStyles[color]} ${className}`}
    >
      {children}
    </Tag>
  );
};