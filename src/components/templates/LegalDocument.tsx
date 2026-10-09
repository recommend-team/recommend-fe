import Link from "next/link";
import { ArrowUp, CalendarDays, Building2, Mail } from "lucide-react";
import { COMPANY, LEGAL_EMAIL, type LegalBlock, type LegalDoc, type Rich } from "@/lib/legal/types";
import { BackgroundTwo } from "./BackgroundTwo";

/**
 * The Terms of Use and Privacy Policy pages: the clouded hero every page opens with, then a
 * table of contents beside the document on a white sheet. Long legal text needs room and
 * calm, so the body sits on the plain amber rather than the grid — stretched over a page
 * this tall, the pattern scales up until it no longer matches the rest of the site.
 */

const EYEBROW = "text-xs font-extrabold tracking-[.14em] text-recommend-green md:text-[13px]";
const SECTION = "mx-auto w-full max-w-6xl px-5 md:px-10";

const LEGAL_PAGES = [
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
] as const;

export type LegalHref = (typeof LEGAL_PAGES)[number]["href"];

// ─── Rich text ────────────────────────────────────────────────────────────────

// `**bold**`, an email address, or a `www.` link. Capturing, so `split` keeps the matches.
const TOKEN =
  /(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|www\.[\w-]+(?:\.[\w-]+)+(?:\/[\w\-./]*[\w-])?)/g;

const LINK =
  "font-bold text-recommend-green underline decoration-recommend-green/30 underline-offset-2 transition-colors hover:decoration-recommend-green";

function RichText({ text }: { text: Rich }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (i % 2 === 0) return part;
        if (part.startsWith("**")) {
          return (
            <strong key={i} className="font-extrabold text-[#1A1A1A]">
              <RichText text={part.slice(2, -2)} />
            </strong>
          );
        }
        if (part.includes("@")) {
          return (
            <a key={i} href={`mailto:${part}`} className={LINK}>
              {part}
            </a>
          );
        }
        return (
          <a key={i} href={`https://${part}`} target="_blank" rel="noopener noreferrer" className={LINK}>
            {part}
          </a>
        );
      })}
    </>
  );
}

// ─── Blocks ───────────────────────────────────────────────────────────────────

const BODY = "text-[15px] leading-[1.75] text-[#3d4451] md:text-base";

