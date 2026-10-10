"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "../atoms/Text";
import { BackgroundThree } from "./BackgroundThree";

export type ValuesFAQ = {
  title: string;
  description: string;
};

export type ValuesSectionProps = {
  headingLine1: string;
  headingLine1Color: "dark" | "orange" | "grey";
  headingLine2: string;
  headingLine2Color: "dark" | "orange" | "grey";
  strengthIcon?: string;
  centerImages: string[];        // for AboutValuesSection: rotating carousel; for RiderValuesSection: single image
  centerImageAlt?: string;
  joyleapIcon?: string;
  faqs: ValuesFAQ[];
};

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

function CenterImage({
  images,
  alt,
  joyleapIcon,
}: {
  images: string[];
  alt?: string;
  joyleapIcon?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full aspect-[4/5] rounded-2xl border border-recommend-orange overflow-hidden">
      {images.map((src, i) => (
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: images.length > 1 ? 1.8 : 0, ease: "easeInOut" }}
          className="absolute inset-0 rounded-2xl overflow-hidden"
        >
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            className="object-cover rounded-2xl"
          />
        </motion.div>
      ))}

      {joyleapIcon && (
        <div className="absolute -bottom-10 -right-8 z-20">
          <Image
            src={joyleapIcon}
            alt=""
            width={100}
            height={100}
            className="w-20 md:w-28 h-auto"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

function FAQDesktop({ faqs }: { faqs: ValuesFAQ[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % faqs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [faqs.length]);

  return (
    <div className="flex flex-col w-full">
      {faqs.map((faq, index) => (
        <div key={faq.title}>
          <div className="py-4">
            <div className="flex justify-between items-center">
              <Text variant="neighborhoods-title" color="dark" className="font-bold">
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

function FAQMobile({ faqs }: { faqs: ValuesFAQ[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % faqs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [faqs.length]);

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
          <Text variant="neighborhoods-title" color="dark" className="font-bold mb-2">
            {faqs[activeIndex].title}
          </Text>
          <Text variant="neighborhoods-list" color="grey" className="leading-relaxed">
            {faqs[activeIndex].description}
          </Text>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function ValuesSectionTemplate({
  headingLine1,
  headingLine1Color,
  headingLine2,
  headingLine2Color,
  strengthIcon,
  centerImages,
  centerImageAlt,
  joyleapIcon,
  faqs,
}: ValuesSectionProps) {
  return (
    <BackgroundThree>
      <div className="relative w-full px-6 md:px-14 py-16 md:py-24">

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-10 max-w-6xl mx-auto items-center">
          <div className="relative flex flex-col gap-4">
            <div>
              <Text variant="section-heading-48" color={headingLine1Color}>
                {headingLine1}
              </Text>
              <Text variant="section-heading-48" color={headingLine2Color}>
                {headingLine2}
              </Text>
            </div>
            {strengthIcon && (
              <div className="absolute -top-17 right-2">
                <Image
                  src={strengthIcon}
                  alt=""
                  width={56}
                  height={56}
                  className="w-28 h-auto"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <div className="relative">
            <CenterImage
              images={centerImages}
              alt={centerImageAlt}
              joyleapIcon={joyleapIcon}
            />
          </div>

          <div className="flex flex-col justify-center">
            <FAQDesktop faqs={faqs} />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-6">
          <div className="relative inline-block">
            <Text variant="section-heading-48" color={headingLine1Color}>
              {headingLine1}
            </Text>
            <div className="flex items-center gap-2">
              <Text variant="section-heading-48" color={headingLine2Color}>
                {headingLine2}
              </Text>
              {strengthIcon && (
                <div className="flex-shrink-0">
                  <Image
                    src={strengthIcon}
                    alt=""
                    width={44}
                    height={44}
                    className="w-18 h-auto"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="relative w-full">
            <CenterImage
              images={centerImages}
              alt={centerImageAlt}
              joyleapIcon={joyleapIcon}
            />
          </div>

          <FAQMobile faqs={faqs} />
        </div>

      </div>
    </BackgroundThree>
  );
}