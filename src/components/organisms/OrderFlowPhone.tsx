"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PICKUP_ENABLED } from "@/lib/features";

/**
 * A phone playing one step of a real order, for the landing page.
 *
 * Drawn to match the customer app (`recommend_customer_app` → `components/chat`): orange
 * buyer bubbles, white replies, the cart bar, the orders sheet. The order itself is a real
 * one from the live flow — Mama Ngozi Kitchen, 2 × Jollof Rice with Chicken, ₦8,500 — so
 * what a visitor sees is what they will get.
 *
 * Decorative: the step list beside it carries the meaning, so the phone is hidden from
 * screen readers rather than read out every few seconds.
 */

export interface OrderFlowStep {
  title: string;
  body: string;
}

export const ORDER_FLOW_STEPS: readonly OrderFlowStep[] = [
  {
    title: "Ask for anything",
    body: "We find it from vendors near you, with real prices.",
  },
  {
    title: "Add to your cart",
    body: "Browse a vendor's menu without leaving the chat.",
  },
  {
    title: "Check out in the chat",
    body: PICKUP_ENABLED
      ? "Your name, number, and delivery or pickup."
      : "Your name, number, and delivery address.",
  },
  {
    title: "Pay securely",
    body: "Card, transfer or USSD via Paystack. You never leave the chat.",
  },
  {
    title: "Order confirmed",
    body: "The vendor starts on it right away.",
  },
  {
    title: "Track it to your door",
    body: "Live updates, and a code to read to the rider.",
  },
];

/**
 * A menu item. `image` is optional: drop a photo in `public/images/order-flow/` and name
 * it here; without one, a warm tile in the item's colour stands in.
 */
interface Item {
  name: string;
  price: string;
  tile: string;
  image?: string;
  description?: string;
}

const IYA_BASIRA: Item[] = [
  { name: "Beans and Fried Plantain", price: "₦2,650", tile: "#b9774a" },
  { name: "Chicken Shawarma", price: "₦3,700", tile: "#d9b48a" },
  { name: "Egusi Soup and Semovita", price: "₦4,200", tile: "#c98d2e" },
];

const JOLLOF: Item = {
  name: "Jollof Rice with Chicken",
  price: "₦3,500",
  tile: "#c0542a",
  description:
    "Party-style jollof cooked in pepper and tomato stock, served with grilled chicken.",
};

const SUYA: Item = {
  name: "Suya Platter",
  price: "₦3,000",
  tile: "#8d4a2b",
  description: "Charcoal-grilled beef suya with yaji and onion.",
};

const MAMA_NGOZI_MENU: Item[] = [
  JOLLOF,
  {
    name: "Amala with Ewedu and Gbegiri",
    price: "₦3,800",
    tile: "#7d6a3a",
    description: "Soft amala served the Ibadan way, with buka stew.",
  },
  {
    name: "Nkwobi",
    price: "₦5,500",
    tile: "#a8432a",
    description: "Cow foot in spiced palm oil paste with utazi leaf.",
  },
  SUYA,
];

const REFERENCE = "REC-EA643B0FFDEC";

/**
 * How one step gives way to the next.
 *
 * - `slide` — the new screen slides in from the side it is coming from.
 * - `book` — the old screen turns away on its left edge like a page, uncovering the
 *   next; going back, the earlier page swings shut over it.
 */
export type FlowTransition = "slide" | "book";

/** Long enough for the slowest transition, the page turn. Then the old screen goes. */
const TURN_MS = 750;

interface Leaving {
  step: number;
  forward: boolean;
}

