"use client";
import { CUSTOMER_APP_URL } from "@/lib/links";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Text } from "@/components/atoms/Text";
import { FoodCard } from "@/components/molecules/FoodCard";
import WhatsAppIcon from "@/components/atoms/WhatsAppIcon";
import { Button } from "@/components/molecules/Button";
import { BackgroundThree } from "./BackgroundThree";

const cards = [
  {
    image: "/images/grab-a-bite.png",
    title: "GRAB A BITE",
    leftText: "Craving something tasty? From local bukas to top restaurants",
    rightText: "rice, pasta, grills, pastries, and more we've got you covered.",
    comingSoon: false,
  },
  {
    image: "/images/everyday-essentials.png",
    title: "EVERYDAY ESSENTIALS",
    leftText: "Get groceries, household items, baby products,",
    rightText: "and other neccessities, right from nearby stores.",
    comingSoon: false,
  },
  {
    image: "/images/medicine-wellness.png",
    title: "MEDICINE & WELLNESS",
    leftText: "Quick access to verified pharmacies for medicines,",
    rightText: "hygiene products, and wellness essentials.",
    comingSoon: false,
  },
  {
    image: "/images/fresh-market.png",
    title: "FRESH FROM MARKET",
    leftText: "Fruits, vegetables, grains,",
    rightText: "seasonal picks delivered fresh to your home.",
    comingSoon: true,
  },
  {
    image: "/images/beauty-fashion.png",
    title: "BEAUTY & FASHION",
    leftText: "Skincare vendors, Hair vendors, tailors, fashion stores,",
    rightText: "and personal care shops within your reach.",
    comingSoon: true,
  },
];

// How much page scroll each card gets while the section is pinned. The outer
// section reserves cards.length * this much height; the sticky pane inside it
// holds still for all but the last screenful, and the card index is derived
// from how far through that reserved height we are. Native scrolling is never
// blocked — the section just takes longer to scroll past.
const VH_PER_CARD = 70;

export default function WhatYouCanOrderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(
      cards.length - 1,
      Math.max(0, Math.floor(progress * cards.length))
    );
    if (next === currentRef.current) return;
    setDirection(next > currentRef.current ? 1 : -1);
    currentRef.current = next;
    setCurrent(next);
  });

  const enter = reduceMotion
    ? { opacity: 0 }
    : { y: direction === 1 ? "35%" : "-35%", opacity: 0 };
  const exit = reduceMotion
    ? { opacity: 0 }
    : { y: direction === 1 ? "-35%" : "35%", opacity: 0 };

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${cards.length * VH_PER_CARD}vh` }}
    >
      <div className="sticky top-0 h-screen w-full">
        <BackgroundThree>
          <div className="relative h-screen w-full overflow-hidden">
            {/* Scroll hint — only while the first card is showing */}
            <AnimatePresence>
              {current === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-12 left-6 z-30 bg-recommend-green px-2 py-1 rounded-full pointer-events-none flex items-center gap-1"
                >
                  <span className="text-base">🟠</span>
                  <Text variant="tap-hint" color="white">
                    Scroll to see more
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background heading */}
            <div className="absolute -inset-10 flex items-center justify-center pointer-events-none z-0 px-4">
              <Text
                variant="section-heading-96"
                color="orange"
                as="h2"
                className="bg-heading font-champ font-black text-[#F15A24] whitespace-nowrap"
              >
                What You Can Order
              </Text>
            </div>

            {/* Card layer — the entering and exiting cards overlap, so a fast
                scroll never leaves the stage empty */}
            <div className="absolute inset-0 z-10">
              <AnimatePresence initial={false}>
                <motion.div
                  key={current}
                  initial={enter}
                  animate={{ y: 0, opacity: 1 }}
                  exit={exit}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center py-4 md:py-16"
                >
                  {/* Desktop */}
                  <div className="hidden md:flex items-center justify-center gap-8 w-full max-w-6xl px-10">
                    <div className="flex-1 flex justify-end mb-40">
                      <Text variant="cta-sublabel" color="green" className="text-left max-w-40 leading-snug">
                        {cards[current].leftText}
                      </Text>
                    </div>
                    <FoodCard
                      image={cards[current].image}
                      title={cards[current].title}
                      comingSoon={cards[current].comingSoon}
                    />
                    <div className="flex-1 flex justify-start mt-40">
                      <Text variant="cta-sublabel" color="green" className="text-left max-w-40 leading-snug">
                        {cards[current].rightText}
                      </Text>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="flex md:hidden flex-col items-center w-full px-5 gap-4">
                    <Text variant="cta-sublabel" color="green" className="text-left max-w-50 leading-snug">
                      {cards[current].leftText}
                    </Text>
                    <FoodCard
                      image={cards[current].image}
                      title={cards[current].title}
                      comingSoon={cards[current].comingSoon}
                    />
                    <Text variant="cta-sublabel" color="green" className="text-center max-w-50 leading-snug">
                      {cards[current].rightText}
                    </Text>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots — so a pinned screen reads as "5 cards", not "stuck" */}
            <div
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-none"
              aria-hidden="true"
            >
              {cards.map((card, i) => (
                <span
                  key={card.title}
                  className={`w-1.5 rounded-full bg-recommend-green transition-all duration-300 ${
                    i === current ? "h-5 opacity-100" : "h-1.5 opacity-30"
                  }`}
                />
              ))}
            </div>

            {/* Button — bottom right */}
            <div className="absolute bottom-0 right-8 z-20 pointer-events-auto">
              <Button
                text="Start Ordering"
                href={CUSTOMER_APP_URL}
                external
                icon={<WhatsAppIcon />}
                variant="green"
              />
            </div>
          </div>
        </BackgroundThree>
      </div>
    </section>
  );
}
