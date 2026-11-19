import { Minus, Plus } from "lucide-react";
import { ProductPhoto } from "@/components/storefront/ProductPhoto";
import { formatNaira } from "@/lib/storefront-cart";
import type { Product } from "@/types";

/**
 * One item on a vendor's menu. A short menu gets big photo cards — a kitchen showing off
 * its dishes; a long one (a gadget shop's forty phones) gets compact rows so the buyer
 * isn't scrolling past a screen per product.
 *
 * Tapping the item opens it. An item with choices or extras is always built in the sheet;
 * a plain one adds straight from here and then shows − / +.
 */
export interface MenuItemProps {
  product: Product;
  quantity: number;
  buildable: boolean;
  onOpen: () => void;
  onChange: (next: number) => void;
}

/** More items than this and the menu switches from cards to rows. */
export const COMPACT_MENU_FROM = 13;

function details(product: Product): string | null {
  const parts = [
    product.unit ? `Per ${product.unit}` : null,
    product.choices?.some((group) => group.required) ? "Choose your options" : null,
    product.extraIds?.length ? "Extras available" : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

function AddControl({
  product,
  quantity,
  buildable,
  onOpen,
  onChange,
  wide,
}: MenuItemProps & { wide: boolean }) {
  if (buildable || quantity === 0) {
    return (
      <button
        type="button"
        onClick={buildable ? onOpen : () => onChange(1)}
        aria-label={quantity > 0 ? `Add another ${product.name}` : `Add ${product.name}`}
        className={`flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#C2410C] px-5 text-[15px] font-bold text-white hover:bg-[#A8380A] ${
          wide ? "w-full" : ""
        }`}
      >
        {quantity > 0 ? (
          <>
            <span className="tabular-nums">{quantity} in cart</span>
            <Plus size={18} strokeWidth={2.4} aria-hidden />
          </>
        ) : (
          <>
            <Plus size={18} strokeWidth={2.4} aria-hidden />
            {wide ? "Add to cart" : "Add"}
          </>
        )}
      </button>
    );
  }
  return (
    <div
      className={`flex h-12 items-center justify-between rounded-[14px] border-2 border-[#C2410C] text-[#C2410C] ${
        wide ? "w-full" : "w-[132px]"
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`One fewer ${product.name}`}
        className="grid h-11 w-11 place-items-center"
      >
        <Minus size={18} strokeWidth={2.4} />
      </button>
      <span className="text-base font-bold tabular-nums text-[#15171C]">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label={`One more ${product.name}`}
        className="grid h-11 w-11 place-items-center"
      >
        <Plus size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
}

export function MenuCard(props: MenuItemProps) {
  const { product, onOpen } = props;
  const more = details(product);
  return (
    <article className="flex flex-col overflow-hidden rounded-[22px] border border-[#E7E2D6] bg-white">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`See ${product.name}`}
        className="relative block aspect-[16/11] w-full overflow-hidden"
      >
        <ProductPhoto product={product} sizes="(min-width: 1024px) 380px, 100vw" large />
      </button>
      <div className="flex flex-1 flex-col gap-2 px-5 pt-4 pb-5">
        <button type="button" onClick={onOpen} className="flex flex-col gap-2 text-left">
          <span className="flex items-baseline justify-between gap-3">
            <span className="font-display text-[19px] font-bold leading-tight">{product.name}</span>
            <span className="shrink-0 text-[17px] font-bold text-[#0E3B26] tabular-nums">
              {formatNaira(product.price)}
            </span>
          </span>
          {product.description && (
            <span className="line-clamp-3 text-[14px] leading-relaxed text-[#4A4A44]">
              {product.description}
            </span>
          )}
          {more && <span className="text-[13px] text-[#5B5B55]">{more}</span>}
        </button>
        <div className="mt-auto pt-2">
          <AddControl {...props} wide />
        </div>
      </div>
    </article>
  );
}

export function MenuRow(props: MenuItemProps) {
  const { product, onOpen } = props;
  const more = details(product);
  return (
    <li className="flex items-center gap-4 border-b border-[#F1ECE0] px-4 py-4 last:border-b-0 sm:px-5">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`See ${product.name}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24"
      >
        <ProductPhoto product={product} sizes="96px" />
      </button>
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 flex-col gap-1 text-left">
        <span className="text-[16px] font-bold leading-tight">{product.name}</span>
        {product.description && (
          <span className="line-clamp-2 text-[14px] leading-snug text-[#4A4A44]">
            {product.description}
          </span>
        )}
        {more && <span className="text-[13px] text-[#5B5B55]">{more}</span>}
        <span className="text-[16px] font-bold text-[#0E3B26] tabular-nums sm:hidden">
          {formatNaira(product.price)}
        </span>
      </button>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="hidden text-[17px] font-bold text-[#0E3B26] tabular-nums sm:block">
          {formatNaira(product.price)}
        </span>
        <AddControl {...props} wide={false} />
      </div>
    </li>
  );
}
