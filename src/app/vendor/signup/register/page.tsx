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
  businessCategory: string;
  businessDescription: string;
}

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
const PHONE_RULE = /^\+?[1-9]\d{1,14}$/;

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierParam = searchParams.get("tier") as VendorType | null;
  const tier: VendorType =
    tierParam === "REGISTERED" || tierParam === "NON_REGISTERED"
      ? tierParam
      : "NON_REGISTERED";

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
      businessCategory: "",
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
        businessCategory: values.businessCategory.trim(),
        businessDescription: values.businessDescription.trim() || undefined,
      });
      router.push(
        `/vendor/signup/verify?email=${encodeURIComponent(result.email)}`
      );
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setSubmitError((err as { message: string }).message);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <BackgroundTwo>
      <div className="relative z-10 min-h-screen w-full px-6 md:px-14 pt-28 md:pt-36 pb-16">
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <Text variant="faq-answer" color="dark">
              Step 2 of 3
            </Text>
            <Text variant="section-heading-48-center" color="orange">
              Create your account
            </Text>
            <Text variant="neighborhoods-list" color="grey">
              {tier === "REGISTERED"
                ? "Registered business"
                : "Non-registered business"}
            </Text>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-4 border border-[#FFD91D]"
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="First name"
                error={errors.firstName?.message}
              >
                <input
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
                  {...field("lastName", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 characters" },
                    maxLength: { value: 50, message: "Max 50 characters" },
                  })}
                  className={inputStyles}
                />
              </FormField>
            </div>

            <FormField label="Email" error={errors.email?.message}>
              <input
                type="email"
                placeholder="you@business.com"
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
                placeholder="+2348012345678"
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

            <FormField
              label="Password"
              error={errors.password?.message}
              hint="8-50 chars, with uppercase, lowercase, digit, and special character"
            >
              <input
                type="password"
                autoComplete="new-password"
                {...field("password", {
                  required: "Required",
                  pattern: {
                    value: PASSWORD_RULE,
                    message:
                      "Needs upper + lower + digit + special (@$!%*?&), 8-50 chars",
                  },
                })}
                className={inputStyles}
              />
            </FormField>

            <FormField
              label="Confirm password"
              error={errors.confirmPassword?.message}
            >
              <input
                type="password"
                autoComplete="new-password"
                {...field("confirmPassword", {
                  required: "Required",
                  validate: (v) => v === password || "Passwords don't match",
                })}
                className={inputStyles}
              />
            </FormField>

            <div className="pt-2 border-t border-gray-200" />

            <FormField label="Business name" error={errors.businessName?.message}>
              <input
                {...field("businessName", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
                className={inputStyles}
              />
            </FormField>

            <FormField
              label="Business address"
              error={errors.businessAddress?.message}
            >
              <input
                placeholder="12 Broad Street, Lagos"
                {...field("businessAddress", {
                  required: "Required",
                  minLength: { value: 5, message: "Min 5 characters" },
                  maxLength: { value: 255, message: "Max 255 characters" },
                })}
                className={inputStyles}
              />
            </FormField>

            <FormField
              label="Business category"
              error={errors.businessCategory?.message}
              hint="e.g. Restaurant, Grocery, Pharmacy"
            >
              <input
                {...field("businessCategory", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 100, message: "Max 100 characters" },
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
                className={`${inputStyles} resize-none`}
              />
            </FormField>

            {submitError && (
              <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
                {submitError}
              </p>
            )}

            <Button
              variant="green"
              text={register.isPending ? "Creating account…" : "Create account"}
              disabled={register.isPending}
              onClick={handleSubmit(onSubmit)}
              className="w-full"
            />

            <p className="text-xs text-center font-dm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/vendor/login"
                className="text-recommend-orange font-bold underline"
              >
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