export default function OrderFlowPhone({
  step,
  transition = "book",
}: {
  step: number;
  transition?: FlowTransition;
}) {
  // The step on screen, and the one on its way out. Derived during render rather than in
  // an effect, so the outgoing screen never misses a frame.
  const [shown, setShown] = useState(step);
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  if (step !== shown) {
    setLeaving({ step: shown, forward: isForward(shown, step) });
    setShown(step);
  }

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => setLeaving(null), TURN_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  const motion = leaving ? MOTION[transition][leaving.forward ? "forward" : "back"] : null;

  return (
    <div
      aria-hidden
      className="h-[610px] w-[300px] shrink-0 rounded-[46px] bg-[#1c1c1e] p-2.5 font-dm shadow-[0_30px_60px_rgba(60,40,0,.22),inset_0_0_0_2px_#3a3a3c] md:h-[690px] md:w-[340px] md:rounded-[50px] md:p-3"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[37px] bg-[#faf6e1] md:rounded-[39px]">
        {/* Header — the one part that stays put while the screens change beneath it */}
        <div className="relative z-30 flex items-center gap-2.5 border-b border-[#ece6c8] bg-[#faf6e1] px-3.5 pt-7 pb-2.5">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#f04e23] text-[13px] font-extrabold text-white">
            R
          </span>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-[#e0451b]">Recommend</p>
            <p className="text-[8px] font-bold tracking-[.1em] text-[#98a2b3]">ONLINE</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
          </svg>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden [perspective:1400px]">
          {leaving && motion && (
            <Screen
              key={`out-${leaving.step}`}
              step={leaving.step}
              className={`flow-leaving ${motion.leaving}`}
            />
          )}
          <Screen
            key={`in-${shown}`}
            step={shown}
            className={motion?.entering ?? "z-10"}
            sheetEnters={!!leaving}
          />
        </div>
      </div>
    </div>
  );
}

/** Which way the visitor is going: the autoplay's wrap from 6 to 1 still reads as forward. */
function isForward(from: number, to: number): boolean {
  const steps = ORDER_FLOW_STEPS.length;
  return (to - from + steps) % steps <= steps / 2;
}

/** The classes for each layer — keyframes in `globals.css`, under "Order flow". */
const MOTION: Record<
  FlowTransition,
  Record<"forward" | "back", { entering: string; leaving: string }>
> = {
  slide: {
    forward: { entering: "z-20 flow-slide-in-next", leaving: "z-10 flow-slide-out-next" },
    back: { entering: "z-20 flow-slide-in-prev", leaving: "z-10 flow-slide-out-prev" },
  },
  book: {
    // Forward, the old page lies on top and turns away; back, the earlier page swings
    // shut over the current one.
    forward: { entering: "z-10 flow-page-under", leaving: "z-20 flow-page-turn-away" },
    back: { entering: "z-20 flow-page-turn-back", leaving: "z-10 flow-page-dim" },
  },
};

/** Everything below the header for one step: thread, cart bar, composer, tabs, sheet. */
function Screen({
  step,
  className,
  sheetEnters = false,
}: {
  step: number;
  className: string;
  sheetEnters?: boolean;
}) {
  const showCartBar = step === 3 || step === 4;
  const sheetClass = sheetEnters ? "flow-sheet-up" : "";

  return (
    <div className={`absolute inset-0 flex flex-col bg-[#faf6e1] ${className}`}>
      {/* Thread — anchored to the bottom, so a long screen scrolls off the top like a real chat */}
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-[7px] overflow-hidden bg-[linear-gradient(180deg,#f7f2da_0%,#e4e8cf_55%,#c7dcc6_100%)] px-2.5 pt-2.5 pb-2">
        {step === 1 && <AskScreen />}
        {step === 2 && <BrowseBackdrop />}
        {step === 3 && <CheckoutScreen />}
        {step === 4 && <PayScreen />}
        {step === 5 && <ConfirmedScreen />}
        {step === 6 && <OnItsWayBackdrop />}
      </div>

      {showCartBar && <CartBar className="mx-2 mb-1.5" />}

      {/* Composer and tabs */}
      <div className="flex items-center gap-2 bg-[#faf6e1] px-2.5 py-1.5">
        <span className="flex-1 rounded-full bg-white px-3 py-2 text-[10.5px] text-[#98a2b3]">
          Type a message...
        </span>
        <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#f6b39e]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
            <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
          </svg>
        </span>
      </div>
      <div className="flex items-center justify-around border-t border-[#ece6c8] bg-[#f5efd6] pt-1.5 pb-3.5">
        <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#f04e23]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
            <path d="M4 4h16v12H8l-4 4z" />
          </svg>
        </span>
        <TabIcon>
          <path d="M6 6h15l-1.5 9h-12z" />
          <circle cx="9" cy="20" r="1.3" />
          <circle cx="18" cy="20" r="1.3" />
        </TabIcon>
        <TabIcon>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 8h6M9 12h6" />
        </TabIcon>
        <TabIcon>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
        </TabIcon>
      </div>

      {step === 2 && <VendorSheet className={sheetClass} />}
      {step === 6 && <OrdersSheet className={sheetClass} />}
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function AskScreen() {
  return (
    <>
      <Buyer time="5:03 AM">Hi, what can I eat around Lekki?</Buyer>
      <Reply time="5:04 AM">
        Good morning! Here are some spots near you in Lekki. Prices are just below — let
        me know if anything catches your eye.
      </Reply>
      <VendorCard name="Iya Basira Buka" items={IYA_BASIRA} />
      <VendorCard name="Mama Ngozi Kitchen" items={[JOLLOF, SUYA]} />
    </>
  );
}

function BrowseBackdrop() {
  return (
    <>
      <div className="opacity-55">
        <VendorCard name="Iya Basira Buka" items={IYA_BASIRA.slice(0, 2)} />
      </div>
      <div className="h-[380px] shrink-0" />
    </>
  );
}

function CheckoutScreen() {
  return (
    <>
      <Reply time="5:09 AM">Lovely. What name should I put on the order?</Reply>
      <Buyer time="5:10 AM">Jake Prince</Buyer>
      <Reply time="5:10 AM">
        Thanks, Jake. What number can we reach you on about the order?
      </Reply>
      <Buyer time="5:11 AM">0801 234 5678</Buyer>
      <Reply time="5:11 AM">Would you like it delivered, or will you pick it up?</Reply>
      <div className="flex gap-1.5">
        <Chip>Deliver to me</Chip>
        <Chip>I&apos;ll pick it up</Chip>
      </div>
      <Buyer time="5:11 AM">Deliver to me</Buyer>
      <Reply time="5:11 AM">Where should we deliver it?</Reply>
      <Buyer time="5:12 AM">No 12, Admiralty Way, Lekki</Buyer>
    </>
  );
}

function PayScreen() {
  return (
    <>
      <Reply time="5:12 AM">
        So that&apos;s 2 × Jollof Rice with Chicken, ₦7,000 for the items, delivered to No
        12, Admiralty Way, Lekki. That comes to ₦8,500. Shall I go ahead?
      </Reply>
      <Card>
        <p className="px-2.5 py-2 text-[11px] font-bold text-[#1f2937]">Your order</p>
        <OrderLines />
      </Card>
      <Buyer time="5:14 AM">yes</Buyer>
      <Reply time="5:14 AM">
        That&apos;s ₦8,500 altogether. Tap below to pay — you won&apos;t leave this chat.
      </Reply>
      <Card className="pb-2">
        <div className="pt-2">
          <Totals />
        </div>
        <div className="mx-2.5 rounded-[9px] bg-[#006837] py-2 text-center text-[11.5px] font-extrabold text-white">
          Pay ₦8,500
        </div>
        <p className="mt-1 text-center text-[8px] text-[#98a2b3]">
          Secured by Paystack · you stay in this chat
        </p>
      </Card>
    </>
  );
}

function ConfirmedScreen() {
  return (
    <>
      <div className="w-[92%] self-start rounded-xl bg-[#dfeadb] px-2.5 py-2">
        <p className="text-[11px] font-extrabold text-[#006837]">Paid — ₦8,500</p>
        <p className="mt-0.5 text-[8px] tracking-[.04em] text-[#6b7280]">{REFERENCE}</p>
      </div>
      <Reply time="5:16 AM">
        Payment confirmed — thank you! Your order of 2 items from Mama Ngozi Kitchen has
        been sent through. We&apos;ll deliver to No 12, Admiralty Way, Lekki. Your reference is{" "}
        {REFERENCE}.
      </Reply>
      <Card>
        <div className="flex items-center justify-between bg-[#e9f3ec] px-2.5 py-2">
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#006837]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#006837"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l3 3 5-6" />
            </svg>
            Payment confirmed
          </span>
          <span className="text-[7.5px] font-semibold text-[#6b7280]">{REFERENCE}</span>
        </div>
        <OrderLines />
        <p className="border-t border-[#f2f4f7] px-2.5 py-1.5 text-[8.5px] text-[#98a2b3]">
          Delivering to No 12, Admiralty Way, Lekki
        </p>
      </Card>
    </>
  );
}

function OnItsWayBackdrop() {
  return (
    <>
      <Reply time="5:16 AM">
        Payment confirmed — thank you! Your order of 2 items from Mama Ngozi Kitchen has
        been sent through.
      </Reply>
      <Reply time="5:17 AM">
        Your order is on its way. Your delivery code is UWEUSB — read it to the rider when
        they arrive.
      </Reply>
      <div className="h-[300px] shrink-0" />
    </>
  );
}

// ─── Sheets ───────────────────────────────────────────────────────────────────

/** `className` carries the slide-up when the sheet arrives with its step. */
function Sheet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <>
      <div className={`absolute inset-0 bg-black/30 ${className && "flow-scrim-in"}`} />
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 rounded-t-[20px] bg-white px-3.5 pt-2 pb-4 ${className}`}
      >
        <span className="h-1 w-[34px] self-center rounded-full bg-[#e5e7eb]" />
        {children}
      </div>
    </>
  );
}

function SheetTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-extrabold text-[#1f2937]">{title}</p>
        <p className="text-[9.5px] text-[#98a2b3]">{subtitle}</p>
      </div>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f2f4f7] text-xs text-[#6b7280]">
        ×
      </span>
    </div>
  );
}

function VendorSheet({ className }: { className?: string }) {
  return (
    <Sheet className={className}>
      <SheetTitle title="Mama Ngozi Kitchen" subtitle="Restaurant · Lekki · Open" />
      <div>
        {MAMA_NGOZI_MENU.map((item, index) => (
          <div
            key={item.name}
            className={`flex items-center gap-2.5 py-2 ${
              index < MAMA_NGOZI_MENU.length - 1 ? "border-b border-[#f2f4f7]" : ""
            }`}
          >
            <Thumb item={item} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-bold text-[#1f2937]">{item.name}</p>
              <p className="my-px line-clamp-2 text-[8.5px] leading-[1.3] text-[#98a2b3]">
                {item.description}
              </p>
              <p className="text-[10px] font-extrabold text-[#1f2937]">{item.price}</p>
            </div>
            {item === JOLLOF ? (
              <span className="flex items-center gap-2 rounded-full bg-[#f04e23] px-2.5 py-1 text-[10px] font-extrabold text-white">
                − <span>2</span> +
              </span>
            ) : (
              <AddButton />
            )}
          </div>
        ))}
      </div>
      <CartBar />
    </Sheet>
  );
}

function OrdersSheet({ className }: { className?: string }) {
  return (
    <Sheet className={className}>
      <SheetTitle title="Your orders" subtitle="1 on this device" />
      <div className="overflow-hidden rounded-[14px] border border-[#eceff3]">
        <div className="flex items-center justify-between px-2.5 py-2">
          <span className="rounded-full bg-[#e8ecff] px-2 py-0.5 text-[9px] font-extrabold text-[#3b4cca]">
            On its way
          </span>
          <span className="text-[7.5px] text-[#98a2b3]">{REFERENCE}</span>
        </div>
        <p className="border-t border-[#f2f4f7] px-2.5 py-1 text-[8.5px] font-extrabold tracking-[.06em] text-[#6b7280]">
          MAMA NGOZI KITCHEN
        </p>
        <div className="flex justify-between px-2.5 pb-2 text-[10px] text-[#1f2937]">
          <span>2× Jollof Rice with Chicken</span>
          <span>₦7,000</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#f2f4f7] px-2.5 py-2 text-[9px] text-[#98a2b3]">
          <span>Delivery</span>
          <b className="text-xs text-[#1f2937]">₦8,500</b>
        </div>
        <div className="bg-[#e9f3ec] p-2.5 text-center">
          <p className="text-[8px] font-bold tracking-[.1em] text-[#6b7280]">
            READ THIS CODE TO THE RIDER
          </p>
          <p className="mt-1 font-mono text-[22px] font-extrabold tracking-[.3em] text-[#006837]">
            UWEUSB
          </p>
        </div>
        <div className="bg-[#006837] py-2.5 text-center text-[11.5px] font-extrabold text-white">
          I&apos;ve received this
        </div>
      </div>
    </Sheet>
  );
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

function Buyer({ time, children }: { time: string; children: ReactNode }) {
  return (
    <div className="max-w-[76%] self-end rounded-[13px] rounded-tr-[4px] bg-[#f04e23] px-2.5 pt-[7px] pb-[5px] text-[11.5px] leading-[1.35] text-white">
      {children}
      <span className="mt-0.5 block text-right text-[8px] text-white/75">{time} ✓</span>
    </div>
  );
}

function Reply({ time, children }: { time: string; children: ReactNode }) {
  return (
    <div className="max-w-[84%] self-start rounded-[13px] rounded-tl-[4px] bg-white px-2.5 pt-[7px] pb-[5px] text-[11.5px] leading-[1.35] text-[#1f2937] shadow-[0_1px_2px_rgba(0,0,0,.06)]">
      {children}
      <span className="mt-0.5 block text-right text-[8px] text-[#98a2b3]">{time}</span>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`w-[92%] shrink-0 self-start overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function VendorCard({ name, items }: { name: string; items: Item[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between px-2.5 py-2 text-[11px] font-bold text-[#1f2937]">
        <span>{name}</span>
        <span className="text-[9.5px] text-[#f04e23]">See all</span>
      </div>
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-2 border-t border-[#f2f4f7] px-2.5 py-1.5"
        >
          <Thumb item={item} />
          <div className="flex-1">
            <p className="text-[10.5px] text-[#1f2937]">{item.name}</p>
            <p className="text-[10px] font-extrabold text-[#1f2937]">{item.price}</p>
          </div>
          <AddButton />
        </div>
      ))}
    </Card>
  );
}

function OrderLines() {
  return (
    <>
      <p className="bg-[#fbf3d6] px-2.5 py-1 text-[8.5px] font-extrabold tracking-[.06em] text-[#6b7280]">
        MAMA NGOZI KITCHEN
      </p>
      <div className="flex justify-between px-2.5 py-1.5 text-[10px] text-[#1f2937]">
        <span>2× Jollof Rice with Chicken</span>
        <b>₦7,000</b>
      </div>
      <div className="border-t border-[#f2f4f7] pt-1" />
      <Totals />
    </>
  );
}

function Totals() {
  return (
    <>
      <div className="flex justify-between px-2.5 py-0.5 text-[10px] text-[#6b7280]">
        <span>Items</span>
        <span>₦7,000</span>
      </div>
      <div className="flex justify-between px-2.5 py-0.5 text-[10px] text-[#6b7280]">
        <span>Delivery</span>
        <span>₦1,500</span>
      </div>
      <div className="flex justify-between px-2.5 pt-0.5 pb-2 text-[11px] font-extrabold text-[#1f2937]">
        <span>Total</span>
        <span>₦8,500</span>
      </div>
    </>
  );
}

function Thumb({ item, size = "sm" }: { item: Item; size?: "sm" | "lg" }) {
  const box = size === "lg" ? "h-11 w-11" : "h-8 w-8";
  return item.image ? (
    // eslint-disable-next-line @next/next/no-img-element -- a 44px decorative thumbnail
    <img src={item.image} alt="" className={`${box} shrink-0 rounded-lg object-cover`} />
  ) : (
    <span className={`${box} shrink-0 rounded-lg`} style={{ background: item.tile }} />
  );
}

function AddButton() {
  return (
    <span className="rounded-full bg-[#f04e23] px-2.5 py-1 text-[9.5px] font-bold text-white">
      Add
    </span>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#e5e1cf] bg-[#f3f1e7] px-2.5 py-1.5 text-[10px] font-semibold text-[#1f2937]">
      {children}
    </span>
  );
}

function CartBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl bg-[#006837] px-3 py-2 text-[11px] font-bold text-white ${className}`}
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[10px]">
        2
      </span>
      <span className="flex-1">₦7,000</span>
      <span>View cart</span>
    </div>
  );
}

function TabIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#b8b29a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
