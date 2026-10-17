"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Lock, Minus, Plus, Trash2 } from "lucide-react";
import { useCheckout, useStorefront, queryKeys } from "@/hooks";
import { ApiError } from "@/lib/api";
import { formatNaira, useStorefrontCart } from "@/lib/storefront-cart";
import { rememberOrder } from "@/lib/last-order";
import type { CartChange, FulfillmentType } from "@/types";

interface CheckoutForm {
  fulfillmentType: FulfillmentType;
  areaId: string;
  deliveryAddress: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  notes: string;
}

/** "08012345678", "8012345678" or "+2348012345678" → "+2348012345678". */
function toE164(phone: string): string {
  const digits = phone.trim().replace(/[\s-]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("234")) return `+${digits}`;
  return `+234${digits.replace(/^0/, "")}`;
}

const CHANGE_WORDING: Record<CartChange["reason"], string> = {
  REMOVED: "is no longer on the menu",
  UNAVAILABLE: "is no longer available",
  VENDOR_CLOSED: "can't be ordered — the store has just closed",
  PRICE_CHANGED: "has a new price",
  ADDON_WITHOUT_MAIN: "needs a meal from the menu to go with it",
};

export default function StoreCheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useStorefront(slug);
  const cart = useStorefrontCart(slug, data?.products);
  const checkout = useCheckout();
  const queryClient = useQueryClient();
  const [problem, setProblem] = useState<string | null>(null);
  const [changes, setChanges] = useState<CartChange[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      fulfillmentType: "DELIVERY",
      areaId: "",
      deliveryAddress: "",
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      notes: "",
    },
  });
  const fulfillmentType = useWatch({ control, name: "fulfillmentType" });

  if (isLoading || !cart.loaded) {
    return (
      <div className="animate-pulse space-y-4 p-4 max-w-[480px] mx-auto">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-dm">
        <p className="text-lg font-bold text-gray-800 mb-2">Store not found</p>
        <p className="text-sm text-gray-500">This vendor may no longer be available.</p>
      </div>
    );
  }

  const { vendor } = data;
  const { priced } = cart;
  const delivery = fulfillmentType === "DELIVERY";
  const deliveryFee = delivery ? (data.deliveryFee ?? 0) : 0;
  const total = priced.goodsTotal + deliveryFee;
  const storeName = vendor.businessName ?? "this store";

  if (priced.count === 0) {
    return (
      <div className="min-h-screen max-w-[480px] mx-auto flex flex-col items-center justify-center p-6 text-center font-dm">
        <p className="text-lg font-bold text-gray-800 mb-2">Your cart is empty</p>
        <Link
          href={`/store/${slug}`}
          className="mt-2 rounded-full bg-[#006837] px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to {storeName}
        </Link>
      </div>
    );
  }

  const onSubmit = async (values: CheckoutForm) => {
    setProblem(null);
    setChanges([]);

    try {
      const placed = await checkout.mutateAsync({
        items: priced.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          expectedUnitPrice: Number(item.product.price),
        })),
        buyerName: values.buyerName.trim(),
        buyerPhone: toE164(values.buyerPhone),
        buyerEmail: values.buyerEmail.trim().toLowerCase(),
        fulfillmentType: values.fulfillmentType,
        deliveryAddress: delivery ? values.deliveryAddress.trim() : undefined,
        areaId: delivery ? values.areaId : undefined,
        notes: values.notes.trim() || undefined,
      });

      // Paystack brings them back to /order/<reference>; this lets that page offer the
      // way back here and open the chat with their email.
      rememberOrder({
        reference: placed.reference,
        slug,
        email: values.buyerEmail.trim().toLowerCase(),
      });
      window.location.assign(placed.authorizationUrl);
    } catch (error) {
      const raw = (error instanceof ApiError ? error.raw : null) as {
        code?: string;
        changes?: CartChange[];
      } | null;

      if (raw?.code === "CART_CHANGED" && raw.changes?.length) {
        // Show what changed, take out what can no longer be bought, and load today's
        // prices before they are asked to pay again.
        setChanges(raw.changes);
        cart.remove(
          raw.changes
            .filter((change) => change.reason !== "PRICE_CHANGED")
            .map((change) => change.productId)
        );
        await queryClient.invalidateQueries({
          queryKey: queryKeys.storefront(slug),
        });
        return;
      }

      setProblem(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto pb-32 font-dm">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <Link
          href={`/store/${slug}`}
          aria-label={`Back to ${storeName}`}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
          <p className="truncate text-xs text-gray-500">{storeName}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Order */}
        <section className="px-4 pt-4">
          <h2 className="text-sm font-bold text-gray-800 mb-2">Your order</h2>
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100">
            {priced.items.map((item) => (
              <li key={item.product.id} className="flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatNaira(item.product.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => cart.setQuantity(item.product.id, item.quantity - 1)}
                    aria-label={
                      item.quantity === 1
                        ? `Remove ${item.product.name}`
                        : `One fewer ${item.product.name}`
                    }
                    className="grid h-7 w-7 place-items-center rounded-full text-[#006837] hover:bg-[#006837]/10"
                  >
                    {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                  </button>
                  <span className="w-5 text-center text-sm font-bold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => cart.setQuantity(item.product.id, item.quantity + 1)}
                    aria-label={`One more ${item.product.name}`}
                    className="grid h-7 w-7 place-items-center rounded-full text-[#006837] hover:bg-[#006837]/10"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="w-20 text-right text-sm font-bold text-gray-900 tabular-nums">
                  {formatNaira(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <dt>Items</dt>
              <dd className="tabular-nums">{formatNaira(priced.goodsTotal)}</dd>
            </div>
            {delivery && (
              <div className="flex justify-between text-gray-600">
                <dt>Delivery</dt>
                <dd className="tabular-nums">{formatNaira(deliveryFee)}</dd>
              </div>
            )}
            <div className="flex justify-between pt-1 text-base font-bold text-gray-900">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatNaira(total)}</dd>
            </div>
          </dl>
        </section>

        {changes.length > 0 && (
          <div role="alert" className="mx-4 mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-bold">Your order changed — please check it and pay again.</p>
            <ul className="mt-1 list-disc pl-5">
              {changes.map((change) => (
                <li key={`${change.productId}-${change.reason}`}>
                  {change.productName ?? "An item"} {CHANGE_WORDING[change.reason]}
                  {change.reason === "PRICE_CHANGED" && change.currentUnitPrice !== undefined
                    ? ` (now ${formatNaira(change.currentUnitPrice)})`
                    : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delivery */}
        <section className="px-4 pt-6 space-y-3">
          <h2 className="text-sm font-bold text-gray-800">
            {delivery ? "Delivery" : "Collection"}
          </h2>

          {data.pickupEnabled && (
            <div className="flex gap-2">
              {(["DELIVERY", "PICKUP"] as const).map((option) => (
                <label
                  key={option}
                  className={`flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-bold ${
                    fulfillmentType === option
                      ? "border-[#006837] bg-[#006837]/5 text-[#006837]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <input type="radio" value={option} {...register("fulfillmentType")} className="sr-only" />
                  {option === "DELIVERY" ? "Delivery" : "Pickup"}
                </label>
              ))}
            </div>
          )}

          {delivery && (
            <>
              <Field label="Area" error={errors.areaId?.message}>
                <select
                  {...register("areaId", {
                    validate: (value) =>
                      !delivery || !!value || "Choose the area we're delivering to",
                  })}
                  className={inputClass(!!errors.areaId)}
                >
                  <option value="">Choose your area</option>
                  {vendor.serviceAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  {storeName} delivers to these areas only.
                </p>
              </Field>

              <Field label="Delivery address" error={errors.deliveryAddress?.message}>
                <textarea
                  rows={2}
                  placeholder="House number, street, landmark"
                  {...register("deliveryAddress", {
                    validate: (value) =>
                      !delivery ||
                      value.trim().length >= 5 ||
                      "Enter the full address — at least a house number and street",
                  })}
                  className={inputClass(!!errors.deliveryAddress)}
                />
              </Field>
            </>
          )}
        </section>

        {/* Buyer */}
        <section className="px-4 pt-6 space-y-3">
          <h2 className="text-sm font-bold text-gray-800">Your details</h2>

          <Field label="Name" error={errors.buyerName?.message}>
            <input
              autoComplete="name"
              {...register("buyerName", {
                required: "Enter your name",
                minLength: { value: 2, message: "Enter your name" },
              })}
              className={inputClass(!!errors.buyerName)}
            />
          </Field>

          <Field label="Phone number" error={errors.buyerPhone?.message}>
            <input
              type="tel"
              autoComplete="tel"
              placeholder="0801 234 5678"
              {...register("buyerPhone", {
                required: "Enter your phone number",
                validate: (value) =>
                  /^(\+?234|0)?[789]\d{9}$/.test(value.replace(/[\s-]/g, "")) ||
                  "Enter a Nigerian phone number, e.g. 0801 234 5678",
              })}
              className={inputClass(!!errors.buyerPhone)}
            />
            <p className="mt-1 text-xs text-gray-400">
              So the rider can reach you at the door.
            </p>
          </Field>

          <Field label="Email" error={errors.buyerEmail?.message}>
            <input
              type="email"
              autoComplete="email"
              {...register("buyerEmail", {
                required: "Enter your email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              className={inputClass(!!errors.buyerEmail)}
            />
            <p className="mt-1 text-xs text-gray-400">
              Your receipt and delivery code are sent here.
            </p>
          </Field>

          <Field label="Note for the vendor (optional)" error={errors.notes?.message}>
            <input
              placeholder="e.g. Extra pepper, no onions"
              {...register("notes", {
                maxLength: { value: 500, message: "Keep it under 500 characters" },
              })}
              className={inputClass(!!errors.notes)}
            />
          </Field>
        </section>

        {problem && (
          <p role="alert" className="mx-4 mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {problem}
          </p>
        )}

        {/* Pay */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white px-4 pb-4 pt-3">
          <div className="max-w-[448px] mx-auto">
            {!vendor.isOpen && (
              <p className="mb-2 text-center text-xs text-red-600">
                {storeName} is closed right now — you can pay once they open.
              </p>
            )}
            <button
              type="submit"
              disabled={checkout.isPending || !vendor.isOpen}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006837] py-3.5 text-base font-bold text-white hover:bg-[#00552d] disabled:bg-gray-300"
            >
              <Lock size={16} aria-hidden />
              {checkout.isPending ? "Starting payment…" : `Pay ${formatNaira(total)}`}
            </button>
            <p className="mt-1.5 text-center text-[11px] text-gray-400">
              Paid securely with Paystack
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function inputClass(invalid: boolean): string {
  return `w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#006837] ${
    invalid ? "border-red-400" : "border-gray-200"
  }`;
}
