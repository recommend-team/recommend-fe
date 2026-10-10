"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Text } from "../atoms/Text";
import { BackgroundTwo } from "./BackgroundTwo";

/**
 * The About page opener: what Recommend is, then the founder's note leading into the story.
 *
 * Laid out in the flow — heading and note side by side, the scroll hint beneath — rather
 * than as a full-screen hero with each piece pinned to a corner, which spread them so far
 * apart they stopped reading as one thing.
 */
export default function AboutHeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <BackgroundTwo>
      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pt-32 pb-14 font-dm md:grid-cols-[minmax(0,1fr)_minmax(0,440px)] md:gap-12 md:px-10 md:pt-40 md:pb-16">
        <div className="relative z-10 flex flex-col gap-5">
          <span className="text-xs font-extrabold tracking-[.14em] text-recommend-green md:text-[13px]">
            ABOUT RECOMMEND
          </span>
          <Text variant="hero-heading" color="orange">
            One message.
            <br />
            Everything you need.
          </Text>
          <p className="max-w-[500px] text-base leading-relaxed text-[#3d4451] md:text-lg">
            Recommend is a personal market assistant for Lagos. Tell us what you need and we
            find it from verified vendors near you, take payment securely, and get it to your
            door — all in one chat.
          </p>
        </div>

        <div className="relative z-10 flex justify-center md:justify-end">
          <Image
            src="/svg/sheep.svg"
            alt=""
            width={110}
            height={110}
            className="absolute -top-8 right-2 w-14 h-auto md:-top-12 md:right-0 md:w-20"
          />
          <div className="relative w-[280px] rotate-[-4deg] md:w-[420px]">
            <Image
              src="/svg/sticky-note.svg"
              alt=""
              width={260}
              height={200}
              className="h-auto w-full"
            />
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <Image
                src="/svg/story-line.svg"
                alt="The founder's story"
                width={150}
                height={100}
                className="h-auto w-[45%]"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 md:col-span-2">
          <motion.span
            aria-hidden
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.span>
          <Text variant="tap-hint" color="dark" className="text-[13px] md:text-[15px]">
            Scroll to see how it started.
          </Text>
        </div>
      </section>
    </BackgroundTwo>
  );
}
