"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Store, Clock } from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import StoreImageField from "@/components/organisms/StoreImageField";
import {
  useMyVendorProfile,
  useUpdateMyVendorProfile,
  useUpdateVendorPayout,
} from "@/hooks";
import type { OperatingHours } from "@/types";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

interface ProfileFormValues {
  businessName: string;
  businessAddress: string;
  businessDescription: string;
  businessCategory: string;
  businessAreas: string;
  whatsappNumber: string;
}

interface PayoutFormValues {
  bankName: string;
  bankCode: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

const PHONE_RULE = /^\+?[1-9]\d{1,14}$/;
const NUBAN_RULE = /^\d{10}$/;

export default function VendorStoreSettingsPage() {
  const profile = useMyVendorProfile();
  const updateProfile = useUpdateMyVendorProfile();
  const updatePayout = useUpdateVendorPayout();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Store settings"
        description="Control how customers see your business on Recommend."
      />

      {profile.isLoading ? (
        <p className="text-sm font-dm text-gray-400">Loading profile…</p>
      ) : profile.isError || !profile.data ? (
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Couldn&apos;t load your profile. Refresh to try again.
        </p>
      ) : (
        <>
          <StoreStatusCard />
          <BusinessProfileSection />
          <OperatingHoursSection />
          <PayoutSection />
        </>
      )}
    </div>
  );

