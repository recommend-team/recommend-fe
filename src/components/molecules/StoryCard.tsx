import Image from "next/image";
import { Text } from "@/components/atoms/Text";

type StoryCardProps = {
  heading: string;
  body: string;
  illustration: string;
  rotation?: number;
  zIndex?: number;
  isBuried?: boolean;
};

export function StoryCard({
  heading,
  body,
  illustration,
  rotation = 0,
  zIndex = 0,
  isBuried = false,
}: StoryCardProps) {
  const isFirstCard = zIndex === 3;

  const bgColor = isFirstCard
    ? isBuried
      ? "#FFD91D"
      : "#FFF27C"
    : "#FFF27C";

  return (
    <div
      className="absolute w-full"
      style={{ transform: `rotate(${rotation}deg)`, zIndex }}
    >
      <div
        className="relative rounded-2xl px-8 py-8 md:px-12 md:py-10 flex flex-row items-center justify-between w-full min-h-[200px] md:min-h-[220px] shadow-md border-2"
        style={{ backgroundColor: bgColor, borderColor: "#FFD91D" }}
      >
        {/* Text side */}
        <div className="flex flex-col gap-3 max-w-[55%]">
          <Text variant="section-heading-48" color="dark">
            {heading}
          </Text>
          <Text variant="faq-answer" color="dark">
            {body}
          </Text>
        </div>

        {/* Illustration side */}
        <div className="relative flex-shrink-0 w-[30%] flex items-center justify-center">

          {/* Slanting path lines — only on Card 1 */}
          {isFirstCard && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="10" y1="55"
                x2="75" y2="45"
                stroke="#5a5a2a"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.4"
              />
              <line
                x1="10" y1="65"
                x2="75" y2="58"
                stroke="#5a5a2a"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>
          )}

          <Image
            src={illustration}
            alt=""
            width={120}
            height={120}
            className="w-full h-auto relative z-10"
          />
        </div>

      </div>
    </div>
  );
}