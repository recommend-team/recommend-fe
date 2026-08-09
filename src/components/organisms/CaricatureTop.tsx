import { CUSTOMER_APP_URL } from "@/lib/links";
import Image from "next/image";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import WhatsAppIcon from "../atoms/WhatsAppIcon";

const CaricatureTop = () => {
  return (
    <div className="flex w-full items-center justify-between h-32 md:h-48 lg:h-72">
      
      {/* Crescent block */}
      <div className="flex-1 flex items-center justify-center h-full">
        <Image
          src="/svg/curve_green.svg"
          alt=""
          width={80}
          height={80}
          className="w-10 md:w-16 lg:w-24 h-auto"
        />
      </div>

      {/* separator */}
      <div className="w-0.5 h-3/4 bg-green-500 opacity-30" />

      {/* Caricature block */}
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-2 md:gap-3">
        
        <div className="hidden md:block">
          <Text
            variant="neighborhoods-title"
            color="green"
            className="text-center text-sm md:text-lg lg:text-2xl"
          >
            I Want to Order
          </Text>

          <Text
            variant="neighborhoods-list"
            color="green"
            className="text-center text-xs md:text-sm lg:text-base whitespace-nowrap"
          >
            No app · Fast · Safe payment
          </Text>
        </div>

        {/* Video */}
        <div className="hidden md:block w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-full"
          >
            <source src="/videos/social_caricature.mp4" type="video/mp4" />

            <Image
              src="/svg/social_caricature.svg"
              alt=""
              width={96}
              height={96}
              className="object-cover rounded-full"
            />
          </video>
        </div>

        <Button
          variant="gradient"
          text="Order now"
          href={CUSTOMER_APP_URL}
          external
          icon={<WhatsAppIcon />}
          className="hidden md:block"
        />
      </div>

      {/* separator */}
      <div className="w-0.5 h-3/4 bg-green-500 opacity-30" />

      {/* X + Slash block */}
      <div className="flex-1 flex items-center justify-center h-full relative">
        
        <Image
          src="/svg/caricature_X_right.svg"
          alt=""
          width={120}
          height={120}
          className="w-12 md:w-20 lg:w-28 h-auto"
        />

        <Image
          src="/svg/caricature_X_slash.svg"
          alt=""
          width={200}
          height={200}
          className="absolute top-1/2 left-1/2 
                     -translate-x-1/2 -translate-y-1/2 
                     w-20 md:w-32 lg:w-48 h-auto"
        />
      </div>
    </div>
  );
};

export { CaricatureTop };