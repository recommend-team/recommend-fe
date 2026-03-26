import Image from "next/image";
import { Text } from "@/components/atoms/Text";

type FoodCardProps = {
  image: string;
  title: string;
  comingSoon?: boolean;
};

export const FoodCard = ({ image, title, comingSoon }: FoodCardProps) => {
  return (
    <div className="bg-black rounded-[26px] w-[280px] md:w-[400px] overflow-hidden shadow-xl">

      {/* Logo */}
      <div className="flex justify-center pt-3 pb-1">
        <Image
          src="/images/whitelogo.png"
          alt="Reco"
          width={16}
          height={16}
          className="object-contain opacity-90"
        />
      </div>

      {/* Image */}
      <div className="px-[17%] pt-[6%]">
        <div className="relative rounded-[16px] overflow-hidden h-[200px] md:h-[280px] border-[2px] border-white">
          <Image src={image} alt={title} fill className="object-cover" />

          {/* Coming soon overlay */}
          {comingSoon && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 z-10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className="text-white text-xs font-medium tracking-wide">Coming soon...</span>
            </div>
          )}

          {/* Clip vector */}
          <div className="absolute -top-2 -left-2 z-10">
            <Image src="/images/clip.png" alt="" width={28} height={18} />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-[5%] pt-4 pb-[18%] relative">

        {/* Lightning */}
        <div className="absolute left-[19%] top-2">
          <Image src="/images/lightning.png" alt="" width={19} height={14} />
        </div>

        <Text
          variant="section-heading-48"
          color="white"
          className="leading-[1.05] text-center"
        >
          {title}
        </Text>

        {/* Heart */}
        <div className="absolute right-[12%] bottom-20">
          <Image src="/images/heart.png" alt="" width={19} height={14} />
        </div>
      </div>

    </div>
  );
};