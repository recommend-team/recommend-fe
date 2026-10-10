"use client";

import { ArrowRight, Check } from "lucide-react";
import { Button } from "../molecules/Button";
import { BackgroundTwo } from "./BackgroundTwo";
import { vendorApp } from "@/lib/links";

/**
 * The vendor page opener.
 *
 * Shows sellers of every size — a home kitchen beside a restaurant with branches — as
 * storefront cards answering a buyer's request, rather than a photo of one person. The
 * photo it replaces read to sellers as "this is for small, informal traders only".
 *
 * The sellers are illustrative, not real businesses.
 */

interface Seller {
  initials: string;
  name: string;
  kind: string;
  /** Monogram tile colours: background, text. */
  tile: [string, string];
}

const SELLERS: Seller[] = [
  {
    initials: "MB",
    name: "Mama Bisi's Kitchen",
    kind: "Home kitchen · Surulere",
    tile: ["#FDE3D6", "#B8441A"],
  },
  {
    initials: "GC",
    name: "Grill & Co.",
    kind: "Restaurant · 3 branches",
    tile: ["#DCEFE3", "#006837"],
  },
  {
    initials: "GT",
    name: "Glow by Tolu",
    kind: "Skincare · Instagram",
    tile: ["#E8E4FB", "#4B3BA8"],
  },
  {
    initials: "LC",
    name: "Lekki Crust",
    kind: "Small bakery · Lekki",
    tile: ["#FFF1B8", "#7A5B00"],
  },
  {
    initials: "SG",
    name: "Sharp Gadgets",
    kind: "Phones · Computer Village",
    tile: ["#DDEBFA", "#1E5A96"],
  },
  {
    initials: "AF",
    name: "Ade's Fresh Market",
    kind: "Groceries · Yaba",
    tile: ["#DCEFE3", "#006837"],
  },
];

/** Where each card sits in the desktop wall, matching SELLERS by index. */
const WALL_PLACEMENT = [
  "left-0 top-[70px] w-[240px] -rotate-[4deg]",
  "left-[330px] top-[24px] w-[250px] rotate-[3deg]",
  "left-[470px] top-[150px] w-[210px] -rotate-[2deg]",
  "left-[20px] top-[440px] w-[230px] rotate-[2deg]",
  "left-[300px] top-[480px] w-[250px] -rotate-[3deg]",
  "left-[120px] top-[590px] w-[230px] rotate-[1deg]",
];

const SELLER_TYPES = [
  "Home cooks",
  "Bakers & small chops",
  "Restaurants & chains",
  "Market stalls & grocers",
  "Gadget shops",
  "Beauty & skincare",
  "Fashion",
  "Instagram & WhatsApp sellers",
];

const PROMISES = [
  "Free to join",
  "Orders arrive already paid",
  "You set your prices",
];

function SellerCard({
  seller,
  compact = false,
}: {
  seller: Seller;
  compact?: boolean;
}) {
  const [background, color] = seller.tile;
  return (
    <div
      className={
        compact
          ? "flex flex-col gap-2 rounded-2xl bg-white p-3"
          : "flex items-center gap-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_24px_rgba(60,40,0,0.12)]"
      }
    >
      <span
        aria-hidden="true"
        style={{ background, color }}
        className={`grid shrink-0 place-items-center font-dm font-extrabold ${
          compact
            ? "h-10 w-10 rounded-xl text-[15px]"
            : "h-12 w-12 rounded-[14px] text-[17px]"
        }`}
      >
        {seller.initials}
      </span>
      <span className="flex flex-col gap-0.5">
        <strong className="font-dm text-[14px] text-[#1A1A1A] md:text-[15px]">
          {seller.name}
        </strong>
        <span className="font-dm text-[12px] text-[#5C5C5C] md:text-[13px]">
          {seller.kind}
        </span>
      </span>
    </div>
  );
}

