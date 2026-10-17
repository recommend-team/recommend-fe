"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Product } from "@/types";

/**
 * A storefront cart: one per vendor, kept in this browser so a buyer who leaves and comes
 * back to the vendor's link finds it as they left it — and the same in every open tab.
 *
 * Holds only ids and quantities. Prices, names and availability always come from the
 * vendor's current menu, and checkout recomputes them on the server regardless.
 */
export interface CartLine {
  productId: string;
  quantity: number;
}

export interface PricedLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

const MAX_QUANTITY = 50;

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

function parse(raw: string): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? (parsed as CartLine[]).filter(
          (line) =>
            typeof line?.productId === "string" &&
            Number.isInteger(line.quantity) &&
            line.quantity > 0
        )
      : [];
  } catch {
    return [];
  }
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
  const lines = useMemo(() => parse(raw ?? ""), [raw]);

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const next = Math.max(0, Math.min(MAX_QUANTITY, Math.floor(quantity)));
      const current = parse(read(slug));
      const others = current.filter((line) => line.productId !== productId);
      if (next === 0) return write(slug, others);
      write(
        slug,
        current.some((line) => line.productId === productId)
          ? current.map((line) =>
              line.productId === productId ? { ...line, quantity: next } : line
            )
          : [...current, { productId, quantity: next }]
      );
    },
    [slug]
  );

  const quantityOf = useCallback(
    (productId: string) =>
      lines.find((line) => line.productId === productId)?.quantity ?? 0,
    [lines]
  );

  const remove = useCallback(
    (productIds: string[]) =>
      write(
        slug,
        parse(read(slug)).filter((line) => !productIds.includes(line.productId))
      ),
    [slug]
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
      .map(({ line, product }) => ({
        product,
        quantity: line.quantity,
        lineTotal: Number(product.price) * line.quantity,
      }));

    return {
      items,
      hasMain,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      goodsTotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    };
  }, [lines, products]);

  return { lines, loaded, priced, quantityOf, setQuantity, remove, clear };
}

export function formatNaira(amount: number): string {
  return `₦${Number(amount).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}
