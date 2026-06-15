"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";

const CATEGORIES = [
  {
    id: "RESTAURANT",
    label: "Restaurant",
    description: "Bukas, fast food, fine dining, local kitchens",
    image: "/images/grab-a-bite.png",
  },
  {
    id: "EVERYDAY_ESSENTIALS",
    label: "Everyday Essentials",
    description: "Groceries, household items, baby products.",
    image: "/images/everyday-essentials.png",
  },
  {
    id: "MEDICINE_WELLNESS",
    label: "Medicine & Wellness",
    description: "Pharmacies, wellness, health products",
    image: "/images/medicine-wellness.png",
  },
  {
    id: "FRESH_FROM_MARKET",
    label: "Fresh From Market",
    description: "Fruits, vegetables, grains, proteins.",
    image: "/images/fresh-market.png",
  },
  {
    id: "BEAUTY_FASHION",
    label: "Beauty & Fashion",
    description: "Hair vendors, wigs, tailors, fashion stores, personal care.",
    image: "/images/beauty-fashion.png",
  },
];

export default function CategorySelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    router.push(`/vendor/signup/tier?category=${selected}`);
  };

  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-end px-6 md:px-10 pt-6 pb-2">
          <Link
            href="/vendor/login"
            className="text-sm font-bold font-dm text-gray-800 hover:text-recommend-orange transition-colors"
          >
            Already a vendor? Log in
          </Link>
        </div>

        {/* White card container */}
        <div className="flex-1 flex items-start justify-center px-4 pb-10 pt-2 md:pt-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm p-6 md:p-8 flex flex-col gap-6">

            {/* Heading */}
            <div className="flex flex-col gap-1">
              <Text variant="section-heading-48" color="dark">
                What do you sell?
              </Text>
              <Text variant="neighborhoods-list" color="grey">
                Select your business type. This helps us show you to the right customers.
              </Text>
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selected === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelected(cat.id)}
                    className="text-left focus:outline-none rounded-2xl"
                  >
                    <div
                      className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-200 ${
                        isSelected
                          ? "ring-4 ring-recommend-orange scale-[1.02]"
                          : "hover:scale-[1.01]"
                      }`}
                    >
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="object-cover"
                      />

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-recommend-orange flex items-center justify-center z-10">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Text over image */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-[#FFD91D] font-black font-dm text-sm uppercase leading-tight drop-shadow-lg">
                          {cat.label}
                        </p>
                        <p className="text-white font-dm text-[11px] mt-0.5 leading-snug line-clamp-2 drop-shadow">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <Button
                variant="gradient"
                text="Continue"
                disabled={!selected}
                onClick={handleContinue}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
                  disabled
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
                  disabled
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </BackgroundTwo>
  );
}