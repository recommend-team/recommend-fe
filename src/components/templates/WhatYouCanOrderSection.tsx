import type { ReactNode } from "react";
import { ArrowRight, MessageSquareText, Pill, ShoppingBasket, Soup, Sparkles, Sprout } from "lucide-react";
import { CUSTOMER_APP_URL } from "@/lib/links";
import { Button } from "@/components/molecules/Button";
import { BackgroundThree } from "./BackgroundThree";

/**
 * "What you can order" — every category at once, so a visitor can see in a glance what is
 * live and what is coming.
 *
 * Replaced a scroll-pinned carousel that showed one category per 70vh of scrolling: it
 * held the page still for three and a half screens, hid its heading behind the card, and
 * read as stuck. Here nothing is pinned and nothing moves on its own.
 *
 * Food leads, with real dishes and prices from vendors on the platform. The other live
 * categories show the kind of thing to ask for — no prices, since we have none to quote.
 */

interface Dish {
  name: string;
  vendor: string;
  price: string;
  tile: string;
}

const DISHES: Dish[] = [
  {
    name: "Jollof Rice with Chicken",
    vendor: "Mama Ngozi Kitchen",
    price: "₦3,500",
    tile: "#c0542a",
  },
  {
    name: "Egusi Soup and Semovita",
    vendor: "Iya Basira Buka",
    price: "₦4,200",
    tile: "#c98d2e",
  },
  { name: "Suya Platter", vendor: "Mama Ngozi Kitchen", price: "₦3,000", tile: "#8d4a2b" },
];

const ESSENTIALS = [
  { label: "Rice & noodles", className: "bg-white text-recommend-green -rotate-3" },
  { label: "Diapers", className: "bg-[#FFD91D] text-[#1A1A1A] rotate-2" },
  { label: "Detergent", className: "bg-white text-recommend-green -rotate-2" },
];

