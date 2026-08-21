"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";
import {
  useCatalogAreas,
  useCatalogCategories,
  useCatalogProducts,
  useCatalogStores,
  usePlaceConversationOrder,
  useSetConversationArea,
} from "@/hooks";
import { RemoteImage } from "@/components/atoms/RemoteImage";
import { ApiError } from "@/lib/api";
import type {
  CatalogProduct,
  CartChange,
  ConversationDetail,
  PlacedAdminOrder,
} from "@/types";

const naira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

/** Plain language for a basket the platform refused. */
const REASONS: Record<CartChange["reason"], string> = {
  REMOVED: "is no longer on the platform",
  UNAVAILABLE: "is not available right now",
  VENDOR_CLOSED: "is from a vendor that is closed",
  PRICE_CHANGED: "changed price while you were building this",
};

/**
 * The 409 body the platform sends when a basket no longer matches reality. It reaches us
 * through `ApiError.raw`, where the exception filter passes custom fields straight
 * through alongside the envelope.
 */
function cartChanges(error: unknown): CartChange[] | null {
  if (!(error instanceof ApiError)) return null;
  const raw = error.raw as { code?: string; changes?: CartChange[] } | undefined;
  if (raw?.code !== "CART_CHANGED") return null;
  return raw.changes ?? [];
}

interface Line {
  product: CatalogProduct;
  quantity: number;
}

/** Which shelf the admin is looking at. The basket survives all three. */
type Step = "area" | "stores" | "products";

/**
 * A product's picture, at the one size this panel uses.
 *
 * Through `RemoteImage` rather than `next/image`: these URLs come from vendors, and an
 * unrecognised host makes `next/image` throw hard enough to take the conversation page
 * down with it. A missing or broken picture should cost a grey square, nothing more.
 */
function Thumb({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <span
      className={`relative block h-9 w-9 shrink-0 overflow-hidden rounded-md bg-black/5 ${className}`}
    >
      {src && (
        <RemoteImage
          src={src}
          alt={alt}
          fill
          sizes="36px"
          className="object-cover"
        />
      )}
    </span>
  );
}

/**
 * Building an order for the buyer an admin is already talking to.
 *
 * Only ever a basket of real products at real prices — there is no amount field and no
 * discount, because the total is whatever the platform computes from the product rows.
 * That is the difference between placing an order for someone and being able to bill any
 * number to any phone.
 */
