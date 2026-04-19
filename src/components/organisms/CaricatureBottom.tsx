import Image from "next/image";
import Link from "next/link";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import WhatsAppIcon from "../atoms/WhatsAppIcon";

const CaricatureBottom = () => {
  return (
    <div className="flex w-full items-center justify-between h-32 md:h-48 lg:h-72">
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
                     -translate-x-1/3 -translate-y-1/3 
                     w-20 md:w-32 lg:w-48 h-auto"
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
            I Want to Ride
          </Text>

          <Text
            variant="neighborhoods-list"
            color="green"
            className="text-center text-xs md:text-sm lg:text-base whitespace-nowrap"
          >
            Earn on Your Schedule
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
            <source src="/videos/rider.mp4" type="video/mp4" />
            {/* the image act as placeholder if vide cannot load */}
            <Image
              src="/svg/delivery_ scooter.svg"
              alt=""
              width={96}
              height={96}
              className="object-cover rounded-full"
            />
          </video>
        </div>

        <Link href="/rider/signup" className="hidden md:block">
          <Button
            variant="gradient"
            text="Become a Rider"
            icon={<WhatsAppIcon />}
          />
        </Link>
      </div>

      {/* separator */}
      <div className="w-0.5 h-3/4 bg-green-500 opacity-30" />


      {/* Caricature block 2 */}
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-2 md:gap-3">
        <div className="hidden md:block">
          <Text
            variant="neighborhoods-title"
            color="orange"
            className="text-center text-sm md:text-lg lg:text-2xl"
          >
            I&apos;m a Business
          </Text>

          <Text
            variant="neighborhoods-list"
            color="orange"
            className="text-center text-xs md:text-sm lg:text-base whitespace-nowrap"
          >
            10M+ reach · WhatsApp storefront
          </Text>
        </div>

        {/* static image */}
        <div className="hidden md:block w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24">
          
            <Image
              src="/svg/business_agreement.svg"
              alt=""
              width={96}
              height={96}
              className="object-cover rounded-full"
            />
          
        </div>

              {/* Crescent block */}
      <div className="md:hidden flex-1 flex items-center justify-center h-full">
        <Image
          src="/svg/curve_green.svg"
          alt=""
          width={80}
          height={80}
          className="w-10 md:w-16 lg:w-24 h-auto"/>
          </div>

        <Link href="/vendor/signup" className="hidden md:block">
          <Button
            variant="gradient"
            text="Join as a Business"
            icon={<WhatsAppIcon />}
          />
        </Link>
      </div>

    </div>
  );
};

export { CaricatureBottom };
