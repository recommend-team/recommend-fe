"use client";

import { useState } from "react";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import { RemoteImage } from "@/components/atoms/RemoteImage";
import { useConfirm } from "@/components/organisms/DialogProvider";
import {
  useRemoveVendorProduct,
  useUpdateVendorProduct,
  useVendorProducts,
} from "@/hooks";
import type { Product } from "@/types";
import ExtraDialog from "./ExtraDialog";
import ProductDialog from "./ProductDialog";

/** The vendor app's own ceiling. */
const PRODUCT_LIMIT = 20;

function formatNaira(raw: string | number): string {
  const n = Number(raw);
  return `₦${(Number.isFinite(n) ? n : 0).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

/** "2 extras · Choose your protein (required)", or how many products an extra is on. */
function describeOptions(product: Product, onDishes: number): string {
  if (product.isAddOn) {
    return onDishes === 0
      ? "Not on any product yet"
      : `On ${onDishes} product${onDishes === 1 ? "" : "s"}`;
  }
  const extras = product.extraIds?.length ?? 0;
  return [
    extras > 0 ? `${extras} extra${extras === 1 ? "" : "s"}` : null,
    ...(product.choices ?? []).map(
      (c) => `${c.name}${c.required ? " (required)" : ""}`,
    ),
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * The vendor's products, run by an admin: add, edit, remove, and switch availability —
 * each logged, and the vendor told. Products and extras are two lists with their own add
 * button and their own form, as in the vendor app, so it's always clear which is which.
 */
export default function VendorProductsTab({ vendorId }: { vendorId: string }) {
  const products = useVendorProducts(vendorId);
  const toggle = useUpdateVendorProduct(vendorId);
  const remove = useRemoveVendorProduct(vendorId);
  const confirm = useConfirm();
  const [view, setView] = useState<"products" | "extras">("products");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const items = products.data?.items ?? [];
  const atLimit = items.length >= PRODUCT_LIMIT;
  const dishes = items.filter((p) => !p.isAddOn);
  const extras = items.filter((p) => p.isAddOn);
  const onDishes = (extraId: string) =>
    dishes.filter((dish) => (dish.extraIds ?? []).includes(extraId)).length;
  const comesWith = (product: Product) =>
    describeOptions(product, onDishes(product.id));

  const run = async (fn: () => Promise<unknown>) => {
    setFailure(null);
    try {
      await fn();
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : "That didn't work.");
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#FFD91D] bg-white p-5 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-dm text-base font-bold text-gray-900">
            Products ({items.length} of {PRODUCT_LIMIT})
          </h3>
          <p className="font-dm text-xs text-gray-500">
            Changes here are logged and the vendor is told.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing("new")}
            disabled={atLimit}
            title={
              atLimit
                ? `A vendor can list at most ${PRODUCT_LIMIT} products`
                : undefined
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-recommend-green px-4 py-2 font-dm text-sm font-bold text-white hover:bg-recommend-green-hover disabled:opacity-40"
          >
            <Plus size={15} />{" "}
            {view === "products" ? "Add product" : "Add extra"}
          </button>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Products or extras"
        className="grid grid-cols-2 gap-1 rounded-full bg-gray-100 p-1 font-dm text-sm font-bold sm:w-80"
      >
        {(
          [
            ["products", "Products", dishes.length],
            ["extras", "Extras", extras.length],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={view === key}
            onClick={() => setView(key)}
            className={`rounded-full py-1.5 ${view === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            {label} <span className="font-normal text-gray-400">{count}</span>
          </button>
        ))}
      </div>
      <p className="-mt-2 font-dm text-xs text-gray-500">
        {view === "products"
          ? "What buyers order."
          : "What buyers add to a product they order — Beef, Takeaway pack. Never sold alone."}
      </p>

      {failure && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 font-dm text-sm text-red-600"
        >
          {failure}
        </p>
      )}

      {products.isLoading && (
        <p className="py-6 text-center font-dm text-sm text-gray-400">
          Loading products…
        </p>
      )}
      {products.isError && (
        <p className="py-6 text-center font-dm text-sm text-red-600">
          Couldn&apos;t load products.
        </p>
      )}
      {!products.isLoading &&
        (view === "products" ? dishes : extras).length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Package size={18} />
            </span>
            <p className="font-dm text-sm text-gray-400">
              {view === "products"
                ? "No products yet. Add the first one."
                : "No extras yet. Add one — like a Takeaway pack."}
            </p>
          </div>
        )}

      {[view === "products" ? dishes : extras].map((list) =>
        list.length === 0 ? null : (
          <div key={view} className="flex flex-col">
            <ul className="flex flex-col divide-y divide-gray-100">
              {list.map((product) => (
                <li key={product.id} className="flex items-center gap-3 py-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {product.imageUrl ? (
                      <RemoteImage
                        src={product.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-gray-300">
                        <Package size={18} />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 font-dm">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatNaira(product.price)}
                      {product.unit ? ` per ${product.unit}` : ""}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {comesWith(product)}
                    </p>
                  </div>

                  <label className="flex shrink-0 cursor-pointer items-center gap-2 font-dm text-xs font-bold text-gray-600">
                    <input
                      type="checkbox"
                      checked={product.isAvailable}
                      disabled={toggle.isPending}
                      onChange={(e) =>
                        void run(() =>
                          toggle.mutateAsync({
                            productId: product.id,
                            payload: { isAvailable: e.target.checked },
                          }),
                        )
                      }
                      aria-label={`${product.name} available`}
                    />
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </label>

                  <button
                    type="button"
                    onClick={() => setEditing(product)}
                    aria-label={`Edit ${product.name}`}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await confirm({
                        title: `Remove ${product.name}?`,
                        message:
                          "It disappears from the vendor's shop. Past orders keep it.",
                        confirmLabel: "Remove",
                        variant: "danger",
                      });
                      if (ok) void run(() => remove.mutateAsync(product.id));
                    }}
                    aria-label={`Remove ${product.name}`}
                    className="rounded-full p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ),
      )}

      {editing && (editing === "new" ? view === "extras" : editing.isAddOn) && (
        <ExtraDialog
          vendorId={vendorId}
          extra={editing === "new" ? undefined : editing}
          products={dishes}
          onClose={() => setEditing(null)}
        />
      )}
      {editing &&
        !(editing === "new" ? view === "extras" : editing.isAddOn) && (
          <ProductDialog
            vendorId={vendorId}
            product={editing === "new" ? undefined : editing}
            extras={extras}
            onClose={() => setEditing(null)}
          />
        )}
    </section>
  );
}
