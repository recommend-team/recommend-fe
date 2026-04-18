"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Text } from "@/components/atoms/Text";
import Image from "next/image";

const cards = [
  {
    title: "SOLO RIDER",
    body: "Register as an individual. Full KYC ensures trust and security for you and our customers.",
    bullets: [
      "Name, Phone, Email",
      "Government-issued ID (Driver's License / Passport / National ID)",
      "BVN & NIN verification",
      "Profile photo & vehicle info",
      "Emergency contact",
      "Bank account for payouts",
      "Secure 4-digit PIN",
    ],
    image: "/images/solo-rider.png",
    rotation: "rotate-[-3deg]",
    bg: "#FFFDE0",
  },
  {
    title: "FLEET OWNER",
    body: "Register your logistics business and manage multiple riders under one company account.",
    bullets: [
      "Company name, CAC certificate & TIN",
      "Office address & contact person",
      "Bank account for payouts",
      "Add multiple drivers with vehicle info",
      "Driver photos & BVN (for payouts)",
      "Secure admin PIN",
    ],
    image: "/images/fleet-owner.png",
    rotation: "rotate-[2deg]",
    bg: "#FFFDE0",
  },
];

export default function AccountTypesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const card1Bg = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["#FFFDE0", "#FFF8B8"]
  );

  const card2Y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7],
    [400, 400, 0]
  );


  const footerOpacity = useTransform(scrollYProgress, [0.75, 1], [0, 1]);
  const footerY = useTransform(scrollYProgress, [0.75, 1], [40, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[260vh] bg-[#FFFEF0]"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 md:px-10">

    
        <div className="mb-10 text-center">
          <Text variant="faq-answer" color="dark">
            Account Types
          </Text>
          <Text variant="section-heading-48" color="orange">
            Ride solo or bring your team
          </Text>
        </div>

       
        <div
          className="relative w-full max-w-[920px] h-[240px] md:h-[280px]"
          style={{ overflow: "hidden" }}
        >

         
          <motion.div className="absolute inset-0 z-10">
            <motion.div
              style={{ backgroundColor: card1Bg }}
              className="relative w-full h-full rounded-2xl border border-[#FFD91D] flex items-center gap-6 px-8"
            >
           
              <div className="flex-shrink-0 h-full flex items-end">
                <Image
                  src="/images/solo-rider.png"
                  alt="Solo rider"
                  width={180}
                  height={220}
                  className="object-contain object-bottom h-[90%] w-auto"
                />
              </div>

              
              <div className="flex flex-col gap-2">
                <span className="font-black text-2xl md:text-3xl text-[#1A1A1A] tracking-tight">
                  {cards[0].title}
                </span>
                <p className="text-sm text-[#3a3a3a] max-w-[280px]">
                  {cards[0].body}
                </p>
                <ul className="mt-1 flex flex-col gap-[2px]">
                  {cards[0].bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-[#3a3a3a]">
                      <span className="mt-[2px] text-[#FF6B00]">→</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>

         
          <motion.div
            style={{ y: card2Y }}
            className={`absolute inset-0 z-20 ${cards[1].rotation}`}
          >
            <div
              className="w-full h-full rounded-2xl border border-[#FFD91D] flex items-center gap-6 px-8"
              style={{ backgroundColor: cards[1].bg }}
            >
              
              <div className="flex-shrink-0 h-full flex items-end">
                <Image
                  src="/images/fleet-owner.png"
                  alt="Fleet owner"
                  width={180}
                  height={220}
                  className="object-contain object-bottom h-[90%] w-auto"
                />
              </div>

            
              <div className="flex flex-col gap-2">
                <span className="font-black text-2xl md:text-3xl text-[#1A1A1A] tracking-tight">
                  {cards[1].title}
                </span>
                <p className="text-sm text-[#3a3a3a] max-w-[280px]">
                  {cards[1].body}
                </p>
                <ul className="mt-1 flex flex-col gap-[2px]">
                  {cards[1].bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-[#3a3a3a]">
                      <span className="mt-[2px] text-[#FF6B00]">→</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

        </div>

        
        <motion.div
          style={{ opacity: footerOpacity, y: footerY }}
          className="relative z-10 mt-8 flex flex-col items-center"
        >
          <Image
            src="/svg/dashed-path.svg"
            alt=""
            width={180}
            height={70}
            className="mb-2"
            aria-hidden="true"
          />
          <div className="flex items-center gap-2">
            <Text variant="faq-answer" color="dark">
              Ready to ride with Recommend?
            </Text>
            <Image
              src="/svg/recommend-logo-small.svg"
              alt="Recommend"
              width={24}
              height={24}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}