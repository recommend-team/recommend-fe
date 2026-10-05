"use client";
import { CUSTOMER_APP_URL } from "@/lib/links";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../molecules/Button";

const headerLabels = [
  { name: "Vendor", href: "/vendor" },
  { name: "Rider", href: "/rider" },
  { name: "About us", href: "/about" },
  { name: "Contact us", href: "/contact" },
];

const isActive = (pathname: string | null, href: string) =>
  pathname === href || (pathname?.startsWith(`${href}/`) ?? false);

/** The bar both layouts sit in: white, rounded, at the width of the page content. */
const BAR =
  "mx-auto max-w-6xl rounded-2xl border border-white/70 bg-white/85 font-dm backdrop-blur-md transition-shadow duration-300";

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Recommend home"
      className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-recommend-green"
    >
      <Image
        alt=""
        src="/logo-minimal.svg"
        width={compact ? 30 : 34}
        height={compact ? 30 : 34}
        priority
        className="rounded-full"
      />
      <span className={`font-extrabold text-recommend-orange ${compact ? "text-base" : "text-lg"}`}>
        Recommend
      </span>
    </Link>
  );
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

/**
 * The phone bar and its menu.
 *
 * The menu covers the whole screen in the page's own solid yellow — nothing of the page
 * shows through — and slides in from the right and back out. It used to appear and vanish,
 * because the `animate-in` classes it relied on belong to a Tailwind plugin this project
 * does not have. While it is open the page behind does not scroll, Escape closes it, and
 * focus moves into it and back out again.
 */
const MobileHeader = ({ scrolled }: { scrolled: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Close after navigating — the link has done its job.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const opener = openButton.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [isOpen]);

  const slide = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  return (
    <div className="px-3 pt-3 lg:hidden">
      <div
        className={`${BAR} flex items-center justify-between py-2 pr-2 pl-3.5 ${
          scrolled ? "shadow-[0_8px_24px_rgba(60,40,0,.12)]" : "shadow-[0_4px_14px_rgba(60,40,0,.06)]"
        }`}
      >
        <Brand compact />
        <button
          ref={openButton}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="grid h-11 w-11 place-items-center rounded-xl text-[#1A1A1A] transition-colors hover:bg-black/[.05] focus-visible:outline-2 focus-visible:outline-recommend-green"
        >
          <Menu size={22} strokeWidth={2.2} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            key="menu"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col bg-[#FFFFDC] p-6 font-dm"
            {...slide}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 380, damping: 40, mass: 0.9 }
            }
          >
            <div className="flex flex-row items-center justify-between">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                aria-label="Recommend home"
                className="relative h-8.75 w-32.5"
              >
                <Image alt="" priority src="/logo-full.svg" fill className="object-contain" />
              </Link>
              <button
                ref={closeButton}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-xl bg-recommend-orange text-white transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-green"
              >
                <X size={24} />
              </button>
            </div>

            <ul className="mt-20 flex w-full flex-1 flex-col items-start gap-10 px-2">
              {headerLabels.map(({ href, name }, index) => {
                const active = isActive(pathname, href);
                return (
                  <motion.li
                    key={name}
                    initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.12 + index * 0.05,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`text-2xl font-medium transition-colors hover:text-recommend-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-recommend-green ${
                        active ? "text-recommend-orange" : "text-[#1A1A1A]"
                      }`}
                    >
                      {name}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              className="mt-auto mb-[max(16px,env(safe-area-inset-bottom))] flex w-full justify-start px-2"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.32, duration: 0.3, ease: "easeOut" }}
            >
              <Button
                variant="gradient"
                text="Start Ordering"
                href={CUSTOMER_APP_URL}
                external
                icon={<ArrowRight size={18} />}
              />
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Desktop ──────────────────────────────────────────────────────────────────

/**
 * One bar across the content width — brand left, links centre, the way in right — with
 * the same `max-w-6xl` and side padding as the sections below, so its edges line up with
 * theirs. (It used to be a centred pill between an empty spacer and the button, which
 * left it floating off to one side.)
 */
const DesktopHeader = ({ scrolled }: { scrolled: boolean }) => {
  const pathname = usePathname();

  return (
    <div className="hidden px-10 pt-4 lg:block">
      <div
        className={`${BAR} grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-2.5 ${
          scrolled ? "shadow-[0_10px_30px_rgba(60,40,0,.12)]" : "shadow-[0_8px_24px_rgba(60,40,0,.06)]"
        }`}
      >
        <div className="justify-self-start">
          <Brand />
        </div>

        <nav aria-label="Main" className="flex items-center gap-1">
          {headerLabels.map(({ href, name }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={name}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl px-4 py-2 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recommend-green ${
                  active
                    ? "bg-[#FFF3C4] text-[#1A1A1A]"
                    : "text-[#3d4451] hover:bg-black/[.04] hover:text-[#1A1A1A]"
                }`}
              >
                {name}
              </Link>
            );
          })}
        </nav>

        <div className="justify-self-end">
          <Button
            variant="green"
            text="Start Ordering"
            href={CUSTOMER_APP_URL}
            external
            icon={<ArrowRight size={18} />}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * The public site's header. Always on screen — it is slim, and on a long page it is the
 * only way to the menu and to Start Ordering. Once the page scrolls, its shadow deepens so
 * it reads as above the content rather than part of it.
 */
const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full">
      <MobileHeader scrolled={scrolled} />
      <DesktopHeader scrolled={scrolled} />
    </div>
  );
};

export { LandingHeader };
