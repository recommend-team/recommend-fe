"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/organisms/ProductForm";
import { useMyProducts, useUpdateProduct } from "@/hooks";
import type { CreateProductPayload } from "@/types";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const products = useMyProducts({ page: 1, limit: 100 });
  const update = useUpdateProduct();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const product = products.data?.items.find((p) => p.id === id);

  const handleSubmit = async (payload: CreateProductPayload) => {
    setSubmitError(null);
    try {
      await update.mutateAsync({ id, payload });
      router.push("/vendor/dashboard/products");
    } catch (err) {
      setSubmitError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Could not update product."
      );
    }
  };

  if (products.isLoading) {
    return <p className="text-sm font-dm text-gray-400">Loading…</p>;
  }
  if (!product) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
          Product not found. It may have been deleted.
        </p>
        <button
          onClick={() => router.push("/vendor/dashboard/products")}
          className="w-fit rounded-full bg-recommend-orange text-white px-4 py-2 text-sm font-bold font-dm hover:bg-orange-600"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      initial={product}
      onSubmit={handleSubmit}
      isSubmitting={update.isPending}
      submitError={submitError}
    />
  );
}