export default function OrderBuilder({
  conversation,
  onPlaced,
}: {
  conversation: ConversationDetail;
  onPlaced?: (placed: PlacedAdminOrder) => void;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [name, setName] = useState(conversation.buyerName ?? "");
  const [phone, setPhone] = useState(conversation.buyerPhone ?? "");
  const [fulfillment, setFulfillment] = useState<"PICKUP" | "DELIVERY">(
    "DELIVERY"
  );
  const [address, setAddress] = useState("");
  const [sendToBuyer, setSendToBuyer] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);
  const [rejected, setRejected] = useState<CartChange[] | null>(null);
  const [placed, setPlaced] = useState<PlacedAdminOrder | null>(null);
  const [copied, setCopied] = useState(false);

  const [step, setStep] = useState<Step>("stores");
  /** Set only when the admin overrides what the conversation already believes. */
  const [areaOverride, setAreaOverride] = useState<string | null>(null);
  const [store, setStore] = useState<{ id: string; name: string } | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const place = usePlaceConversationOrder();
  const saveArea = useSetConversationArea(conversation.id);

  const search = term.trim();

  const { data: areaContext } = useCatalogAreas(
    conversation.id,
    step === "area" ? search : "",
    open
  );

  // Derived, not synced: whatever the thread already believes, until the admin says
  // otherwise. Most of the time discovery has resolved it and nobody is asked at all.
  const areaId = areaOverride ?? areaContext?.areaId ?? null;

  const chosenArea =
    areaContext?.areas.find((option) => option.id === areaId) ??
    (areaId && areaId === areaContext?.areaId ? areaContext.area : null);

  const { data: categories } = useCatalogCategories(
    conversation.id,
    areaId,
    open && step === "stores"
  );

  const { data: stores, isFetching: loadingStores } = useCatalogStores(
    conversation.id,
    {
      areaId: areaId ?? undefined,
      category: category ?? undefined,
      search: step === "stores" ? search : "",
    },
    open && step === "stores"
  );

  const { data: products, isFetching: loadingProducts } = useCatalogProducts(
    conversation.id,
    {
      areaId: areaId ?? undefined,
      vendorId: store?.id,
      // Only when browsing the whole area — inside one store its own category is a
      // tautology, and would silently empty the shelf if the store were miscategorised.
      category: store ? undefined : category ?? undefined,
      search: step === "products" ? search : "",
    },
    open && step === "products"
  );

  const isFetching = loadingStores || loadingProducts;

  const goodsTotal = useMemo(
    () =>
      lines.reduce(
        (sum, line) => sum + Number(line.product.price) * line.quantity,
        0
      ),
    [lines]
  );

  const add = (product: CatalogProduct) => {
    setLines((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setTerm("");
  };

  const setQuantity = (productId: string, quantity: number) =>
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.product.id !== productId)
        : current.map((line) =>
            line.product.id === productId ? { ...line, quantity } : line
          )
    );

  const reset = () => {
    setLines([]);
    setTerm("");
    setFailure(null);
    setRejected(null);
    setPlaced(null);
    setCopied(false);
    setStep("stores");
    setStore(null);
    setCategory(null);
  };

  /** Moving between shelves clears the search, never the basket. */
  const goTo = (next: Step) => {
    setStep(next);
    setTerm("");
  };

  const chooseArea = async (id: string) => {
    setAreaOverride(id);
    setStore(null);
    // A category that made sense in Ikeja may not exist in Lekki at all.
    setCategory(null);
    goTo("stores");
    // Saved to the conversation, not just this screen — DiscoveryService reads the same
    // field, so the assistant stops asking where the buyer is.
    try {
      await saveArea.mutateAsync(id);
    } catch {
      // The picker still works on the admin's choice; only the memory is lost.
    }
  };

  const submit = async () => {
    setFailure(null);
    setRejected(null);

    try {
      const result = await place.mutateAsync({
        id: conversation.id,
        payload: {
          items: lines.map((line) => ({
            productId: line.product.id,
            quantity: line.quantity,
          })),
          buyerName: name.trim() || undefined,
          buyerPhone: phone.trim() || undefined,
          fulfillmentType: fulfillment,
          deliveryAddress:
            fulfillment === "DELIVERY" ? address.trim() || undefined : undefined,
          sendToBuyer,
        },
      });
      setPlaced(result);
      setLines([]);
      onPlaced?.(result);
    } catch (cause) {
      const changes = cartChanges(cause);
      if (changes) {
        setRejected(changes);
        return;
      }
      setFailure(
        cause instanceof ApiError ? cause.message : "That didn't work."
      );
    }
  };

  const copyLink = () => {
    if (!placed) return;
    navigator.clipboard
      .writeText(placed.authorizationUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-dashed border-black/15 py-2 font-dm text-xs font-semibold text-gray-600 hover:bg-black/5"
      >
        Order for this buyer
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-black/10 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-dm text-sm font-bold text-gray-900">
          Order for this buyer
        </p>
        <button
          onClick={() => {
            setOpen(false);
            reset();
          }}
          aria-label="Close"
          className="grid h-7 w-7 place-items-center rounded-md text-gray-400 hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {placed ? (
        <div className="flex flex-col gap-2">
          <p className="font-dm text-xs text-gray-600">
            Order <span className="font-bold">{placed.reference}</span> placed —{" "}
            {naira(placed.totalAmount)}.{" "}
            {placed.sent
              ? "The payment card is in the conversation."
              : "Send the buyer this link to pay."}
          </p>
          {/* Shown whether or not the card went — a card that failed to send leaves the
              admin with a real order and no way to collect it otherwise. */}
          <button
            onClick={copyLink}
            className="flex items-center justify-between gap-2 rounded-md border border-recommend-green/30 bg-recommend-green/10 px-3 py-2 text-left"
          >
            <span className="truncate font-dm text-xs text-recommend-green">
              {placed.authorizationUrl}
            </span>
            {copied ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-recommend-green" />
            ) : (
              <Copy className="h-3.5 w-3.5 shrink-0 text-recommend-green/60" />
            )}
          </button>
          <button
            onClick={reset}
            className="font-dm text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            Build another
          </button>
        </div>
      ) : (
        <>
          {/* Where the buyer is, and what shelf we are on. Everything below is filtered
              by the area — checkout does not validate service area, so an out-of-area
              store must never be reachable here in the first place. */}
          <div className="mb-2 flex items-center gap-2">
            {step !== "stores" && (
              <button
                onClick={() => goTo(step === "products" ? "stores" : "stores")}
                aria-label="Back"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-gray-400 hover:bg-black/5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => goTo("area")}
              className="flex min-w-0 items-center gap-1 rounded-md px-1.5 py-1 font-dm text-[11px] text-gray-500 hover:bg-black/5"
            >
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {chosenArea?.name ?? "Choose an area"}
              </span>
            </button>
            {store && step === "products" && (
              <span className="truncate font-dm text-[11px] font-semibold text-gray-700">
                · {store.name}
              </span>
            )}
          </div>

          {/* What kind of shop, from what actually serves this area. Free text on the
              vendor, so the list is counted from the data rather than fixed. */}
          {step === "stores" && !!areaId && (categories ?? []).length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              <button
                onClick={() => setCategory(null)}
                className={`rounded-full px-2 py-1 font-dm text-[11px] ${
                  category === null
                    ? "bg-recommend-green text-white"
                    : "bg-black/5 text-gray-600 hover:bg-black/10"
                }`}
              >
                All
              </button>
              {(categories ?? []).map((option) => (
                <button
                  key={option.name}
                  onClick={() =>
                    setCategory(category === option.name ? null : option.name)
                  }
                  className={`rounded-full px-2 py-1 font-dm text-[11px] ${
                    category === option.name
                      ? "bg-recommend-green text-white"
                      : "bg-black/5 text-gray-600 hover:bg-black/10"
                  }`}
                >
                  {option.name}
                  <span className="ml-1 opacity-60">{option.storeCount}</span>
                </button>
              ))}
            </div>
          )}

          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder={
                step === "area"
                  ? "Search areas…"
                  : step === "stores"
                    ? "Search stores…"
                    : store
                      ? `Search ${store.name}…`
                      : "Search products in this area…"
              }
              className="w-full rounded-md border border-black/10 py-2 pl-8 pr-3 font-dm text-xs outline-none focus:border-recommend-green"
            />
            {isFetching && (
              <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-gray-400" />
            )}
          </div>

          <ul className="mb-3 max-h-44 overflow-y-auto rounded-md border border-black/10">
            {step === "area" &&
              (areaContext?.areas ?? []).map((option) => (
                <li key={option.id}>
                  <button
                    onClick={() => void chooseArea(option.id)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-black/5"
                  >
                    <span className="truncate font-dm text-xs text-gray-800">
                      {option.name}
                    </span>
                    <span className="shrink-0 font-dm text-[11px] text-gray-400">
                      {option.stateName}
                    </span>
                  </button>
                </li>
              ))}

            {step === "stores" && !areaId && (
              <li className="px-3 py-2 font-dm text-xs text-gray-400">
                Choose an area first — it decides who can deliver to this buyer.
              </li>
            )}

            {step === "stores" &&
              !!areaId &&
              (stores ?? []).length === 0 &&
              !isFetching && (
                <li className="px-3 py-2 font-dm text-xs text-gray-400">
                  No {category ?? ""} store serves{" "}
                  {chosenArea?.name ?? "this area"}
                  {search ? ` matching “${search}”` : ""}.
                </li>
              )}

            {step === "stores" &&
              !!areaId &&
              (stores ?? []).map((option) => (
                <li key={option.id}>
                  <button
                    onClick={() => {
                      setStore({ id: option.id, name: option.name });
                      goTo("products");
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-black/5"
                  >
                    <Thumb src={option.logoUrl} alt={option.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-dm text-xs text-gray-800">
                        {option.name}
                      </span>
                      <span className="block truncate font-dm text-[11px] text-gray-400">
                        {option.category ?? "Store"}
                      </span>
                    </span>
                    {/* Closed is shown, not hidden: the admin can still take the order
                        and the vendor may reopen, but checkout will refuse it now. */}
                    {!option.isOpen && (
                      <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 font-dm text-[10px] font-semibold text-gray-500">
                        Closed
                      </span>
                    )}
                  </button>
                </li>
              ))}

            {step === "products" && (products ?? []).length === 0 && !isFetching && (
              <li className="px-3 py-2 font-dm text-xs text-gray-400">
                Nothing here{search ? ` matches “${search}”` : " yet"}.
              </li>
            )}

            {step === "products" &&
              (products ?? []).map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => add(product)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-black/5"
                  >
                    <Thumb src={product.imageUrl} alt={product.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-dm text-xs text-gray-800">
                        {product.name}
                      </span>
                      <span className="block truncate font-dm text-[11px] text-gray-400">
                        {product.vendorName ?? "Unknown store"}
                      </span>
                    </span>
                    <span className="shrink-0 font-dm text-xs font-bold text-gray-700">
                      {naira(Number(product.price))}
                    </span>
                  </button>
                </li>
              ))}
          </ul>

          {lines.length > 0 && (
            <ul className="mb-3 flex flex-col gap-1.5">
              {lines.map((line) => (
                <li
                  key={line.product.id}
                  className="flex items-center gap-2 rounded-md bg-black/[0.03] px-2 py-1.5"
                >
                  {/* Also in the basket, so an admin reading the order back to a customer
                      is looking at the same picture the customer is. */}
                  <Thumb src={line.product.imageUrl} alt={line.product.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-dm text-xs text-gray-800">
                      {line.product.name}
                    </span>
                    <span className="block truncate font-dm text-[11px] text-gray-400">
                      {line.product.vendorName ?? "Unknown store"} ·{" "}
                      {naira(Number(line.product.price) * line.quantity)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() =>
                        setQuantity(line.product.id, line.quantity - 1)
                      }
                      aria-label={`One fewer ${line.product.name}`}
                      className="grid h-6 w-6 place-items-center rounded border border-black/10 text-gray-600 hover:bg-white"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center font-dm text-xs font-bold text-gray-800">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(line.product.id, line.quantity + 1)
                      }
                      aria-label={`One more ${line.product.name}`}
                      className="grid h-6 w-6 place-items-center rounded border border-black/10 text-gray-600 hover:bg-white"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mb-3 grid grid-cols-2 gap-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Buyer name"
              className="rounded-md border border-black/10 px-2.5 py-2 font-dm text-xs outline-none focus:border-recommend-green"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+2348012345678"
              className="rounded-md border border-black/10 px-2.5 py-2 font-dm text-xs outline-none focus:border-recommend-green"
            />
            <select
              value={fulfillment}
              onChange={(event) =>
                setFulfillment(event.target.value as "PICKUP" | "DELIVERY")
              }
              className="rounded-md border border-black/10 px-2.5 py-2 font-dm text-xs outline-none focus:border-recommend-green"
            >
              <option value="DELIVERY">Delivery</option>
              <option value="PICKUP">Pickup</option>
            </select>
            {fulfillment === "DELIVERY" && (
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Delivery address"
                className="rounded-md border border-black/10 px-2.5 py-2 font-dm text-xs outline-none focus:border-recommend-green"
              />
            )}
          </div>

          {/* Named, with the reason — "some items changed" tells an admin nothing they
              can act on while a buyer is waiting. */}
          {rejected && (
            <div className="mb-3 rounded-md bg-amber-50 px-3 py-2">
              <p className="font-dm text-xs font-semibold text-amber-900">
                This basket can&apos;t be ordered right now:
              </p>
              <ul className="mt-1 list-disc pl-4">
                {rejected.map((change) => (
                  <li
                    key={change.productId}
                    className="font-dm text-xs text-amber-900"
                  >
                    {change.productName ?? "An item"} {REASONS[change.reason]}
                    {change.reason === "PRICE_CHANGED" &&
                      change.currentUnitPrice !== undefined &&
                      ` — it is now ${naira(change.currentUnitPrice)}`}
                    .
                  </li>
                ))}
              </ul>
            </div>
          )}

          {failure && (
            <p className="mb-3 font-dm text-xs text-red-600">{failure}</p>
          )}

          <label className="mb-3 flex items-center gap-2 font-dm text-xs text-gray-600">
            <input
              type="checkbox"
              checked={sendToBuyer}
              onChange={(event) => setSendToBuyer(event.target.checked)}
              className="h-3.5 w-3.5 accent-[#006837]"
            />
            Send the payment card to the buyer
          </label>

          <div className="flex items-center justify-between gap-3">
            <span className="font-dm text-xs text-gray-500">
              {lines.length === 0
                ? "No items yet"
                : `${lines.length} item${lines.length === 1 ? "" : "s"} · ${naira(goodsTotal)} before delivery`}
            </span>
            <button
              onClick={submit}
              disabled={lines.length === 0 || place.isPending}
              className="rounded-lg bg-recommend-green px-3 py-2 font-dm text-xs font-bold text-white hover:bg-recommend-green-hover disabled:opacity-50"
            >
              {place.isPending ? "Placing…" : "Place order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