function BuyerRequest({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-[22px] bg-white shadow-[0_18px_40px_rgba(60,40,0,0.16)] ${
        compact ? "p-4" : "w-[300px] px-5 py-[18px]"
      }`}
    >
      <span className="font-dm text-[11px] font-bold tracking-[0.08em] text-[#8A6D00] md:text-[12px]">
        A BUYER IN YABA
      </span>
      <p className="m-0 rounded-[18px_18px_4px_18px] bg-recommend-orange px-4 py-3 font-dm text-[15px] font-semibold leading-snug text-white md:text-[17px]">
        Who sells small chops near me? For a party on Saturday.
      </p>
      {!compact && (
        <span className="font-dm text-[13px] text-[#5C5C5C]">
          James is finding sellers nearby…
        </span>
      )}
    </div>
  );
}

function PaidTag() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-recommend-green px-3.5 py-2 font-dm text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(0,104,55,0.3)] md:text-[14px]">
      <Check size={15} strokeWidth={3} aria-hidden="true" />
      New order — already paid
    </span>
  );
}

export default function VendorHeroSection() {
  return (
    <BackgroundTwo>
      <section className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 pt-28 pb-12 md:px-14 md:pt-36 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-10 lg:pb-16">
        <div className="flex flex-col items-start gap-6 md:gap-7">
          <span className="rounded-full bg-[#E3F1E8] px-3 py-2 font-dm text-[12px] font-bold tracking-[0.12em] text-recommend-green md:text-[13px]">
            FOR SELLERS OF EVERY SIZE
          </span>
          <h1 className="font-champ text-[44px] leading-[0.96] font-black text-balance text-recommend-orange md:text-[64px] xl:text-[72px]">
            Your next customer is already looking for you
          </h1>
          <p className="max-w-[520px] font-dm text-[17px] leading-relaxed text-[#3A3A3A] md:text-[20px]">
            Home kitchens, market stalls, Instagram shops and household-name
            restaurants — if you sell it, buyers near you are asking for it on
            Recommend.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="green"
              text="Start Selling Today"
              href={vendorApp("/signup")}
              icon={<ArrowRight size={18} />}
            />
            <Button
              variant="gradient"
              text="Log in"
              href={vendorApp("/login")}
            />
          </div>
          <ul className="flex flex-col gap-2 font-dm text-[15px] font-semibold text-[#2B2B2B] sm:flex-row sm:flex-wrap sm:gap-6">
            {PROMISES.map((promise) => (
              <li key={promise} className="inline-flex items-center gap-2">
                <Check
                  size={18}
                  strokeWidth={2.6}
                  className="text-recommend-green"
                  aria-hidden="true"
                />
                {promise}
              </li>
            ))}
          </ul>
        </div>

        {/* Wide screens: the request in the middle, sellers of every size around it. A
            fixed 680px composition, scaled down a little until there is room for all of it. */}
        <div className="hidden h-[700px] overflow-hidden xl:block" aria-hidden="true">
          <div className="relative h-[700px] w-[680px] origin-top-left scale-[0.82] min-[1400px]:scale-100">
            <div className="absolute top-[40px] left-[70px] h-[560px] w-[560px] rounded-full bg-[#FFE7A3]" />
            <div className="absolute top-[248px] left-[196px] z-[3]">
              <BuyerRequest />
            </div>
            {SELLERS.map((seller, index) => (
              <div
                key={seller.name}
                className={`absolute ${WALL_PLACEMENT[index]}`}
              >
                <SellerCard seller={seller} />
              </div>
            ))}
            <div className="absolute top-[152px] left-[10px] z-[4]">
              <PaidTag />
            </div>
          </div>
        </div>

        {/* Phones, tablets and laptops: the same idea, stacked. */}
        <div
          className="flex w-full max-w-[460px] flex-col gap-3 justify-self-center rounded-[28px] bg-[#FFE7A3] px-4 py-5 xl:hidden"
          aria-hidden="true"
        >
          <BuyerRequest compact />
          <div className="grid grid-cols-2 gap-2.5">
            {SELLERS.slice(0, 4).map((seller, index) => (
              <div
                key={seller.name}
                className={
                  index % 3 === 0 ? "-rotate-[1.5deg]" : "rotate-[1.5deg]"
                }
              >
                <SellerCard seller={seller} compact />
              </div>
            ))}
          </div>
          <div className="self-center">
            <PaidTag />
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="text-center font-champ text-[40px] leading-none font-black text-recommend-orange md:text-[64px]">
          A spot for every seller.
        </h2>
        <ul className="flex max-w-[980px] flex-wrap justify-center gap-2 md:gap-3">
          {SELLER_TYPES.map((type) => (
            <li
              key={type}
              className="rounded-full border-[1.5px] border-[#F2D96B] bg-white px-3.5 py-2 font-dm text-[14px] font-semibold text-[#1A1A1A] md:px-[18px] md:py-2.5 md:text-[16px]"
            >
              {type}
            </li>
          ))}
        </ul>
        <p className="max-w-[620px] text-center font-dm text-[16px] leading-relaxed text-[#3A3A3A] md:text-[18px]">
          Whether you sold your first plate last week or run three branches, you
          get the same buyers, the same tools and the same paid orders.
        </p>
        <Button
          variant="green"
          text="Become a Vendor"
          href={vendorApp("/signup")}
          icon={<ArrowRight size={18} />}
        />
      </section>
    </BackgroundTwo>
  );
}
