"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useStorefront } from "@/hooks";
import { RemoteImage } from "@/components/atoms/RemoteImage";
import { formatNaira, useStorefrontCart } from "@/lib/storefront-cart";
import type { Product } from "@/types";

/**
 * A vendor's own shop — the link they share on Instagram, WhatsApp and TikTok. Build a
 * cart, check out, pay; the order then follows the buyer into the Recommend chat.
 */

function StoreSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 max-w-[480px] mx-auto">
      <div className="h-40 bg-gray-200 rounded-xl" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function StorefrontPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useStorefront(slug);
  const cart = useStorefrontCart(slug, data?.products);

  if (isLoading) return <StoreSkeleton />;

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-bold font-dm text-gray-800 mb-2">
          Store not found
        </p>
        <p className="text-sm text-gray-500 font-dm">
          This vendor may no longer be available.
        </p>
      </div>
    );
  }

  const { vendor, products } = data;
  const mains = products.filter((p) => p.isAvailable && !p.isAddOn);
  // Extras — drinks, extra protein — go with a meal from this store, never alone.
  const extras = products.filter((p) => p.isAvailable && p.isAddOn);
  const { priced } = cart;

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto pb-28">
      {/* Banner */}
      <div className="relative w-full h-44 bg-gray-100">
        {vendor.businessBannerUrl ? (
          <RemoteImage
            src={vendor.businessBannerUrl}
            alt={vendor.businessName ?? "Store banner"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#006837] to-[#EF5A22] flex items-center justify-center">
            <span className="text-white text-3xl font-champ">
              {vendor.businessName?.charAt(0) ?? "R"}
            </span>
          </div>
        )}

        {vendor.businessLogoUrl && (
          <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-2 border-white bg-white overflow-hidden shadow-md">
            <RemoteImage
              src={vendor.businessLogoUrl}
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Vendor info */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold font-dm text-gray-900">
            {vendor.businessName ?? "Unnamed Store"}
          </h1>
          <span
            className={`shrink-0 text-xs font-dm font-bold px-2 py-1 rounded-full ${
              vendor.isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {vendor.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {vendor.businessDescription && (
          <p className="text-sm text-gray-500 font-dm mt-1 leading-snug">
            {vendor.businessDescription}
          </p>
        )}

        {vendor.serviceAreas?.length > 0 && (
          <p className="text-xs text-gray-400 font-dm mt-2">
            Delivers to:{" "}
            {vendor.serviceAreas.map((area) => area.name).join(", ")}
          </p>
        )}

        {!vendor.isOpen && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-dm text-red-700">
            {vendor.businessName ?? "This store"} is closed right now. You can
            look around and fill your cart — ordering opens when they do.
          </p>
        )}
      </div>

      {/* Products */}
      <div className="px-4 pb-8">
        <h2 className="text-base font-bold font-dm text-gray-800 mb-3">Menu</h2>

        {mains.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400 font-dm">
              No products available right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mains.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                quantity={cart.quantityOf(product.id)}
                onChange={(next) => cart.setQuantity(product.id, next)}
              />
            ))}
          </div>
        )}

        {extras.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-bold font-dm text-gray-800">Extras</h2>
            <p className="text-xs text-gray-400 font-dm mt-0.5 mb-3">
              {priced.hasMain
                ? "Add these to your order."
                : "Add something from the menu first — extras go with a meal."}
            </p>
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100">
              {extras.map((extra) => (
                <li
                  key={extra.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-dm text-gray-700">
                      {extra.name}
                    </p>
                    <p className="text-sm font-bold font-dm text-[#006837]">
                      {formatNaira(extra.price)}
                    </p>
                  </div>
                  <Stepper
                    quantity={cart.quantityOf(extra.id)}
                    disabled={!priced.hasMain}
                    label={extra.name}
                    onChange={(next) => cart.setQuantity(extra.id, next)}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="px-4 py-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 font-dm">Powered by Recommend</p>
      </div>

      {/* Cart bar */}
      {cart.loaded && priced.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-white/0">
          <div className="max-w-[448px] mx-auto">
            <Link
              href={`/store/${slug}/checkout`}
              aria-disabled={!vendor.isOpen}
              onClick={(event) => {
                if (!vendor.isOpen) event.preventDefault();
              }}
              className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 font-dm text-white shadow-lg ${
                vendor.isOpen
                  ? "bg-[#006837] hover:bg-[#00552d]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <ShoppingBag size={18} aria-hidden />
                {priced.count} {priced.count === 1 ? "item" : "items"} ·{" "}
                {formatNaira(priced.goodsTotal)}
              </span>
              <span className="text-sm font-bold">
                {vendor.isOpen ? "Checkout →" : "Closed now"}
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductRow({
  product,
  quantity,
  onChange,
}: {
  product: Product;
  quantity: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
      <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
        {product.imageUrl ? (
          <RemoteImage
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
            🍽️
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold font-dm text-gray-800 line-clamp-2">
          {product.name}
        </p>
        {product.description && (
          <p className="text-xs text-gray-400 font-dm mt-0.5 line-clamp-2">
            {product.description}
          </p>
        )}
        <p className="text-sm font-bold font-dm text-[#006837] mt-1">
          {formatNaira(product.price)}
        </p>
      </div>

      <Stepper quantity={quantity} label={product.name} onChange={onChange} />
    </div>
  );
}

/** "Add" until there is one, then − n +. */
function Stepper({
  quantity,
  label,
  disabled = false,
  onChange,
}: {
  quantity: number;
  label: string;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  if (quantity === 0) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(1)}
        aria-label={`Add ${label}`}
        className="shrink-0 rounded-full bg-[#006837] px-4 py-2 text-xs font-bold font-dm text-white hover:bg-[#00552d] disabled:bg-gray-200 disabled:text-gray-400"
      >
        Add
      </button>
    );
  }

  return (
    <div className="shrink-0 flex items-center gap-1 rounded-full border border-[#006837]/30 p-0.5">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`One fewer ${label}`}
        className="grid h-8 w-8 place-items-center rounded-full text-[#006837] hover:bg-[#006837]/10"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-bold font-dm text-gray-900 tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label={`One more ${label}`}
        className="grid h-8 w-8 place-items-center rounded-full text-[#006837] hover:bg-[#006837]/10"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
