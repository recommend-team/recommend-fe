"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { CheckoutLine, ChoiceGroup, ChoiceOption, Product } from "@/types";

/**
 * A storefront cart: one per vendor, kept in this browser so a buyer who leaves and comes
 * back to the vendor's link finds it as they left it — and the same in every open tab.
 *
 * Holds only ids and quantities. Prices, names and availability always come from the
 * vendor's current menu, and checkout recomputes them on the server regardless.
 *
 * A dish with extras or choices is built as a **pack** — portions, choices, extras — and
 * the buyer can repeat the same pack ×N. Anything else is a plain line with a count.
 */
export interface CartLine {
  /** Tells two builds of the same dish apart. */
  key: string;
  productId: string;
  /** Portions in each pack, for a pack; how many, for a plain line. */
  quantity: number;
  /** Set on a pack: how many identical packs. */
  packs?: number;
  /** In each pack. */
  extras?: { productId: string; quantity: number }[];
  choices?: { groupId: string; optionIds: string[] }[];
}

/** What the pack builder hands back. */
export interface PackDraft {
  productId: string;
  quantity: number;
  packs: number;
  extras: { productId: string; quantity: number }[];
  choices: { groupId: string; optionIds: string[] }[];
}

export interface PricedLine {
  key: string;
  line: CartLine;
  product: Product;
  /** Built in the pack builder, rather than a plain count. */
  isPack: boolean;
  /** Portions per pack, or the count of a plain line. */
  quantity: number;
  packs: number;
  /** Per portion, with what the chosen options add. */
  unitPrice: number;
  choices: { group: ChoiceGroup; options: ChoiceOption[] }[];
  /** In each pack, on sale and still offered with this dish. */
  extras: { product: Product; quantity: number }[];
  packTotal: number;
  lineTotal: number;
  /** Why it can't be paid for as it is — a required choice now unanswered. */
  problem: string | null;
}

export const MAX_QUANTITY = 50;
export const MAX_PORTIONS = 10;
export const MAX_EXTRA = 5;
export const MAX_PACKS = 50;

const storageKey = (slug: string) => `recommend:store-cart:${slug}`;

/** Tabs are told by the browser; this tab tells itself. */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(slug: string): string {
  try {
    return localStorage.getItem(storageKey(slug)) ?? "";
  } catch {
    return "";
  }
}

function write(slug: string, lines: CartLine[]): void {
  try {
    if (lines.length === 0) localStorage.removeItem(storageKey(slug));
    else localStorage.setItem(storageKey(slug), JSON.stringify(lines));
  } catch {
    // Private mode or storage full: nothing is kept between visits.
  }
  listeners.forEach((listener) => listener());
}

const wholeInRange = (value: unknown, max: number): value is number =>
  Number.isInteger(value) && (value as number) > 0 && (value as number) <= max;

/** Stored lines, kept only where they make sense. A cart from before packs keeps working. */
export function parseCart(raw: string): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as Partial<CartLine>[]).flatMap((line) => {
      if (typeof line?.productId !== "string" || !wholeInRange(line.quantity, MAX_QUANTITY)) {
        return [];
      }
      // Older carts had no key: one plain line per product.
      const key = typeof line.key === "string" ? line.key : line.productId;
      if (line.packs === undefined) {
        return [{ key, productId: line.productId, quantity: line.quantity }];
      }
      if (!wholeInRange(line.packs, MAX_PACKS)) return [];
      return [
        {
          key,
          productId: line.productId,
          quantity: Math.min(MAX_PORTIONS, line.quantity),
          packs: line.packs,
          extras: (Array.isArray(line.extras) ? line.extras : []).filter(
            (extra) =>
              typeof extra?.productId === "string" && wholeInRange(extra.quantity, MAX_EXTRA)
          ),
          choices: (Array.isArray(line.choices) ? line.choices : []).filter(
            (choice) =>
              typeof choice?.groupId === "string" &&
              Array.isArray(choice.optionIds) &&
              choice.optionIds.every((id) => typeof id === "string")
          ),
        },
      ];
    });
  } catch {
    return [];
  }
}

/** Whether a dish is built as a pack: it has extras to add or choices to answer. */
export function isBuildable(product: Product): boolean {
  return (
    !product.isAddOn &&
    ((product.extraIds?.length ?? 0) > 0 || (product.choices?.length ?? 0) > 0)
  );
}

type Build = Pick<CartLine, "productId" | "quantity" | "extras" | "choices">;

