"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function WhatYouCanOrderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(-1);
  const [exiting, setExiting] = useState(false);
  const [showHint, setShowHint] = useState(false);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && current === -1) {
  setTimeout(() => {
    setCurrent(0);
    setTimeout(() => setShowHint(true), 800);
  }, 1800);
}
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [current]);

  const handleClick = () => {
    if (exiting) return;
    setShowHint (false);
    if (current < cards.length - 1) {
      setExiting(true);
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setExiting(false);
      }, 400);
    }
  };

  return (
 <BackgroundThree>
    <section
      ref={sectionRef}
      className="relative w-full h-175 md:h-screen overflow-hidden cursor-pointer "
      onClick={handleClick}
    >
      {/* Tap hint — slides in from right */}
<AnimatePresence>
  {showHint && (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.4 }}
      className="absolute bottom-12 left-6 z-30 bg-recommend-green px-2 py-1 rounded-full pointer-events-none flex items-center gap-1"
    >
      <span className="text-base">🟠</span>
      <Text variant="tap-hint" color="white">
        Tap anywhere to see more
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

      {/* Card layer */}
      <div className="absolute inset-0 flex items-center justify-center z-10 py-4 md:py-16">
        <AnimatePresence mode="wait">
          {current >= 0 && (
            <motion.div
              key={current}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >

              {/* Desktop */}
              <div className="hidden md:flex items-center justify-center gap-8 w-full max-w-6xl px-10">
                <div className="flex-1 flex justify-end mb-40">
                  <Text
                    variant="cta-sublabel"
                    color="green"
                    className="text-left max-w-40 leading-snug"
                  >
                    {cards[current].leftText}
                  </Text>
                </div>

                <FoodCard
                  image={cards[current].image}
                  title={cards[current].title}
                  comingSoon={cards[current].comingSoon}
                />

                <div className="flex-1 flex justify-start mt-40">
                  <Text
                    variant="cta-sublabel"
                    color="green"
                    className="text-left max-w-40 leading-snug"
                  >
                    {cards[current].rightText}
                  </Text>
                </div>
              </div>

              {/* Mobile */}
              <div className="flex md:hidden flex-col items-center w-full px-5 gap-4">
                <Text
                  variant="cta-sublabel"
                  color="green"
                  className="text-left max-w-50 leading-snug"
                >
                  {cards[current].leftText}
                </Text>
                <FoodCard
                  image={cards[current].image}
                  title={cards[current].title}
                  comingSoon={cards[current].comingSoon}
                />
                <Text
                  variant="cta-sublabel"
                  color="green"
                  className="text-center max-w-50 leading-snug"
                >
                  {cards[current].rightText}
                </Text>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button — bottom right */}
      <div className="absolute bottom-0 right-8 z-20 pointer-events-auto">
        <Button
          text="Start Ordering"
          icon={<WhatsAppIcon />}
          variant="green"
        />
      </div>

    </section>
 </BackgroundThree>
  );
}