"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";
import { useVerifyEmail, useResendVerification } from "@/hooks";

interface FormValues {
  code: string;
}

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const verify = useVerifyEmail();
  const resend = useResendVerification();
  const [message, setMessage] = useState<{
    kind: "error" | "info";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { code: "" } });

  const onSubmit = async (values: FormValues) => {
    setMessage(null);
    try {
      await verify.mutateAsync({ email, code: values.code.trim() });
      router.push("/vendor/signup/pending");
    } catch (err) {
      setMessage({
        kind: "error",
        text:
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Verification failed. Please try again.",
      });
    }
  };

  const onResend = async () => {
    setMessage(null);
    try {
      await resend.mutateAsync({ email });
      setMessage({
        kind: "info",
        text: "New code sent. Check your email.",
      });
    } catch (err) {
      setMessage({
        kind: "error",
        text:
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Could not resend. Please try again.",
      });
    }
  };

  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-22 md:pt-22 pb-16">
        <div className="max-w-md mx-auto flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Text variant="faq-answer" color="dark">
              Step 3 of 3
            </Text>
            <Text variant="section-heading-48-center" color="orange">
              Verify your email
            </Text>
            <Text variant="neighborhoods-list" color="grey">
              We sent a 6-digit code to{" "}
              <span className="font-bold text-gray-800">{email || "your email"}</span>
              . It expires in 5 minutes.
            </Text>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-4 border border-[#FFD91D]"
          >
            <div>
              <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
                Verification code
              </label>
              <input
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                {...register("code", {
                  required: "Required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Must be 6 digits",
                  },
                })}
                className="w-full h-14 px-3 rounded-lg border border-gray-300 bg-white font-dm text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green"
              />
              {errors.code && (
                <p className="text-xs text-red-500 font-dm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            {message && (
              <p
                className={`text-sm font-dm rounded-lg p-3 ${
                  message.kind === "error"
                    ? "text-red-600 bg-red-50"
                    : "text-green-700 bg-green-50"
                }`}
              >
                {message.text}
              </p>
            )}

            <Button
              variant="green"
              text={verify.isPending ? "Verifying…" : "Verify email"}
              disabled={verify.isPending || !email}
              onClick={handleSubmit(onSubmit)}
              className="w-full"
            />

            <p className="text-xs text-center font-dm text-gray-500">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                onClick={onResend}
                disabled={resend.isPending || !email}
                className="text-recommend-orange font-bold underline disabled:opacity-50"
              >
                {resend.isPending ? "Sending…" : "Resend"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </BackgroundTwo>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
