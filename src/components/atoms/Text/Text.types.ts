import React, { ReactNode } from "react";

export type TextVariant =
  | "hero-heading"
  | "hero-subtext"
  | "section-heading-96"
  | "section-heading-48"
  | "section-heading-48-right"
  | "section-heading-48-center"
  | "cta-label"
  | "cta-sublabel"
  | "ticker"
  | "neighborhoods-title"
  | "neighborhoods-list"
  | "tap-hint"
  | "footer-input-placeholder"
  | "stats-number"
  | "stats-label"
  | "section-label"
  | "origin-card-heading"
  | "origin-card-body"
  | "origin-closing"
  | "faq-question"
  | "faq-answer";

export type TextColor =
  | "orange"
  | "dark"
  | "green"
  | "white"
  | "inherit"
  | "grey";

export interface TextProps {
  variant: TextVariant;
  color?: TextColor;
  as?: React.ElementType;
  className?: string;
  children: ReactNode;
}