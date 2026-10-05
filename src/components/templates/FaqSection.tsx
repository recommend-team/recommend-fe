import Image from "next/image";
import { Text } from "../atoms/Text";
import { FaqItem } from "../molecules/FaqItem";
import { BackgroundThree } from "./BackgroundThree";
import { SERVICE_AREAS } from "@/lib/serviceAreas";

type Faq = { question: string; answer: string };

/**
 * For anyone: the about, contact and rider pages. Ordering happens in the Recommend chat in
 * the browser — the WhatsApp flow these answers used to describe is gone.
 */
const GENERAL: Faq[] = [
  {
    question: "What is Recommend?",
    answer:
      "Recommend is your personal market assistant. Tell us what you need — food, groceries, medicine and more — and we find it from verified vendors near you, take your payment securely, and get it to your door.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Tap Start Ordering and chat. Say what you want, add what you like to your cart, choose delivery or pickup, and pay — all in the same conversation.",
  },
  {
    question: "Is there an app?",
    answer:
      "Recommend works in your phone's browser, and you can add it to your home screen so it opens like an app. Apps for the Play Store and App Store are coming.",
  },
  {
    question: "Where do you deliver?",
    answer: `Today we deliver to ${SERVICE_AREAS.join(", ")}. We add new areas as vendors and riders join.`,
  },
  {
    question: "How do I pay?",
    answer:
      "Inside the chat, through Paystack — by card, bank transfer or USSD. Your card details go to Paystack, never to us or the vendor.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Ask in the chat and someone on our team will pick it up, or reach us from the Contact page.",
  },
];

/**
 * For the vendor page. Each answer is what the vendor app does today: KYC documents per
 * business type (`update-kyc.dto.ts`), earnings credited when an order is completed
 * (`earning.listener.ts`), withdrawals behind the account password with a ₦2,000 minimum
 * (`withdrawals.service.ts`), and the pickup code check.
 */
const VENDOR: Faq[] = [
  {
    question: "Can I sell if my business isn't registered?",
    answer:
      "Yes. Sign up as a non-registered business with your NIN slip, a passport photo, a bank statement and a utility bill. Registered businesses verify with their CAC and TIN certificates.",
  },
  {
    question: "How do orders reach me?",
    answer:
      "Buyers order and pay in the Recommend chat. The paid order arrives in your vendor app with an alert — you prepare it and mark it ready.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Your earnings land in your Recommend wallet once the order is delivered or collected. Withdraw to your verified bank account whenever you like, from ₦2,000.",
  },
  {
    question: "How does pickup work?",
    answer:
      "When a buyer collects in person, they show you a code. Check it in the vendor app before you hand the order over.",
  },
  {
    question: "Do I need to pay to join?",
    answer:
      "No. Signing up and listing your products is free — Recommend takes a share of each sale you make, and you see your earnings on every order.",
  },
  ...GENERAL.filter((faq) =>
    ["What is Recommend?", "Where do you deliver?", "How do I contact support?"].includes(faq.question)
  ),
];

export default function FaqSection({ audience = "general" }: { audience?: "general" | "vendor" }) {
  const faqs = audience === "vendor" ? VENDOR : GENERAL;

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
