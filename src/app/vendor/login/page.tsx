"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";
import { useLogin } from "@/hooks";

interface FormValues {
  email: string;
  password: string;
}

export default function VendorLoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      await login.mutateAsync({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      router.push("/");
    } catch (err) {
      setSubmitError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Login failed. Please try again."
      );
    }
  };

  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-28 md:pt-36 pb-16">
        <div className="max-w-md mx-auto flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <Text variant="section-heading-48-center" color="orange">
              Welcome back
            </Text>
            <Text variant="neighborhoods-list" color="grey">
              Log in to manage your business on Recommend.
            </Text>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-4 border border-[#FFD91D]"
          >
            <div>
              <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@business.com"
                {...register("email", {
                  required: "Required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green"
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-dm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                {...register("password", { required: "Required" })}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green"
              />
              {errors.password && (
                <p className="text-xs text-red-500 font-dm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {submitError && (
              <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
                {submitError}
              </p>
            )}

            <Button
              variant="green"
              text={login.isPending ? "Logging in…" : "Log in"}
              disabled={login.isPending}
              onClick={handleSubmit(onSubmit)}
              className="w-full"
            />

            <p className="text-xs text-center font-dm text-gray-500">
              New to Recommend?{" "}
              <Link
                href="/vendor/signup"
                className="text-recommend-orange font-bold underline"
              >
                Sign up as a vendor
              </Link>
            </p>
          </form>
        </div>
      </div>
    </BackgroundTwo>
  );
}