/** The same dish built the same way — adding it again just adds packs. */
function sameBuild(a: Build, b: Build): boolean {
  const extras = (line: Build) =>
    (line.extras ?? [])
      .map((e) => `${e.productId}:${e.quantity}`)
      .sort()
      .join(",");
  const choices = (line: Build) =>
    (line.choices ?? [])
      .filter((c) => c.optionIds.length > 0)
      .map((c) => `${c.groupId}:${[...c.optionIds].sort().join("+")}`)
      .sort()
      .join(",");
  return (
    a.productId === b.productId &&
    a.quantity === b.quantity &&
    extras(a) === extras(b) &&
    choices(a) === choices(b)
  );
}

function newKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * A pack against today's menu: its price, the extras and options still on offer, and what
 * stops it being paid for. Extras no longer offered are left out (checkout would refuse
 * them); a required choice that can't be met is a problem for the buyer to fix.
 */
export function pricePack(
  product: Product,
  draft: Pick<CartLine, "quantity" | "packs" | "extras" | "choices">,
  byId: Map<string, Product>
): Omit<PricedLine, "key" | "line" | "product" | "isPack"> {
  const offered = new Set(product.extraIds ?? []);
  const extras = (draft.extras ?? []).flatMap(({ productId, quantity }) => {
    const extra = byId.get(productId);
    return extra && extra.isAvailable && offered.has(productId)
      ? [{ product: extra, quantity }]
      : [];
  });

  const picked = new Map((draft.choices ?? []).map((c) => [c.groupId, c.optionIds]));
  let problem: string | null = null;
  const choices = (product.choices ?? []).flatMap((group) => {
    const options = group.options.filter(
      (option) => option.isAvailable && (picked.get(group.id) ?? []).includes(option.id)
    );
    if (!problem && options.length < group.minPick) {
      problem = `${group.name} — pick ${group.minPick === 1 ? "one" : group.minPick}`;
    } else if (!problem && options.length > group.maxPick) {
      problem = `${group.name} — pick at most ${group.maxPick}`;
    }
    return options.length > 0 ? [{ group, options }] : [];
  });

  const unitPrice =
    Number(product.price) +
    choices.reduce(
      (sum, c) => sum + c.options.reduce((s, o) => s + Number(o.priceDelta), 0),
      0
    );
  const packTotal =
    unitPrice * draft.quantity +
    extras.reduce((sum, e) => sum + Number(e.product.price) * e.quantity, 0);
  const packs = draft.packs ?? 1;

  return {
    quantity: draft.quantity,
    packs,
    unitPrice,
    choices,
    extras,
    packTotal,
    lineTotal: packTotal * packs,
    problem,
  };
}

/** A line as checkout takes it — packs whole, with the prices the buyer was shown. */
export function toCheckoutLine(item: PricedLine): CheckoutLine {
  const base = {
    productId: item.product.id,
    quantity: item.quantity,
    expectedUnitPrice: Number(item.product.price),
  };
  if (!item.isPack) return base;
  return {
    ...base,
    packs: item.packs,
    extras: item.extras.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
      expectedUnitPrice: Number(product.price),
    })),
    choices: item.choices.map(({ group, options }) => ({
      groupId: group.id,
      optionIds: options.map((option) => option.id),
    })),
  };
}

/** Empty a vendor's cart from outside the hook — once its order is paid. */
export function clearStoredCart(slug: string): void {
  write(slug, []);
}

