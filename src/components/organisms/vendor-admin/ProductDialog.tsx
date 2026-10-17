"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/atoms/admin/Modal";
import { useAddVendorProduct, useUpdateVendorProduct } from "@/hooks";
import type { AdminProductPayload, Product } from "@/types";
import ImageUploader from "./ImageUploader";
import { Field, FormActions, FormError, INPUT, TEXTAREA, changed } from "./form";

interface Values {
  name: string;
  description: string;
  price: string;
  isAvailable: boolean;
  isAddOn: boolean;
}

/**
 * Add a product for a vendor, or change one — the same fields and rules as the vendor
 * app (name, price, photo, description, available, extra; 20 products at most).
 */
export default function ProductDialog({
  vendorId,
  product,
  onClose,
}: {
  vendorId: string;
  /** Absent to add a new product. */
  product?: Product;
  onClose: () => void;
}) {
  const add = useAddVendorProduct(vendorId);
  const edit = useUpdateVendorProduct(vendorId);
  const saving = add.isPending || edit.isPending;
  const failure = add.error ?? edit.error;
  const [photo, setPhoto] = useState<string | null>(product?.imageUrl ?? null);
  const [nothing, setNothing] = useState(false);

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
      isAddOn: product?.isAddOn ?? false,
    },
  });

  const onSubmit = (values: Values) => {
    const after: AdminProductPayload = {
      name: values.name.trim(),
      description: values.description.trim(),
      price: Math.round(Number(values.price) * 100) / 100,
      isAvailable: values.isAvailable,
      isAddOn: values.isAddOn,
      ...(photo ? { imageUrl: photo } : {}),
    };
    const onError = (error: { fieldErrors?: { field: string; message: string }[] }) => {
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
      },
      after as unknown as Record<string, unknown>
    );
    if (Object.keys(payload).length === 0) {
      setNothing(true);
      return;
    }
    edit.mutate({ productId: product.id, payload }, { onSuccess: onClose, onError });
  };

  return (
    <Modal
      title={product ? "Edit product" : "Add a product"}
      description="The vendor is told what you changed."
      onClose={onClose}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
              maxLength: { value: 100, message: "Keep it under 100 characters" },
            })}
            className={INPUT}
          />
        </Field>

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

        <Field label="Description" hint="Optional" error={errors.description?.message}>
          <textarea
            rows={3}
            {...register("description", {
              maxLength: { value: 500, message: "Keep it under 500 characters" },
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
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...register("isAddOn")} />
            <span>
              <b>Extra</b> — only sold with a meal from this vendor (e.g. extra plantain)
            </span>
          </label>
        </div>

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
