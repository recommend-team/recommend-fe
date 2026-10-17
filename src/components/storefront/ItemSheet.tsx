"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { formatNaira } from "@/lib/storefront-cart";
import type { Product } from "@/types";
import { ProductPhoto } from "./ProductPhoto";

/**
 * One product, up close: the photo full width, the whole description, and how many.
 * A bottom sheet on a phone, a centred card on a wider screen.
 *
 * Opens at what is already in the cart (or one), and sets the cart to whatever the buyer
 * leaves it at — so it doubles as the way to change or remove an item.
 */
export function ItemSheet({
  product,
  storeName,
  inCart,
  locked,
  etaText,
  onSave,
  onClose,
}: {
  product: Product;
  storeName: string;
  /** How many are in the cart now. */
  inCart: number;
  /** Why it cannot be added yet — an extra with no meal in the cart. */
  locked: string | null;
  etaText: string;
  onSave: (quantity: number) => void;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(inCart || 1);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // The page behind stays put while the sheet is open.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const removing = inCart > 0 && quantity === 0;
  const label = removing
    ? "Remove from cart"
    : inCart > 0
      ? "Update cart"
      : "Add to cart";

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-[#0D0F13]/55"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="relative flex max-h-[92vh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[28px] bg-white font-dm text-[#15171C] sm:rounded-[28px]"
      >
        <div className="relative aspect-square max-h-[46vh] w-full shrink-0 sm:aspect-[4/3]">
          <ProductPhoto product={product} sizes="480px" large />
          <span
            aria-hidden
            className="absolute left-1/2 top-2.5 h-[5px] w-10 -translate-x-1/2 rounded-full bg-black/20 sm:hidden"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-5 grid h-11 w-11 place-items-center rounded-full bg-white text-[#15171C] shadow-md"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-[26px] font-bold leading-tight tracking-tight">
              {product.name}
            </h2>
            <span className="whitespace-nowrap pt-1 text-xl font-bold text-[#006837]">
              {formatNaira(product.price)}
            </span>
          </div>
          {product.description && (
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-[#3B404A]">
              {product.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2 text-[13px] text-[#3B404A]">
            <span className="rounded-full bg-[#F4F3EF] px-2.5 py-1.5">
              From {storeName}
            </span>
            <span className="rounded-full bg-[#F4F3EF] px-2.5 py-1.5">
              Delivered in {etaText}
            </span>
          </div>
          {locked && (
            <p className="mt-4 rounded-xl bg-[#FAF6E1] px-3 py-2.5 text-sm text-[#6B5A12]">
              {locked}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-[#ECECE8] px-5 pt-3.5 pb-6">
          <div className="flex h-[52px] items-center rounded-2xl bg-[#F4F3EF]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(inCart > 0 ? 0 : 1, q - 1))}
              disabled={!!locked}
              aria-label={`One fewer ${product.name}`}
              className="grid h-[52px] w-12 place-items-center disabled:opacity-40"
            >
              <Minus size={18} strokeWidth={2.4} />
            </button>
            <span className="w-6 text-center text-[17px] font-bold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(50, q + 1))}
              disabled={!!locked}
              aria-label={`One more ${product.name}`}
              className="grid h-[52px] w-12 place-items-center disabled:opacity-40"
            >
              <Plus size={18} strokeWidth={2.4} />
            </button>
          </div>
          <button
            type="button"
            disabled={!!locked}
            onClick={() => {
              onSave(quantity);
              onClose();
            }}
            className={`flex h-[52px] flex-1 items-center justify-between rounded-2xl px-[18px] text-base font-bold text-white disabled:bg-gray-300 ${
              removing ? "bg-[#B42318] hover:bg-[#912018]" : "bg-recommend-orange hover:bg-[#D84A15]"
            }`}
          >
            <span>{label}</span>
            {!removing && <span>{formatNaira(product.price * quantity)}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
