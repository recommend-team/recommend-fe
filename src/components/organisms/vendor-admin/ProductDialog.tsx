"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/atoms/admin/Modal";
import { useAddVendorProduct, useUpdateVendorProduct } from "@/hooks";
import { PRODUCT_UNITS, type AdminProductPayload, type Product } from "@/types";
import ImageUploader from "./ImageUploader";
import {
  ChoicesEditor,
  choiceProblem,
  toChoiceInputs,
  toDrafts,
  type DraftChoice,
} from "./ChoicesEditor";
import {
  Field,
  FormActions,
  FormError,
  INPUT,
  TEXTAREA,
  changed,
} from "./form";

interface Values {
  name: string;
  description: string;
  price: string;
  isAvailable: boolean;
  unit: string;
}

/**
 * Add a product for a vendor, or change one — the same fields and rules as the vendor
 * app: name, price, what the price is per, photo, description, available, the extras that
 * go with it, and its choices. Extras have their own dialog (`ExtraDialog`).
 */
export default function ProductDialog({
  vendorId,
  product,
  extras,
  onClose,
}: {
  vendorId: string;
  /** Absent to add a new product. */
  product?: Product;
  /** The vendor's extras, to tick onto a dish. */
  extras: Product[];
  onClose: () => void;
}) {
  const add = useAddVendorProduct(vendorId);
  const edit = useUpdateVendorProduct(vendorId);
  const saving = add.isPending || edit.isPending;
  const failure = add.error ?? edit.error;
  const [photo, setPhoto] = useState<string | null>(product?.imageUrl ?? null);
  const [nothing, setNothing] = useState(false);
  const [extraIds, setExtraIds] = useState<string[]>(product?.extraIds ?? []);
  const [choices, setChoices] = useState<DraftChoice[]>(() =>
    toDrafts(product?.choices),
  );
  const [showProblems, setShowProblems] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product ? String(Number(product.price)) : "",
      isAvailable: product?.isAvailable ?? true,
      unit: product?.unit ?? "",
    },
  });
  const problems = Object.fromEntries(
    choices.map((c) => [c.key, choiceProblem(c)]),
  );
  const otherExtras = extras.filter((extra) => extra.id !== product?.id);

  const onSubmit = (values: Values) => {
    if (Object.values(problems).some(Boolean)) {
      setShowProblems(true);
      return;
    }
    const after: AdminProductPayload = {
      name: values.name.trim(),
      description: values.description.trim(),
      price: Math.round(Number(values.price) * 100) / 100,
      isAvailable: values.isAvailable,
      isAddOn: false,
      ...(photo ? { imageUrl: photo } : {}),
      unit: values.unit || null,
      extraIds: otherExtras
        .map((e) => e.id)
        .filter((id) => extraIds.includes(id)),
      choices: toChoiceInputs(choices),
    };
    const onError = (error: {
      fieldErrors?: { field: string; message: string }[];
    }) => {
      for (const { field, message } of error.fieldErrors ?? []) {
        if (field in values) setError(field as keyof Values, { message });
      }
    };

    if (!product) {
      if (!after.description) delete after.description;
      add.mutate(after, { onSuccess: onClose, onError });
      return;
    }

    const payload = changed(
      {
        name: product.name,
        description: product.description ?? "",
        price: Number(product.price),
        isAvailable: product.isAvailable,
        isAddOn: product.isAddOn ?? false,
        imageUrl: product.imageUrl,
        unit: product.unit ?? null,
        extraIds: otherExtras
          .map((e) => e.id)
          .filter((id) => (product.extraIds ?? []).includes(id)),
        choices: toChoiceInputs(toDrafts(product.choices)),
      },
      after as unknown as Record<string, unknown>,
    );
    if (Object.keys(payload).length === 0) {
      setNothing(true);
      return;
    }
    edit.mutate(
      { productId: product.id, payload },
      { onSuccess: onClose, onError },
    );
  };

  return (
    <Modal
      title={product ? "Edit product" : "Add a product"}
      description="The vendor is told what you changed."
      onClose={onClose}
      width="max-w-lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <ImageUploader
          label="Photo"
          value={photo}
          onChange={setPhoto}
          folder="products"
          removable={!product?.imageUrl}
        />

        <Field label="Name" error={errors.name?.message}>
          <input
            autoFocus
            {...register("name", {
              validate: (v) => v.trim().length >= 2 || "At least 2 characters",
              maxLength: {
                value: 100,
                message: "Keep it under 100 characters",
              },
            })}
            className={INPUT}
          />
        </Field>

        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="Price (₦)" error={errors.price?.message}>
              <input
                inputMode="decimal"
                placeholder="2500"
                {...register("price", {
                  validate: (v) =>
                    (/^\d+(\.\d{1,2})?$/.test(v.trim()) && Number(v) > 0) ||
                    "A price above zero, e.g. 2500",
                })}
                className={INPUT}
              />
            </Field>
          </div>
          <div className="w-40">
            <Field label="Price is per">
              <select {...register("unit")} className={INPUT}>
                <option value="">No unit</option>
                {PRODUCT_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <Field
          label="Description"
          hint="Optional"
          error={errors.description?.message}
        >
          <textarea
            rows={3}
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Keep it under 500 characters",
              },
            })}
            className={TEXTAREA}
          />
        </Field>

        <div className="flex flex-col gap-2 font-dm text-sm text-gray-800">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...register("isAvailable")} />
            <span>
              <b>Available</b> — buyers can order it now
            </span>
          </label>
        </div>

        <section className="flex flex-col gap-2 font-dm">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-sm font-bold text-gray-900">
              Extras on this dish
            </h4>
            {otherExtras.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setExtraIds(
                    extraIds.length === otherExtras.length
                      ? []
                      : otherExtras.map((e) => e.id),
                  )
                }
                className="text-xs font-bold text-recommend-green"
              >
                {extraIds.length === otherExtras.length
                  ? "Clear all"
                  : "Select all"}
              </button>
            )}
          </div>
          {otherExtras.length === 0 ? (
            <p className="text-xs text-gray-500">
              This vendor has no extras yet. Add them with &ldquo;Add an
              extra&rdquo;.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {otherExtras.map((extra) => (
                <label
                  key={extra.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={extraIds.includes(extra.id)}
                    onChange={(e) =>
                      setExtraIds(
                        e.target.checked
                          ? [...extraIds, extra.id]
                          : extraIds.filter((id) => id !== extra.id),
                      )
                    }
                  />
                  <span className="min-w-0 flex-1 truncate">{extra.name}</span>
                  <span className="text-xs text-gray-500">
                    ₦{Number(extra.price).toLocaleString("en-NG")}
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <ChoicesEditor
          choices={choices}
          onChange={setChoices}
          problems={showProblems ? problems : {}}
        />

        <FormError
          message={
            nothing
              ? "Nothing has changed."
              : failure && !failure.fieldErrors?.length
                ? failure.message
                : null
          }
        />
        <FormActions
          onCancel={onClose}
          saving={saving}
          label={product ? "Save" : "Add product"}
        />
      </form>
    </Modal>
  );
}
