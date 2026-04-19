import Image from "next/image";
import Link from "next/link";
import { Text } from "../atoms/Text";

export default function RiderCTASection() {
  return (
    <section
      className="relative w-full py-20 md:py-24 overflow-hidden"
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
      <div className="relative z-10 flex flex-col items-center justify-center px-6 gap-6">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <div className="flex-shrink-0 w-[40px] md:w-[56px]">
            <Image
              src="/svg/noapp-left.svg"
              alt=""
              width={56}
              height={56}
              className="w-full h-auto"
              aria-hidden="true"
            />
          </div>

          <Text
            variant="section-heading-48-center"
            color="orange"
            className="max-w-[640px] md:max-w-[780px] leading-tight"
          >
            The Recommend Rider App is built for you.
          </Text>

          <div className="flex-shrink-0 w-[64px] md:w-[80px] self-end mb-2">
            <Image
              src="/svg/noapp-right.svg"
              alt=""
              width={80}
              height={56}
              className="w-full h-auto"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* TODO: replace href="#" with real store links once apps are published */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="#"
            aria-label="Download on Google Play (coming soon)"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#1A1A1A] bg-white hover:bg-gray-100 transition-colors"
          >
            <Image
              src="/svg/google-play-icon.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className="font-bold text-sm font-dm text-[#1A1A1A]">
              Download on Google Play
            </span>
          </Link>

          <Link
            href="#"
            aria-label="Download on App Store (coming soon)"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-recommend-green hover:bg-recommend-green-hover transition-colors"
          >
            <Image
              src="/svg/apple-icon.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className="font-bold text-sm font-dm text-white">
              Download on App Store
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
