"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Lock } from "lucide-react";
import { useCheckout, useStorefront, queryKeys } from "@/hooks";
import { ApiError } from "@/lib/api";
import {
  formatNaira,
  toCheckoutLine,
  useStorefrontCart,
  type CartLine,
} from "@/lib/storefront-cart";
import { CartLineRow } from "@/components/storefront/CartLineRow";
import { ItemSheet } from "@/components/storefront/ItemSheet";
import { AddressPicker } from "@/components/storefront/AddressPicker";
import { rememberOrder } from "@/lib/last-order";
import { SUPPORT_PHONE, SUPPORT_PHONE_HREF } from "@/lib/support";
import type {
  CartChange,
  FulfillmentType,
  PickedPlace,
  Product,
} from "@/types";

interface CheckoutForm {
  fulfillmentType: FulfillmentType;
  areaId: string;
  deliveryAddress: string;
  /** With a picked address: the house or flat number, a landmark. */
  addressDetails: string;
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

/** What changed, in a sentence. */
function describeChange(change: CartChange): string {
  const name = change.productName ?? "An item";
  switch (change.reason) {
    case "REMOVED":
      return `${name} is no longer on the menu`;
    case "UNAVAILABLE":
      return `${name} is no longer available`;
    case "VENDOR_CLOSED":
      return `${name} can't be ordered — the store has just closed`;
    case "PRICE_CHANGED":
      return change.currentUnitPrice !== undefined
        ? `${name} has a new price (now ${formatNaira(change.currentUnitPrice)})`
        : `${name} has a new price`;
    case "ADDON_WITHOUT_MAIN":
      return `${name} needs a meal from the menu to go with it`;
    case "EXTRA_NOT_OFFERED":
      return `${name} no longer comes with ${change.dishName ?? "that dish"}, so it's been taken out`;
    case "CHOICES_NEEDED":
      return `${name} needs you to pick ${(change.groupName ?? "an option").toLowerCase()}`;
    case "CHOICE_UNAVAILABLE":
      return change.optionName
        ? `${change.optionName} is no longer available for ${name} — pick again`
        : `One of the options on ${name} has changed — pick again`;
  }
}

/** Changes that mean the item itself can't be bought: it comes out of the cart. */
const GONE: CartChange["reason"][] = [
  "REMOVED",
  "UNAVAILABLE",
  "VENDOR_CLOSED",
  "ADDON_WITHOUT_MAIN",
];

export default function StoreCheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useStorefront(slug);
  const cart = useStorefrontCart(slug, data?.products);
  const checkout = useCheckout();
  const queryClient = useQueryClient();
  const [problem, setProblem] = useState<string | null>(null);
  const [changes, setChanges] = useState<CartChange[]>([]);
  const [editing, setEditing] = useState<{
    product: Product;
    line: CartLine;
  } | null>(null);
  const closeSheet = useCallback(() => setEditing(null), []);
  // The address is picked from Google; typed only when it can't be found, or Google
  // can't be reached.
  const [picked, setPicked] = useState<PickedPlace | null>(null);
  const [typing, setTyping] = useState(false);
  const [searchDown, setSearchDown] = useState(false);
  const [addressProblem, setAddressProblem] = useState<string | null>(null);
  const searchUnavailable = useCallback(() => {
    setSearchDown(true);
    setTyping(true);
  }, []);

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
      addressDetails: "",
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      notes: "",
    },
  });
  const fulfillmentType = useWatch({ control, name: "fulfillmentType" });
  const typedEmail = useWatch({ control, name: "buyerEmail" });

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
        <p className="text-sm text-gray-500">
          This vendor may no longer be available.
        </p>
      </div>
    );
  }

  const { vendor } = data;
  const { priced } = cart;
  const delivery = fulfillmentType === "DELIVERY";
  const deliveryFee = delivery ? (data.deliveryFee ?? 0) : 0;
  const total = priced.goodsTotal + deliveryFee;
  const storeName = vendor.businessName ?? "this store";
  const served = new Set(vendor.serviceAreas.map((area) => area.id));
  const pickedArea = picked?.place.areaId ?? null;
  // Picked somewhere this vendor doesn't deliver — said before paying, not after.
  const outsideAreas = !!picked && !!pickedArea && !served.has(pickedArea);
  // An area to choose: typing, or a pick we couldn't place in one of ours.
  const chooseArea = typing || (!!picked && !pickedArea);

  if (priced.count === 0) {
    return (
      <div className="min-h-screen max-w-[480px] mx-auto flex flex-col items-center justify-center p-6 text-center font-dm">
        <p className="text-lg font-bold text-gray-800 mb-2">
          Your cart is empty
        </p>
        <Link
          href={`/store/${slug}`}
          className="mt-2 rounded-full bg-recommend-orange px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to {storeName}
        </Link>
      </div>
    );
  }

  const onSubmit = async (values: CheckoutForm) => {
    setProblem(null);
    setChanges([]);

    if (delivery && !typing) {
      if (!picked) {
        setAddressProblem(
          "Choose your address from the list — or type it instead.",
        );
        return;
      }
      if (outsideAreas) {
        setAddressProblem(
          `${storeName} doesn't deliver to ${picked.place.areaName} yet.`,
        );
        return;
      }
    }
    const usePick = delivery && !typing && !!picked;

    try {
      const placed = await checkout.mutateAsync({
        items: priced.items.map(toCheckoutLine),
        buyerName: values.buyerName.trim(),
        buyerPhone: toE164(values.buyerPhone),
        buyerEmail: values.buyerEmail.trim().toLowerCase(),
        fulfillmentType: values.fulfillmentType,
        deliveryAddress:
          delivery && !usePick ? values.deliveryAddress.trim() : undefined,
        deliveryPlace: usePick
          ? {
              token: picked.token,
              details: values.addressDetails.trim() || undefined,
            }
          : undefined,
        areaId: delivery
          ? (usePick ? (pickedArea ?? values.areaId) : values.areaId) ||
            undefined
          : undefined,
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
        // menu before they are asked to pay again — a pack whose choices changed then
        // asks to be picked again, and an extra no longer offered drops out of it.
        setChanges(raw.changes);
        cart.remove(
          raw.changes
            .filter((change) => GONE.includes(change.reason))
            .map((change) => change.productId),
        );
        await queryClient.invalidateQueries({
          queryKey: queryKeys.storefront(slug),
        });
        return;
      }

      setProblem(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
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
          <ul className="flex flex-col gap-3.5 rounded-xl border border-gray-100 px-3 py-3 text-[#15171C]">
            {priced.items.map((item) => (
              <CartLineRow
                key={item.key}
                item={item}
                onEdit={() =>
                  setEditing({ product: item.product, line: item.line })
                }
                onChange={(next) =>
                  item.isPack
                    ? cart.setPacks(item.key, next)
                    : cart.setQuantity(item.product.id, next)
                }
              />
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
          <div
            role="alert"
            className="mx-4 mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"
          >
            <p className="font-bold">
              Your order changed — please check it and pay again.
            </p>
            <ul className="mt-1 list-disc pl-5">
              {changes.map((change, index) => (
                <li key={`${change.productId}-${change.reason}-${index}`}>
                  {describeChange(change)}
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
                      ? "border-recommend-orange bg-recommend-orange/5 text-[#C2410C]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    value={option}
                    {...register("fulfillmentType")}
                    className="sr-only"
                  />
                  {option === "DELIVERY" ? "Delivery" : "Pickup"}
                </label>
              ))}
            </div>
          )}

          {delivery && !typing && (
            <>
              <Field
                label="Delivery address"
                error={addressProblem ?? undefined}
              >
                <AddressPicker
                  picked={picked}
                  onPick={(next) => {
                    setPicked(next);
                    setAddressProblem(null);
                  }}
                  onClear={() => setPicked(null)}
                  onUnavailable={searchUnavailable}
                  // Lean towards the one area a single-area vendor serves.
                  areaId={
                    vendor.serviceAreas.length === 1
                      ? vendor.serviceAreas[0].id
                      : undefined
                  }
                  invalid={!!addressProblem}
                />
                {picked && pickedArea && !outsideAreas && (
                  <p className="mt-1 text-xs font-bold text-green-700">
                    ✓ {storeName} delivers to {picked.place.areaName}.
                  </p>
                )}
                {outsideAreas && (
                  <p className="mt-1 text-xs text-red-600">
                    {storeName} doesn&apos;t deliver to {picked?.place.areaName}{" "}
                    — only to{" "}
                    {vendor.serviceAreas.map((area) => area.name).join(", ")}.
                  </p>
                )}
                {!picked && (
                  <button
                    type="button"
                    onClick={() => setTyping(true)}
                    className="mt-1.5 text-xs font-bold text-[#C2410C] hover:underline"
                  >
                    Can&apos;t find it? Type it instead
                  </button>
                )}
              </Field>

              {picked && (
                <Field
                  label="House or flat number, landmark"
                  error={errors.addressDetails?.message}
                >
                  <input
                    placeholder="e.g. House 12, the blue gate opposite the church"
                    {...register("addressDetails", {
                      validate: (value) =>
                        !delivery ||
                        typing ||
                        !picked ||
                        value.trim().length >= 2 ||
                        "Add your house or flat number, or a landmark, so the rider finds you",
                    })}
                    className={inputClass(!!errors.addressDetails)}
                  />
                </Field>
              )}
            </>
          )}

          {delivery && typing && searchDown && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Address search isn&apos;t available right now — type your address
              below.
            </p>
          )}

          {delivery && chooseArea && (
            <>
              <Field label="Area" error={errors.areaId?.message}>
                <select
                  {...register("areaId", {
                    validate: (value) =>
                      !delivery ||
                      !chooseArea ||
                      !!value ||
                      "Choose the area we're delivering to",
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
                  {typing
                    ? `${storeName} delivers to these areas only.`
                    : "We couldn't tell which area this is in — choose it."}
                </p>
              </Field>
            </>
          )}

          {delivery && typing && (
            <Field
              label="Delivery address"
              error={errors.deliveryAddress?.message}
            >
              <textarea
                rows={2}
                placeholder="House number, street, landmark"
                {...register("deliveryAddress", {
                  validate: (value) =>
                    !delivery ||
                    !typing ||
                    value.trim().length >= 5 ||
                    "Enter the full address — at least a house number and street",
                })}
                className={inputClass(!!errors.deliveryAddress)}
              />
              {!searchDown && (
                <button
                  type="button"
                  onClick={() => setTyping(false)}
                  className="mt-1.5 text-xs font-bold text-[#C2410C] hover:underline"
                >
                  Search for it instead
                </button>
              )}
            </Field>
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
            <p className="mt-1 text-xs text-gray-500">
              Your receipt and delivery code come here.{" "}
              <b className="text-gray-700">Use one you can open</b> — it&apos;s
              also how you sign in to follow your order.
            </p>
          </Field>

          <Field
            label="Note for the vendor (optional)"
            error={errors.notes?.message}
          >
            <input
              placeholder="e.g. Extra pepper, no onions"
              {...register("notes", {
                maxLength: {
                  value: 500,
                  message: "Keep it under 500 characters",
                },
              })}
              className={inputClass(!!errors.notes)}
            />
          </Field>
        </section>

        <AfterYouPay
          email={typedEmail?.trim() || null}
          delivery={fulfillmentType === "DELIVERY"}
        />

        {problem && (
          <p
            role="alert"
            className="mx-4 mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {problem}
          </p>
        )}

        {/* Pay */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white px-4 pb-4 pt-3">
          <div className="max-w-[448px] mx-auto">
            {!vendor.isOpen ? (
              <p className="mb-2 text-center text-xs text-red-600">
                {storeName} is closed right now — you can pay once they open.
              </p>
            ) : (
              priced.problem && (
                <p className="mb-2 text-center text-xs font-medium text-[#9A3412]">
                  {priced.problem.product.name}: {priced.problem.problem}
                </p>
              )
            )}
            <button
              type="submit"
              disabled={
                checkout.isPending || !vendor.isOpen || !!priced.problem
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-recommend-orange py-3.5 text-base font-bold text-white hover:bg-[#D84A15] disabled:bg-gray-300"
            >
              <Lock size={16} aria-hidden />
              {checkout.isPending
                ? "Starting payment…"
                : `Pay ${formatNaira(total)}`}
            </button>
            <p className="mt-1.5 text-center text-[11px] text-gray-400">
              Paid securely with Paystack
            </p>
          </div>
        </div>
      </form>

      {editing && (
        <ItemSheet
          product={editing.product}
          products={data.products}
          storeName={storeName}
          inCart={cart.quantityOf(editing.product.id)}
          editing={editing.line}
          locked={null}
          etaText=""
          onSave={(quantity) => cart.setQuantity(editing.product.id, quantity)}
          onSavePack={(draft) => cart.replacePack(editing.line.key, draft)}
          onRemove={() => cart.removeLine(editing.line.key)}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}

/**
 * The last thing read before paying: what happens next, and how to follow the order —
 * the Recommend chat, signed in with the email they paid with, where the order is already
 * waiting. No link from here: leaving checkout half-way helps nobody. The order page they
 * return to has the button.
 */
function AfterYouPay({
  email,
  delivery,
}: {
  email: string | null;
  delivery: boolean;
}) {
  const steps: React.ReactNode[] = [
    <>
      Pay securely with Paystack. You&apos;ll come back here to see your order
      confirmed.
    </>,
    <>
      We email your receipt to{" "}
      {email ? (
        <b className="text-gray-900 [overflow-wrap:anywhere]">{email}</b>
      ) : (
        "your email"
      )}
      {delivery ? ", and your delivery code when the rider leaves." : "."}
    </>,
    <>
      <b className="text-gray-900">Follow your order on Recommend.</b> Open the
      Recommend chat and sign in with this same email — your order will already
      be there, with every update, and you can message us about it.
    </>,
  ];

  return (
    <section
      aria-labelledby="after-you-pay"
      className="mx-4 mt-6 rounded-2xl border border-[#F2E2B8] bg-[#FAF6E1] p-4"
    >
      <h2 id="after-you-pay" className="text-sm font-bold text-gray-900">
        What happens after you pay
      </h2>
      <ol className="mt-3 space-y-3">
        {steps.map((step, index) => (
          <li
            key={index}
            className="flex gap-3 text-sm leading-snug text-gray-700"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-recommend-orange text-xs font-bold text-white">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 border-t border-[#EADFB8] pt-3 text-sm text-gray-700">
        Prefer to call?{" "}
        <a
          href={SUPPORT_PHONE_HREF}
          className="font-bold whitespace-nowrap text-[#C2410C] hover:underline"
        >
          {SUPPORT_PHONE}
        </a>
      </p>
    </section>
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
      <span className="mb-1 block text-sm font-bold text-gray-700">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}

function inputClass(invalid: boolean): string {
  return `w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-recommend-orange ${
    invalid ? "border-red-400" : "border-gray-200"
  }`;
}
