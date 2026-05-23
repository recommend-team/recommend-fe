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
