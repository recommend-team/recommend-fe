import Image from "next/image";
import { Text } from "../atoms/Text";

const locations = [
  "Lekki",
  "Admiralty Way",
  "Ajah",
  "Wole Ariyo Street",
  "Freedom Way",
  "Ikate & Jakande",
  "Igbo Efon",
  "Osapa London",
  "Victoria Arobieke Street",
];

export const SlidingLocations = () => {
  const duplicated = [...locations, ...locations];

  return (
    <div className="w-full overflow-hidden py-16 bg-[#FFFFDC]">
      {/* Container that moves */}
      <div className="flex w-max animate-slide gap-12 hover:[animation-play-state:paused]">
        {duplicated.map((location, index) => (
          <div
            className="flex items-center gap-3 whitespace-nowrap"
            key={`${location}-${index}`}
          >
            <Image
              alt="" // Decorative icon, keep alt empty
              src="/curve.svg"
              width={30}
              height={30}
            />
            <Text variant="section-heading-48" color="green" className="font-bold">
              {location}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};