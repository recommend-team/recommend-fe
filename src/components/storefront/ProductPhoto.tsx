import { ImageIcon } from "lucide-react";
import { RemoteImage } from "@/components/atoms/RemoteImage";
import type { Product } from "@/types";

/** Soft grounds for products without a photo, picked by name so each keeps its own. */
const TINTS = ["#EEF3EF", "#F1EFF8", "#EEF1F6", "#F6EFE0", "#F6ECE6", "#EDF2E6"];

function tintOf(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TINTS[hash % TINTS.length];
}

/** The product's photo filling its box — or a quiet tile with its initial. */
export function ProductPhoto({
  product,
  sizes,
  large = false,
}: {
  product: Product;
  sizes: string;
  large?: boolean;
}) {
  if (product.imageUrl) {
    return (
      <RemoteImage
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes={sizes}
        className="object-cover"
      />
    );
  }
  return (
    <div
      className="absolute inset-0 flex items-center justify-center text-[#7A808B]"
      style={{ background: tintOf(product.name) }}
    >
      {product.name.trim() ? (
        <span
          aria-hidden
          className={`font-display font-bold text-[#15171C]/25 ${large ? "text-7xl" : "text-4xl"}`}
        >
          {product.name.trim().charAt(0).toUpperCase()}
        </span>
      ) : (
        <ImageIcon size={large ? 40 : 28} aria-hidden />
      )}
    </div>
  );
}
