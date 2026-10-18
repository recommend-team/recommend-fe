"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Minus, Plus, X } from "lucide-react";
import {
  MAX_EXTRA,
  MAX_PACKS,
  MAX_PORTIONS,
  deltaText,
  formatNaira,
  isBuildable,
  portionsText,
  pricePack,
  type CartLine,
  type PackDraft,
} from "@/lib/storefront-cart";
import type { ChoiceGroup, Product } from "@/types";
import { ProductPhoto } from "./ProductPhoto";

/**
 * One product, up close: the photo, the whole description, and how many. A bottom sheet
 * on a phone, a centred card on a wider screen.
 *
 * A dish with extras or choices is built here as a pack — portions, the choices, the
 * extras, how many packs — and opening a pack from the cart edits it. Anything else opens
 * at what is already in the cart (or one) and sets the cart to whatever the buyer leaves
 * it at, so it doubles as the way to change or remove an item.
 */
export function ItemSheet({
  product,
  products,
  storeName,
  inCart,
  editing = null,
  locked,
  etaText,
  onSave,
  onSavePack,
  onRemove,
  onClose,
}: {
  product: Product;
  /** The vendor's menu, for the extras that go with this dish. */
  products: Product[];
  storeName: string;
  /** How many are in the cart now — for a plain product. */
  inCart: number;
  /** The pack being changed, opened from the cart. Null builds a new one. */
  editing?: CartLine | null;
  /** Why it cannot be added yet — an extra with no meal in the cart. */
  locked: string | null;
  etaText: string;
  onSave: (quantity: number) => void;
  onSavePack: (draft: PackDraft) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const buildable = isBuildable(product);

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
        <div
          className={`relative w-full shrink-0 ${
            buildable ? "aspect-[16/9] max-h-[28vh]" : "aspect-square max-h-[46vh] sm:aspect-[4/3]"
          }`}
        >
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

        {buildable ? (
          <PackBuilder
            product={product}
            products={products}
            editing={editing}
            onSave={(draft) => {
              onSavePack(draft);
              onClose();
            }}
            onRemove={() => {
              onRemove();
              onClose();
            }}
          />
        ) : (
          <PlainItem
            product={product}
            storeName={storeName}
            etaText={etaText}
            inCart={inCart}
            locked={locked}
            onSave={(quantity) => {
              onSave(quantity);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
}

function Heading({ product }: { product: Product }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-[26px] font-bold leading-tight tracking-tight">
          {product.name}
        </h2>
        <span className="whitespace-nowrap pt-1 text-right text-xl font-bold text-[#006837]">
          {formatNaira(product.price)}
          {product.unit && (
            <span className="block text-xs font-medium text-[#5B6270]">per {product.unit}</span>
          )}
        </span>
      </div>
      {product.description && (
        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-[#3B404A]">
          {product.description}
        </p>
      )}
    </>
  );
}

function PlainItem({
  product,
  storeName,
  etaText,
  inCart,
  locked,
  onSave,
}: {
  product: Product;
  storeName: string;
  etaText: string;
  inCart: number;
  locked: string | null;
  onSave: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(inCart || 1);
  const removing = inCart > 0 && quantity === 0;
  const label = removing ? "Remove from cart" : inCart > 0 ? "Update cart" : "Add to cart";

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3">
        <Heading product={product} />
        <div className="mt-4 flex flex-wrap gap-2 text-[13px] text-[#3B404A]">
          <span className="rounded-full bg-[#F4F3EF] px-2.5 py-1.5">From {storeName}</span>
          <span className="rounded-full bg-[#F4F3EF] px-2.5 py-1.5">Delivered in {etaText}</span>
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
          <span className="w-6 text-center text-[17px] font-bold tabular-nums">{quantity}</span>
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
          onClick={() => onSave(quantity)}
          className={`flex h-[52px] flex-1 items-center justify-between rounded-2xl px-[18px] text-base font-bold text-white disabled:bg-gray-300 ${
            removing ? "bg-[#B42318] hover:bg-[#912018]" : "bg-recommend-orange hover:bg-[#D84A15]"
          }`}
        >
          <span>{label}</span>
          {!removing && <span>{formatNaira(product.price * quantity)}</span>}
        </button>
      </div>
    </>
  );
}

/**
 * Build a pack: portions, the dish's choices, its extras, and how many packs like it.
 * A required choice must be answered before it can go in the cart.
 */
function PackBuilder({
  product,
  products,
  editing,
  onSave,
  onRemove,
}: {
  product: Product;
  products: Product[];
  editing: CartLine | null;
  onSave: (draft: PackDraft) => void;
  onRemove: () => void;
}) {
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const extrasOnOffer = useMemo(
    () =>
      (product.extraIds ?? [])
        .map((id) => byId.get(id))
        .filter((extra): extra is Product => !!extra && extra.isAvailable),
    [product.extraIds, byId]
  );

  const [portions, setPortions] = useState(editing?.quantity ?? 1);
  const [packs, setPacks] = useState(editing?.packs ?? 1);
  const [extras, setExtras] = useState<Record<string, number>>(() =>
    Object.fromEntries((editing?.extras ?? []).map((e) => [e.productId, e.quantity]))
  );
  const [picked, setPicked] = useState<Record<string, string[]>>(() =>
    Object.fromEntries((editing?.choices ?? []).map((c) => [c.groupId, c.optionIds]))
  );

  const draft: PackDraft = {
    productId: product.id,
    quantity: portions,
    packs,
    extras: extrasOnOffer
      .filter((extra) => (extras[extra.id] ?? 0) > 0)
      .map((extra) => ({ productId: extra.id, quantity: extras[extra.id] })),
    choices: (product.choices ?? [])
      .map((group) => ({ groupId: group.id, optionIds: picked[group.id] ?? [] }))
      .filter((choice) => choice.optionIds.length > 0),
  };
  const price = pricePack(product, draft, byId);
  const unitWord = product.unit ?? "item";

  const pick = (group: ChoiceGroup, optionId: string) =>
    setPicked((current) => {
      const chosen = current[group.id] ?? [];
      if (chosen.includes(optionId)) {
        return { ...current, [group.id]: chosen.filter((id) => id !== optionId) };
      }
      // Pick one: the new choice replaces the old.
      if (group.maxPick === 1) return { ...current, [group.id]: [optionId] };
      if (chosen.length >= group.maxPick) return current;
      return { ...current, [group.id]: [...chosen, optionId] };
    });

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
        <Heading product={product} />

        <Section title={product.unit ? `How many ${product.unit}s?` : "How many?"}>
          <Stepper
            label={product.unit ? `${product.unit}s` : product.name}
            value={portions}
            min={1}
            max={MAX_PORTIONS}
            onChange={setPortions}
            words={[`One fewer ${unitWord}`, `One more ${unitWord}`]}
          />
        </Section>

        {(product.choices ?? []).map((group) => {
          const chosen = picked[group.id] ?? [];
          const full = group.maxPick > 1 && chosen.length >= group.maxPick;
          return (
            <Section
              key={group.id}
              title={group.name}
              badge={group.required ? "Required" : "Optional"}
              hint={pickHint(group)}
            >
              <div role="group" aria-label={group.name} className="flex flex-col gap-2">
                {group.options.map((option) => {
                  const on = chosen.includes(option.id);
                  const soldOut = !option.isAvailable;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role={group.maxPick === 1 ? "radio" : "checkbox"}
                      aria-checked={on}
                      disabled={soldOut || (!on && full)}
                      onClick={() => pick(group, option.id)}
                      className={`flex min-h-[48px] items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left text-[15px] disabled:opacity-45 ${
                        on
                          ? "border-recommend-orange bg-[#FFF4EE]"
                          : "border-[#E4E2DB] bg-white hover:bg-[#FBFAF7]"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`grid h-5 w-5 shrink-0 place-items-center border-2 ${
                          group.maxPick === 1 ? "rounded-full" : "rounded-md"
                        } ${on ? "border-recommend-orange bg-recommend-orange text-white" : "border-[#C9C7BF]"}`}
                      >
                        {on && <Check size={12} strokeWidth={3.5} />}
                      </span>
                      <span className="flex-1 font-medium">{option.name}</span>
                      <span className="text-[13px] text-[#5B6270]">
                        {soldOut
                          ? "Sold out"
                          : option.priceDelta > 0
                            ? deltaText(option.priceDelta, product.unit)
                            : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Section>
          );
        })}

        {extrasOnOffer.length > 0 && (
          <Section title="Extras" hint={packs > 1 ? "In each pack" : `Up to ${MAX_EXTRA} of each`}>
            <ul className="flex flex-col divide-y divide-[#F0EFEA]">
              {extrasOnOffer.map((extra) => (
                <li key={extra.id} className="flex items-center gap-3 py-2">
                  <span className="flex-1 text-[15px]">
                    <span className="font-medium">{extra.name}</span>
                    <span className="block text-[13px] text-[#5B6270]">
                      {formatNaira(extra.price)}
                    </span>
                  </span>
                  <Stepper
                    small
                    label={extra.name}
                    value={extras[extra.id] ?? 0}
                    min={0}
                    max={MAX_EXTRA}
                    onChange={(next) => setExtras((current) => ({ ...current, [extra.id]: next }))}
                    words={[`One fewer ${extra.name}`, `One more ${extra.name}`]}
                  />
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="How many packs like this?" hint="Each pack is packed separately">
          <Stepper
            label="packs"
            value={packs}
            min={1}
            max={MAX_PACKS}
            onChange={setPacks}
            words={["One fewer pack", "One more pack"]}
          />
        </Section>
      </div>

      <div className="border-t border-[#ECECE8] px-5 pt-3 pb-6">
        {price.problem && (
          <p className="mb-2.5 text-center text-[13px] font-medium text-[#9A3412]">
            {price.problem}
          </p>
        )}
        <div className="flex items-center gap-3">
          {editing && (
            <button
              type="button"
              onClick={onRemove}
              className="h-[52px] rounded-2xl px-3 text-sm font-bold text-[#B42318] hover:bg-red-50"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            disabled={!!price.problem}
            onClick={() => onSave(draft)}
            className="flex h-[52px] flex-1 items-center justify-between rounded-2xl bg-recommend-orange px-[18px] text-base font-bold text-white hover:bg-[#D84A15] disabled:bg-gray-300"
          >
            <span>{editing ? "Update cart" : "Add to cart"}</span>
            <span className="tabular-nums">{formatNaira(price.lineTotal)}</span>
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-[#5B6270]">
          {packs > 1
            ? `${packs} packs × ${formatNaira(price.packTotal)} · ${portionsText(portions, product.unit)} in each`
            : `${portionsText(portions, product.unit)}${draft.extras.length > 0 ? " with extras" : ""}`}
        </p>
      </div>
    </>
  );
}

/** "Pick 1", "Pick up to 2", "Pick 1 to 3". */
function pickHint(group: ChoiceGroup): string {
  if (group.minPick === group.maxPick || group.maxPick === 1) return `Pick ${group.maxPick}`;
  if (group.minPick <= 1) return `Pick up to ${group.maxPick}`;
  return `Pick ${group.minPick} to ${group.maxPick}`;
}

function Section({
  title,
  badge,
  hint,
  children,
}: {
  title: string;
  badge?: "Required" | "Optional";
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h3 className="text-[16px] font-bold">{title}</h3>
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
              badge === "Required" ? "bg-[#FFF1EB] text-[#B23A12]" : "bg-[#F4F3EF] text-[#5B6270]"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      {hint && <p className="-mt-1.5 mb-2.5 text-[13px] text-[#5B6270]">{hint}</p>}
      {children}
    </section>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  words,
  small = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  /** What the − and + buttons say to a screen reader. */
  words: [string, string];
  small?: boolean;
}) {
  const size = small ? "h-9 w-9" : "h-12 w-12";
  return (
    <div
      className={`inline-flex items-center rounded-2xl bg-[#F4F3EF] ${small ? "h-9" : "h-12"}`}
      aria-label={label}
      role="group"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={words[0]}
        className={`grid ${size} place-items-center disabled:opacity-30`}
      >
        <Minus size={small ? 15 : 18} strokeWidth={2.4} />
      </button>
      <span
        className={`${small ? "w-5 text-[15px]" : "w-7 text-[17px]"} text-center font-bold tabular-nums`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={words[1]}
        className={`grid ${size} place-items-center disabled:opacity-30`}
      >
        <Plus size={small ? 15 : 18} strokeWidth={2.4} />
      </button>
    </div>
  );
}
