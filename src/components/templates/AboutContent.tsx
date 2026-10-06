import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck, Ticket, UserRound } from "lucide-react";
import { CUSTOMER_APP_URL, vendorApp } from "@/lib/links";
import { Button } from "@/components/molecules/Button";
import { BackgroundThree } from "./BackgroundThree";
import { BackgroundTwo } from "./BackgroundTwo";

/**
 * The About page (design option A, "Editorial"): who we are, the founder's story, mission
 * and vision, what we do, who we serve, what we stand for, why it is safe, and what to do
 * next. Every claim is something the product does today — no invented figures.
 */

const EYEBROW = "text-xs font-extrabold tracking-[.14em] text-recommend-green md:text-[13px]";
const SECTION = "mx-auto w-full max-w-6xl px-5 md:px-10";

// ─── Who we are ───────────────────────────────────────────────────────────────

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className={`${SECTION} grid items-center gap-12 pt-32 pb-12 md:pt-40 md:pb-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16`}
    >
      <div className="flex flex-col gap-5 md:gap-6">
        <span className={EYEBROW}>ABOUT RECOMMEND</span>
        <h1
          id="about-heading"
          className="font-champ text-[46px] leading-[.98] md:text-[64px] lg:text-[76px] lg:leading-[.96]"
        >
          We connect Lagos to the vendors <span className="text-recommend-orange">next door.</span>
        </h1>
        <p className="max-w-[620px] text-base leading-relaxed text-[#3d4451] md:text-[19px]">
          Recommend is a personal market assistant for Lagos. Tell us what you need, and we
          connect you with verified vendors nearby — then take care of payment and delivery,
          all in one conversation.
        </p>
      </div>
      <div className="relative mx-auto w-full max-w-[380px] rotate-2 rounded-[28px] bg-white p-7 shadow-[0_24px_50px_rgba(60,40,0,.12)]">
        <span className="text-xs font-extrabold tracking-[.12em] text-[#98a2b3]">
          HOW IT STARTED
        </span>
        <p className="mt-2.5 font-champ text-[26px] leading-[1.05] md:text-[30px]">
          A wet shirt, a closed dry cleaner, and 45 lost minutes.
        </p>
        <Image
          src="/images/journey/social_caricature.webp"
          alt=""
          width={96}
          height={96}
          className="absolute -bottom-9 right-4 h-auto w-20 md:w-24"
        />
      </div>
    </section>
  );
}

// ─── The story ────────────────────────────────────────────────────────────────

export function AboutStory() {
  return (
    <section
      aria-labelledby="our-story"
      className={`${SECTION} grid items-start gap-10 py-12 md:py-16 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-[72px]`}
    >
      <figure className="mx-auto flex w-full max-w-[340px] flex-col gap-3.5">
        <div className="relative aspect-[17/20] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#0F4A2E] to-[#1b8f57]">
          <Image
            src="/images/about/chanor-james.webp"
            alt="Chanor James, founder of Recommend"
            fill
            sizes="(min-width: 1024px) 340px, 90vw"
            className="object-cover object-top"
          />
        </div>
        <figcaption>
          <p className="text-xl font-extrabold">Chanor James</p>
          <p className="mt-0.5 text-[15px] text-[#5b6472]">Founder, Recommend</p>
        </figcaption>
      </figure>

      <div className="flex flex-col gap-5 lg:pt-2">
        <span className={EYEBROW}>OUR STORY</span>
        <h2 id="our-story" className="font-champ text-[34px] leading-[1.02] md:text-[52px] md:leading-none">
          It started with a 45-second problem.
        </h2>
        <p className="text-[15px] leading-[1.7] text-[#3d4451] md:text-[17px]">
          On the way to an important interview, Chanor James had water splashed across his
          shirt. He needed a dry cleaner, fast. The nearest one was closed, and nobody could
          say which vendors nearby were reliable.
        </p>
        <p className="text-[15px] leading-[1.7] text-[#3d4451] md:text-[17px]">
          Forty-five minutes of searching, scrolling and calling numbers that didn&apos;t
          connect — for something that should have taken forty-five seconds. Lagos is full of
          great vendors. Finding the right one, right now, shouldn&apos;t be the hard part.
        </p>
        <blockquote className="mt-2 rounded-[22px] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(60,40,0,.08)] md:px-[30px] md:py-[26px]">
          <p className="font-champ text-[26px] leading-[1.05] text-recommend-orange md:text-[34px]">
            “What if one message could fix this?”
          </p>
          <p className="mt-2.5 text-sm text-[#5b6472]">The question that started Recommend.</p>
        </blockquote>
      </div>
    </section>
  );
}

