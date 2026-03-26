import React from "react";
import { TextProps, TextVariant, TextColor } from "./Text.types";

const sizeStyles = {
  "64": "text-[40px] md:text-[64px] lg:text-[64px]",
  "48": "text-[32px] md:text-[40px] lg:text-[48px]",
  "24": "text-[18px] md:text-[20px] lg:text-[24px]",
  "20": "text-[20px] md:text-[20px]",
  "16": "text-[14px] md:text-[16px]",
  "12": "text-[11px] md:text-[12px]",
};

const alignStyles = {
  left:    "text-left",
  center:  "text-center",
  right:   "text-right",
  inherit: "",
};

const variantStyles: Record<TextVariant, string> = {
  "hero-heading":
    `font-champ font-black ${sizeStyles["64"]} ${alignStyles.center} leading-none`,
  "hero-subtext":
    `font-dm font-extrabold ${sizeStyles["20"]} ${alignStyles.center} leading-none`,
  "section-heading-96":
    `font-champ font-black ${sizeStyles["64"]} ${alignStyles.inherit} leading-none`,
  "section-heading-48":
    `font-champ font-black ${sizeStyles["48"]} ${alignStyles.inherit} leading-none`,
  "section-heading-48-right":
    `font-champ font-black ${sizeStyles["48"]} ${alignStyles.right} leading-none`,
  "section-heading-48-center":
    `font-champ font-black ${sizeStyles["48"]} ${alignStyles.center} leading-none`,
  "cta-label":
    `font-champ font-black ${sizeStyles["24"]} ${alignStyles.center} leading-none`,
  "cta-sublabel":
    `font-dm font-extrabold ${sizeStyles["16"]} ${alignStyles.center} leading-none`,
  "ticker":
    `font-champ font-black ${sizeStyles["48"]} ${alignStyles.inherit} whitespace-nowrap leading-none`,
  "neighborhoods-title":
    `font-dm font-extrabold ${sizeStyles["20"]} ${alignStyles.inherit} leading-none`,
  "neighborhoods-list":
    `font-dm font-extrabold ${sizeStyles["16"]} ${alignStyles.inherit} leading-none`,
    "tap-hint":
  `font-dm font-medium ${sizeStyles["12"]} ${alignStyles.center} leading-none tracking-wide`,
};

const colorStyles: Record<TextColor, string> = {
  orange:  "text-[#EF5A22]",
  dark:    "text-[#1A1A1A]",
  green:   "text-[#006837]",
  white:   "text-white",
  inherit: "text-inherit",
};

const defaultTag: Record<TextVariant, React.ElementType> = {
  "hero-heading":              "h1",
  "hero-subtext":              "p",
  "section-heading-96":        "h2",
  "section-heading-48":        "h2",
  "section-heading-48-right":  "h2",
  "section-heading-48-center": "h2",
  "cta-label":                 "span",
  "cta-sublabel":              "span",
  "ticker":                    "span",
  "neighborhoods-title":       "h3",
  "neighborhoods-list":        "p",
  "tap-hint":                  "span",
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