"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";
import { useResetPassword } from "@/hooks";

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;

interface FormValues {
  password: string;
  confirmPassword: string;
}

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const resetPassword = useResetPassword();

  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "success" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = async (values: FormValues) => {
    setStatus({ kind: "idle" });
    try {
      await resetPassword.mutateAsync({
        token,
        password: values.password,
      });
      setStatus({ kind: "success" });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Couldn't reset password. The link may be expired.",
      });
    }
  };

  if (!token) {
    return (
      <BackgroundTwo>
        <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-24 md:pt-32 pb-16 flex items-center justify-center">
          <div className="max-w-md w-full bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#FFD91D] flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <ShieldAlert size={24} />
            </div>
            <Text variant="section-heading-48-center" color="orange">
              Invalid reset link
            </Text>
            <Text variant="neighborhoods-list" color="grey">
              We couldn&apos;t find a reset token in the URL. Go back to your
              dashboard and request a new link.
            </Text>
            <Link href="/">
              <Button variant="green" text="Back to home" />
            </Link>
          </div>
        </div>
      </BackgroundTwo>
    );
  }

  if (status.kind === "success") {
    return (
      <BackgroundTwo>
        <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-24 md:pt-32 pb-16 flex items-center justify-center">
          <div className="max-w-md w-full bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#FFD91D] flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-recommend-green">
              <CheckCircle2 size={24} />
            </div>
            <Text variant="section-heading-48-center" color="orange">
              Password updated
            </Text>
            <Text variant="neighborhoods-list" color="grey">
              You can now log in with your new password. Pick where you need
              to go:
            </Text>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link href="/vendor/login">
                <Button variant="green" text="Vendor login" />
              </Link>
              <Link href="/rider/login">
                <Button variant="gradient" text="Rider login" />
              </Link>
              <Link href="/admin/login">
                <Button variant="gradient" text="Admin login" />
              </Link>
            </div>
          </div>
        </div>
      </BackgroundTwo>
    );
  }

  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-24 md:pt-32 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-recommend-orange">
              <KeyRound size={22} />
            </div>
            <Text variant="section-heading-48-center" color="orange">
              Reset your password
            </Text>
            <Text variant="neighborhoods-list" color="grey">
              Pick a strong password you haven&apos;t used before.
            </Text>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-4 border border-[#FFD91D]"
          >
            <div>
              <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
                New password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                autoFocus
                {...register("password", {
                  required: "Required",
                  pattern: {
                    value: PASSWORD_RULE,
                    message:
                      "Needs upper + lower + digit + special (@$!%*?&), 8-50 chars",
                  },
                })}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green"
              />
              {errors.password && (
                <p className="text-xs text-red-500 font-dm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Required",
                  validate: (v) =>
                    v === password || "Passwords don't match",
                })}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-dm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {status.kind === "error" && (
              <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
                {status.message}
              </p>
            )}

            <Button
              variant="green"
              text={
                resetPassword.isPending ? "Saving…" : "Save new password"
              }
              disabled={resetPassword.isPending}
              onClick={handleSubmit(onSubmit)}
              className="w-full"
            />

            <p className="text-xs text-center font-dm text-gray-500">
              Reset links expire after 60 minutes. If this one&apos;s stale,{" "}
              <Link href="/" className="text-recommend-orange font-bold underline">
                head home
              </Link>{" "}
              and request a new one from your profile page.
            </p>
          </form>
        </div>
      </div>
    </BackgroundTwo>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
