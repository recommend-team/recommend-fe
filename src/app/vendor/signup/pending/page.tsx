import Image from "next/image";
import Link from "next/link";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";

export default function SignupPendingPage() {
  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-5 md:pt-8 pb-16">
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
            You&apos;re in.
          </Text>

          <Text
            variant="neighborhoods-list"
            color="grey"
            className="leading-relaxed max-w-lg"
          >
            Your email is verified — log in to access your dashboard. Your KYC
            review is in progress (usually within 24 hours). You can list
            products once approved.
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
              <li>Log in to set up your storefront and upload KYC documents.</li>
              <li>We review your business details and KYC documents.</li>
              <li>Once approved, start listing products and taking orders.</li>
            </ol>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/vendor/login">
              <Button variant="green" text="Log in" />
            </Link>
            <Link
              href="/"
              className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-bold font-dm text-gray-700 hover:bg-gray-50 self-center"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </BackgroundTwo>
  );
}
