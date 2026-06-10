"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/molecules/Button";
import { BackgroundTwo } from "@/components/templates/BackgroundTwo";
import { useRegisterVendor } from "@/hooks";
import type { VendorType } from "@/types";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessAddress: string;
  businessDescription: string;
}

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
const PHONE_RULE = /^\+?[1-9]\d{1,14}$/;

// Maps URL param from step 1 to a human-readable label sent to the API
const CATEGORY_LABELS: Record<string, string> = {
  RESTAURANT: "Restaurant",
  EVERYDAY_ESSENTIALS: "Everyday Essentials",
  MEDICINE_WELLNESS: "Medicine & Wellness",
  FRESH_FROM_MARKET: "Fresh From Market",
  BEAUTY_FASHION: "Beauty & Fashion",
};

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // tier comes from step 2
  const tierParam = searchParams.get("tier") as VendorType | null;
  const tier: VendorType =
    tierParam === "REGISTERED" || tierParam === "NON_REGISTERED"
      ? tierParam
      : "NON_REGISTERED";

  // category comes from step 1
  const categoryParam = searchParams.get("category") ?? "";
  const categoryLabel = CATEGORY_LABELS[categoryParam] ?? categoryParam;

  const register = useRegisterVendor();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register: field,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      businessAddress: "",
      businessDescription: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      const result = await register.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
        vendorType: tier,
        businessName: values.businessName.trim(),
        businessAddress: values.businessAddress.trim(),
        businessCategory: categoryLabel || "GENERAL",
        businessDescription: values.businessDescription.trim() || undefined,
      });
      router.push(
        `/vendor/signup/verify?email=${encodeURIComponent(result.email)}`
      );
    } catch (err) {
      setSubmitError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-28 md:pt-36 pb-16">
        <div className="max-w-xl mx-auto flex flex-col gap-6">

          {/* Step indicator */}
          <div className="flex flex-col items-center gap-1 text-center">
            <Text variant="faq-answer" color="dark">
              Step 3 of 3
            </Text>
            <Text variant="section-heading-48-center" color="orange">
              Your next customer is already nearby.
            </Text>
            {(categoryLabel || tier) && (
              <Text variant="neighborhoods-list" color="grey">
                {categoryLabel && (
                  <span className="font-bold text-gray-700">{categoryLabel} · </span>
                )}
                {tier === "REGISTERED" ? "Registered business" : "Non-registered business"}
              </Text>
            )}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-4 border border-[#FFD91D]"
          >
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First name" error={errors.firstName?.message}>
                <input
                  placeholder="Enter first name"
                  {...field("firstName", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 characters" },
                    maxLength: { value: 50, message: "Max 50 characters" },
                  })}
                  className={inputStyles}
                />
              </FormField>
              <FormField label="Last name" error={errors.lastName?.message}>
                <input
                  placeholder="Enter last name"
                  {...field("lastName", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 characters" },
                    maxLength: { value: 50, message: "Max 50 characters" },
                  })}
                  className={inputStyles}
                />
              </FormField>
            </div>

            <FormField label="Email address" error={errors.email?.message}>
              <input
                type="email"
                placeholder="Enter email address"
                {...field("email", {
                  required: "Required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                className={inputStyles}
              />
            </FormField>

            <FormField
              label="Phone number"
              error={errors.phoneNumber?.message}
              hint="Include country code, e.g. +2348012345678"
            >
              <input
                type="tel"
                placeholder="+234 80 0000 0000"
                {...field("phoneNumber", {
                  required: "Required",
                  pattern: {
                    value: PHONE_RULE,
                    message: "Use E.164 format, e.g. +2348012345678",
                  },
                })}
                className={inputStyles}
              />
            </FormField>

            <FormField label="Business name" error={errors.businessName?.message}>
              <input
                placeholder="Enter business name"
                {...field("businessName", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
                className={inputStyles}
              />
            </FormField>

            <FormField label="Business address" error={errors.businessAddress?.message}>
              <input
                placeholder="Enter business address"
                {...field("businessAddress", {
                  required: "Required",
                  minLength: { value: 5, message: "Min 5 characters" },
                  maxLength: { value: 255, message: "Max 255 characters" },
                })}
                className={inputStyles}
              />
            </FormField>

            <div className="pt-2 border-t border-gray-200" />

            <FormField
              label="Password"
              error={errors.password?.message}
              hint="Must contain one uppercase, one lowercase, one symbol, one number, and be at least 8 characters long."
            >
              <input
                type="password"
                placeholder="Enter password"
                autoComplete="new-password"
                {...field("password", {
                  required: "Required",
                  pattern: {
                    value: PASSWORD_RULE,
                    message: "Needs upper + lower + digit + special (@$!%*?&), 8-50 chars",
                  },
                })}
                className={inputStyles}
              />
            </FormField>

            <FormField label="Confirm password" error={errors.confirmPassword?.message}>
              <input
                type="password"
                placeholder="Confirm password"
                autoComplete="new-password"
                {...field("confirmPassword", {
                  required: "Required",
                  validate: (v) => v === password || "Passwords don't match",
                })}
                className={inputStyles}
              />
            </FormField>

            <FormField
              label="Business description"
              error={errors.businessDescription?.message}
              hint="Optional — up to 500 characters"
            >
              <textarea
                rows={3}
                {...field("businessDescription", {
                  maxLength: { value: 500, message: "Max 500 characters" },
                })}
                className={`${inputStyles} h-auto resize-none`}
              />
            </FormField>

            {submitError && (
              <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
                {submitError}
              </p>
            )}

            <p className="text-xs font-dm text-gray-500 text-center">
              By clicking the &quot;Create my account&quot; button, you agree to
              Recommend&apos;s{" "}
              <Link href="/privacy" className="text-recommend-orange font-bold underline">
                Privacy policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="text-recommend-orange font-bold underline">
                Terms of service
              </Link>.
            </p>

            <Button
              variant="green"
              text={register.isPending ? "Creating account…" : "Create account"}
              disabled={register.isPending}
              onClick={handleSubmit(onSubmit)}
              className="w-full"
            />

            <p className="text-xs text-center font-dm text-gray-500">
              Already have an account?{" "}
              <Link href="/vendor/login" className="text-recommend-orange font-bold underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </BackgroundTwo>
  );
}

const inputStyles =
  "w-full h-11 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green";

function FormField({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-400 font-dm mt-1">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500 font-dm mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterFormInner />
    </Suspense>
  );
}