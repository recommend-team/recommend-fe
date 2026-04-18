"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Text } from "@/components/atoms/Text";
import { StoryCard } from "@/components/molecules/StoryCard";
import Image from "next/image";

const cards = [
  {
    heading: "James.\nWet Shirt.\nRunning Late.",
    body: "On the way to an important interview, someone splashed water on his shirt. He needed a dry cleaner fast.",
    illustration: "/svg/story-figure.svg",
  },
  {
    heading: "Googling.\nScrolling.\nCalling Dead Numbers.",
    body: "The dry cleaner was closed. Nobody knew which vendors were reliable nearby. 45 minutes wasted on a 45-second problem.",
    illustration: "/svg/story-frown.svg",
  },
  {
    heading: '"WHAT IF WHATSAPP\nCOULD JUST FIX THIS?"',
    body: "Not another app. Not another marketplace. A decision-first, WhatsApp-first system connecting people to verified local vendors instantly.",
    illustration: "/svg/story-lightbulb.svg",
  },
];

export default function FounderStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const card2Y = useTransform(
    scrollYProgress,
    [0, 0.22, 0.45],
    ["130%", "130%", "0%"]
  );

  const card3Y = useTransform(
    scrollYProgress,
    [0.45, 0.68, 0.88],
    ["130%", "130%", "0%"]
  );

  const card1Bg = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["#FFFDE0", "#FFF8B8"]
  );

  const footerOpacity = useTransform(scrollYProgress, [0.82, 1], [0, 1]);
  const footerY = useTransform(scrollYProgress, [0.82, 1], [40, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[320vh] bg-[#FFFEF0]"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center px-4 md:px-10">

        <div className="mb-10 flex items-center justify-center gap-4">
          <div className="flex-shrink-0 self-end">
            <Image
              src="/svg/pushing-figure.svg"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
            />
          </div>

         
          <div className="text-center">
            <Text variant="faq-answer" color="dark">
              The Origin
            </Text>
            <div className="flex flex-wrap justify-center gap-2">
              <Text variant="section-heading-48" color="orange">
                We got tired of
              </Text>
              <Text variant="section-heading-48" color="dark">
                the friction.
              </Text>
            </div>
          </div>
        </div>

       
        <div className="relative w-full max-w-[920px] h-[240px] md:h-[280px]">

         
          <motion.div className="absolute inset-0 z-10">
            <motion.div
              style={{ backgroundColor: card1Bg }}
              className="relative w-full h-full rounded-2xl border-1 border-[#FFD91D]"
            >
              <Image
                src="/svg/diagonal-lines(1).svg"
                alt=""
                width={96}
                height={48}
                className="absolute right-[18%] top-[38%] opacity-40"
                aria-hidden="true"
              />
              <Image
                src="/svg/diagonal-lines(2).svg"
                alt=""
                width={96}
                height={48}
                className="absolute right-[18%] top-[52%] opacity-40"
                aria-hidden="true"
              />

              <StoryCard
                heading={cards[0].heading}
                body={cards[0].body}
                illustration={cards[0].illustration}
                rotation={0}
                zIndex={3}
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: card2Y }}
            className="absolute inset-0 z-20 rotate-[-6deg]"
          >
            <div className="w-full h-full rounded-2xl border-1 border-[#FFD91D] bg-[#FFFDE0]">
              <StoryCard
                heading={cards[1].heading}
                body={cards[1].body}
                illustration={cards[1].illustration}
                rotation={0}
                zIndex={2}
              />
            </div>
          </motion.div>

         
          <motion.div
            style={{ y: card3Y }}
            className="absolute inset-0 z-30 rotate-[3deg]"
          >
            <div className="w-full h-full rounded-2xl border-1 border-[#FFD91D] bg-[#FFFDE0]">
              <StoryCard
                heading={cards[2].heading}
                body={cards[2].body}
                illustration={cards[2].illustration}
                rotation={0}
                zIndex={1}
              />
            </div>
          </motion.div>
        </div>

       
        <motion.div
          style={{ opacity: footerOpacity, y: footerY }}
          className="relative z-10 mt-8 flex flex-col items-center"
        >
          <Image
            src="/svg/dashed-path.svg"
            alt=""
            width={180}
            height={70}
            className="mb-2"
            aria-hidden="true"
          />

          <div className="flex items-center gap-2">
            <Text variant="faq-answer" color="dark">
              That frustration became Recommend.
            </Text>
            <Image
              src="/svg/recommend-logo-small.svg"
              alt="Recommend"
              width={24}
              height={24}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}