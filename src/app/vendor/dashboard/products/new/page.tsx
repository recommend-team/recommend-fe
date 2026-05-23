"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/organisms/ProductForm";
import { useCreateProduct, useCurrentUser } from "@/hooks";
import type { CreateProductPayload } from "@/types";

export default function NewProductPage() {
  const router = useRouter();
  const create = useCreateProduct();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && user && user.status !== "APPROVED") {
      router.replace("/vendor/dashboard/kyc");
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (payload: CreateProductPayload) => {
    setSubmitError(null);
    try {
      await create.mutateAsync(payload);
      router.push("/vendor/dashboard/products");
    } catch (err) {
      setSubmitError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Could not create product."
      );
    }
  };

  return (
    <ProductForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={create.isPending}
      submitError={submitError}
    />
  );
}
