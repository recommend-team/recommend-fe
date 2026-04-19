"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Text } from "../atoms/Text";

type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left"
      >
        <Text variant="faq-question" color="dark">
          {question}
        </Text>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <Image
            src="/svg/arrow.svg"
            alt=""
            width={20}
            height={20}
            className="w-7 h-auto"
          />
        </motion.div>
      </button>
      {open && (
        <div className="mt-3">
          <Text variant="faq-answer" color="dark">
            {answer}
          </Text>
        </div>
      )}
      <div className="w-full mt-4">
  <Image
    src="/svg/uniquedivider.svg"
    alt=""
    width={960}
    height={10}
    className="w-full h-full object-fill"
  />
</div>
    </div>
  );
}