export default function WhatYouCanOrderSection() {
  return (
    <BackgroundThree>
      <section
        aria-labelledby="what-you-can-order"
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 font-dm text-[#1A1A1A] md:gap-11 md:px-10 md:py-24"
      >
        {/* Heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-extrabold tracking-[.12em] text-recommend-green md:text-[13px]">
              WHAT YOU CAN ORDER
            </span>
            <h2
              id="what-you-can-order"
              className="font-champ text-[44px] leading-[.98] md:text-[60px] lg:text-[72px] lg:leading-[.95]"
            >
              <span className="block text-recommend-orange">Anything near you.</span>
              <span className="block">Just ask.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-[15px] leading-relaxed text-[#3d4451] md:mb-1.5 md:text-[17px]">
            Food, groceries and medicine from vendors in your area. Don&apos;t see what you
            need? Ask anyway — if someone near you sells it, we&apos;ll find it.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {/* Food — the lead tile */}
          <Tile className="relative flex flex-col gap-5 overflow-hidden bg-recommend-orange p-6 text-white md:col-span-2 md:p-8 lg:row-span-2">
            <span
              aria-hidden
              className="absolute -top-16 -right-16 h-60 w-60 rounded-full bg-white/[.08]"
            />
            <div className="flex items-center justify-between">
              <LiveBadge tone="solid" />
              <IconBox className="bg-white/[.16]">
                <Soup size={26} />
              </IconBox>
            </div>
            <div>
              <h3 className="font-champ text-[34px] leading-none md:text-[46px]">Grab a bite</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/90 md:text-base">
                From local bukas to kitchens and grills — real dishes, real prices.
              </p>
            </div>
            <ul className="overflow-hidden rounded-[18px] bg-white text-[#1f2937] shadow-[0_8px_24px_rgba(0,0,0,.12)]">
              {DISHES.map((dish) => (
                <li
                  key={dish.name}
                  className="flex items-center gap-3 border-b border-[#f2f4f7] px-4 py-3 last:border-b-0"
                >
                  <span
                    aria-hidden
                    className="h-10 w-10 shrink-0 rounded-[10px]"
                    style={{ background: dish.tile }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold md:text-sm">{dish.name}</p>
                    <p className="text-xs text-[#98a2b3]">{dish.vendor}</p>
                  </div>
                  <b className="text-[13px] md:text-sm">{dish.price}</b>
                </li>
              ))}
            </ul>
            <AskLink className="mt-auto w-full justify-center rounded-[14px] bg-white px-5 py-3.5 text-recommend-orange md:w-auto md:self-start">
              Ask for food
            </AskLink>
          </Tile>

          {/* Everyday essentials */}
          <Tile className="flex gap-6 bg-recommend-green p-6 text-white md:col-span-2 md:p-7">
            <div className="flex flex-1 flex-col gap-3.5">
              <LiveBadge tone="glass" />
              <div>
                <h3 className="font-champ text-[28px] leading-none md:text-[34px]">
                  Everyday essentials
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-[15px]">
                  Groceries, household and baby items from stores nearby.
                </p>
              </div>
              <ul className="flex flex-wrap gap-1.5 sm:hidden">
                {ESSENTIALS.map((item) => (
                  <li
                    key={item.label}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${item.className.replace(/-?rotate-\d/, "")}`}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
              <AskLink className="mt-auto text-white">Ask for essentials</AskLink>
            </div>
            <div aria-hidden className="hidden w-[190px] flex-col items-end justify-center gap-2.5 sm:flex">
              <IconBox className="mb-1.5 h-16 w-16 rounded-[20px] bg-white/[.14]">
                <ShoppingBasket size={32} />
              </IconBox>
              {ESSENTIALS.map((item) => (
                <span
                  key={item.label}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold ${item.className}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </Tile>

          {/* Medicine & wellness */}
          <Tile className="flex flex-col gap-3 border border-[#f0ebc4] bg-white p-6">
            <div className="flex items-start justify-between">
              <IconBox className="bg-[#E6F2EB] text-recommend-green">
                <Pill size={26} />
              </IconBox>
              <LiveBadge tone="soft" short />
            </div>
            <h3 className="mt-1 font-champ text-[26px] leading-[1.02]">Medicine &amp; wellness</h3>
            <p className="text-sm leading-relaxed text-[#5b6472]">
              Verified pharmacies for medicines, hygiene and wellness essentials.
            </p>
            <AskLink className="mt-auto text-recommend-green">Ask a pharmacy</AskLink>
          </Tile>

          {/* Coming soon */}
          <div className="flex flex-col gap-3.5 rounded-[28px] border-2 border-dashed border-[#e6d98a] bg-white/45 p-5 md:p-6">
            <span className="text-xs font-extrabold tracking-[.1em] text-[#8a7a24]">
              COMING SOON
            </span>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-3.5">
              <Upcoming
                icon={<Sprout size={22} />}
                title="Fresh from market"
                detail="Fruit, vegetables, grains"
              />
              <Upcoming
                icon={<Sparkles size={22} />}
                title="Beauty & fashion"
                detail="Skincare, hair, tailors"
              />
            </div>
          </div>
        </div>

        {/* Anything else */}
        <div className="flex flex-col gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,.06)] md:flex-row md:items-center md:gap-6 md:py-[18px] md:pr-[18px] md:pl-7">
          <IconBox className="hidden h-11 w-11 rounded-[14px] bg-[#FDE7DF] text-[#d13d16] md:grid">
            <MessageSquareText size={22} />
          </IconBox>
          <p className="flex-1 text-[15px] leading-snug md:text-base">
            <b>Not on the list?</b>{" "}
            <span className="text-[#5b6472]">
              Ask anyway. We search every vendor near you, whatever they sell.
            </span>
          </p>
          <Button
            text="Start Ordering"
            href={CUSTOMER_APP_URL}
            external
            icon={<ArrowRight size={18} />}
            variant="green"
          />
        </div>
      </section>
    </BackgroundThree>
  );
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

function Tile({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-[24px] transition-[transform,box-shadow] duration-200 motion-safe:hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(60,40,0,.16)] md:rounded-[28px] ${className}`}
    >
      {children}
    </div>
  );
}

function IconBox({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span
      aria-hidden
      className={`grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl ${className}`}
    >
      {children}
    </span>
  );
}

function LiveBadge({
  tone,
  short = false,
}: {
  tone: "solid" | "glass" | "soft";
  short?: boolean;
}) {
  const styles = {
    solid: "bg-white text-recommend-green",
    glass: "bg-white/[.14] text-white",
    soft: "bg-[#E6F2EB] text-recommend-green",
  }[tone];
  const dot = tone === "glass" ? "bg-[#8fe3b4]" : "bg-[#1b8f57]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[11px] font-extrabold md:text-xs ${styles}`}
    >
      <span aria-hidden className={`h-[7px] w-[7px] rounded-full ${dot}`} />
      {short ? "Live" : "Live now"}
    </span>
  );
}

/**
 * A way into the customer app. With no app URL configured it renders as text, not a dead
 * link — the same rule `Button` follows.
 */
function AskLink({ className, children }: { className: string; children: ReactNode }) {
  const inner = (
    <>
      {children}
      <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
    </>
  );
  const base = `inline-flex min-h-11 items-center gap-2 text-[15px] font-extrabold ${className}`;

  if (!CUSTOMER_APP_URL) {
    return (
      <span aria-disabled className={`${base} opacity-60`}>
        {inner}
      </span>
    );
  }
  return (
    <a
      href={CUSTOMER_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} self-start hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current`}
    >
      {inner}
    </a>
  );
}

function Upcoming({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3EFC9] text-[#6b5f1c] lg:h-11 lg:w-11 lg:rounded-[14px]"
      >
        {icon}
      </span>
      <div>
        <p className="text-[15px] leading-tight font-extrabold lg:text-base">{title}</p>
        <p className="mt-0.5 text-xs text-[#6b7280] lg:text-[13px]">{detail}</p>
      </div>
    </div>
  );
}
