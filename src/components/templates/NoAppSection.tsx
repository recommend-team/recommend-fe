"use client";
import { CUSTOMER_APP_URL } from "@/lib/links";
import Image from "next/image";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import WhatsAppIcon from "@/components/atoms/WhatsAppIcon";
import ChatBubble from "@/components/molecules/ChatBubble";
import { BackgroundThree } from "./BackgroundThree";

export default function NoAppSection() {
  return (
    <BackgroundThree>
      <section className="relative w-full py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="hidden md:block text-right max-w-3xl ml-auto mb-16">
            <Text
              as="h2"
              variant="section-heading-48"
              className="font-extrabold tracking-tight leading-[1.1]"
            >
              <span className="text-orange-600 whitespace-nowrap">
                No App needed. Start with
              </span>
              <span className="text-[#1A1A1A] block">Hey Recommend</span>
            </Text>
          </div>
          <div className="md:hidden text-center mb-10">
            <Text
              as="h2"
              variant="section-heading-48"
              className="font-extrabold tracking-tight leading-[1.2]"
            >
              <span className="text-orange-600 block">No App needed.</span>
              <span className="text-orange-600 block">Start with</span>
              <span className="text-[#1A1A1A] block">Hey Recommend</span>
            </Text>
          </div>
        </div>
        <div className="relative w-full flex justify-center items-center">
          <div className="hidden md:block absolute left-[20%] top-[32%] z-20">
            <ChatBubble
              text="Hello Recommend"
              avatar="/images/gravatar-1.webp"
            />
          </div>
          <div className="relative w-65 md:w-[320px] lg:w-90 z-10">
            <Image
              src="/images/Silver.png"
              alt="Phone frame"
              width={360}
              height={720}
              className="w-full h-auto"
            />
            <div className="absolute inset-[4%] top-[2%] overflow-hidden rounded-[12%]">
              <Image
                src="/images/Mockup.png"
                alt="Chat UI"
                width={320}
                height={640}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="hidden md:flex flex-col items-start gap-6 absolute right-[12%] top-1/2 -translate-y-1/2 z-20">
            <ChatBubble
              text="Recommend I want to dry clean my clothes"
              avatar="/images/gravatar-2.png"
            />
            <Button
              text="Start Ordering"
              href={CUSTOMER_APP_URL}
              external
              icon={<WhatsAppIcon />}
              variant="green"
            />
          </div>
        </div>
        <div className="flex md:hidden justify-center mt-10">
          <Button
            text="Start Ordering"
            href={CUSTOMER_APP_URL}
            external
            icon={<WhatsAppIcon />}
            variant="green"
          />
        </div>
      </section>
    </BackgroundThree>
  );
}