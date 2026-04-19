"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "../atoms/Text";
import { BackgroundThree } from "./BackgroundThree";

const faqs = [
  {
    title: "Fast Payouts",
    description:
      "Withdraw your earnings anytime directly to your bank account. No waiting, no delays — your money, your pace.",
  },
  {
    title: "Flexible Schedule",
    description:
      "Ride when it works for you. Accept orders, take breaks, or log off — no shifts, no quotas, no manager.",
  },
  {
    title: "Simple Rider App",
    description:
      "A clean dashboard built for the road. See orders, navigate, and track earnings without digging through menus.",
  },
  {
    title: "Neighborhood",
    description:
      "We match you with orders close to where you already are. Less driving between jobs, more income per hour.",
  },
];

function Divider() {
  return (
    <div className="w-full">
      <Image
        src="/svg/uniquedivider.svg"
        alt=""
        width={400}
        height={10}
        className="w-full h-auto"
      />
    </div>
  );
}

function FAQDesktop() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % faqs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {faqs.map((faq, index) => (
        <div key={faq.title}>
          <div className="py-4">
            <div className="flex justify-between items-center">
              <Text
                variant="neighborhoods-title"
                color="dark"
                className="font-bold"
              >
                {faq.title}
              </Text>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/svg/arrow.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-auto"
                />
              </motion.div>
            </div>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <Text
                    variant="neighborhoods-list"
                    color="grey"
                    className="mt-2 leading-relaxed"
                  >
                    {faq.description}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {index < faqs.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
}

function FAQMobile() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % faqs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full mt-8">
      <div className="flex gap-1 mb-6">
        {faqs.map((_, index) => (
          <motion.div
            key={index}
            className="h-[4px] rounded-full bg-recommend-orange"
            animate={{
              width: activeIndex === index ? "52px" : "32px",
              opacity: activeIndex === index ? 1 : 0.3,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <Text
            variant="neighborhoods-title"
            color="dark"
            className="font-bold mb-2"
          >
            {faqs[activeIndex].title}
          </Text>
          <Text
            variant="neighborhoods-list"
            color="grey"
            className="leading-relaxed"
          >
            {faqs[activeIndex].description}
          </Text>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function RiderValuesSection() {
  return (
    <BackgroundThree>
      <div className="relative w-full px-6 md:px-14 py-16 md:py-24">
        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid grid-cols-3 gap-10 max-w-6xl mx-auto items-center">
          <div className="relative flex flex-col gap-4">
            <div>
              <Text variant="section-heading-48" color="orange">
                Your hustle,
              </Text>
              <Text variant="section-heading-48" color="grey">
                your rules.
              </Text>
            </div>
            <div className="absolute -top-16 right-4">
              <Image
                src="/svg/strength.svg"
                alt=""
                width={56}
                height={56}
                className="w-24 h-auto"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-2xl border border-recommend-orange overflow-hidden">
            {/* TODO: replace with real Naira / payouts image */}
            <Image
              src="/images/stopwatch.png"
              alt="Payouts"
              fill
              className="object-cover"
            />
            <div className="absolute -bottom-10 -right-8 z-20">
              <Image
                src="/svg/joyleap.svg"
                alt=""
                width={100}
                height={100}
                className="w-20 md:w-28 h-auto"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <FAQDesktop />
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="flex md:hidden flex-col gap-6">
          <div className="relative inline-block">
            <Text variant="section-heading-48" color="orange">
              Your hustle,
            </Text>
            <div className="flex items-center gap-2">
              <Text variant="section-heading-48" color="grey">
                your rules.
              </Text>
              <div className="flex-shrink-0">
                <Image
                  src="/svg/strength.svg"
                  alt=""
                  width={44}
                  height={44}
                  className="w-16 h-auto"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-2xl border border-recommend-orange overflow-hidden">
            {/* TODO: replace with real Naira / payouts image */}
            <Image
              src="/images/stopwatch.png"
              alt="Payouts"
              fill
              className="object-cover"
            />
          </div>

          <FAQMobile />
        </div>
      </div>
    </BackgroundThree>
  );
}
