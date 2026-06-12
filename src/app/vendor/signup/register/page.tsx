"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
  notOwner: boolean;
  ownersFirstName: string;
  ownersLastName: string;
}

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;

const CATEGORY_LABELS: Record<string, string> = {
  RESTAURANT: "Restaurant",
  EVERYDAY_ESSENTIALS: "Everyday Essentials",
  MEDICINE_WELLNESS: "Medicine & Wellness",
  FRESH_FROM_MARKET: "Fresh From Market",
  BEAUTY_FASHION: "Beauty & Fashion",
};

const COUNTRIES = [
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "ZA", dial: "+27",  name: "South Africa" },
  { code: "US", dial: "+1",   name: "United States" },
  { code: "GB", dial: "+44",  name: "United Kingdom" },
  { code: "CA", dial: "+1",   name: "Canada" },
  { code: "IN", dial: "+91",  name: "India" },
  { code: "DE", dial: "+49",  name: "Germany" },
  { code: "FR", dial: "+33",  name: "France" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "SN", dial: "+221", name: "Senegal" },
  { code: "CI", dial: "+225", name: "Côte d'Ivoire" },
  { code: "CM", dial: "+237", name: "Cameroon" },
  { code: "ET", dial: "+251", name: "Ethiopia" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "UG", dial: "+256", name: "Uganda" },
  { code: "RW", dial: "+250", name: "Rwanda" },
  { code: "ZM", dial: "+260", name: "Zambia" },
  { code: "AU", dial: "+61",  name: "Australia" },
  { code: "BR", dial: "+55",  name: "Brazil" },
  { code: "MX", dial: "+52",  name: "Mexico" },
  { code: "JP", dial: "+81",  name: "Japan" },
  { code: "ZW", dial: "+263", name: "Zimbabwe" },
  { code: "EG", dial: "+20",  name: "Egypt" },
  { code: "MA", dial: "+212", name: "Morocco" },
];

type Country = (typeof COUNTRIES)[0];

const inputStyles =
  "w-full h-11 px-3 rounded-lg border border-gray-200 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green";

