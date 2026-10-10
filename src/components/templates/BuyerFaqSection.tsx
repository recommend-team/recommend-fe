"use client";

import { useId, useState } from "react";
import { ArrowRight, Minus, Plus, UserRound } from "lucide-react";
import { CUSTOMER_APP_URL } from "@/lib/links";
import { SERVICE_AREAS } from "@/lib/serviceAreas";
import { BackgroundThree } from "./BackgroundThree";
import { PICKUP_ENABLED } from "@/lib/features";

/**
 * "Before you order" — what a first-time buyer wants answered before paying.
 *
 * Separate from `FaqSection`, which serves the vendor, rider and about pages and still
 * describes the WhatsApp flow.
 *
 * Every answer here is true of the product as built: pickup (while switched on — see
 * `lib/features`) costs nothing, delivery is one
 * flat fee shown before payment (`checkout.service.ts` → `deliveryFeeFor`), payment is
 * Paystack, and the assistant hands a buyer to a person when it cannot help.
 */

export const BUYER_FAQS: { question: string; answer: string }[] = [
  {
    question: "Is there an app?",
    answer:
      "Recommend works in your phone's browser — tap Start Ordering and chat. You can add it to your home screen so it opens like an app, and it's coming to the Play Store and App Store.",
  },
  {
    question: "How much is delivery?",
    answer:
      PICKUP_ENABLED
        ? "A flat delivery fee, shown in the chat before you pay — it's added at checkout once you choose delivery. Pickup is free."
        : "A flat delivery fee, shown in the chat before you pay — it's added at checkout.",
  },
  {
    question: "How do I pay? Is it safe?",
    answer:
      "You pay inside the chat through Paystack, by card, bank transfer or USSD. Your card details go to Paystack, never to us or the vendor.",
  },
  {
    question: "Can I pick it up myself?",
    answer:
      "Yes. Choose “I'll pick it up” at checkout. We tell you the vendor's address and give you a code to show at the counter.",
  },
  {
    question: "What's the delivery code for?",
    answer:
      "It makes sure your order reaches you and only you. Read it to the rider when they arrive — no code, no hand-over.",
  },
  {
    question: "How will I know where my order is?",
    answer:
      "You get an update in the chat at each step — when the vendor is preparing it, when it's ready, and when it's on its way.",
  },
  {
    question: "What if my order is wrong or doesn't arrive?",
    answer:
      "Tell us in the chat and someone on our team will sort it out with you and the vendor.",
  },
  {
    question: "Can I talk to a real person?",
    answer:
      "Yes. Just ask in the chat. If our assistant can't help, it hands you to someone on our team.",
  },
  {
    question: "Where do you deliver?",
    answer: `Today we deliver to ${SERVICE_AREAS.join(", ")}. We add new areas as vendors and riders join.`,
  },
];

export default function BuyerFaqSection() {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <BackgroundThree>
      <section
        id="faq"
        aria-labelledby="buyer-faq"
        className="mx-auto grid scroll-mt-24 w-full max-w-6xl gap-8 px-4 py-20 font-dm text-[#1A1A1A] md:px-10 md:py-24 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-[72px]"
      >
        <div className="flex flex-col gap-4 px-1 md:gap-[18px]">
          <span className="text-xs font-extrabold tracking-[.14em] text-recommend-green md:text-[13px]">
            QUESTIONS BUYERS ASK
          </span>
          <h2
            id="buyer-faq"
            className="font-champ text-[42px] leading-none md:text-[54px] lg:text-[60px] lg:leading-[.98]"
          >
            Before you <span className="text-recommend-orange">order.</span>
          </h2>
          <p className="text-[15px] leading-relaxed text-[#3d4451] md:text-[17px]">
            Everything people usually want to know first. Anything else, just ask in the
            chat.
          </p>
          <div className="mt-3 hidden lg:block">
            <PersonCard />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {BUYER_FAQS.map((faq, index) => {
            const isOpen = open === index;
            const answerId = `${baseId}-answer-${index}`;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition-colors md:rounded-[18px] ${
                  isOpen ? "border-[#f0e3a5] bg-white" : "border-transparent bg-white/60"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left text-[15px] font-extrabold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-recommend-green md:px-[22px] md:py-5 md:text-[17px]"
                  >
                    {faq.question}
                    <span
                      aria-hidden
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full md:h-8 md:w-8 ${
                        isOpen ? "bg-recommend-orange text-white" : "bg-[#F3EFC9] text-[#6b5f1c]"
                      }`}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                </h3>
                <div id={answerId} hidden={!isOpen}>
                  <p className="-mt-1.5 px-4 pb-4 text-sm leading-relaxed text-[#3d4451] md:pr-[70px] md:pb-5 md:pl-[22px] md:text-[15px]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:hidden">
          <PersonCard />
        </div>
      </section>
    </BackgroundThree>
  );
}

function PersonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-[#0F4A2E] p-5 text-[#FFF9E0] md:rounded-[22px] md:p-[22px]">
      <span
        aria-hidden
        className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF9E0]/[.12] text-[#FFE58A]"
      >
        <UserRound size={20} strokeWidth={2.2} />
      </span>
      <p className="text-[17px] font-extrabold">Prefer a person?</p>
      <p className="text-sm leading-relaxed text-[#FFF9E0]/80">
        Ask for one in the chat. If our assistant can&apos;t help, it hands you to someone on
        our team.
      </p>
      {CUSTOMER_APP_URL && (
        <a
          href={CUSTOMER_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-recommend-orange px-[18px] text-[15px] font-extrabold text-white sm:self-start"
        >
          Chat with us
          <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
        </a>
      )}
    </div>
  );
}
