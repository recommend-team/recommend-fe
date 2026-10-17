"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/atoms/admin/Modal";
import { useUpdateVendor } from "@/hooks";
import type { AdminUpdateVendorPayload, AdminVendorDetail } from "@/types";
import ImageUploader from "./ImageUploader";
import { Field, FormActions, FormError, INPUT, TEXTAREA, changed } from "./form";

interface Values {
  businessName: string;
  businessCategory: string;
  businessAddress: string;
  businessDescription: string;
  whatsappNumber: string;
}

/** "0801 234 5678" → "+2348012345678": the server takes international numbers only. */
export function toInternational(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return digits ? `+${digits}` : "";
}

/**
 * The store as buyers see it: name, what they sell, address, description, WhatsApp,
 * logo and banner. Saved through the vendor's own update, logged, and the vendor is told
 * — so only the fields actually changed are sent.
 */
export default function EditStoreDialog({
  vendor,
  onClose,
}: {
  vendor: AdminVendorDetail["vendor"];
  onClose: () => void;
}) {
  const update = useUpdateVendor(vendor.id);
  const [logo, setLogo] = useState<string | null>(vendor.businessLogoUrl ?? null);
  const [banner, setBanner] = useState<string | null>(vendor.businessBannerUrl ?? null);
  const [nothing, setNothing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      businessName: vendor.businessName ?? "",
      businessCategory: vendor.businessCategory ?? "",
      businessAddress: vendor.businessAddress ?? "",
      businessDescription: vendor.businessDescription ?? "",
      whatsappNumber: vendor.whatsappNumber ?? "",
    },
  });

  const onSubmit = (values: Values) => {
    const whatsapp = toInternational(values.whatsappNumber);
    const after: AdminUpdateVendorPayload = {
      businessName: values.businessName.trim(),
      businessCategory: values.businessCategory.trim(),
      businessAddress: values.businessAddress.trim(),
      businessDescription: values.businessDescription.trim(),
      // A number can be changed but not cleared; an empty box leaves it as it is.
      ...(whatsapp ? { whatsappNumber: whatsapp } : {}),
      ...(logo ? { businessLogoUrl: logo } : {}),
      ...(banner ? { businessBannerUrl: banner } : {}),
    };
    const payload = changed(
      {
        businessName: vendor.businessName,
        businessCategory: vendor.businessCategory,
        businessAddress: vendor.businessAddress,
        businessDescription: vendor.businessDescription ?? "",
        whatsappNumber: vendor.whatsappNumber,
        businessLogoUrl: vendor.businessLogoUrl,
        businessBannerUrl: vendor.businessBannerUrl,
      },
      after as Record<string, unknown>
    );
    if (Object.keys(payload).length === 0) {
      setNothing(true);
      return;
    }
    update.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Modal
      title="Edit store"
      description="What buyers see. The vendor is told what you changed."
      onClose={onClose}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-5">
          <ImageUploader label="Logo" value={logo} onChange={setLogo} folder="profile" />
          <div className="min-w-[220px] flex-1">
            <ImageUploader
              label="Banner"
              value={banner}
              onChange={setBanner}
              folder="profile"
              shape="wide"
            />
          </div>
        </div>

        <Field label="Business name" error={errors.businessName?.message}>
          <input
            autoFocus
            {...register("businessName", {
              validate: (v) => v.trim().length >= 2 || "At least 2 characters",
              maxLength: { value: 100, message: "Keep it under 100 characters" },
            })}
            className={INPUT}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="What they sell" error={errors.businessCategory?.message}>
            <input
              placeholder="e.g. Food, Gadgets"
              {...register("businessCategory", {
                validate: (v) => v.trim().length >= 2 || "At least 2 characters",
              })}
              className={INPUT}
            />
          </Field>
          <Field
            label="WhatsApp"
            hint="Optional"
            error={errors.whatsappNumber?.message}
          >
            <input
              type="tel"
              placeholder="0801 234 5678"
              {...register("whatsappNumber", {
                validate: (v) =>
                  !v.trim() ||
                  /^\+?[1-9]\d{7,14}$/.test(toInternational(v)) ||
                  "Enter a valid phone number",
              })}
              className={INPUT}
            />
          </Field>
        </div>

        <Field label="Address" error={errors.businessAddress?.message}>
          <input
            {...register("businessAddress", {
              validate: (v) => v.trim().length >= 5 || "Enter the full address",
              maxLength: { value: 255, message: "Keep it under 255 characters" },
            })}
            className={INPUT}
          />
        </Field>

        <Field label="Description" hint="Optional" error={errors.businessDescription?.message}>
          <textarea
            rows={3}
            {...register("businessDescription", {
              maxLength: { value: 500, message: "Keep it under 500 characters" },
            })}
            className={TEXTAREA}
          />
        </Field>

        <FormError
          message={
            nothing ? "Nothing has changed." : update.isError ? update.error.message : null
          }
        />
        <FormActions onCancel={onClose} saving={update.isPending} />
      </form>
    </Modal>
  );
}
