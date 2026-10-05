/**
 * Where Recommend delivers today. Add an area here and both the coverage check and the
 * FAQ pick it up.
 *
 * One list for the landing page's coverage check and its FAQ, so the two never disagree.
 * Matches the backend's catalog areas only loosely — this is a marketing answer to "do you
 * come to me?", not the check that decides an order. The chat does that.
 */
export const SERVICE_AREAS = [
  "Lekki",
  "Admiralty Way",
  "Ajah",
  "Wole Ariyo Street",
  "Freedom Way",
  "Ikate & Jakande",
  "Igbo Efon",
  "Osapa London",
  "Victoria Arobieke Street",
] as const;

const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Words too common to identify a place on their own. */
const GENERIC = new Set(["street", "road", "way", "and", "phase", "estate", "lagos", "close"]);

/**
 * Words in our area names that are also elsewhere in Lagos — "Victoria Island" is not
 * Victoria Arobieke Street. They still match as part of the full name, never alone.
 */
const AMBIGUOUS = new Set(["victoria", "freedom", "london"]);

/**
 * The served area a buyer's text points at, or null.
 *
 * Generous on purpose: "lekki phase 1", "osapa" and "no 12 admiralty way" all match. A
 * false "yes" costs a buyer a chat that says otherwise; a false "no" costs an order.
 */
export function servedAreaFor(query: string): string | null {
  const typed = normalise(query);
  if (typed.length < 3 || GENERIC.has(typed)) return null;
  const words = typed.split(" ");

  for (const area of SERVICE_AREAS) {
    const name = normalise(area);
    if (typed.includes(name)) return area;
    // The start of a name — "osapa", "admiralty" — but not a generic or ambiguous word.
    if (name.startsWith(typed) && !AMBIGUOUS.has(typed)) return area;
    const distinctive = name
      .split(" ")
      .filter((word) => word.length > 3 && !GENERIC.has(word) && !AMBIGUOUS.has(word));
    if (distinctive.some((word) => words.includes(word))) return area;
  }
  return null;
}
