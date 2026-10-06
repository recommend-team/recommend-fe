"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { CUSTOMER_APP_URL } from "@/lib/links";
import { SOCIAL_LINKS } from "@/lib/social";
import { BUYER_FAQS } from "./BuyerFaqSection";
import { BackgroundThree } from "./BackgroundThree";
import { BackgroundTwo } from "./BackgroundTwo";

/**
 * The contact page: the fastest route for each kind of person first, then the form and the
 * details. Buyers with an order go to the chat — a person on the team can see the order and
 * take over — because that beats any form.
 *
 * The form still sends through the visitor's email app: there is no support endpoint yet.
 * When there is, `onSubmit` is the one place to change.
 */

export const CONTACT_EMAIL = "contacts.recommend@gmail.com";
export const CONTACT_PHONE = "+234 814 306 7676";
const CONTACT_PHONE_HREF = "tel:+2348143067676";
const SUPPORT_HOURS = [
  { days: "Monday – Friday", hours: "8am – 9pm" },
  { days: "Saturday", hours: "9am – 8pm" },
];

const EYEBROW = "text-xs font-extrabold tracking-[.14em] text-recommend-green md:text-[13px]";
const SECTION = "mx-auto w-full max-w-6xl px-5 md:px-10";

const mailto = (subject: string, body = "") =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ""
  }`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

function ContactHero() {
  return (
    <section
      aria-labelledby="contact-heading"
      className={`${SECTION} grid items-center gap-10 pt-32 pb-10 md:pt-40 md:pb-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16`}
    >
      <div className="flex flex-col gap-5">
        <span className={EYEBROW}>CONTACT US</span>
        <h1
          id="contact-heading"
          className="font-champ text-[48px] leading-[.96] md:text-[64px] lg:text-[76px]"
        >
          We&apos;re here to <span className="text-recommend-orange">help.</span>
        </h1>
        <p className="max-w-[600px] text-base leading-relaxed text-[#3d4451] md:text-[19px]">
          Questions about an order, selling on Recommend, riding with us, or working together
          — pick the quickest way to reach us below.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-[24px] bg-[#0F4A2E] p-6 text-[#FFF9E0] shadow-[0_24px_50px_rgba(15,74,46,.25)] md:rounded-[26px] md:p-7">
        <span className="text-xs font-extrabold tracking-[.12em] text-[#FFE58A]">FASTEST HELP</span>
        <p className="text-xl font-extrabold leading-snug md:text-[22px]">
          Already ordering? Ask in the chat.
        </p>
        <p className="text-sm leading-relaxed text-[#FFF9E0]/80 md:text-[15px]">
          A real person on our team can see your order and take over the conversation.
        </p>
        <ExternalButton href={CUSTOMER_APP_URL} className="mt-1 bg-recommend-orange text-white sm:self-start">
          Open the chat
        </ExternalButton>
      </div>
    </section>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const ROUTES = [
  {
    eyebrow: "CUSTOMERS",
    title: "Help with an order",
    body: "Late, wrong or missing items, or a payment question. Ask in the chat — it's quickest.",
    cta: "Open the chat",
    href: CUSTOMER_APP_URL,
    border: "border-t-recommend-orange",
    link: "text-recommend-green",
  },
  {
    eyebrow: "VENDORS",
    title: "Your store & payouts",
    body: "Sign-up, verification, orders or withdrawals. Include your business name.",
    cta: "Email vendor support",
    href: mailto("Vendor support", "Business name: \n\n"),
    border: "border-t-recommend-green",
    link: "text-recommend-green",
  },
  {
    eyebrow: "RIDERS",
    title: "Riding with us",
    body: "Joining, deliveries or earnings. Include the phone number you signed up with.",
    cta: "Email rider support",
    href: mailto("Rider support", "Phone number I signed up with: \n\n"),
    border: "border-t-[#FFD91D]",
    link: "text-[#c44514]",
  },
  {
    eyebrow: "BUSINESS",
    title: "Partnerships & press",
    body: "Working with us, media enquiries and interviews.",
    cta: "Email us",
    href: mailto("Partnership / press"),
    border: "border-t-[#1A1A1A]",
    link: "text-[#1A1A1A]",
  },
];

function ContactRoutes() {
  return (
    <section aria-labelledby="how-can-we-help" className={`${SECTION} flex flex-col gap-6 py-10 md:gap-7 md:py-14`}>
      <div className="flex flex-col gap-2">
        <span className={EYEBROW}>HOW CAN WE HELP?</span>
        <h2 id="how-can-we-help" className="font-champ text-[32px] leading-[1.02] md:text-[44px] md:leading-none">
          Choose what you need.
        </h2>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 md:gap-[18px] lg:grid-cols-4">
        {ROUTES.map((route) => (
          <li
            key={route.eyebrow}
            className={`flex flex-col gap-2.5 rounded-[22px] border-t-[5px] bg-white p-5 md:p-6 ${route.border}`}
          >
            <span className="text-xs font-extrabold tracking-[.12em] text-[#98a2b3]">{route.eyebrow}</span>
            <h3 className="text-lg font-extrabold md:text-[19px]">{route.title}</h3>
            <p className="text-sm leading-relaxed text-[#5b6472]">{route.body}</p>
            {route.href ? (
              <a
                href={route.href}
                {...(route.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`mt-auto inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-extrabold hover:underline ${route.link}`}
              >
                {route.cta}
                <ArrowRight size={15} strokeWidth={2.6} aria-hidden />
              </a>
            ) : (
              <span className={`mt-auto text-sm font-extrabold opacity-60 ${route.link}`}>{route.cta}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Form and details ─────────────────────────────────────────────────────────

const TOPICS = [
  "Order or delivery",
  "Payment or withdrawal",
  "Vendor support",
  "Rider support",
  "Partnership or press",
  "Something else",
] as const;
type Topic = (typeof TOPICS)[number];

interface FormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  orderReference: string;
  message: string;
}

const PHONE_RULE = /^\+?[0-9\s-]{7,20}$/;
const INPUT =
  "w-full rounded-xl border-[1.5px] border-[#e3e6e1] bg-[#fcfcf8] px-3.5 py-3 text-[15px] placeholder:text-[#98a2b3] focus:border-recommend-green focus:outline-none focus:ring-1 focus:ring-recommend-green";

/** What the email app is handed: a subject from the topic, every field in the body. */
export function composeEnquiry(topic: Topic, values: FormValues): string {
  const phone = values.phoneNumber.trim();
  const order = topic === "Order or delivery" ? values.orderReference.trim() : "";
  const header = [
    `Name: ${values.fullName.trim()}`,
    `Email: ${values.email.trim()}`,
    phone && `Phone: ${phone}`,
    order && `Order: ${order}`,
  ].filter(Boolean);
  return mailto(`Recommend — ${topic}`, [...header, "", values.message.trim()].join("\n"));
}

function ContactForm() {
  const [topic, setTopic] = useState<Topic>("Order or delivery");
  const [opened, setOpened] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { fullName: "", email: "", phoneNumber: "", orderReference: "", message: "" },
  });

  const onSubmit = (values: FormValues) => {
    window.open(composeEnquiry(topic, values), "_self");
    setOpened(true);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="send-message"
      className="flex flex-col gap-[18px] rounded-[24px] bg-white p-5 shadow-[0_14px_40px_rgba(60,40,0,.08)] md:rounded-[28px] md:p-9"
    >
      <div>
        <span className={EYEBROW}>SEND US A MESSAGE</span>
        <h2 id="send-message" className="mt-2 font-champ text-[28px] leading-[1.02] md:text-4xl md:leading-none">
          Tell us what&apos;s going on.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}>
          <input
            autoComplete="name"
            placeholder="Ada Okafor"
            {...register("fullName", {
              required: "Please enter your name",
              minLength: { value: 2, message: "Please enter your name" },
            })}
            className={INPUT}
          />
        </Field>
        <Field label="Email address" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            placeholder="ada@example.com"
            {...register("email", {
              required: "Please enter your email",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
            className={INPUT}
          />
        </Field>
      </div>

      <Field label="Phone number" hint="(optional — for a call back)" error={errors.phoneNumber?.message}>
        <input
          type="tel"
          autoComplete="tel"
          placeholder="0801 234 5678"
          {...register("phoneNumber", {
            validate: (value) => !value.trim() || PHONE_RULE.test(value.trim()) || "Enter a valid phone number",
          })}
          className={INPUT}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[13px] font-bold text-[#3d4451]">What is it about?</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((option) => {
            const on = option === topic;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setTopic(option)}
                aria-pressed={on}
                className={`min-h-10 rounded-full border-[1.5px] px-3.5 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-green ${
                  on
                    ? "border-recommend-green bg-recommend-green text-white"
                    : "border-[#e3e6e1] bg-white text-[#1A1A1A] hover:border-recommend-green"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      {topic === "Order or delivery" && (
        <Field label="Order reference" hint="(it starts with REC-, in your chat)">
          <input placeholder="REC-…" {...register("orderReference")} className={INPUT} />
        </Field>
      )}

      <Field label="Message" error={errors.message?.message}>
        <textarea
          rows={5}
          placeholder="How can we help?"
          {...register("message", {
            required: "Please tell us how we can help",
            minLength: { value: 10, message: "A little more detail, please (10+ characters)" },
            maxLength: { value: 2000, message: "Please keep it under 2,000 characters" },
          })}
          className={`${INPUT} resize-none leading-relaxed`}
        />
      </Field>

      {opened && (
        <p role="status" className="rounded-xl bg-[#E6F2EB] p-3 text-sm text-recommend-green">
          Your email app should open with your message ready to send. If it doesn&apos;t, email us
          at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[#6b7280]">
          This opens your email app with your message ready. We only use your details to reply.
        </p>
        <button
          type="submit"
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-[14px] bg-recommend-green px-6 text-base font-extrabold text-white transition-colors hover:bg-recommend-green-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-green"
        >
          Send message
          <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </form>
  );
}

function ContactDetails() {
  const rows = [
    {
      icon: Mail,
      label: "EMAIL",
      value: (
        <a href={`mailto:${CONTACT_EMAIL}`} className="break-all hover:underline">
          {CONTACT_EMAIL}
        </a>
      ),
    },
    {
      icon: Phone,
      label: "PHONE",
      value: (
        <a href={CONTACT_PHONE_HREF} className="hover:underline">
          {CONTACT_PHONE}
        </a>
      ),
    },
    {
      icon: Clock,
      label: "SUPPORT HOURS",
      value: (
        <span className="flex flex-col">
          {SUPPORT_HOURS.map(({ days, hours }) => (
            <span key={days}>
              {days}: {hours}
            </span>
          ))}
        </span>
      ),
    },
    { icon: MapPin, label: "LOCATION", value: "Lagos, Nigeria" },
  ];

  return (
    <aside aria-label="Contact details" className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-5 rounded-[24px] bg-[#0F4A2E] p-6 text-[#FFF9E0] md:rounded-[26px] md:p-7">
        <span className="text-xs font-extrabold tracking-[.12em] text-[#FFE58A]">CONTACT DETAILS</span>
        <dl className="flex flex-col gap-5">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3.5">
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF9E0]/10 text-[#8fe3b4]"
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <div>
                <dt className="text-xs font-bold text-[#FFF9E0]/60">{label}</dt>
                <dd className="text-[15px] font-bold md:text-base">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-3 rounded-[22px] bg-white p-5 md:p-[22px]">
        <span className="text-xs font-extrabold tracking-[.14em] text-recommend-green">FOLLOW US</span>
        <ul className="grid grid-cols-2 gap-2.5">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-between rounded-xl bg-[#FFF9E0] px-3 text-sm font-bold text-[#1A1A1A] transition-colors hover:bg-[#FFF3C4]"
              >
                {label}
                <ArrowUpRight size={15} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function ContactFormAndDetails() {
  return (
    <section className={`${SECTION} grid items-start gap-5 py-10 md:gap-7 md:py-14 lg:grid-cols-[minmax(0,1fr)_380px]`}>
      <ContactForm />
      <ContactDetails />
    </section>
  );
}

// ─── Quick answers ────────────────────────────────────────────────────────────

const QUICK = [
  {
    question: "Where is my order?",
    answer:
      "You get an update in the chat at each step. Open your orders in the app to see its status and your delivery code.",
  },
  ...BUYER_FAQS.filter((faq) => faq.question === "How do I pay? Is it safe?"),
  {
    question: "How do I start selling?",
    answer: "Sign up in the vendor app, verify your business, and list your products. It's free to join.",
  },
];

function ContactQuickAnswers() {
  return (
    <section
      aria-labelledby="quick-answers"
      className={`${SECTION} grid items-start gap-6 pt-10 pb-24 md:pt-14 md:pb-28 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14`}
    >
      <div className="flex flex-col gap-2.5">
        <span className={EYEBROW}>QUICK ANSWERS</span>
        <h2 id="quick-answers" className="font-champ text-[30px] leading-[1.02] md:text-[40px] md:leading-none">
          You might not need to write.
        </h2>
        <Link
          href="/#faq"
          className="mt-1.5 inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-extrabold text-recommend-green hover:underline"
        >
          See all questions
          <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {QUICK.map(({ question, answer }) => (
          <li key={question} className="rounded-[18px] bg-white/75 px-5 py-4 md:px-[22px] md:py-5">
            <h3 className="text-base font-extrabold md:text-[17px]">{question}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5b6472] md:text-[15px]">{answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-bold text-[#3d4451]">
      <span>
        {label} {hint && <span className="font-medium text-[#98a2b3]">{hint}</span>}
      </span>
      {children}
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}

function ExternalButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const base = `inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-extrabold ${className}`;
  if (!href) return <span className={`${base} opacity-60`}>{children}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
      {children}
      <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
    </a>
  );
}

/** The page body; each section on its own background, like every other page. */
export default function ContactContent() {
  const sections = [ContactRoutes, ContactFormAndDetails, ContactQuickAnswers];

  return (
    <div className="font-dm text-[#1A1A1A]">
      <BackgroundTwo>
        <ContactHero />
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