export function useStorefrontCart(slug: string, products: Product[] = []) {
  // The server has no localStorage: null there, the stored string in the browser.
  const raw = useSyncExternalStore<string | null>(
    subscribe,
    () => read(slug),
    () => null
  );
  const loaded = raw !== null;
  const lines = useMemo(() => parseCart(raw ?? ""), [raw]);

  const update = useCallback(
    (change: (current: CartLine[]) => CartLine[]) =>
      write(slug, change(parseCart(read(slug)))),
    [slug]
  );

  /** A plain product's count, from the stepper. 0 takes it out. */
  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const next = Math.max(0, Math.min(MAX_QUANTITY, Math.floor(quantity)));
      const plain = (line: CartLine) =>
        line.productId === productId && line.packs === undefined;
      update((current) => {
        if (next === 0) return current.filter((line) => !plain(line));
        return current.some(plain)
          ? current.map((line) => (plain(line) ? { ...line, quantity: next } : line))
          : [...current, { key: newKey(), productId, quantity: next }];
      });
    },
    [update]
  );

  /** A pack from the builder. Built exactly like one already in the cart, it adds packs. */
  const addPack = useCallback(
    (draft: PackDraft) =>
      update((current) => {
        const same = current.find(
          (line) => line.packs !== undefined && sameBuild(line, draft)
        );
        if (!same) return [...current, { key: newKey(), ...draft }];
        return current.map((line) =>
          line === same
            ? { ...line, packs: Math.min(MAX_PACKS, (line.packs ?? 1) + draft.packs) }
            : line
        );
      }),
    [update]
  );

  /** A pack changed in the builder: the line keeps its place in the cart. */
  const replacePack = useCallback(
    (key: string, draft: PackDraft) =>
      update((current) =>
        current.map((line) => (line.key === key ? { key, ...draft } : line))
      ),
    [update]
  );

  /** ×N on a pack. 0 takes it out. */
  const setPacks = useCallback(
    (key: string, packs: number) => {
      const next = Math.max(0, Math.min(MAX_PACKS, Math.floor(packs)));
      update((current) =>
        next === 0
          ? current.filter((line) => line.key !== key)
          : current.map((line) => (line.key === key ? { ...line, packs: next } : line))
      );
    },
    [update]
  );

  const removeLine = useCallback(
    (key: string) => update((current) => current.filter((line) => line.key !== key)),
    [update]
  );

  /** How many of a product are in the cart: packs, for a dish built as packs. */
  const quantityOf = useCallback(
    (productId: string) =>
      lines
        .filter((line) => line.productId === productId)
        .reduce((sum, line) => sum + (line.packs ?? line.quantity), 0),
    [lines]
  );

  /** Take out products that can no longer be bought — as lines, and as extras in packs. */
  const remove = useCallback(
    (productIds: string[]) =>
      update((current) =>
        current
          .filter((line) => !productIds.includes(line.productId))
          .map((line) =>
            line.extras
              ? {
                  ...line,
                  extras: line.extras.filter((e) => !productIds.includes(e.productId)),
                }
              : line
          )
      ),
    [update]
  );

  const clear = useCallback(() => write(slug, []), [slug]);

  /**
   * The cart against today's menu: items gone or unavailable are left out, and so are
   * extras with no main item to go with — checkout would refuse them.
   */
  const priced = useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]));
    const available = lines
      .map((line) => ({ line, product: byId.get(line.productId) }))
      .filter(
        (entry): entry is { line: CartLine; product: Product } =>
          !!entry.product && entry.product.isAvailable
      );
    const hasMain = available.some(({ product }) => !product.isAddOn);
    const items: PricedLine[] = available
      .filter(({ product }) => hasMain || !product.isAddOn)
      .map(({ line, product }) => {
        if (line.packs !== undefined) {
          return { key: line.key, line, product, isPack: true, ...pricePack(product, line, byId) };
        }
        const unitPrice = Number(product.price);
        return {
          key: line.key,
          line,
          product,
          isPack: false,
          quantity: line.quantity,
          packs: 1,
          unitPrice,
          choices: [],
          extras: [],
          packTotal: unitPrice * line.quantity,
          lineTotal: unitPrice * line.quantity,
          problem: null,
        };
      });

    return {
      items,
      hasMain,
      count: items.reduce((sum, item) => sum + (item.isPack ? item.packs : item.quantity), 0),
      goodsTotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
      /** The first line that can't be paid for as it is. */
      problem: items.find((item) => item.problem) ?? null,
    };
  }, [lines, products]);

  return {
    lines,
    loaded,
    priced,
    quantityOf,
    setQuantity,
    addPack,
    replacePack,
    setPacks,
    removeLine,
    remove,
    clear,
  };
}

/** "portion" → "2 portions"; no unit → "×2". */
export function portionsText(quantity: number, unit: string | null | undefined): string {
  if (!unit) return `×${quantity}`;
  return `${quantity} ${quantity === 1 ? unit : `${unit}s`}`;
}

/** What's in a pack, a line each: "2 portions each", "Protein: Beef", "+ Beef ×2". */
export function packDetails(
  item: Pick<PricedLine, "product" | "quantity" | "packs" | "choices" | "extras">
): string[] {
  const each = item.packs > 1 ? " each" : "";
  return [
    `${portionsText(item.quantity, item.product.unit)}${each}`,
    ...item.choices.map(
      ({ group, options }) =>
        `${shortGroup(group.name)}: ${options.map((o) => o.name).join(" & ")}`
    ),
    ...(item.extras.length > 0
      ? [`+ ${item.extras.map((e) => `${e.product.name} ×${e.quantity}`).join(", ")}`]
      : []),
  ];
}

/** "Choose your protein" → "Protein", as receipts read it. */
export function shortGroup(name: string): string {
  const short = name
    .trim()
    .replace(/^(choose|pick|select)\s+/i, "")
    .replace(/^(your|a|an|the)\s+/i, "");
  return short ? short.charAt(0).toUpperCase() + short.slice(1) : name;
}

/** "+₦300 per portion" — what an option adds. */
export function deltaText(priceDelta: number, unit: string | null | undefined): string {
  return `+${formatNaira(priceDelta)}${unit ? ` per ${unit}` : " each"}`;
}

export function formatNaira(amount: number): string {
  return `₦${Number(amount).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}
