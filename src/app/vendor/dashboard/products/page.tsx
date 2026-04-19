"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import Paginator from "@/components/atoms/admin/Paginator";
import { useConfirm } from "@/components/organisms/DialogProvider";
import { useMyProducts, useDeleteProduct } from "@/hooks";
import type { Product } from "@/types";

const PAGE_SIZE = 20;

function formatNaira(raw: string | number): string {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export default function VendorProductsPage() {
  const confirm = useConfirm();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const products = useMyProducts({ page, limit: PAGE_SIZE });
  const del = useDeleteProduct();

  const rows = products.data?.items ?? [];
  const filtered = rows.filter((p) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(needle) ||
      (p.description ?? "").toLowerCase().includes(needle)
    );
  });

  const onDelete = async (product: Product) => {
    const ok = await confirm({
      title: `Delete "${product.name}"?`,
      message:
        "This removes the product from your storefront. Existing orders for this product are not affected.",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!ok) return;
    setActionError(null);
    try {
      await del.mutateAsync(product.id);
    } catch (err) {
      setActionError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Could not delete product."
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Manage your catalog. You can have up to 20 products at a time."
        right={
          <Link
            href="/vendor/dashboard/products/new"
            className="flex items-center gap-2 rounded-full bg-recommend-orange text-white px-4 py-2 text-sm font-bold font-dm hover:bg-orange-600"
          >
            <Plus size={16} />
            Add product
          </Link>
        }
      />

      <div className="rounded-2xl bg-white border border-[#FFD91D] p-5 md:p-6 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your products"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green"
          />
        </div>

        {actionError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            {actionError}
          </p>
        )}
        {products.isError && (
          <p className="text-sm font-dm text-red-600 bg-red-50 rounded-lg p-3">
            Couldn&apos;t load products.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-dm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.isLoading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Loading products…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    {search ? (
                      <p className="text-gray-400">No products match.</p>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-500">No products yet.</p>
                        <Link
                          href="/vendor/dashboard/products/new"
                          className="text-recommend-orange font-bold underline text-sm"
                        >
                          Add your first product
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-amber-50/40"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                          {p.imageUrl ? (
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {p.name}
                          </p>
                          {p.description && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-bold text-gray-900">
                      {formatNaira(p.price)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                          p.isAvailable ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isAvailable ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {p.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-1">
                        <Link
                          href={`/vendor/dashboard/products/${p.id}`}
                          className="p-2 rounded-lg text-gray-500 hover:bg-amber-100 hover:text-recommend-orange"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => onDelete(p)}
                          disabled={del.isPending}
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {products.data && products.data.total > 0 && (
          <Paginator
            page={page}
            total={products.data.total}
            pageSize={PAGE_SIZE}
            loadedOnThisPage={rows.length}
            onChange={setPage}
            label="products"
          />
        )}
      </div>
    </div>
  );
}
