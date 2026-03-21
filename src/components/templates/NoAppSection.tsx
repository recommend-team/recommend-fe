"use client";

import Image from "next/image";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.520.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.500-.669-.510-.173-.008-.371-.010-.570-.010-.198 0-.520.074-.792.372-.272.297-1.040 1.016-1.040 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.200 5.077 4.487z"/>
  </svg>
);

const ChatBubble = ({
  text,
  avatar,
}: {
  text: string;
  avatar: string;
}) => (
  <div className="flex items-start">
    <div className="relative z-10 -mt-[2px]">
      <Image
        src={avatar}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
    </div>

    <div className="relative -ml-3 bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow max-w-[180px]">
      <div className="absolute -left-[6px] top-[6px] w-0 h-0 border-r-[10px] border-r-white border-b-[10px] border-b-transparent" />
      <span className="text-xs font-medium text-gray-800">
        {text}
      </span>
    </div>
  </div>
);

export default function NoAppSection() {
  return (
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
            <span className="text-[#1A1A1A] block">
              Hey Recommend
            </span>
          </Text>
        </div>

        <div className="md:hidden text-center mb-10">
          <Text
            as="h2"
            variant="section-heading-48"
            className="font-extrabold tracking-tight leading-[1.2]"
          >
            <span className="text-orange-600 block">
              No App needed.
            </span>
            <span className="text-orange-600 block">
              Start with
            </span>
            <span className="text-[#1A1A1A] block">
              Hey Recommend
            </span>
          </Text>
        </div>
      </div>

      <div className="relative w-full flex justify-center items-center">
        <div className="hidden md:block absolute left-[20%] top-[32%] z-20">
          <ChatBubble 
            text="Hello Recommend" 
            avatar="/images/gravatar-1.png" 
          />
        </div>

        <div className="relative w-[260px] md:w-[320px] lg:w-[360px] z-10">
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
            icon={<WhatsAppIcon />} 
            variant="green" 
          />
        </div>
      </div>

      <div className="flex md:hidden justify-center mt-10">
        <Button
          text="Start Ordering"
          icon={<WhatsAppIcon />}
          variant="green"
        />
      </div>
    </section>
  );
}