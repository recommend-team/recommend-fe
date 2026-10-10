"use client";

import { useId, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { CUSTOMER_APP_URL } from "@/lib/links";
import { SERVICE_AREAS, servedAreaFor } from "@/lib/serviceAreas";
import { BackgroundThree } from "./BackgroundThree";
import { PICKUP_ENABLED } from "@/lib/features";

/**
 * "Where we deliver" — the areas we serve today, and a check a buyer can run on their own
 * street. Deliberately says nothing about where we started or where we're headed: the list
 * grows, the copy shouldn't need to. Replaces the scrolling strip of street names, which listed places
 * without saying whether we were live there.
 */

const EXAMPLES = ["Admiralty Way", "Osapa London", "Yaba"];

export default function CoverageSection() {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const typed = query.trim();
  const match = typed.length >= 3 ? servedAreaFor(typed) : null;
  const answered = typed.length >= 3;

  return (
    <BackgroundThree>
      <section
        aria-labelledby="where-we-deliver"
        className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 font-dm text-[#1A1A1A] md:px-10 md:py-24 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-16"
      >
        <div className="flex flex-col gap-4 px-1 md:gap-[18px]">
          <span className="text-xs font-extrabold tracking-[.14em] text-recommend-green md:text-[13px]">
            WHERE WE DELIVER
          </span>
          <h2
            id="where-we-deliver"
            className="font-champ text-[40px] leading-none md:text-[54px] lg:text-[64px] lg:leading-[.98]"
          >
            Is Recommend <span className="text-recommend-orange">near you?</span>
          </h2>
          <p className="max-w-[520px] text-[15px] leading-relaxed text-[#3d4451] md:text-[17px]">
            Here&apos;s where we deliver today. We add new areas as vendors and riders join.
          </p>
          <ul className="mt-1 flex max-w-[560px] flex-wrap gap-2 md:gap-2.5">
            {SERVICE_AREAS.map((area) => (
              <li
                key={area}
                className="inline-flex items-center gap-2 rounded-full border border-[#dcebe2] bg-white px-3 py-2 text-[13px] font-bold md:px-3.5 md:text-sm"
              >
                <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-[#1b8f57]" />
                {area}
              </li>
            ))}
          </ul>
          <p className="text-sm text-[#6b7280]">
            Not listed? Ask in the chat — if a vendor near you is on Recommend, we&apos;ll
            find them.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-[0_24px_56px_rgba(60,40,0,.14)] md:rounded-[28px] md:p-[30px]">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#E6F2EB] text-recommend-green"
            >
              <MapPin size={22} strokeWidth={2.2} />
            </span>
            <h3 className="text-xl font-extrabold md:text-[22px]">Do you deliver to me?</h3>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={inputId} className="text-[13px] font-bold text-[#5b6472]">
              Your street or area
            </label>
            <div className="flex items-center gap-2.5 rounded-[14px] border-[1.5px] border-[#cfd8d2] bg-[#fbfdfb] px-4 focus-within:border-recommend-green">
              <Search size={18} strokeWidth={2.2} className="shrink-0 text-[#98a2b3]" aria-hidden />
              <input
                id={inputId}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. Admiralty Way"
                autoComplete="address-level3"
                className="min-h-[52px] w-full bg-transparent text-base font-bold outline-none placeholder:font-medium placeholder:text-[#98a2b3] md:text-[17px]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#98a2b3]">Try:</span>
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="min-h-10 rounded-full border border-[#e3e8e5] bg-white px-3.5 text-[13px] font-bold transition-colors hover:border-recommend-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-green"
              >
                {example}
              </button>
            ))}
          </div>

          <div aria-live="polite">
            {answered &&
              (match ? (
                <Answer
                  tone="yes"
                  title={`Yes — we deliver to ${match}.`}
                  body="Vendors near you are on Recommend now. You'll see the delivery fee before you pay."
                  cta="Start Ordering"
                />
              ) : (
                <Answer
                  tone="no"
                  title={`Not in ${typed} yet.`}
                  body={
                    PICKUP_ENABLED
                      ? "We add new areas as vendors and riders join. You can still order for pickup from a vendor in one of our areas."
                      : "We add new areas as vendors and riders join."
                  }
                  cta="Ask anyway"
                />
              ))}
          </div>
        </div>
      </section>
    </BackgroundThree>
  );
}

function Answer({
  tone,
  title,
  body,
  cta,
}: {
  tone: "yes" | "no";
  title: string;
  body: string;
  cta: string;
}) {
  const yes = tone === "yes";
  const ctaClass = `inline-flex min-h-12 items-center justify-center gap-2 self-stretch rounded-xl px-[18px] text-[15px] font-extrabold text-white sm:self-start ${
    yes ? "bg-recommend-green" : "bg-[#1A1A1A]"
  }`;

  return (
    <div
      className={`flex flex-col gap-3 rounded-[18px] p-4 md:p-[18px] ${
        yes ? "bg-[#E6F2EB]" : "bg-[#FFF6D6]"
      }`}
    >
      <p className={`text-base font-extrabold md:text-[17px] ${yes ? "text-recommend-green" : "text-[#6b4e00]"}`}>
        {title}
      </p>
      <p className="text-sm leading-relaxed text-[#3d4451]">{body}</p>
      {CUSTOMER_APP_URL ? (
        <a href={CUSTOMER_APP_URL} target="_blank" rel="noopener noreferrer" className={ctaClass}>
          {cta}
          <ArrowRight size={16} strokeWidth={2.6} aria-hidden />
        </a>
      ) : (
        <span aria-disabled className={`${ctaClass} opacity-60`}>
          {cta}
        </span>
      )}
    </div>
  );
}
