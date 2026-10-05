"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CUSTOMER_APP_URL } from "@/lib/links";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import OrderFlowPhone, { ORDER_FLOW_STEPS } from "@/components/organisms/OrderFlowPhone";
import { BackgroundThree } from "./BackgroundThree";

const STEP_MS = 3800;
const STEP_COUNT = ORDER_FLOW_STEPS.length;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function subscribeReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * "No app needed" — a real order, played on a phone, step by step.
 *
 * The phone advances by itself while the section is on screen, and stops for good the
 * moment a visitor picks a step: someone reading step 4 should not have it snatched away.
 * It never advances for a visitor who has asked for reduced motion.
 */
export default function NoAppSection() {
  const [step, setStep] = useState(1);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    () => false
  );
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = section.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const playing = visible && !paused && !reducedMotion;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setStep((current) => (current % STEP_COUNT) + 1),
      STEP_MS
    );
    return () => window.clearInterval(timer);
  }, [playing]);

  const choose = (next: number) => {
    setPaused(true);
    setStep(((next - 1 + STEP_COUNT) % STEP_COUNT) + 1);
  };

  const current = ORDER_FLOW_STEPS[step - 1];

  return (
    <BackgroundThree>
      <section ref={section} className="relative w-full overflow-hidden py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          {/* Heading */}
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:justify-between md:gap-12 md:text-left">
            <div className="order-2 flex max-w-lg flex-col items-center gap-3.5 md:order-1 md:items-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E6F2EB] px-3 py-1.5 text-xs font-bold font-dm text-recommend-green md:text-[13px]">
                <span className="h-2 w-2 rounded-full bg-[#1b8f57]" aria-hidden />
                Live now in Lagos
              </span>
              <p className="text-base leading-relaxed font-dm text-[#3d4451] md:text-lg">
                Tell us what you want. We find it from vendors near you, you pay securely,
                and you follow your order to your door — all in one chat.
              </p>
            </div>
            <Text
              as="h2"
              variant="section-heading-48"
              className="order-1 font-extrabold leading-[1.08] tracking-tight md:order-2 md:text-right"
            >
              <span className="block text-recommend-orange">No app needed.</span>
              <span className="block text-[#1A1A1A]">Just say Hey Recommend.</span>
            </Text>
          </div>

          {/* Flow */}
          <div className="mt-10 grid grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 lg:grid-cols-[330px_auto_300px] lg:justify-items-stretch">
            <ol className="hidden w-full max-w-sm flex-col gap-1 md:flex">
              {ORDER_FLOW_STEPS.map((item, index) => {
                const n = index + 1;
                const active = n === step;
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => choose(n)}
                      aria-current={active ? "step" : undefined}
                      className={`flex w-full items-start gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-green ${
                        active ? "bg-white shadow-sm" : "hover:bg-white/60"
                      }`}
                    >
                      <span
                        className={`grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] text-[13px] font-extrabold font-dm ${
                          active
                            ? "bg-recommend-orange text-white"
                            : "bg-black/[.07] text-[#5b6472]"
                        }`}
                      >
                        {n}
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-bold font-dm text-[#1A1A1A]">
                          {item.title}
                        </span>
                        <span className="text-[13px] leading-snug font-dm text-[#5b6472]">
                          {item.body}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <OrderFlowPhone step={step} />

            {/* Phone-width stepper — the list above is too tall to sit beside the phone */}
            <div className="flex w-full max-w-sm flex-col items-center gap-4 md:hidden">
              <div className="flex w-full items-center gap-3">
                <StepArrow label="Previous step" onClick={() => choose(step - 1)}>
                  <ChevronLeft size={18} />
                </StepArrow>
                <div className="flex-1 text-center" aria-live="polite">
                  <p className="text-xs font-extrabold font-dm tracking-[.08em] text-recommend-orange">
                    STEP {step} OF {STEP_COUNT}
                  </p>
                  <p className="mt-0.5 text-[17px] font-extrabold font-dm">{current.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug font-dm text-[#5b6472]">
                    {current.body}
                  </p>
                </div>
                <StepArrow label="Next step" onClick={() => choose(step + 1)}>
                  <ChevronRight size={18} />
                </StepArrow>
              </div>
              <div className="flex gap-1.5">
                {ORDER_FLOW_STEPS.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => choose(index + 1)}
                    aria-label={`Step ${index + 1}: ${item.title}`}
                    aria-current={index + 1 === step ? "step" : undefined}
                    className={`h-2 rounded-full transition-all ${
                      index + 1 === step ? "w-[22px] bg-recommend-orange" : "w-2 bg-black/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-4 md:col-span-2 md:max-w-none md:flex-row md:items-center md:justify-center lg:col-span-1 lg:flex-col lg:items-stretch">
              <div className="flex flex-col gap-3 rounded-[18px] bg-white p-[18px] shadow-[0_10px_30px_rgba(0,0,0,.07)] md:min-w-[300px] lg:min-w-0">
                <p className="text-xs font-extrabold font-dm tracking-[.08em] text-[#98a2b3]">
                  A REAL ORDER, START TO FINISH
                </p>
                <SummaryLine label="Vendor" value="Mama Ngozi Kitchen" />
                <SummaryLine label="Order" value="2× Jollof Rice with Chicken" />
                <SummaryLine label="Delivery" value="₦1,500" />
                <div className="flex justify-between border-t border-[#eceff3] pt-2.5 text-base font-dm">
                  <span className="font-bold">Total</span>
                  <b>₦8,500</b>
                </div>
                <p className="text-[13px] font-dm text-[#5b6472]">
                  First message to delivery code in one conversation.
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 lg:items-start">
                <Button
                  text="Start Ordering"
                  href={CUSTOMER_APP_URL}
                  external
                  icon={<ArrowRight size={18} />}
                  variant="green"
                />
                <p className="text-[13px] font-dm text-[#5b6472]">
                  Opens in your browser. Nothing to install.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BackgroundThree>
  );
}

function StepArrow({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-green"
    >
      {children}
    </button>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm font-dm">
      <span className="text-[#5b6472]">{label}</span>
      <b className="text-right">{value}</b>
    </div>
  );
}
