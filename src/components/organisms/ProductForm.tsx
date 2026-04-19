"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft, Upload, X } from "lucide-react";
import { uploadFile } from "@/services";
import type { CreateProductPayload, Product } from "@/types";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
}

interface ProductFormProps {
  mode: "create" | "edit";
  initial?: Product;
  onSubmit: (payload: CreateProductPayload) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}

export default function ProductForm({
  mode,
  initial,
  onSubmit,
  isSubmitting,
  submitError,
}: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      price: initial ? String(initial.price) : "",
      imageUrl: initial?.imageUrl ?? "",
      isAvailable: initial?.isAvailable ?? true,
    },
  });

  const imageUrl = watch("imageUrl");

  const pickFile = () => fileRef.current?.click();

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be 10 MB or smaller.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const uploaded = await uploadFile(file, "products");
      setValue("imageUrl", uploaded.secureUrl, { shouldDirty: true });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => setValue("imageUrl", "", { shouldDirty: true });

  const submit = async (values: ProductFormValues) => {
    const price = Number(values.price);
    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      price,
      imageUrl: values.imageUrl || undefined,
      isAvailable: values.isAvailable,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/vendor/dashboard/products"
        className="text-sm font-dm text-gray-500 flex items-center gap-1 w-fit hover:text-recommend-orange"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-dm text-gray-900">
          {mode === "create" ? "Add a new product" : "Edit product"}
        </h1>
        <p className="text-sm font-dm text-gray-500">
          {mode === "create"
            ? "Photos, clear name, and an honest price sell best."
            : "Update any of the fields below."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        <div className="lg:col-span-2 flex flex-col gap-4 rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6">
          <Field label="Product name" error={errors.name?.message}>
            <input
              placeholder="e.g. Fresh Vine Tomatoes (1kg)"
              {...register("name", {
                required: "Required",
                minLength: { value: 2, message: "Min 2 characters" },
                maxLength: { value: 100, message: "Max 100 characters" },
              })}
              className={inputStyles}
            />
          </Field>

          <Field
            label="Price (₦)"
            error={errors.price?.message}
            hint="Enter in Naira, no commas. Up to 2 decimals."
          >
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="1200"
              {...register("price", {
                required: "Required",
                validate: (v) => {
                  const n = Number(v);
                  if (!Number.isFinite(n) || n <= 0)
                    return "Price must be greater than 0";
                  return true;
                },
              })}
              className={inputStyles}
            />
          </Field>

          <Field
            label="Description"
            error={errors.description?.message}
            hint="Optional. Up to 500 characters."
          >
            <textarea
              rows={4}
              placeholder="Describe the product — size, freshness, origin, anything a buyer should know."
              {...register("description", {
                maxLength: { value: 500, message: "Max 500 characters" },
              })}
              className={`${inputStyles} resize-none`}
            />
          </Field>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("isAvailable")}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-recommend-green focus:ring-recommend-green"
            />
            <span className="flex flex-col">
              <span className="text-sm font-bold font-dm text-gray-800">
                Available for purchase
              </span>
              <span className="text-xs font-dm text-gray-500">
                Uncheck to keep the product listed but hide it from checkout
                temporarily.
              </span>
            </span>
          </label>

          {submitError && (
            <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
              {submitError}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-recommend-orange text-white px-5 py-2.5 text-sm font-bold font-dm hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving…"
                : mode === "create"
                  ? "Save product"
                  : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/vendor/dashboard/products")}
              className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold font-dm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-3">
            <span className="text-xs font-bold font-dm uppercase tracking-wide text-gray-500">
              Product image
            </span>
            <div
              className={`relative aspect-square w-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${
                imageUrl ? "border-[#FFD91D]" : "border-gray-200"
              }`}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Product"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <Upload size={22} />
                  <span className="text-xs font-dm">No image yet</span>
                </div>
              )}
              {imageUrl && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFilePicked}
              className="sr-only"
            />
            <button
              type="button"
              onClick={pickFile}
              disabled={uploading}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-bold font-dm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading
                ? "Uploading…"
                : imageUrl
                  ? "Replace image"
                  : "Upload image"}
            </button>

            {uploadError && (
              <p className="text-xs font-dm text-red-600">{uploadError}</p>
            )}
            <p className="text-xs font-dm text-gray-400">
              JPEG, PNG, or WEBP up to 10 MB. Square photos look best.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
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
