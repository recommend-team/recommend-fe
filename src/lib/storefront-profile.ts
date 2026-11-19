import type { OperatingHours } from "@/types";

/**
 * The human side of a vendor's shop: how to reach them, when they open, who runs it.
 *
 * Times are the vendor's, in Lagos — Nigeria has no daylight saving, so WAT is UTC+1 all
 * year, the same rule the backend's opening-hours util uses.
 */

const LAGOS = "Africa/Lagos";

/** The order a week is read in, and the keys `operatingHours` uses. */
const WEEK = [
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
  ["sunday", "Sunday"],
] as const;

/** "08012345678", "+234 801 234 5678" → "2348012345678". Null when it can't be a number. */
function internationalDigits(phone: string | null | undefined): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits.length >= 10 ? digits : null;
}

/** A WhatsApp chat with the vendor, opening with a line that says where they came from. */
export function whatsappHref(
  phone: string | null | undefined,
  storeName: string
): string | null {
  const digits = internationalDigits(phone);
  if (!digits) return null;
  const hello = `Hi ${storeName}, I found your shop on Recommend.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(hello)}`;
}

export function phoneHref(phone: string | null | undefined): string | null {
  const digits = internationalDigits(phone);
  return digits ? `tel:+${digits}` : null;
}

/** "+234 801 234 5678" — how a Nigerian number is read aloud. */
export function displayPhone(phone: string | null | undefined): string | null {
  const digits = internationalDigits(phone);
  if (!digits) return null;
  if (digits.length === 13 && digits.startsWith("234")) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return `+${digits}`;
}

/** "09:00" → "9am", "21:30" → "9:30pm", "00:00" → "midnight", "12:00" → "noon". */
export function clockText(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  if (h === 0 && m === 0) return "midnight";
  if (h === 12 && m === 0) return "noon";
  const hour = h % 12 || 12;
  const suffix = h < 12 ? "am" : "pm";
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
}

/** The Lagos wall clock of an instant, as "HH:mm". */
function lagosClock(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LAGOS,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

/** Days since an epoch, counted on the Lagos calendar — to tell today from tomorrow. */
function lagosDayNumber(date: Date): number {
  return Math.floor((date.getTime() + 60 * 60 * 1000) / 86_400_000);
}

function lagosWeekday(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: LAGOS, weekday: "long" }).format(date);
}

/** "Opens today at noon", "Opens tomorrow at 9am", "Opens Monday at 9am". */
export function opensText(opensAt: string | null | undefined, now: Date): string {
  if (!opensAt) return "Not taking orders for now";
  const at = new Date(opensAt);
  if (Number.isNaN(at.getTime())) return "Not taking orders for now";
  const days = lagosDayNumber(at) - lagosDayNumber(now);
  const when = days <= 0 ? "today" : days === 1 ? "tomorrow" : lagosWeekday(at);
  return `Opens ${when} at ${clockText(lagosClock(at))}`;
}

/** "Open until 9pm" — or just "Open now" when there is no closing time. */
export function openUntilText(closesAt: string | null | undefined): string {
  if (!closesAt) return "Open now";
  const at = new Date(closesAt);
  return Number.isNaN(at.getTime()) ? "Open now" : `Open until ${clockText(lagosClock(at))}`;
}

export interface HoursRow {
  day: string;
  text: string;
  today: boolean;
  closed: boolean;
}

/** The week from Monday, today marked. Null when the vendor has set no hours. */
export function weekRows(
  hours: Record<string, OperatingHours | undefined> | null | undefined,
  now: Date
): HoursRow[] | null {
  if (!hours) return null;
  const today = lagosWeekday(now).toLowerCase();
  return WEEK.map(([key, day]) => {
    const slot = hours[key];
    const closed = !slot?.isOpen;
    const text = closed
      ? "Closed"
      : slot.open === slot.close
        ? "Open all day"
        : `${clockText(slot.open)} – ${clockText(slot.close)}`;
    return { day, text, today: key === today, closed };
  });
}

/** "March 2026". Null for a missing or unreadable date. */
export function memberSinceText(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", { timeZone: LAGOS, month: "long", year: "numeric" }).format(at);
}

/** A kitchen rather than a shop — "See the menu" rather than "Shop now". */
export function sellsFood(category: string | null | undefined): boolean {
  return /food|restaurant|kitchen|grill|barbecue|bbq|caf[eé]|bakery|buka|eatery|catering|chops|snack|suya/i.test(
    category ?? ""
  );
}
