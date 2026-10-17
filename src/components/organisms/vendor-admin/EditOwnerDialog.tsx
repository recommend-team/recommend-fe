"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/atoms/admin/Modal";
import { useUpdateVendor } from "@/hooks";
import type { AdminUpdateVendorPayload, AdminVendorDetail } from "@/types";
import { Field, FormActions, FormError, INPUT, changed } from "./form";

interface Values {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vendorType: "REGISTERED" | "NON_REGISTERED";
  /** Empty for no monthly limit. */
  orderQuota: string;
}

/**
 * The person behind the store — details the vendor app cannot change: their name, phone,
 * whether the business is registered, and the monthly order limit. The phone is kept
 * unique; the server says so if another account has it.
 */
export default function EditOwnerDialog({
  vendor,
  onClose,
}: {
  vendor: AdminVendorDetail["vendor"];
  onClose: () => void;
}) {
  const update = useUpdateVendor(vendor.id);
  const [nothing, setNothing] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      firstName: vendor.firstName ?? "",
      lastName: vendor.lastName ?? "",
      phoneNumber: vendor.phoneNumber ?? "",
      vendorType: vendor.vendorType === "REGISTERED" ? "REGISTERED" : "NON_REGISTERED",
      orderQuota:
        typeof vendor.orderQuota === "number" ? String(vendor.orderQuota) : "",
    },
  });

  const onSubmit = (values: Values) => {
    const after: AdminUpdateVendorPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      vendorType: values.vendorType,
      orderQuota: values.orderQuota.trim() ? Number(values.orderQuota) : null,
    };
    const payload = changed(
      {
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        phoneNumber: vendor.phoneNumber,
        vendorType: vendor.vendorType,
        orderQuota: vendor.orderQuota ?? null,
      },
      after as Record<string, unknown>
    );
    if (Object.keys(payload).length === 0) {
      setNothing(true);
      return;
    }
    update.mutate(payload, {
      onSuccess: onClose,
      onError: (error) => {
        for (const { field, message } of error.fieldErrors ?? []) {
          if (field in values) setError(field as keyof Values, { message });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit owner"
      description="The person behind the store. The vendor is told what you changed."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" error={errors.firstName?.message}>
            <input
              autoFocus
              {...register("firstName", {
                validate: (v) => v.trim().length >= 2 || "At least 2 letters",
              })}
              className={INPUT}
            />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <input
              {...register("lastName", {
                validate: (v) => v.trim().length >= 2 || "At least 2 letters",
              })}
              className={INPUT}
            />
          </Field>
        </div>

        <Field label="Phone number" hint="Any format" error={errors.phoneNumber?.message}>
          <input
            type="tel"
            {...register("phoneNumber", {
              validate: (v) => /\d{7,}/.test(v.replace(/\D/g, "")) || "Enter a phone number",
            })}
            className={INPUT}
          />
        </Field>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 font-dm text-sm font-bold text-gray-700">Business</legend>
          <div className="flex gap-2">
            {(
              [
                ["REGISTERED", "Registered (CAC)"],
                ["NON_REGISTERED", "Not registered"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 font-dm text-sm has-[:checked]:border-recommend-green has-[:checked]:bg-green-50"
              >
                <input type="radio" value={value} {...register("vendorType")} />
                {label}
              </label>
            ))}
          </div>
          <span className="font-dm text-xs text-gray-500">
            Decides which documents they need for KYC.
          </span>
        </fieldset>

        <Field
          label="Monthly order limit"
          hint="Leave empty for no limit"
          error={errors.orderQuota?.message}
        >
          <input
            inputMode="numeric"
            placeholder="No limit"
            {...register("orderQuota", {
              validate: (v) =>
                !v.trim() || /^\d{1,6}$/.test(v.trim()) || "A whole number, or empty",
            })}
            className={INPUT}
          />
        </Field>

        <FormError
          message={
            nothing
              ? "Nothing has changed."
              : update.isError && !update.error.fieldErrors?.length
                ? update.error.message
                : null
          }
        />
        <FormActions onCancel={onClose} saving={update.isPending} />
      </form>
    </Modal>
  );
}
