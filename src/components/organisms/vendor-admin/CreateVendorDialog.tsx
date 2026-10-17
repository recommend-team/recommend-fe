"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/atoms/admin/Modal";
import { useAllAreas, useCreateVendor } from "@/hooks";
import type { CreateVendorPayload } from "@/types";
import { Field, FormActions, FormError, INPUT, TEXTAREA } from "./form";

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  vendorType: "REGISTERED" | "NON_REGISTERED";
  businessName: string;
  businessCategory: string;
  businessAddress: string;
  businessDescription: string;
}

/**
 * Set up a vendor who hasn't signed up themselves — someone onboarded in person. Approved
 * and open straight away, with a shop link. They have no password: they're emailed a link
 * to choose one, and sign in to the vendor app after that.
 */
export default function CreateVendorDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (vendor: { id: string; inviteSent: boolean }) => void;
}) {
  const create = useCreateVendor();
  const areas = useAllAreas(true);
  const [areaIds, setAreaIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      vendorType: "NON_REGISTERED",
      businessName: "",
      businessCategory: "",
      businessAddress: "",
      businessDescription: "",
    },
  });

  const onSubmit = (values: Values) => {
    const payload: CreateVendorPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phoneNumber: values.phoneNumber.trim(),
      vendorType: values.vendorType,
      businessName: values.businessName.trim(),
      businessCategory: values.businessCategory.trim(),
      businessAddress: values.businessAddress.trim(),
      ...(values.businessDescription.trim()
        ? { businessDescription: values.businessDescription.trim() }
        : {}),
      ...(areaIds.length ? { areaIds } : {}),
    };
    create.mutate(payload, {
      onSuccess: (vendor) => onCreated(vendor),
      onError: (error) => {
        for (const { field, message } of error.fieldErrors ?? []) {
          if (field in values) setError(field as keyof Values, { message });
        }
      },
    });
  };

  const toggleArea = (id: string) =>
    setAreaIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );

  return (
    <Modal
      title="Set up a vendor"
      description="For someone you've onboarded yourself. They're approved and open straight away, and we email them a link to set their password."
      onClose={onClose}
      width="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <p className="font-dm text-xs font-bold uppercase tracking-wide text-gray-500">Owner</p>
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Email" hint="Their login" error={errors.email?.message}>
            <input
              type="email"
              {...register("email", {
                validate: (v) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email",
              })}
              className={INPUT}
            />
          </Field>
          <Field label="Phone number" hint="Any format" error={errors.phoneNumber?.message}>
            <input
              type="tel"
              placeholder="0801 234 5678"
              {...register("phoneNumber", {
                validate: (v) => /\d{7,}/.test(v.replace(/\D/g, "")) || "Enter a phone number",
              })}
              className={INPUT}
            />
          </Field>
        </div>

        <p className="pt-1 font-dm text-xs font-bold uppercase tracking-wide text-gray-500">
          Business
        </p>
        <Field label="Business name" error={errors.businessName?.message}>
          <input
            {...register("businessName", {
              validate: (v) => v.trim().length >= 2 || "At least 2 characters",
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
          <fieldset className="flex flex-col gap-1.5">
            <legend className="mb-1.5 font-dm text-sm font-bold text-gray-700">Registered?</legend>
            <div className="flex gap-2">
              {(
                [
                  ["NON_REGISTERED", "Not yet"],
                  ["REGISTERED", "CAC registered"],
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
          </fieldset>
        </div>
        <Field label="Address" error={errors.businessAddress?.message}>
          <input
            {...register("businessAddress", {
              validate: (v) => v.trim().length >= 5 || "Enter the full address",
            })}
            className={INPUT}
          />
        </Field>
        <Field label="Description" hint="Optional" error={errors.businessDescription?.message}>
          <textarea
            rows={2}
            {...register("businessDescription", {
              maxLength: { value: 500, message: "Keep it under 500 characters" },
            })}
            className={TEXTAREA}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <p className="font-dm text-sm font-bold text-gray-700">
            Delivery areas <span className="font-normal text-gray-400">Optional — can add later</span>
          </p>
          <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 p-2">
            {areas.isLoading && (
              <p className="p-2 font-dm text-sm text-gray-400">Loading areas…</p>
            )}
            {(areas.data ?? []).map(({ state, areas: list }) => (
              <fieldset key={state.id}>
                <legend className="px-1 pt-1 font-dm text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  {state.name}
                </legend>
                <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-3">
                  {list.map((area) => (
                    <label
                      key={area.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 font-dm text-sm text-gray-800 hover:bg-amber-50"
                    >
                      <input
                        type="checkbox"
                        checked={areaIds.includes(area.id)}
                        onChange={() => toggleArea(area.id)}
                      />
                      {area.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        <FormError
          message={
            create.isError && !create.error.fieldErrors?.length ? create.error.message : null
          }
        />
        <FormActions
          onCancel={onClose}
          saving={create.isPending}
          label="Set up vendor"
          disabled={areaIds.length > 20}
        />
      </form>
    </Modal>
  );
}
