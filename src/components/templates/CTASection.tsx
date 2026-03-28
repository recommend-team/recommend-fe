import Image from "next/image";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import WhatsAppIcon from "@/components/atoms/WhatsAppIcon";

export default function CTASection() {
  return (
    <section
      className="relative w-full py-20 md:py-23 overflow-hidden"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 50px,
            #5398e2 50px,
            #B9DBFF 51px
          ),
          linear-gradient(
            to right,
            transparent 59px,
            #e8a0a0 59px,
            #EF5A22 61px,
            transparent 61px
          )
        `,
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center px-6 gap-1">

       {/* Text row with caricatures */}
        <div className="flex items-center justify-center gap-1 md:gap-2">

          {/* Left caricature */}
          <div className="flex-shrink-0 w-[40px] md:w-[56px]">
            <Image
              src="/svg/noapp-left.svg"
              alt=""
              width={56}
              height={56}
              className="w-full h-auto"
            />
          </div>

          {/* Heading */}
          <Text
            variant="section-heading-48-center"
            color="orange"
            className="max-w-[780px] md:max-w-[980px] leading-tight"
          >
            One message is all it takes. No signup. No app. Just results.
          </Text>

          {/* Right caricature */}
          <div className="flex-shrink-0 w-[64px] md:w-[80px] self-end mb-2">
            <Image
              src="/svg/noapp-right.svg"
              alt=""
              width={80}
              height={56}
              className="w-full h-auto"
            />
          </div>

        </div>

        {/* Button */}
        <Button
          text="Start Ordering"
          icon={<WhatsAppIcon />}
          variant="green" 
        />

      </div>
    </section>
  );
}