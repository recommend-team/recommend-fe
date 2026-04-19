"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import { BackgroundTwo } from "./BackgroundTwo";

const CONTACT_EMAIL = "hello@recommend.ng";
const CONTACT_PHONE = "+234 800 000 0000"; // TODO: replace with real support line
const CONTACT_LOCATION = "Lagos, Nigeria";

const subjects = [
  "Order/Delivery Issue",
  "Payment / Withdrawal",
  "Vendor/Rider Support",
  "Partnership / Press",
  "General Enquiries",
  "Feedback & Suggestions",
] as const;

type Subject = (typeof subjects)[number];

interface FormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: Subject | "";
  message: string;
}

const PHONE_RULE = /^\+?[0-9\s-]{7,20}$/;

export default function ContactFormSection() {
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "sent" } | { kind: "error"; text: string }
  >({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // TODO: replace with POST /support when backend endpoint exists.
    // For now, open the user's email client with a pre-filled message.
    const body = [
      `Name: ${values.fullName.trim()}`,
      `Email: ${values.email.trim()}`,
      `Phone: ${values.phoneNumber.trim()}`,
      "",
      values.message.trim(),
    ].join("\n");

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      values.subject || "Recommend enquiry"
    )}&body=${encodeURIComponent(body)}`;

    try {
      window.location.href = mailto;
      setStatus({ kind: "sent" });
      reset();
    } catch {
      setStatus({
        kind: "error",
        text: `Couldn't open your email app. Please email us directly at ${CONTACT_EMAIL}.`,
      });
    }
  };

  return (
    <BackgroundTwo>
      <div className="relative z-10 w-full px-6 md:px-14 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#FFF8B8] border border-[#FFD91D] p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: heading + contact cards */}
            <div className="flex flex-col gap-6">
              <Text
                variant="section-heading-48"
                color="dark"
                className="leading-tight"
              >
                SEND US A<br />
                MESSAGE.
              </Text>

              <div className="rounded-2xl bg-white p-5 md:p-6 flex flex-col gap-3">
                <Text
                  variant="neighborhoods-title"
                  color="dark"
                  className="font-bold mb-1"
                >
                  Contact Details
                </Text>
                <InfoRow label="Phone" value={CONTACT_PHONE} />
                <InfoRow
                  label="Email"
                  value={
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-recommend-green underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  }
                />
                <InfoRow label="Location" value={CONTACT_LOCATION} />
                <InfoRow
                  label="Social"
                  value={
                    <div className="flex flex-col">
                      <SocialLink href="#">Instagram</SocialLink>
                      <SocialLink href="#">X</SocialLink>
                      <SocialLink href="#">LinkedIn</SocialLink>
                      <SocialLink href="#">Tiktok</SocialLink>
                    </div>
                  }
                />
                <div className="mt-2 flex justify-end">
                  <Image
                    src="/svg/faq-figure.svg"
                    alt=""
                    width={96}
                    height={120}
                    className="h-24 w-auto"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 md:p-6 flex flex-col gap-3">
                <Text
                  variant="neighborhoods-title"
                  color="dark"
                  className="font-bold mb-1"
                >
                  Support Hours
                </Text>
                <InfoRow label="Monday – Friday" value="8am – 9pm" />
                <InfoRow label="Saturday" value="9am – 8pm" />
              </div>
            </div>

            {/* Right: form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl bg-white p-6 md:p-8 flex flex-col gap-4"
            >
              <Field label="Full Name" error={errors.fullName?.message}>
                <input
                  placeholder="Full name"
                  {...register("fullName", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 characters" },
                  })}
                  className={inputStyles}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    })}
                    className={inputStyles}
                  />
                </Field>
                <Field label="Phone Number" error={errors.phoneNumber?.message}>
                  <input
                    type="tel"
                    placeholder="(+234) 90 0000 0000"
                    {...register("phoneNumber", {
                      required: "Required",
                      pattern: {
                        value: PHONE_RULE,
                        message: "Enter a valid phone",
                      },
                    })}
                    className={inputStyles}
                  />
                </Field>
              </div>

              <Field label="Subject" error={errors.subject?.message}>
                <select
                  {...register("subject", { required: "Required" })}
                  className={`${inputStyles} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22gray%22 viewBox=%220 0 24 24%22><path d=%22M7 10l5 5 5-5H7z%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center]`}
                >
                  <option value="">Select a topic...</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Your Message" error={errors.message?.message}>
                <textarea
                  rows={5}
                  placeholder="Tell us what's on your mind. The more detail, the more we can help..."
                  {...register("message", {
                    required: "Required",
                    minLength: { value: 10, message: "Min 10 characters" },
                    maxLength: { value: 2000, message: "Max 2000 characters" },
                  })}
                  className={`${inputStyles} resize-none h-auto py-3`}
                />
              </Field>

              {status.kind === "sent" && (
                <p className="text-sm font-dm text-green-700 bg-green-50 rounded-lg p-3">
                  Opening your email app… If nothing happens, email us at{" "}
                  <Link
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-bold underline"
                  >
                    {CONTACT_EMAIL}
                  </Link>
                  .
                </p>
              )}
              {status.kind === "error" && (
                <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
                  {status.text}
                </p>
              )}

              <Button
                variant="gradient"
                text="Send Message"
                onClick={handleSubmit(onSubmit)}
                className="w-full"
              />
            </form>
          </div>
        </div>
      </div>
    </BackgroundTwo>
  );
}

const inputStyles =
  "w-full h-11 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 font-dm mt-1">{error}</p>}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 text-sm font-dm">
      <span className="text-gray-500 w-24 shrink-0">{label}</span>
      <span className="text-gray-800 flex-1">{value}</span>
    </div>
  );
}

function SocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-800 hover:text-recommend-orange transition-colors"
    >
      {children}
    </Link>
  );
}
