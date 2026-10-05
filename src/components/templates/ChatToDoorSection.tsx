import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { BellRing, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { BackgroundThree } from "./BackgroundThree";

/**
 * "From your chat to your door" — what happens after a buyer pays, and who handles it.
 *
 * The "No app needed" section shows the buyer's side of the chat; this one shows the other
 * two people involved, the vendor and the rider, and explains the delivery code before a
 * buyer meets it at the door. Replaces the WhatsApp-era "Order in 3 Easy Steps".
 *
 * The illustrations are WebP renders of the hand-drawn SVGs in `public/svg` — the
 * originals weigh 2.9 MB between them, these 37 KB.
 */

interface Stage {
  role: string;
  title: string;
  body: string;
  image: { src: string; width: number; height: number };
  proof: ReactNode;
}

const STAGES: Stage[] = [
  {
    role: "YOU",
    title: "Order and pay in the chat",
    body: "Tell us what you want, confirm the total, and pay without leaving the conversation.",
    image: { src: "/images/journey/social_caricature.webp", width: 116, height: 116 },
    proof: (
      <div className="rounded-[14px] bg-[#dfeadb] px-3.5 py-3 text-left">
        <p className="text-sm font-extrabold text-recommend-green">Paid — ₦8,500</p>
        <p className="mt-0.5 text-[11px] tracking-[.04em] text-[#6b7280]">
          REC-EA643B0FFDEC · via Paystack
        </p>
      </div>
    ),
  },
  {
    role: "THE VENDOR",
    title: "Gets it and starts right away",
    body: "Your order lands with the vendor the moment you pay. You're told as soon as it's ready.",
    image: { src: "/images/journey/business_agreement.webp", width: 118, height: 118 },
    proof: (
      <div className="flex items-center gap-2.5 rounded-[14px] bg-white px-3.5 py-3 text-left">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#E6F2EB] text-recommend-green">
          <Check size={16} strokeWidth={2.6} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-extrabold">Ready</p>
          <p className="text-xs text-[#5b6472]">Mama Ngozi Kitchen has your order</p>
        </div>
      </div>
    ),
  },
  {
    role: "THE RIDER",
    title: "Brings it to your door",
    body: "Read your delivery code to the rider. No code, no hand-over — so it reaches you and only you.",
    image: { src: "/images/journey/delivery_scooter.webp", width: 132, height: 110 },
    proof: (
      <div className="rounded-[14px] bg-[#e9f3ec] px-3.5 py-2.5 text-left">
        <p className="text-[10px] font-bold tracking-[.1em] text-[#6b7280]">
          READ THIS CODE TO THE RIDER
        </p>
        <p className="mt-1 font-mono text-2xl font-extrabold tracking-[.3em] text-recommend-green">
          UWEUSB
        </p>
      </div>
    ),
  },
];

const PROMISES = [
  { icon: LockKeyhole, text: "Secure payment through Paystack" },
  { icon: BellRing, text: "An update at every step" },
  { icon: ShieldCheck, text: "Code-checked hand-over" },
];

export default function ChatToDoorSection() {
  return (
    <BackgroundThree>
      <section
        aria-labelledby="chat-to-door"
        className="mx-auto w-full max-w-6xl px-5 py-20 font-dm text-[#1A1A1A] md:px-10 md:py-24"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-extrabold tracking-[.14em] text-recommend-green md:text-[13px]">
            WHAT HAPPENS AFTER YOU PAY
          </span>
          <h2
            id="chat-to-door"
            className="font-champ text-[40px] leading-none md:text-[54px] lg:text-[64px]"
          >
            From your chat <span className="text-recommend-orange">to your door.</span>
          </h2>
          <p className="max-w-[560px] text-[15px] leading-relaxed text-[#3d4451] md:text-[17px]">
            Three people handle every order, and you can see each hand-off as it happens.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-14">
          {/* The path between the three — desktop only, where they sit side by side */}
          <svg
            aria-hidden
            viewBox="0 0 1088 160"
            fill="none"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-[30px] hidden h-[160px] w-full lg:block"
          >
            <path
              d="M180 70 C 300 -10, 420 150, 544 70 S 790 -10, 908 70"
              stroke="#006837"
              strokeOpacity=".35"
              strokeWidth="2.5"
              strokeDasharray="2 12"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="relative flex flex-col items-center lg:grid lg:grid-cols-3 lg:items-start lg:gap-10">
            {STAGES.map((stage, index) => (
              <Fragment key={stage.role}>
                {index > 0 && <MobileConnector />}
                <li
                  className={`flex flex-col items-center gap-3.5 text-center ${
                    index === 1 ? "lg:pt-[70px]" : ""
                  }`}
                >
                  <div className="relative grid h-[132px] w-[132px] place-items-center rounded-full bg-white shadow-[0_14px_34px_rgba(60,40,0,.12)] md:h-[168px] md:w-[168px]">
                    <Image
                      src={stage.image.src}
                      alt=""
                      width={stage.image.width}
                      height={stage.image.height}
                      className="h-auto w-[70%]"
                    />
                    <span className="absolute top-0.5 right-0.5 grid h-8 w-8 place-items-center rounded-full bg-recommend-orange text-sm font-extrabold text-white md:top-1.5 md:right-1.5 md:h-9 md:w-9 md:text-[15px]">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold tracking-[.12em] text-[#98a2b3] md:text-xs">
                    {stage.role}
                  </span>
                  <h3 className="-mt-1.5 text-[21px] font-extrabold md:text-2xl">{stage.title}</h3>
                  <p className="max-w-[290px] text-sm leading-relaxed text-[#5b6472] md:text-[15px]">
                    {stage.body}
                  </p>
                  <div className="mt-1.5 w-[260px] shadow-[0_6px_18px_rgba(0,0,0,.06)] [&>*]:w-full">
                    {stage.proof}
                  </div>
                </li>
              </Fragment>
            ))}
          </ol>
        </div>

        <ul className="mt-12 flex flex-col gap-3 rounded-2xl bg-white/70 p-4 text-sm text-[#3d4451] md:mt-14 md:flex-row md:justify-center md:gap-10 md:bg-transparent md:p-0">
          {PROMISES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2.5 md:gap-2">
              <Icon size={16} strokeWidth={2.4} className="text-recommend-green" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </section>
    </BackgroundThree>
  );
}

/** The dotted line between stacked stages on narrower screens. */
function MobileConnector() {
  return (
    <li aria-hidden className="py-3 lg:hidden">
      <svg width="2" height="48">
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="48"
          stroke="#006837"
          strokeOpacity=".35"
          strokeWidth="2"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />
      </svg>
    </li>
  );
}