// ─── Mission and vision ───────────────────────────────────────────────────────

export function AboutMission() {
  return (
    <section aria-label="Mission and vision" className={`${SECTION} grid gap-4 py-12 md:grid-cols-2 md:gap-6 md:py-16`}>
      <div className="flex flex-col gap-3.5 rounded-[24px] bg-recommend-green p-6 text-white md:rounded-[28px] md:p-10">
        <span className="text-xs font-extrabold tracking-[.14em] text-[#8fe3b4] md:text-[13px]">
          OUR MISSION
        </span>
        <p className="font-champ text-[26px] leading-[1.05] md:text-4xl">
          Make getting what you need as easy as asking for it.
        </p>
        <p className="text-sm leading-relaxed text-white/85 md:text-base">
          We connect people to trusted vendors nearby in a single conversation — and stand
          behind every order, from payment to hand-over.
        </p>
      </div>
      <div className="flex flex-col gap-3.5 rounded-[24px] border border-[#f0e8c0] bg-white p-6 md:rounded-[28px] md:p-10">
        <span className={EYEBROW}>OUR VISION</span>
        <p className="font-champ text-[26px] leading-[1.05] md:text-4xl">
          The best vendors in every neighbourhood, one message away.
        </p>
        <p className="text-sm leading-relaxed text-[#5b6472] md:text-base">
          Starting in Lagos, and growing city by city — so local businesses thrive and
          everyone gets what they need, faster.
        </p>
      </div>
    </section>
  );
}

// ─── What we do ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: "Ask for anything",
    body: "Food, groceries, medicine and more — we show you vendors nearby with real prices.",
    image: { src: "/images/journey/social_caricature.webp", width: 64 },
  },
  {
    title: "Pay securely",
    body: "Pay in the chat through Paystack. The vendor starts on your order right away.",
    image: { src: "/images/journey/business_agreement.webp", width: 64 },
  },
  {
    title: "Delivered or collected",
    body: "Follow every step in the chat. A code makes sure it reaches you, and only you.",
    image: { src: "/images/journey/delivery_scooter.webp", width: 76 },
  },
];