function FlagImage({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      width={22}
      height={15}
      alt={code}
      style={{
        borderRadius: 2,
        objectFit: "cover",
        border: "1px solid #e5e7eb",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function CountrySelector({
  value,
  onChange,
}: {
  value: Country;
  onChange: (c: Country) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 10);
  }, [open]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 h-11 border-r border-gray-200 bg-white rounded-l-lg hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <FlagImage code={value.code} />
        <span className="font-dm font-medium text-sm text-gray-700 min-w-[36px] text-left">
          {value.dial}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-[9999] w-72 bg-white border border-gray-200 rounded-xl shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country or code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm font-dm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-gray-400 font-dm">No results</li>
            ) : (
              filtered.map((c) => (
                <li key={`${c.code}-${c.dial}`}>
                  <button
                    type="button"
                    onMouseDown={() => { onChange(c); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm transition-colors text-left ${
                      c.code === value.code ? "bg-yellow-50 font-semibold" : "hover:bg-gray-50"
                    }`}
                  >
                    <FlagImage code={c.code} />
                    <span className="flex-1 text-gray-800 truncate">{c.name}</span>
                    <span className="text-gray-400 shrink-0 text-xs">{c.dial}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

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
        <p className="text-xs text-gray-400 font-dm mt-1 leading-snug">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500 font-dm mt-1">{error}</p>}
    </div>
  );
}

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tierParam = searchParams.get("tier") as VendorType | null;
  const tier: VendorType =
    tierParam === "REGISTERED" || tierParam === "NON_REGISTERED"
      ? tierParam
      : "NON_REGISTERED";

  const categoryParam = searchParams.get("category") ?? "";
  const categoryLabel = CATEGORY_LABELS[categoryParam] ?? categoryParam;

  const register = useRegisterVendor();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);

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
      notOwner: false,
      ownersFirstName: "",
      ownersLastName: "",
    },
  });

  const password = watch("password");
  const notOwner = watch("notOwner");

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      const result = await register.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phoneNumber: selectedCountry.dial + values.phoneNumber.trim(),
        password: values.password,
        vendorType: tier,
        businessName: values.businessName.trim(),
        businessAddress: values.businessAddress.trim(),
        businessCategory: categoryLabel || "GENERAL",
        businessDescription: values.businessDescription.trim() || undefined,
        ...(values.notOwner && {
          ownersFirstName: values.ownersFirstName.trim(),
          ownersLastName: values.ownersLastName.trim(),
        }),
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
      <div className="relative z-10 min-h-screen w-full flex flex-col">

        <div className="flex items-center justify-end px-6 md:px-10 pt-6 pb-2">
          <Link
            href="/vendor/login"
            className="text-sm font-bold font-dm text-gray-800 hover:text-recommend-orange transition-colors"
          >
            Already a vendor? Log in
          </Link>
        </div>

        <div className="flex-1 flex items-start justify-center px-4 pb-10 pt-2">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-6 md:p-10 flex flex-col gap-6">

            <h2 className="font-dm font-black text-[22px] leading-snug text-gray-900 whitespace-nowrap">
              Your next customer is already nearby.
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="First name" error={errors.firstName?.message}>
                  <input
                    placeholder="Enter first name"
                    {...field("firstName", {
                      required: "Required",
                      minLength: { value: 2, message: "Min 2 chars" },
                      maxLength: { value: 50, message: "Max 50 chars" },
                    })}
                    className={inputStyles}
                  />
                </FormField>
                <FormField label="Last name" error={errors.lastName?.message}>
                  <input
                    placeholder="Enter last name"
                    {...field("lastName", {
                      required: "Required",
                      minLength: { value: 2, message: "Min 2 chars" },
                      maxLength: { value: 50, message: "Max 50 chars" },
                    })}
                    className={inputStyles}
                  />
                </FormField>
              </div>

              {/* Email */}
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

              {/* Phone */}
              <FormField label="Phone number" error={errors.phoneNumber?.message}>
                <div
                  className="w-full h-11 rounded-lg border border-gray-200 bg-white flex items-center focus-within:border-recommend-green focus-within:ring-1 focus-within:ring-recommend-green"
                  style={{ position: "relative" }}
                >
                  <CountrySelector value={selectedCountry} onChange={setSelectedCountry} />
                  <input
                    type="tel"
                    placeholder="80 0000 0000"
                    {...field("phoneNumber", {
                      required: "Required",
                      pattern: {
                        value: /^\d{6,12}$/,
                        message: "Enter a valid local number",
                      },
                    })}
                    className="flex-1 h-full px-3 text-sm font-dm bg-transparent focus:outline-none rounded-r-lg"
                  />
                </div>
              </FormField>

              {/* Business name + checkbox + conditional owner fields */}
              <div className="flex flex-col gap-3">
                <FormField label="Business name" error={errors.businessName?.message}>
                  <input
                    placeholder="Enter business name"
                    {...field("businessName", {
                      required: "Required",
                      minLength: { value: 2, message: "Min 2 chars" },
                      maxLength: { value: 100, message: "Max 100 chars" },
                    })}
                    className={inputStyles}
                  />
                </FormField>

                {/* Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    {...field("notOwner")}
                    className="w-3.5 h-3.5 rounded border-gray-300 accent-recommend-orange"
                  />
                  <span className="text-xs font-dm text-gray-600">
                    I do not own this business
                  </span>
                </label>

                {/* Owner name fields — revealed when checkbox is ticked */}
                {notOwner && (
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      label="Owner's first name"
                      error={errors.ownersFirstName?.message}
                    >
                      <input
                        placeholder="Enter owner's first name"
                        {...field("ownersFirstName", {
                          required: "Required",
                          minLength: { value: 2, message: "Min 2 chars" },
                          maxLength: { value: 50, message: "Max 50 chars" },
                        })}
                        className={inputStyles}
                      />
                    </FormField>
                    <FormField
                      label="Owner's last name"
                      error={errors.ownersLastName?.message}
                    >
                      <input
                        placeholder="Enter owner's last name"
                        {...field("ownersLastName", {
                          required: "Required",
                          minLength: { value: 2, message: "Min 2 chars" },
                          maxLength: { value: 50, message: "Max 50 chars" },
                        })}
                        className={inputStyles}
                      />
                    </FormField>
                  </div>
                )}
              </div>

              {/* Business address */}
              <FormField label="Business address" error={errors.businessAddress?.message}>
                <input
                  placeholder="Enter business address"
                  {...field("businessAddress", {
                    required: "Required",
                    minLength: { value: 5, message: "Min 5 chars" },
                    maxLength: { value: 255, message: "Max 255 chars" },
                  })}
                  className={inputStyles}
                />
              </FormField>

              {/* Password */}
              <FormField
                label="Password"
                error={errors.password?.message}
                hint="Password must contain one uppercase, one lowercase, one symbol, one number, and be at least 8 characters long."
              >
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    {...field("password", {
                      required: "Required",
                      pattern: {
                        value: PASSWORD_RULE,
                        message: "Needs upper + lower + digit + special (@$!%*?&), 8–50 chars",
                      },
                    })}
                    className={`${inputStyles} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </FormField>

              {/* Confirm password */}
              <FormField label="Confirm password" error={errors.confirmPassword?.message}>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    {...field("confirmPassword", {
                      required: "Required",
                      validate: (v) => v === password || "Passwords don't match",
                    })}
                    className={`${inputStyles} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </FormField>

              {submitError && (
                <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
                  {submitError}
                </p>
              )}

              {/* Terms */}
              <p className="text-xs font-dm text-gray-500">
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

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="gradient"
                  text={register.isPending ? "Creating account…" : "Create account"}
                  disabled={register.isPending}
                  onClick={handleSubmit(onSubmit)}
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={() => router.back()}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
                    disabled
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>

      </div>
    </BackgroundTwo>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterFormInner />
    </Suspense>
  );
}