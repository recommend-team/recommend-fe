import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { BackgroundThree } from "./BackgroundThree";

/**
 * "Sell with us. Ride with us." — the way in for the other two sides of an order. Links to
 * the existing `/vendor` and `/rider` pitch pages rather than straight to sign-up, which
 * explain the terms first.
 */

const CARDS = [
  {
    eyebrow: "FOR VENDORS",
    title: "Sell on Recommend",
    points: [
      "Buyers near you find you by chatting",
      "Orders arrive already paid",
      "Your earnings go to your wallet, then your bank",
    ],
    cta: "Become a vendor",
    href: "/vendor",
    image: { src: "/images/journey/business_agreement.webp", width: 104, height: 104 },
    card: "bg-recommend-green",
    eyebrowColor: "text-[#8fe3b4]",
    tick: "text-[#8fe3b4]",
    button: "text-recommend-green",
  },
  {
    eyebrow: "FOR RIDERS",
    title: "Ride with us",
    points: [
      "Deliveries close to where you are",
      "Solo riders and fleet owners welcome",
      "Code-checked hand-overs, no disputes",
    ],
    cta: "Become a rider",
    href: "/rider",
    image: { src: "/images/journey/delivery_scooter.webp", width: 118, height: 98 },
    card: "bg-recommend-orange",
    eyebrowColor: "text-[#FFE58A]",
    tick: "text-[#FFE58A]",
    button: "text-[#b23d12]",
  },
];

export default function JoinUsSection() {
  return (
    <BackgroundThree>
      <section
        aria-labelledby="join-us"
        className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-20 font-dm text-[#1A1A1A] md:gap-10 md:px-10 md:py-24"
      >
        <div className="flex flex-col gap-3 px-1 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-extrabold tracking-[.14em] text-recommend-green md:text-[13px]">
              GROW WITH RECOMMEND
            </span>
            <h2
              id="join-us"
              className="font-champ text-[40px] leading-none md:text-[52px] lg:text-[60px] lg:leading-[.98]"
            >
              Sell with us. <span className="text-recommend-orange">Ride with us.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-[15px] leading-relaxed text-[#3d4451] md:mb-1.5 md:text-base">
            Every order needs a vendor and, for delivery, a rider. Join early and grow with us
            as we add new areas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className={`relative grid grid-cols-[minmax(0,1fr)_auto] gap-4 overflow-hidden rounded-[24px] p-[22px] text-white transition-transform duration-200 motion-safe:hover:-translate-y-1 md:rounded-[28px] md:p-8 ${card.card}`}
            >
              <div className="flex flex-col gap-3 md:gap-3.5">
                <span className={`text-[11px] font-extrabold tracking-[.12em] md:text-xs ${card.eyebrowColor}`}>
                  {card.eyebrow}
                </span>
                <h3 className="font-champ text-[30px] leading-none md:text-[38px]">{card.title}</h3>
                <ul className="flex flex-col gap-2 text-sm text-white/90 md:text-[15px]">
                  {card.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <Check size={16} strokeWidth={2.6} className={`mt-0.5 shrink-0 ${card.tick}`} aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={card.href}
                  className={`mt-2 inline-flex min-h-12 items-center justify-center gap-2 self-stretch rounded-[14px] bg-white px-5 text-[15px] font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:self-start ${card.button}`}
                >
                  {card.cta}
                  <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
                </Link>
              </div>
              <span
                aria-hidden
                className="grid h-[72px] w-[72px] place-items-center self-start rounded-full bg-[#FFF9E0] md:h-[150px] md:w-[150px] md:self-end"
              >
                <Image
                  src={card.image.src}
                  alt=""
                  width={card.image.width}
                  height={card.image.height}
                  className="h-auto w-[70%]"
                />
              </span>
            </div>
          ))}
        </div>
      </section>
    </BackgroundThree>
  );
}
