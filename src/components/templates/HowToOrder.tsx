import Image from "next/image";
import { Text } from "../atoms/Text";
import { BackgroundThree } from "./BackgroundThree";
import { HowToOrderCard } from "../molecules/HowToOrderCard";

export const HowToOrder = () => {
  return (
    <BackgroundThree>
      <section className="flex flex-row items-center gap-32 pl-5 md:pl-20 h-200  overflow-x-auto overflow-y-hidden scrollbar-hide">
        {/* Static intro block */}
        <div className="shrink-0">
          <Text as="h2" variant="section-heading-48" color="orange">
            Order in{" "}
            <Text as="span" color="grey" variant="section-heading-48">
              3
            </Text>{" "}
            Easy <br /> Steps
          </Text>

          <Image
            src="/svg/down-u-guide.svg"
            alt=""
            width={280}
            height={280}
            className="relative left-50 transform rotate-45 translate-y-14 -translate-x-20 md:translate-11"
          />
        </div>

        {/* Cards */}
        <div className="flex translate-y-36">
          <div className="shrink-0">
            <Image src="/svg/social_caricature.svg" alt="" width={100} height={100} className="-translate-x-16 translate-y-10"/>
            <HowToOrderCard
              title="Step 1"
              description="Open whatsapp, and search for Recommend. then tap on the chat"
              image="/images/oes1.jpeg"
            />
          </div>

          <div className="shrink-0 pl-44 pt-10">

            <Image src="/svg/business_agreement.svg" alt="" width={100} height={100} className="-translate-x-20 translate-y-[350px]"/>
            <HowToOrderCard
              title="Step 2"
              description="Tell us what you need — food, groceries, anything"
              image="/images/oes2.png"
            />
          </div>
      
            <Image src="/svg/up-u-guide.svg" alt="" width={200} height={200} className="-translate-y-32 translate-x-6 scale-125" />
          
          <div className="shrink-0 pt-10">

            <Image src="/svg/delivery_scooter.svg" alt="" width={100} height={100} className="translate-x-44 translate-y-20 "/>
            <HowToOrderCard
              title="Step 3"
              description="We handle the rest and deliver to you"
              image="/images/oes3.png"
            />
          </div>
        </div>
      </section>
    </BackgroundThree>
  );
};
