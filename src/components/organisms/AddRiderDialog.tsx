"use client";

import { useForm } from "react-hook-form";
import Modal from "@/components/atoms/admin/Modal";
import { useCreateRider } from "@/hooks";
import type { AdminRider, CreateRiderPayload, RiderType } from "@/types";

interface FormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  riderType: RiderType;
  note: string;
}

const INPUT =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-dm text-sm focus:border-recommend-green focus:outline-none focus:ring-1 focus:ring-recommend-green";

/**
 * Add a rider the team has vetted and can reach by phone. Approved at once; no password,
 * since there is nothing for them to sign in to until the rider app. The phone is
 * normalised by the server, which also refuses one already on another account.
 */
export default function AddRiderDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: (rider: AdminRider) => void;
}) {
  const create = useCreateRider();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      riderType: "INDIVIDUAL",
      note: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload: CreateRiderPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      riderType: values.riderType,
      ...(values.email.trim() ? { email: values.email.trim() } : {}),
      ...(values.note.trim() ? { note: values.note.trim() } : {}),
    };
    create.mutate(payload, {
      onSuccess: (rider) => {
        onCreated?.(rider);
        onClose();
      },
      onError: (error) => {
        // A field the server refused is shown on that field.
        for (const { field, message } of error.fieldErrors ?? []) {
          if (field in values) setError(field as keyof FormValues, { message });
        }
      },
    });
  };

  return (
    <Modal
      title="Add a rider"
      description="Someone you've vetted and can reach by phone. They're approved straight away."
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

        <Field label="Phone number" hint="Any format, e.g. 0801 234 5678" error={errors.phoneNumber?.message}>
          <input
            type="tel"
            placeholder="0801 234 5678"
            {...register("phoneNumber", {
              validate: (v) => /\d{7,}/.test(v.replace(/\D/g, "")) || "Enter a phone number",
            })}
            className={INPUT}
          />
        </Field>

        <Field label="Email" hint="Optional" error={errors.email?.message}>
          <input
            type="email"
            placeholder="rider@example.com"
            {...register("email", {
              validate: (v) =>
                !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email",
            })}
            className={INPUT}
          />
        </Field>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 font-dm text-sm font-bold text-gray-700">Type</legend>
          <div className="flex gap-2">
            {(
              [
                ["INDIVIDUAL", "Solo rider"],
                ["COMPANY", "Fleet / company"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 font-dm text-sm has-[:checked]:border-recommend-green has-[:checked]:bg-green-50"
              >
                <input type="radio" value={value} {...register("riderType")} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Note" hint="Optional — vehicle, areas covered" error={errors.note?.message}>
          <textarea
            rows={2}
            placeholder="Has a bike. Covers Lekki Phase 1 and Ajah."
            {...register("note", { maxLength: { value: 500, message: "Keep it under 500 characters" } })}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 font-dm text-sm focus:border-recommend-green focus:outline-none focus:ring-1 focus:ring-recommend-green"
          />
        </Field>

        {create.isError && !create.error.fieldErrors?.length && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 font-dm text-sm text-red-600">
            {create.error.message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 font-dm text-sm font-bold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-full bg-recommend-green px-5 py-2 font-dm text-sm font-bold text-white hover:bg-recommend-green-hover disabled:opacity-50"
          >
            {create.isPending ? "Adding…" : "Add rider"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 font-dm text-sm font-bold text-gray-700">
      <span>
        {label} {hint && <span className="font-normal text-gray-400">{hint}</span>}
      </span>
      {children}
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
