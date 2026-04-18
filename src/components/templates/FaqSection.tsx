import Image from "next/image";
import { Text } from "../atoms/Text";
import { FaqItem } from "../molecules/FaqItem";
import { BackgroundThree } from "./BackgroundThree";

const faqs = [
  {
    question: "What is Recommend?",
    answer:
      "Recommend is a hyper-local AI market assistant that connects you to trusted businesses in your neighborhood — order food, groceries, medicine, and more, all through WhatsApp. No app needed.",
  },
  {
    question: "How do I place an order?",
    answer:
      'Send "Hey Recommend" to our WhatsApp number and tell us what you need. We confirm your order and handle delivery.',
  },
  {
    question: "Where do you deliver?",
    answer:
      "We cover key neighborhoods across Lagos — Lekki, Ajah, Admiralty Way, Wole Ariyo Street, Freedom Way, Ikate & Jakande, Igbo Efon, Osapa London, Victoria Arobieke Street, and more.",
  },
  {
    question: "How do I pay?",
    answer:
      "Payment is handled securely through the platform once your order is confirmed. Fast, safe, and straightforward.",
  },
  {
    question: "How do I contact support?",
    answer:
      "See contact page for contact info or use the in-app support chat if you're a rider or vendor. We're always available to help.",
  },
];

export default function FaqSection() {
  return (
    <BackgroundThree>
      <div className="relative w-full px-6 md:px-14 py-16 md:py-20">

        {/* Heading row */}
        <div className="relative flex items-end justify-between mb-10 md:justify-center md:gap-6">

          {/* Heading */}
          <Text variant="section-heading-48-center" color="orange">
            Got questions?
          </Text>

          {/* FAQ figure — thinking squiggle + standing figure */}
          <div className="relative flex-shrink-0 w-[60px] md:w-[80px]">
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-[20px]">
              <Image
                src="/svg/thinking-squiggle.svg"
                alt=""
                width={24}
                height={24}
                className="w-full h-auto"
              />
            </div>
            <Image
              src="/svg/faq-figure.svg"
              alt=""
              width={80}
              height={120}
              className="w-full h-auto"
            />
          </div>

        </div>

        {/* FAQ list */}
        <div className="flex flex-col max-w-[960px] mx-auto w-full">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

      </div>
    </BackgroundThree>
  );
}