function Block({ block }: { block: LegalBlock }) {
  if ("h" in block) {
    return <h3 className="mt-8 text-lg font-extrabold text-[#1A1A1A] first:mt-0 md:text-xl">{block.h}</h3>;
  }
  if ("p" in block) {
    return (
      <p className={BODY}>
        <RichText text={block.p} />
      </p>
    );
  }
  if ("list" in block) {
    return (
      <ul className="flex flex-col gap-2.5">
        {block.list.map((item) => (
          <li key={item} className={`${BODY} relative pl-6`}>
            <span
              aria-hidden
              className="absolute left-1 top-[.7em] h-2 w-2 rounded-full bg-recommend-orange"
            />
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if ("note" in block) {
    return (
      <div className="rounded-[18px] border-l-4 border-recommend-green bg-[#f1f8f3] px-5 py-4 md:px-6 md:py-5">
        {block.title && (
          <p className="mb-1.5 text-[15px] font-extrabold text-recommend-green md:text-base">
            <RichText text={block.title} />
          </p>
        )}
        <p className={BODY}>
          <RichText text={block.note} />
        </p>
      </div>
    );
  }
  return (
    // Wide tables scroll inside their own frame, never the page.
    <div className="overflow-x-auto rounded-[18px] border border-[#f0e8c0]">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm md:text-[15px]">
        <thead className="bg-recommend-amber">
          <tr>
            {block.table.head.map((cell) => (
              <th key={cell} scope="col" className="px-4 py-3 font-extrabold text-[#1A1A1A] md:px-5">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]} className="border-t border-[#f0e8c0] align-top">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`px-4 py-3 leading-relaxed md:px-5 ${
                    i === 0 ? "font-bold text-[#1A1A1A]" : "text-[#3d4451]"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

function Contents({ doc }: { doc: LegalDoc }) {
  return (
    <ol className="flex flex-col gap-0.5">
      {doc.sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex gap-3 rounded-xl px-2.5 py-2 text-sm leading-snug text-[#3d4451] transition-colors hover:bg-recommend-amber hover:text-[#1A1A1A]"
          >
            <span className="w-5 shrink-0 text-right font-extrabold text-recommend-orange">
              {index + 1}
            </span>
            <span className="font-bold">{section.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-[13px] font-bold text-[#3d4451] md:text-sm">
      {icon}
      {children}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LegalDocument({ doc, current }: { doc: LegalDoc; current: LegalHref }) {
  return (
    <div className="font-dm text-[#1A1A1A]">
      <BackgroundTwo>
        <section
          aria-labelledby="legal-heading"
          className={`${SECTION} flex flex-col gap-5 pt-32 pb-12 md:gap-6 md:pt-40 md:pb-16`}
        >
          <nav aria-label="Legal documents" className="flex flex-wrap gap-2">
            {LEGAL_PAGES.map((page) => {
              const active = page.href === current;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-extrabold transition-colors ${
                    active
                      ? "bg-recommend-green text-white"
                      : "border-[1.5px] border-[#cfe2d6] bg-white text-recommend-green hover:bg-[#fffdf2]"
                  }`}
                >
                  {page.label}
                </Link>
              );
            })}
          </nav>
          <span className={EYEBROW}>LEGAL · {doc.eyebrow}</span>
          <h1
            id="legal-heading"
            className="font-champ text-[46px] leading-[.98] md:text-[64px] lg:text-[76px] lg:leading-[.96]"
          >
            {doc.title}
          </h1>
          <p className="max-w-[640px] text-base leading-relaxed text-[#3d4451] md:text-[19px]">
            {doc.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            <Meta icon={<CalendarDays size={16} className="text-recommend-orange" aria-hidden />}>
              Last updated {doc.lastUpdated}
            </Meta>
            {doc.effective && (
              <Meta icon={<CalendarDays size={16} className="text-recommend-green" aria-hidden />}>
                Effective {doc.effective}
              </Meta>
            )}
            <Meta icon={<Building2 size={16} className="text-recommend-green" aria-hidden />}>
              {COMPANY} · Lagos, Nigeria
            </Meta>
          </div>
        </section>
      </BackgroundTwo>

      <div className="bg-recommend-amber">
        <div
          className={`${SECTION} grid items-start gap-6 pb-20 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-12 md:pb-28`}
        >
          {/* Small screens: contents fold away above the document. */}
          <details className="group rounded-[20px] bg-white p-2 shadow-[0_10px_30px_rgba(60,40,0,.06)] lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-[15px] font-extrabold [&::-webkit-details-marker]:hidden">
              On this page
              <span className="text-sm text-[#98a2b3] group-open:hidden">
                {doc.sections.length} sections
              </span>
              <span className="hidden text-sm text-[#98a2b3] group-open:inline">Hide</span>
            </summary>
            <div className="pt-1 pb-2">
              <Contents doc={doc} />
            </div>
          </details>

          {/* Large screens: contents stay beside the text as it scrolls. */}
          <aside className="hidden lg:sticky lg:top-28 lg:block">
            <nav
              aria-label="On this page"
              className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[24px] bg-white/75 p-4 scrollbar-hide"
            >
              <p className="px-2.5 pb-2 text-xs font-extrabold tracking-[.14em] text-[#98a2b3]">
                ON THIS PAGE
              </p>
              <Contents doc={doc} />
            </nav>
          </aside>

          <div className="flex min-w-0 flex-col gap-6">
            <article className="rounded-[24px] bg-white px-5 py-8 shadow-[0_10px_30px_rgba(60,40,0,.08)] [overflow-wrap:anywhere] md:rounded-[28px] md:px-12 md:py-12">
              {doc.sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-heading`}
                  className="scroll-mt-28 border-t border-[#f0e8c0] pt-10 mt-10 first:mt-0 first:border-0 first:pt-0"
                >
                  <div className="mb-5 flex items-start gap-3.5">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-recommend-orange text-[15px] font-extrabold text-white">
                      {index + 1}
                    </span>
                    <h2
                      id={`${section.id}-heading`}
                      className="font-champ text-[26px] leading-[1.05] md:text-[34px]"
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    {section.blocks.map((block, i) => (
                      // A fixed list, never reordered — its position is a stable key.
                      <Block key={i} block={block} />
                    ))}
                  </div>
                </section>
              ))}

              <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0e8c0] pt-6 text-sm text-[#5b6472]">
                <p>Last updated {doc.lastUpdated}.</p>
                <a
                  href="#legal-heading"
                  className="inline-flex min-h-11 items-center gap-1.5 font-extrabold text-recommend-green hover:underline"
                >
                  <ArrowUp size={16} strokeWidth={2.6} aria-hidden />
                  Back to top
                </a>
              </div>
            </article>

            <aside className="flex flex-col gap-4 rounded-[24px] bg-recommend-green p-6 text-white md:flex-row md:items-center md:justify-between md:rounded-[28px] md:p-10">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-extrabold tracking-[.14em] text-[#8fe3b4] md:text-[13px]">
                  QUESTIONS?
                </span>
                <p className="font-champ text-[26px] leading-[1.05] md:text-[32px]">
                  Talk to our legal team.
                </p>
                <p className="text-sm leading-relaxed text-white/85 md:text-base">
                  For requests, notices or complaints about this document. Anything else?{" "}
                  <Link href="/contact" className="font-extrabold text-white underline underline-offset-2">
                    Contact us
                  </Link>
                  .
                </p>
              </div>
              <a
                href={`mailto:${LEGAL_EMAIL}`}
                className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 self-start rounded-[14px] bg-white px-6 text-base font-extrabold text-recommend-green transition-colors hover:bg-[#fffdf2] md:self-auto"
              >
                <Mail size={18} aria-hidden />
                {LEGAL_EMAIL}
              </a>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
