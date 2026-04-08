"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Text } from "../atoms/Text";
import { BackgroundTwo } from "./BackgroundTwo";

export default function AboutHeroSection() {
  return (
    <BackgroundTwo>
      <div className="relative min-h-screen w-full px-6 md:px-14 pt-32 md:pt-40 pb-20">

        <div className="absolute top-28 right-6 md:top-45 md:right-35 z-10">
          <Image
            src="/svg/sheep.svg"
            alt="sheep illustration"
            width={110}
            height={110}
            className="w-14 md:w-20 h-auto"
          />
        </div>

        <div className="relative z-10 max-w-xl">
          <Text variant="hero-heading" color="orange">
            One message.
            <br />
            Everything
            <br />
            you need.
          </Text>
        </div>

        <div className="
          relative z-10
          -mt-17 flex justify-end pr-8
          md:mt-20 md:block
          md:absolute md:top-[50px] md:left-[29%]
        ">
          <div className="relative rotate-[-4deg] w-[280px] md:w-[480px]">
            <Image
              src="/svg/sticky-note.svg"
              alt="Founder story sticky note"
              width={260}
              height={200}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <Image
                src="/svg/story-line.svg"
                alt="Chanor's story"
                width={150}
                height={100}
                className="w-[45%] h-auto"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-6 md:right-10 flex flex-row items-center gap-2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center flex-shrink-0"
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
          </motion.div>
          <Text variant="tap-hint" color="dark" className="text-[13px] md:text-[15px]">
            Scroll to see how that became this.
          </Text>
        </div>

      </div>
    </BackgroundTwo>
  );
}