/**
 * The shape of a legal document (Terms of Use, Privacy Policy), kept as data so both pages
 * render through one template and the wording can change without touching layout.
 *
 * Text fields are "rich": `**bold**` is emphasised, and email addresses and `www.` links
 * become links. Nothing else is interpreted.
 */

export type Rich = string;

export type LegalBlock =
  /** A numbered sub-heading, e.g. "2.1 What Recommend Does". */
  | { h: string }
  | { p: Rich }
  | { list: Rich[] }
  /** A highlighted paragraph, for the clauses a reader most needs to notice. */
  | { note: Rich; title?: string }
  | { table: { head: string[]; rows: string[][] } };

export type LegalSection = {
  /** The anchor, e.g. "introduction" → /terms#introduction. Stable: other pages may link to it. */
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  eyebrow: string;
  title: string;
  summary: string;
  lastUpdated: string;
  effective?: string;
  sections: LegalSection[];
};

export const LEGAL_EMAIL = "legal@getrecommend.co";
export const COMPANY = "Brand Collaborator Limited";