export function AboutWhatWeDo() {
  return (
    <section aria-labelledby="what-we-do" className={`${SECTION} flex flex-col gap-8 py-12 md:gap-9 md:py-16`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="flex flex-col gap-2.5">
          <span className={EYEBROW}>WHAT WE DO</span>
          <h2 id="what-we-do" className="font-champ text-[32px] leading-[1.02] md:text-5xl md:leading-none">
            One conversation, start to finish.
          </h2>
        </div>
        <p className="max-w-[380px] text-[15px] leading-relaxed text-[#5b6472] md:text-base">
          No forms, no menus to dig through. Recommend works in your browser — just open it
          and chat.
        </p>
      </div>
      <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-3 rounded-[24px] bg-white/75 p-6 md:p-7">
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-recommend-orange font-extrabold text-white">
                {index + 1}
              </span>
              <Image
                src={step.image.src}
                alt=""
                width={step.image.width}
                height={step.image.width}
                className="h-auto"
                style={{ width: step.image.width }}
              />
            </div>
            <h3 className="text-xl font-extrabold md:text-[22px]">{step.title}</h3>
            <p className="text-sm leading-relaxed text-[#5b6472] md:text-[15px]">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── Who we serve ─────────────────────────────────────────────────────────────

export function AboutWhoWeServe() {
  const audiences = [
    {
      eyebrow: "CUSTOMERS",
      title: "Get it without the hassle",
      body: "Ask, pay securely, and choose delivery or pickup — with updates at every step.",
      cta: "Start Ordering",
      href: CUSTOMER_APP_URL,
      external: true,
      border: "border-t-recommend-orange",
      link: "text-recommend-green",
    },
    {
      eyebrow: "VENDORS",
      title: "Get found by buyers nearby",
      body: "People looking for what you sell find you by chatting. Orders arrive already paid.",
      cta: "Become a vendor",
      href: vendorApp("/signup"),
      external: true,
      border: "border-t-recommend-green",
      link: "text-recommend-green",
    },
    {
      eyebrow: "RIDERS",
      title: "Earn on deliveries near you",
      body: "Pick up close to where you are, and hand over with a code — no disputes.",
      cta: "Become a rider",
      href: "/rider/signup",
      external: false,
      border: "border-t-[#FFD91D]",
      link: "text-[#c44514]",
    },
  ];

  return (
    <section aria-labelledby="who-we-serve" className={`${SECTION} flex flex-col gap-8 py-12 md:gap-9 md:py-16`}>
      <div className="flex flex-col gap-2.5">
        <span className={EYEBROW}>WHO WE SERVE</span>
        <h2 id="who-we-serve" className="font-champ text-[32px] leading-[1.02] md:text-5xl md:leading-none">
          Good for everyone in the order.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {audiences.map((item) => (
          <div
            key={item.eyebrow}
            className={`flex flex-col gap-3 rounded-[24px] border-t-[6px] bg-white p-6 md:p-[30px] ${item.border}`}
          >
            <span className="text-xs font-extrabold tracking-[.12em] text-[#98a2b3]">{item.eyebrow}</span>
            <h3 className="text-xl font-extrabold md:text-2xl">{item.title}</h3>
            <p className="text-sm leading-relaxed text-[#5b6472] md:text-[15px]">{item.body}</p>
            <TextLink href={item.href} external={item.external} className={`mt-auto ${item.link}`}>
              {item.cta}
            </TextLink>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Values ───────────────────────────────────────────────────────────────────

const VALUES = [
  {
    title: "Fast",
    body: "Seconds, not minutes. Every feature we build answers one question: does this make it faster?",
  },
  {
    title: "Trusted",
    body: "Every vendor verified, every payment protected. We stand behind each order.",
  },
  {
    title: "Simple",
    body: "Just chat. No forms, no menus to dig through — say what you want and we handle the rest.",
  },
  {
    title: "Local",
    body: "Built in Lagos, for Lagos — and for the businesses that make every neighbourhood work.",
  },
];

export function AboutValues() {
  return (
    <section
      aria-labelledby="our-values"
      className={`${SECTION} grid items-start gap-8 py-12 md:py-16 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14`}
    >
      <div className="flex flex-col gap-2.5">
        <span className={EYEBROW}>WHAT WE STAND FOR</span>
        <h2 id="our-values" className="font-champ text-[32px] leading-[1.02] md:text-5xl md:leading-none">
          Four words. Everything we do.
        </h2>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-[18px]">
        {VALUES.map((value) => (
          <li key={value.title} className="rounded-[22px] bg-white/75 p-5 md:p-6">
            <p className="font-champ text-2xl text-recommend-orange md:text-[30px]">{value.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#3d4451] md:text-[15px]">{value.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Trust and safety ─────────────────────────────────────────────────────────

const SAFEGUARDS = [
  {
    icon: ShieldCheck,
    title: "Verified vendors",
    body: "Every vendor is checked before they sell — NIN, or CAC and TIN for registered businesses.",
  },
  {
    icon: LockKeyhole,
    title: "Secure payments",
    body: "Payments run through Paystack. Card details never reach us or the vendor.",
  },
  {
    icon: Ticket,
    title: "Code-checked hand-overs",
    body: "Every delivery and pickup is confirmed with a code only the buyer has.",
  },
  {
    icon: UserRound,
    title: "People behind the chat",
    body: "When our assistant can't help, it hands you to a real person on our team.",
  },
];

export function AboutTrust() {
  return (
    <section aria-labelledby="trust-safety" className={`${SECTION} py-12 md:py-16`}>
      <div className="flex flex-col gap-7 rounded-[26px] bg-[#0F4A2E] p-6 text-[#FFF9E0] md:gap-8 md:rounded-[32px] md:p-[52px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-extrabold tracking-[.14em] text-[#FFE58A] md:text-[13px]">
              TRUST &amp; SAFETY
            </span>
            <h2 id="trust-safety" className="font-champ text-[30px] leading-[1.02] md:text-[46px] md:leading-none">
              Built so you can rely on it.
            </h2>
          </div>
          <p className="max-w-[380px] text-[15px] leading-relaxed text-[#FFF9E0]/75 md:text-base">
            Trust is the product. Here&apos;s how we protect every order.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 md:gap-[18px] lg:grid-cols-4">
          {SAFEGUARDS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex flex-col gap-2.5 rounded-[20px] bg-[#FFF9E0]/[.07] p-5 md:p-[22px]">
              <Icon size={26} strokeWidth={2} className="text-[#8fe3b4]" aria-hidden />
              <p className="text-[17px] font-extrabold">{title}</p>
              <p className="text-sm leading-relaxed text-[#FFF9E0]/75">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Next steps ───────────────────────────────────────────────────────────────

export function AboutNextSteps() {
  return (
    <section
      aria-labelledby="next-steps"
      className={`${SECTION} flex flex-col items-center gap-5 pt-16 pb-24 text-center md:pt-24 md:pb-28`}
    >
      <h2 id="next-steps" className="font-champ text-[40px] leading-none md:text-[60px]">
        Ready when <span className="text-recommend-orange">you are.</span>
      </h2>
      <p className="max-w-[560px] text-[15px] leading-relaxed text-[#3d4451] md:text-[17px]">
        Order something, sell what you make, or ride with us. Recommend is live in Lagos now.
      </p>
      <div className="mt-1 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
        <Button
          variant="green"
          text="Start Ordering"
          href={CUSTOMER_APP_URL}
          external
          icon={<ArrowRight size={18} />}
        />
        <OutlineLink href={vendorApp("/signup")} external className="border-[#cfe2d6] text-recommend-green">
          Become a vendor
        </OutlineLink>
        <OutlineLink href="/rider/signup" className="border-[#f6d3c4] text-[#c44514]">
          Become a rider
        </OutlineLink>
      </div>
      <p className="mt-2 text-sm text-[#6b7280]">
        Press, partnerships or anything else?{" "}
        <Link href="/contact" className="font-extrabold text-recommend-green hover:underline">
          Contact us
        </Link>
      </p>
    </section>
  );
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

/** An arrow link; off-site opens a new tab, and no URL renders as text rather than `#`. */
function TextLink({
  href,
  external = false,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const base = `inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-extrabold ${className}`;
  const inner = (
    <>
      {children}
      <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
    </>
  );
  if (!href) return <span className={`${base} opacity-60`}>{inner}</span>;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} hover:underline`}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={`${base} hover:underline`}>
      {inner}
    </Link>
  );
}

function OutlineLink({
  href,
  external = false,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const base = `inline-flex min-h-[52px] items-center justify-center rounded-[14px] border-[1.5px] bg-white px-6 text-base font-extrabold transition-colors hover:bg-[#fffdf2] ${className}`;
  if (!href) return <span className={`${base} opacity-60`}>{children}</span>;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
      {children}
    </a>
  ) : (
    <Link href={href} className={base}>
      {children}
    </Link>
  );
}

/**
 * The page body. Each section sits on its own background, as on every other page — the
 * hero on the clouded one, the rest on the grid. One background stretched over the whole
 * page scaled its pattern up until it no longer matched the rest of the site.
 */
export default function AboutContent() {
  const sections = [
    AboutStory,
    AboutMission,
    AboutWhatWeDo,
    AboutWhoWeServe,
    AboutValues,
    AboutTrust,
    AboutNextSteps,
  ];

  return (
    <div className="font-dm text-[#1A1A1A]">
      <BackgroundTwo>
        <AboutHero />
      </BackgroundTwo>
      {/* A fixed list, never reordered — its position is a stable key. */}
      {sections.map((Section, index) => (
        <BackgroundThree key={index}>
          <Section />
        </BackgroundThree>
      ))}
    </div>
  );
}
