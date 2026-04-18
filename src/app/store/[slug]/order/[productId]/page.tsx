"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useStorefront } from "@/hooks/useStore";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";

interface OrderFormValues {
  quantity: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  fulfillmentType: "PICKUP" | "DELIVERY";
  deliveryAddress: string;
  notes: string;
}

function formatPrice(price: number): string {
  return `\u20A6${Number(price).toLocaleString("en-NG")}`;
}

export default function OrderPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const searchParams = useSearchParams();
  const { data, isLoading } = useStorefront(slug);
  const createOrder = useCreateOrder();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const prefillName = searchParams.get("name") ?? "";
  const prefillPhone = searchParams.get("phone") ?? "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormValues>({
    defaultValues: {
      quantity: 1,
      buyerName: prefillName,
      buyerPhone: prefillPhone,
      buyerEmail: "",
      fulfillmentType: "DELIVERY",
      deliveryAddress: "",
      notes: "",
    },
  });

  const fulfillmentType = watch("fulfillmentType");
  const quantity = watch("quantity");

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4 max-w-[480px] mx-auto">
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-6 bg-gray-200 rounded w-2/3" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const product = data?.products.find((p) => p.id === productId);
  const vendor = data?.vendor;

  if (!product || !vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-bold font-dm text-gray-800 mb-2">
          Product not found
        </p>
        <p className="text-sm text-gray-500 font-dm">
          This product may no longer be available.
        </p>
      </div>
    );
  }

  const unitPrice = Number(product.price);
  const total = unitPrice * (quantity || 1);

  const onSubmit = async (values: OrderFormValues) => {
    setSubmitError(null);

    try {
      const result = await createOrder.mutateAsync({
        productId,
        quantity: Number(values.quantity),
        buyerName: values.buyerName.trim(),
        buyerPhone: values.buyerPhone.startsWith("+")
          ? values.buyerPhone.trim()
          : `+234${values.buyerPhone.trim().replace(/^0/, "")}`,
        buyerEmail: values.buyerEmail.trim() || undefined,
        fulfillmentType: values.fulfillmentType,
        deliveryAddress:
          values.fulfillmentType === "DELIVERY"
            ? values.deliveryAddress.trim()
            : undefined,
        notes: values.notes.trim() || undefined,
      });

      // Redirect to Paystack checkout
      window.location.href = result.authorizationUrl;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto pb-28">
      {/* Product summary */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                🍽️
              </div>
            )}
          </div>
          <div>
            <p className="text-base font-bold font-dm text-gray-900">
              {product.name}
            </p>
            <p className="text-sm font-dm text-gray-500">
              {vendor.businessName}
            </p>
            <p className="text-sm font-bold font-dm text-[#006837]">
              {formatPrice(unitPrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Order form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        {/* Quantity */}
        <div>
          <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Minimum quantity is 1" },
            })}
            className="w-full h-12 px-3 rounded-lg border border-gray-200 font-dm text-sm focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
          />
          {errors.quantity && (
            <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>
          )}
        </div>

        {/* Buyer name */}
        <div>
          <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
            Your Name
          </label>
          <input
            type="text"
            placeholder="e.g. James Okafor"
            {...register("buyerName", {
              required: "Name is required",
              minLength: { value: 2, message: "Name is too short" },
            })}
            className="w-full h-12 px-3 rounded-lg border border-gray-200 font-dm text-sm focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
          />
          {errors.buyerName && (
            <p className="text-xs text-red-500 mt-1">{errors.buyerName.message}</p>
          )}
        </div>

        {/* Buyer phone */}
        <div>
          <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g. 08012345678"
            {...register("buyerPhone", {
              required: "Phone number is required",
              pattern: {
                value: /^(\+234|0)?[789]\d{9}$/,
                message: "Enter a valid Nigerian phone number",
              },
            })}
            className="w-full h-12 px-3 rounded-lg border border-gray-200 font-dm text-sm focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
          />
          {errors.buyerPhone && (
            <p className="text-xs text-red-500 mt-1">{errors.buyerPhone.message}</p>
          )}
        </div>

        {/* Buyer email (optional) */}
        <div>
          <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
            Email <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="email"
            placeholder="e.g. james@email.com"
            {...register("buyerEmail", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            className="w-full h-12 px-3 rounded-lg border border-gray-200 font-dm text-sm focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
          />
          {errors.buyerEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.buyerEmail.message}</p>
          )}
        </div>

        {/* Fulfillment type */}
        <div>
          <label className="text-sm font-bold font-dm text-gray-700 block mb-2">
            How do you want to receive your order?
          </label>
          <div className="flex gap-3">
            <label
              className={`flex-1 flex items-center justify-center h-12 rounded-lg border-2 cursor-pointer font-dm text-sm font-bold transition-all ${
                fulfillmentType === "DELIVERY"
                  ? "border-[#006837] bg-green-50 text-[#006837]"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              <input
                type="radio"
                value="DELIVERY"
                {...register("fulfillmentType")}
                className="sr-only"
              />
              Delivery
            </label>
            <label
              className={`flex-1 flex items-center justify-center h-12 rounded-lg border-2 cursor-pointer font-dm text-sm font-bold transition-all ${
                fulfillmentType === "PICKUP"
                  ? "border-[#006837] bg-green-50 text-[#006837]"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              <input
                type="radio"
                value="PICKUP"
                {...register("fulfillmentType")}
                className="sr-only"
              />
              Pickup
            </label>
          </div>
        </div>

        {/* Delivery address (conditional) */}
        {fulfillmentType === "DELIVERY" && (
          <div>
            <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
              Delivery Address
            </label>
            <input
              type="text"
              placeholder="e.g. No 2 Shasha, Ikeja"
              {...register("deliveryAddress", {
                validate: (value) =>
                  fulfillmentType !== "DELIVERY" ||
                  (value && value.trim().length >= 5) ||
                  "Delivery address is required (min 5 characters)",
              })}
              className="w-full h-12 px-3 rounded-lg border border-gray-200 font-dm text-sm focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
            />
            {errors.deliveryAddress && (
              <p className="text-xs text-red-500 mt-1">
                {errors.deliveryAddress.message}
              </p>
            )}
          </div>
        )}

        {/* Notes (optional) */}
        <div>
          <label className="text-sm font-bold font-dm text-gray-700 block mb-1">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Any special instructions..."
            maxLength={500}
            {...register("notes", {
              maxLength: { value: 500, message: "Max 500 characters" },
            })}
            className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 font-dm text-sm resize-none focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
          />
        </div>

        {/* Error message */}
        {submitError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 font-dm">{submitError}</p>
          </div>
        )}
      </form>

      {/* Sticky pay button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[480px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-dm text-gray-500">
            {quantity || 1}x {product.name}
          </span>
          <span className="text-base font-bold font-dm text-gray-900">
            {formatPrice(total)}
          </span>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={createOrder.isPending}
          className="w-full h-12 rounded-lg bg-[#006837] text-white font-dm font-bold text-sm transition-all hover:bg-[#007a41] active:bg-[#00552a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createOrder.isPending ? "Processing..." : `Pay ${formatPrice(total)}`}
        </button>
      </div>
    </div>
  );
}
