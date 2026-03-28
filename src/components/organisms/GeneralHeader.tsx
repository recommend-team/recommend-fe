"use client";

import { useEffect, useState, useRef } from "react";
import { LandingHeader } from "./Header";

export default function GeneralHeader() {
  const [isHidden, setIsHidden] = useState(false);
  const [isHoveringTop, setIsHoveringTop] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const SCROLL_THRESHOLD = 100;
    const SCROLL_DELTA = 8;
    const REVEAL_RANGE = 120;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;


      if (currentScrollY <= 10) {
        setIsHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (diff > SCROLL_DELTA && currentScrollY > SCROLL_THRESHOLD) {
        setIsHidden(true);
      }

      else if (diff < -SCROLL_DELTA && currentScrollY <= REVEAL_RANGE) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldBeVisible = !isHidden || isHoveringTop;

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-12 z-50 ${
          isHidden ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onMouseEnter={() => setIsHoveringTop(true)}
      />

      <header
        onMouseEnter={() => setIsHoveringTop(true)}
        onMouseLeave={() => setIsHoveringTop(false)}
        className={`
          fixed top-0 left-0 w-full z-40
          transition-transform duration-300 ease-in-out
          ${shouldBeVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <LandingHeader />
      </header>
    </>
  );
}
