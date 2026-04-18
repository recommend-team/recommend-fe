"use client";

import { useParams } from "next/navigation";
import { useStorefront } from "@/hooks";
import Image from "next/image";
import Link from "next/link";

function formatPrice(price: number): string {
  return `\u20A6${Number(price).toLocaleString("en-NG")}`;
}

function StoreSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
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
  const availableProducts = products.filter((p) => p.isAvailable);

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto">
      {/* Banner */}
      <div className="relative w-full h-44 bg-gray-100">
        {vendor.businessBannerUrl ? (
          <Image
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

        {/* Logo overlay */}
        {vendor.businessLogoUrl && (
          <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-2 border-white bg-white overflow-hidden shadow-md">
            <Image
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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-dm text-gray-900">
            {vendor.businessName ?? "Unnamed Store"}
          </h1>
          <span
            className={`text-xs font-dm font-bold px-2 py-1 rounded-full ${
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

        {vendor.businessAreas && vendor.businessAreas.length > 0 && (
          <p className="text-xs text-gray-400 font-dm mt-2">
            Delivers to: {vendor.businessAreas.join(", ")}
          </p>
        )}
      </div>

      {/* Products */}
      <div className="px-4 pb-8">
        <h2 className="text-base font-bold font-dm text-gray-800 mb-3">
          Products
        </h2>

        {availableProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400 font-dm">
              No products available right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableProducts.map((product) => (
              <Link
                key={product.id}
                href={`/store/${slug}/order/${product.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                {/* Product image */}
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                  {product.imageUrl ? (
                    <Image
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

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold font-dm text-gray-800 truncate">
                    {product.name}
                  </p>
                  {product.description && (
                    <p className="text-xs text-gray-400 font-dm mt-0.5 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <p className="text-sm font-bold font-dm text-[#006837] mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Order arrow */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#006837] flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 font-dm">
          Powered by Recommend
        </p>
      </div>
    </div>
  );
}
