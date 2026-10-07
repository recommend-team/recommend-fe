import { ArrowDown, ArrowRight, Check, LockKeyhole, Smartphone } from "lucide-react";
import { CUSTOMER_APP_URL } from "@/lib/links";
import { Button } from "../molecules/Button";
import OrderFlowPhone from "./OrderFlowPhone";
import { BackgroundTwo } from "../templates/BackgroundTwo";

/**
 * The hero: what Recommend is, in one line, and the way in.
 *
 * Says "works in your browser" rather than "no app": the customer app is a PWA today and
 * is headed for the Play Store and App Store, so "no app" would stop being true.
 *
 * The phone is the first screen of the order played in full by `NoAppSection` below —
 * "See how it works" scrolls there.
 */

const PROMISES = [
  { icon: Smartphone, text: "Works in your browser" },
  { icon: LockKeyhole, text: "Paid securely via Paystack" },
  { icon: Check, text: "Delivery or pickup" },
];

const LandingSectionOne = () => {
  return (
    <BackgroundTwo>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-28 pb-16 font-dm text-[#1A1A1A] md:px-10 md:pt-36 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:pt-40">
        <div className="flex flex-col gap-5 md:gap-6">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#E6F2EB] px-3 py-1.5 text-xs font-extrabold text-recommend-green md:text-[13px]">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#1b8f57]" />
            Now live in Lagos
          </span>

          <h1 className="font-champ text-[50px] leading-[.95] md:text-[68px] lg:text-[80px]">
            <span className="block">Anything you need.</span>
            <span className="block text-recommend-orange">Just chat.</span>
          </h1>

          <p className="max-w-[520px] text-base leading-relaxed text-[#3d4451] md:text-[19px]">
            Your personal market assistant. Tell us what you want — food, groceries,
            medicine — and we find it from vendors near you, take your payment securely, and
            bring it to your door.
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              text="Start Ordering"
              href={CUSTOMER_APP_URL}
              external
              icon={<ArrowRight size={18} />}
              variant="green"
            />
            <a
              href="#how-it-works"
              className="inline-flex min-h-11 items-center justify-center gap-2 px-2 text-base font-bold text-[#1A1A1A] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-green"
            >
              See how it works
              <ArrowDown size={16} strokeWidth={2.4} aria-hidden />
            </a>
          </div>

          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5b6472]">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2">
                <Icon size={16} strokeWidth={2.4} className="text-recommend-green" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* The phone, with two moments from later in the order pinned beside it */}
        <div className="relative flex justify-center">
          <OrderFlowPhone step={1} />
          <div
            aria-hidden
            className="absolute top-[150px] left-0 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3 shadow-[0_16px_36px_rgba(60,40,0,.16)] sm:left-[calc(50%-210px)] lg:-left-16"
          >
            <span className="grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-[#dfeadb] text-recommend-green">
              <Check size={16} strokeWidth={2.6} />
            </span>
            <div>
              <p className="text-sm font-extrabold">Paid — ₦8,500</p>
              <p className="text-[11px] text-[#6b7280]">via Paystack</p>
            </div>
          </div>
          <div
            aria-hidden
            className="absolute top-[420px] right-0 hidden rounded-2xl bg-white px-3.5 py-3 shadow-[0_16px_36px_rgba(60,40,0,.16)] sm:right-[calc(50%-200px)] sm:block lg:-right-10"
          >
            <p className="text-[10px] font-extrabold tracking-[.1em] text-[#6b7280]">
              ON ITS WAY · YOUR CODE
            </p>
            <p className="mt-0.5 font-mono text-xl font-extrabold tracking-[.28em] text-recommend-green">
              UWEUSB
            </p>
          </div>
        </div>
      </section>
    </BackgroundTwo>
  );
};

export { LandingSectionOne };
