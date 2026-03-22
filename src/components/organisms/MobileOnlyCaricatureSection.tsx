import Image from "next/image";
import { Button } from "../molecules/Button";
import { Text } from "../atoms/Text";
import WhatsAppIcon from "../atoms/WhatsAppIcon";

const MobileOnlyCaricatureSection = () => {
  return (
    <div className="flex flex-col gap-10 md:hidden pt-10 px-4">
      {/* Caricature block 1 */}
      <div className="flex flex-col items-center gap-3">
        <Text
          variant="neighborhoods-title"
          color="dark"
          className="text-center text-lg"
        >
          I want to order
        </Text>

        <Text
          variant="neighborhoods-list"
          color="dark"
          className="text-center text-sm whitespace-nowrap"
        >
          No app . FAST . Safe payment
        </Text>

        {/* Video with fallback */}
        <div className="w-24 h-24">
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

        <Button variant="gradient" text="Order now" icon={<WhatsAppIcon />} />
      </div>
      {/* Caricature block 2 */}
      <div className="flex flex-col items-center gap-3">
        <Text
          variant="neighborhoods-title"
          color="dark"
          className="text-center text-lg"
        >
          I Am a Business
        </Text>

        <Text
          variant="neighborhoods-list"
          color="dark"
          className="text-center text-sm whitespace-nowrap"
        >
          10M+ reach - Whatsapp storefront
        </Text>

        <Image
          src="/svg/business_agreement.svg"
          alt=""
          width={96}
          height={96}
          className="w-24 h-24 object-cover rounded-full"
        />

        <Button
          variant="gradient"
          text="Join as a Business"
          icon={<WhatsAppIcon />}
        />
      </div>
      {/* Caricature block 3 */}
      <div className="flex flex-col items-center gap-3">
        <Text
          variant="neighborhoods-title"
          color="dark"
          className="text-center text-lg"
        >
          I Want to Ride
        </Text>

        <Text
          variant="neighborhoods-list"
          color="dark"
          className="text-center text-sm whitespace-nowrap"
        >
          Earn on Your Schedule
        </Text>

        <div className="w-24 h-24">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-full"
          >
            <source src="/videos/rider.mp4" type="video/mp4" />
            <Image
              src="/svg/delivery_scooter.svg"
              alt=""
              width={96}
              height={96}
              className="object-cover rounded-full"
            />
          </video>
        </div>

        <Button variant="gradient" text="Order now" icon={<WhatsAppIcon />} />
      </div>
    </div>
  );
};

export { MobileOnlyCaricatureSection };