  function StoreStatusCard() {
    const isOpen = profile.data?.isOpen ?? false;
    const [flipping, setFlipping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggle = async () => {
      setError(null);
      setFlipping(true);
      try {
        await updateProfile.mutateAsync({ isOpen: !isOpen });
      } catch (err) {
        setError(
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Could not update status."
        );
      } finally {
        setFlipping(false);
      }
    };

    return (
      <div
        className={`rounded-2xl p-5 md:p-6 flex items-center gap-4 border ${
          isOpen
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div
          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            isOpen
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          <Store size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold font-dm text-gray-900">
            {isOpen ? "Store is open" : "Store is closed"}
          </p>
          <p className="text-sm font-dm text-gray-600">
            {isOpen
              ? "Customers can place orders right now."
              : "Customers see your store but can't place orders."}
          </p>
          {error && (
            <p className="text-xs font-dm text-red-600 mt-1">{error}</p>
          )}
        </div>
        <button
          onClick={toggle}
          disabled={flipping}
          className={`rounded-full px-5 py-2 text-sm font-bold font-dm text-white disabled:opacity-50 ${
            isOpen
              ? "bg-red-600 hover:bg-red-700"
              : "bg-recommend-green hover:bg-recommend-green-hover"
          }`}
        >
          {flipping ? "…" : isOpen ? "Close store" : "Open store"}
        </button>
      </div>
    );
  }

  function BusinessProfileSection() {
    const [logoUrl, setLogoUrl] = useState<string | null>(
      profile.data?.businessLogoUrl ?? null
    );
    const [bannerUrl, setBannerUrl] = useState<string | null>(
      profile.data?.businessBannerUrl ?? null
    );
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
      defaultValues: {
        businessName: profile.data?.businessName ?? "",
        businessAddress: "",
        businessDescription: profile.data?.businessDescription ?? "",
        businessCategory: profile.data?.businessCategory ?? "",
        businessAreas: (profile.data?.businessAreas ?? []).join(", "),
        whatsappNumber: profile.data?.whatsappNumber ?? "",
      },
    });

    const hasImageChanges =
      logoUrl !== (profile.data?.businessLogoUrl ?? null) ||
      bannerUrl !== (profile.data?.businessBannerUrl ?? null);

    const onSubmit = async (values: ProfileFormValues) => {
      setSubmitError(null);
      setSuccess(false);
      try {
        await updateProfile.mutateAsync({
          businessName: values.businessName.trim() || undefined,
          businessAddress: values.businessAddress.trim() || undefined,
          businessDescription:
            values.businessDescription.trim() || undefined,
          businessCategory: values.businessCategory.trim() || undefined,
          businessAreas: values.businessAreas
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          whatsappNumber: values.whatsappNumber.trim() || undefined,
          businessLogoUrl: logoUrl ?? undefined,
          businessBannerUrl: bannerUrl ?? undefined,
        });
        setSuccess(true);
      } catch (err) {
        setSubmitError(
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Could not save profile."
        );
      }
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4"
      >
        <div>
          <h2 className="text-lg font-bold font-dm text-gray-900">
            Business profile
          </h2>
          <p className="text-xs font-dm text-gray-500">
            This shows up on your public storefront.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <Field label="Business name" error={errors.businessName?.message}>
              <input
                {...register("businessName", {
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
                className={inputStyles}
              />
            </Field>
            <Field
              label="Business category"
              error={errors.businessCategory?.message}
              hint="e.g. Restaurant, Grocery, Pharmacy"
            >
              <input {...register("businessCategory")} className={inputStyles} />
            </Field>
            <Field
              label="Business address"
              error={errors.businessAddress?.message}
              hint="Leave blank to keep current."
            >
              <input
                placeholder="e.g. 12 Broad Street, Lagos"
                {...register("businessAddress")}
                className={inputStyles}
              />
            </Field>
            <Field
              label="WhatsApp number"
              error={errors.whatsappNumber?.message}
              hint="Orders route here. Use E.164 format (e.g. +2348012345678)."
            >
              <input
                {...register("whatsappNumber", {
                  validate: (v) =>
                    !v || PHONE_RULE.test(v) || "Use E.164 format",
                })}
                className={inputStyles}
              />
            </Field>
            <Field
              label="Delivery areas"
              error={errors.businessAreas?.message}
              hint="Comma-separated. e.g. Lekki, Ajah, Victoria Island"
            >
              <input {...register("businessAreas")} className={inputStyles} />
            </Field>
            <Field
              label="Description"
              error={errors.businessDescription?.message}
              hint="Up to 500 characters."
            >
              <textarea
                rows={3}
                {...register("businessDescription", {
                  maxLength: { value: 500, message: "Max 500 characters" },
                })}
                className={`${inputStyles} resize-none`}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-4">
            <StoreImageField
              label="Logo"
              hint="Square, high-contrast. Shown in listings."
              value={logoUrl}
              onChange={setLogoUrl}
              aspect="square"
            />
            <StoreImageField
              label="Banner"
              hint="Wide image across the top of your storefront."
              value={bannerUrl}
              onChange={setBannerUrl}
              aspect="banner"
            />
          </div>
        </div>

        {submitError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            {submitError}
          </p>
        )}
        {success && !isDirty && !hasImageChanges && (
          <p className="text-sm font-dm text-green-700 bg-green-50 rounded-lg p-3">
            Profile saved.
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={
              (!isDirty && !hasImageChanges) || updateProfile.isPending
            }
            className="rounded-full bg-recommend-orange text-white px-5 py-2.5 text-sm font-bold font-dm hover:bg-orange-600 disabled:opacity-50"
          >
            {updateProfile.isPending ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
    );
  }

  function OperatingHoursSection() {
    const defaultHours: Record<string, OperatingHours> =
      profile.data?.operatingHours ??
      Object.fromEntries(
        DAYS.map((d) => [
          d,
          { isOpen: d !== "sunday", open: "09:00", close: "18:00" },
        ])
      );

    const [hours, setHours] = useState<Record<string, OperatingHours>>(defaultHours);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      if (profile.data?.operatingHours) {
        setHours(profile.data.operatingHours);
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const set = (day: string, patch: Partial<OperatingHours>) => {
      setHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
    };

    const onSave = async () => {
      setSubmitError(null);
      setSuccess(false);
      try {
        await updateProfile.mutateAsync({ operatingHours: hours });
        setSuccess(true);
      } catch (err) {
        setSubmitError(
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Could not save hours."
        );
      }
    };

    return (
      <section className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-recommend-orange">
            <Clock size={16} />
          </div>
          <div>
            <h2 className="text-lg font-bold font-dm text-gray-900">
              Operating hours
            </h2>
            <p className="text-xs font-dm text-gray-500">
              Customers see these on your storefront. Times use your local
              timezone.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {DAYS.map((d) => {
            const h = hours[d] ?? {
              isOpen: false,
              open: "09:00",
              close: "18:00",
            };
            return (
              <div
                key={d}
                className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="w-28 shrink-0">
                  <p className="text-sm font-bold font-dm text-gray-800">
                    {DAY_LABELS[d]}
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={h.isOpen}
                    onChange={(e) => set(d, { isOpen: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-recommend-green focus:ring-recommend-green"
                  />
                  <span className="text-sm font-dm text-gray-700">
                    {h.isOpen ? "Open" : "Closed"}
                  </span>
                </label>
                {h.isOpen && (
                  <>
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => set(d, { open: e.target.value })}
                      className="h-9 px-2 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green"
                    />
                    <span className="text-xs font-dm text-gray-500">to</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => set(d, { close: e.target.value })}
                      className="h-9 px-2 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {submitError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            {submitError}
          </p>
        )}
        {success && (
          <p className="text-sm font-dm text-green-700 bg-green-50 rounded-lg p-3">
            Hours saved.
          </p>
        )}

        <div>
          <button
            type="button"
            onClick={onSave}
            disabled={updateProfile.isPending}
            className="rounded-full bg-recommend-orange text-white px-5 py-2.5 text-sm font-bold font-dm hover:bg-orange-600 disabled:opacity-50"
          >
            {updateProfile.isPending ? "Saving…" : "Save hours"}
          </button>
        </div>
      </section>
    );
  }

  function PayoutSection() {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
    } = useForm<PayoutFormValues>({
      defaultValues: {
        bankName: profile.data?.bankName ?? "",
        bankCode: profile.data?.bankCode ?? "",
        bankAccountNumber: profile.data?.bankAccountNumber ?? "",
        bankAccountName: profile.data?.bankAccountName ?? "",
      },
    });

    const onSubmit = async (values: PayoutFormValues) => {
      setSubmitError(null);
      setSuccess(false);
      try {
        await updatePayout.mutateAsync({
          bankName: values.bankName.trim(),
          bankCode: values.bankCode.trim(),
          bankAccountNumber: values.bankAccountNumber.trim(),
          bankAccountName: values.bankAccountName.trim(),
        });
        setSuccess(true);
      } catch (err) {
        setSubmitError(
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Could not save payout details."
        );
      }
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4"
      >
        <div>
          <h2 className="text-lg font-bold font-dm text-gray-900">
            Payout details
          </h2>
          <p className="text-xs font-dm text-gray-500">
            We&apos;ll send earnings to this bank account. Use your Paystack
            bank code — see{" "}
            <a
              href="https://api.paystack.co/bank"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              api.paystack.co/bank
            </a>{" "}
            for the full list.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Bank name" error={errors.bankName?.message}>
            <input
              placeholder="e.g. Access Bank"
              {...register("bankName", { required: "Required" })}
              className={inputStyles}
            />
          </Field>
          <Field label="Bank code" error={errors.bankCode?.message}>
            <input
              placeholder="e.g. 044"
              {...register("bankCode", { required: "Required" })}
              className={inputStyles}
            />
          </Field>
          <Field
            label="Account number"
            error={errors.bankAccountNumber?.message}
            hint="10-digit NUBAN"
          >
            <input
              inputMode="numeric"
              maxLength={10}
              {...register("bankAccountNumber", {
                required: "Required",
                pattern: {
                  value: NUBAN_RULE,
                  message: "Must be 10 digits",
                },
              })}
              className={inputStyles}
            />
          </Field>
          <Field label="Account name" error={errors.bankAccountName?.message}>
            <input
              placeholder="As shown on your bank statement"
              {...register("bankAccountName", { required: "Required" })}
              className={inputStyles}
            />
          </Field>
        </div>

        {submitError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            {submitError}
          </p>
        )}
        {success && (
          <p className="text-sm font-dm text-green-700 bg-green-50 rounded-lg p-3">
            Payout details saved.
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={!isDirty || updatePayout.isPending}
            className="rounded-full bg-recommend-orange text-white px-5 py-2.5 text-sm font-bold font-dm hover:bg-orange-600 disabled:opacity-50"
          >
            {updatePayout.isPending ? "Saving…" : "Save payout"}
          </button>
        </div>
      </form>
    );
  }
}

const inputStyles =
  "w-full h-11 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green";

function Field({
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
