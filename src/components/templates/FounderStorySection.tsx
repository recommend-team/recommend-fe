"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
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
    heading: '"What if one\nmessage could\nfix this?"',
    body: "Not another marketplace to scroll through. One chat that finds a verified vendor near you, takes payment, and gets it done.",
    illustration: "/svg/story-lightbulb.svg",
  },
];

export default function FounderStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const footerControls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Each card starts moving almost as soon as the one before has landed. The section used
  // to be 400vh with long still stretches before each card, which read as stuck and slow.
  const card2Y = useTransform(
    scrollYProgress,
    [0, 0.06, 0.36],
    ["100vh", "100vh", "0vh"]
  );

  const card3Y = useTransform(
    scrollYProgress,
    [0, 0.42, 0.72],
    ["100vh", "100vh", "0vh"]
  );

  const card1Bg = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["#FFFDE0", "#FFF8B8"]
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v >= 0.76) {
        footerControls.start({ opacity: 1, y: 0, transition: { duration: 0.4 } });
      } else {
        footerControls.start({ opacity: 0, y: 40, transition: { duration: 0.2 } });
      }
    });
    return unsubscribe;
  }, [scrollYProgress, footerControls]);

  return (
    <section
      ref={containerRef}
      className="relative h-[260vh] bg-[#FFFEF0]"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 md:px-10">

        <div className="mb-8 flex items-center justify-center gap-4">
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

        <div className="relative w-full max-w-[480px] md:max-w-[860px]">

          <div className="relative h-[480px] md:h-[320px]">

            <motion.div
              style={{ backgroundColor: card1Bg }}
              className="absolute inset-0 z-10 rounded-2xl border border-[#FFD91D]"
            >
              <StoryCard
                heading={cards[0].heading}
                body={cards[0].body}
                illustration={cards[0].illustration}
                rotation={0}
                zIndex={1}
              />
            </motion.div>

            <motion.div
              style={{ y: card2Y }}
              className="absolute inset-0 z-20 rotate-[-4deg]"
            >
              <div className="w-full h-full rounded-2xl border border-[#FFD91D] bg-[#FFFDE0]">
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
              <div className="w-full h-full rounded-2xl border border-[#FFD91D] bg-[#FFFDE0]">
                <StoryCard
                  heading={cards[2].heading}
                  body={cards[2].body}
                  illustration={cards[2].illustration}
                  rotation={0}
                  zIndex={3}
                />
              </div>
            </motion.div>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={footerControls}
            className="w-full mt-10 pointer-events-none relative flex items-center justify-end"
          >
            <div className="absolute left-[48%] bottom-3">
              <Image
                src="/svg/dashed-path.svg"
                alt=""
                width={200}
                height={60}
                className="w-full h-auto rotate-[15deg]"
              />
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <Text variant="faq-answer" color="dark"> That frustration became Recommend.</Text>
              <Image
                src="/svg/recommend-logo-small.svg"
                alt="Recommend"
                width={40}
                height={55}
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}