"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/atoms/admin/Modal";
import { useAddVendorProduct, useUpdateVendorProduct } from "@/hooks";
import type { AdminProductPayload, Product } from "@/types";
import ImageUploader from "./ImageUploader";
import { Field, FormActions, FormError, INPUT, changed } from "./form";

interface Values {
  name: string;
  price: string;
  isAvailable: boolean;
}

/**
 * Add an extra for a vendor, or change one — Beef, Takeaway pack, Water — on its own
 * form, as in the vendor app: a name, a price, a photo, in stock, and the products it
 * goes with. A new extra starts on every product.
 */
export default function ExtraDialog({
  vendorId,
  extra,
  products,
  onClose,
}: {
  vendorId: string;
  /** Absent to add a new extra. */
  extra?: Product;
  /** The vendor's products (not extras), to put it on. */
  products: Product[];
  onClose: () => void;
}) {
  const add = useAddVendorProduct(vendorId);
  const edit = useUpdateVendorProduct(vendorId);
  const saving = add.isPending || edit.isPending;
  const failure = add.error ?? edit.error;
  const [photo, setPhoto] = useState<string | null>(extra?.imageUrl ?? null);
  const [nothing, setNothing] = useState(false);
  const [goesWith, setGoesWith] = useState<string[]>(
    extra ? (extra.dishIds ?? []) : products.map((p) => p.id),
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      name: extra?.name ?? "",
      price: extra ? String(Number(extra.price)) : "",
      isAvailable: extra?.isAvailable ?? true,
    },
  });

  // In the menu's order, so the same ticks always compare equal.
  const ordered = (ids: string[]) =>
    products.map((p) => p.id).filter((id) => ids.includes(id));
  const all = products.length > 0 && goesWith.length === products.length;

  const onSubmit = (values: Values) => {
    const after: AdminProductPayload = {
      name: values.name.trim(),
      price: Math.round(Number(values.price) * 100) / 100,
      isAvailable: values.isAvailable,
      isAddOn: true,
      dishIds: ordered(goesWith),
      ...(photo ? { imageUrl: photo } : {}),
    };
    const onError = (error: {
      fieldErrors?: { field: string; message: string }[];
    }) => {
      for (const { field, message } of error.fieldErrors ?? []) {
        if (field in values) setError(field as keyof Values, { message });
      }
    };

    if (!extra) {
      add.mutate(after, { onSuccess: onClose, onError });
      return;
    }

    const payload = changed(
      {
        name: extra.name,
        price: Number(extra.price),
        isAvailable: extra.isAvailable,
        isAddOn: true,
        dishIds: ordered(extra.dishIds ?? []),
        imageUrl: extra.imageUrl,
      },
      after as unknown as Record<string, unknown>,
    );
    if (Object.keys(payload).length === 0) {
      setNothing(true);
      return;
    }
    edit.mutate(
      { productId: extra.id, payload },
      { onSuccess: onClose, onError },
    );
  };

  return (
    <Modal
      title={extra ? "Edit extra" : "Add an extra"}
      description="Something buyers add to a product they order — never sold on its own. The vendor is told what you changed."
      onClose={onClose}
      width="max-w-lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <Field label="Extra name" error={errors.name?.message}>
          <input
            autoFocus
            placeholder="e.g. Beef, Takeaway pack"
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

        <Field label="Price (₦)" error={errors.price?.message}>
          <input
            inputMode="decimal"
            placeholder="200"
            {...register("price", {
              validate: (v) =>
                (/^\d+(\.\d{1,2})?$/.test(v.trim()) && Number(v) > 0) ||
                "A price above zero, e.g. 200",
            })}
            className={INPUT}
          />
        </Field>

        <section className="flex flex-col gap-2 font-dm">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-sm font-bold text-gray-900">Goes with</h4>
            {products.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setGoesWith(all ? [] : products.map((p) => p.id))
                }
                className="text-xs font-bold text-recommend-green"
              >
                {all ? "Clear all" : "Select all"}
              </button>
            )}
          </div>
          {products.length === 0 ? (
            <p className="text-xs text-gray-500">
              This vendor has no products yet. Add one, and this extra can go
              with it.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {products.map((product) => (
                <label
                  key={product.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={goesWith.includes(product.id)}
                    onChange={(e) =>
                      setGoesWith(
                        e.target.checked
                          ? [...goesWith, product.id]
                          : goesWith.filter((id) => id !== product.id),
                      )
                    }
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {product.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <ImageUploader
          label="Photo (optional)"
          value={photo}
          onChange={setPhoto}
          folder="products"
          removable={!extra?.imageUrl}
        />

        <label className="flex cursor-pointer items-center gap-2 font-dm text-sm text-gray-800">
          <input type="checkbox" {...register("isAvailable")} />
          <span>
            <b>In stock</b> — buyers can add it now
          </span>
        </label>

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
          label={extra ? "Save" : "Add extra"}
        />
      </form>
    </Modal>
  );
}
