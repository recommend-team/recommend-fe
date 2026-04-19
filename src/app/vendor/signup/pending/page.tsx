import Image from "next/image";
import Link from "next/link";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";

export default function SignupPendingPage() {
  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-28 md:pt-36 pb-16">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 md:w-28 md:h-28">
            <Image
              src="/svg/joyleap.svg"
              alt=""
              width={120}
              height={120}
              className="w-full h-auto"
            />
          </div>

          <Text variant="section-heading-48-center" color="orange">
            You&apos;re in the queue.
          </Text>

          <Text
            variant="neighborhoods-list"
            color="grey"
            className="leading-relaxed max-w-lg"
          >
            Your email is verified. Your account is now pending KYC review — we
            check everything manually so customers can trust every vendor on
            Recommend. We&apos;ll email you once approved (usually within 24
            hours).
          </Text>

          <div className="bg-[#FFF8B8] border border-[#FFD91D] rounded-2xl p-5 md:p-6 w-full text-left">
            <Text
              variant="neighborhoods-title"
              color="dark"
              className="font-bold mb-2"
            >
              What happens next
            </Text>
            <ol className="space-y-2 text-sm font-dm text-gray-800 list-decimal list-inside">
              <li>We review your business details and KYC documents.</li>
              <li>You get an approval email with a link to log in.</li>
              <li>Start taking orders.</li>
            </ol>
          </div>

          <Link href="/">
            <Button variant="green" text="Back to home" />
          </Link>
        </div>
      </div>
    </BackgroundTwo>
  );
}
