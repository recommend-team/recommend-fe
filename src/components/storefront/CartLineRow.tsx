"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { formatNaira, packDetails, type PricedLine } from "@/lib/storefront-cart";

/**
 * One line of the cart — the order panel beside the menu, and checkout. A pack shows what
 * is in it and opens to be changed; − and + change how many packs, or how many of a plain
 * item. At one, − takes it out.
 *
 *   Rice and beans                 − 2 +    ₦8,400
 *   2 portions each · + Beef ×2
 *   Edit
 */
export function CartLineRow({
  item,
  onEdit,
  onChange,
}: {
  item: PricedLine;
  /** Open the pack to change it. Plain items have nothing to edit. */
  onEdit: () => void;
  /** Packs for a pack, the count for a plain item. 0 removes the line. */
  onChange: (next: number) => void;
}) {
  const count = item.isPack ? item.packs : item.quantity;
  const name = item.product.name;
  const what = item.isPack ? `pack of ${name}` : name;

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-snug">{name}</p>
          {item.isPack && (
            <p className="mt-0.5 text-[13px] leading-snug text-[#5B6270]">
              {packDetails(item).join(" · ")}
            </p>
          )}
          {item.problem && (
            <p className="mt-1 text-[13px] font-medium text-[#9A3412]">{item.problem}</p>
          )}
          {item.isPack && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${name}`}
              className="mt-1 text-[13px] font-bold text-[#C2410C] hover:underline"
            >
              {item.problem ? "Choose now" : "Edit"}
            </button>
          )}
        </div>
        <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-[#F4F3EF] px-1 text-sm font-bold">
          <button
            type="button"
            onClick={() => onChange(count - 1)}
            aria-label={count === 1 ? `Remove ${name}` : `One fewer ${what}`}
            className="grid h-7 w-7 place-items-center"
          >
            {count === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
          </button>
          <span className="min-w-[1rem] text-center tabular-nums">
            {item.isPack ? `×${count}` : count}
          </span>
          <button
            type="button"
            onClick={() => onChange(count + 1)}
            aria-label={`One more ${what}`}
            className="grid h-7 w-7 place-items-center"
          >
            <Plus size={13} />
          </button>
        </span>
        <span className="w-[78px] shrink-0 pt-1 text-right text-[15px] font-bold tabular-nums">
          {formatNaira(item.lineTotal)}
        </span>
      </div>
    </li>
  );
}
