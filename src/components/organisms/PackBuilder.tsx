"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import type { CatalogProduct, ChoiceGroup } from "@/types";

/** A dish built as a pack in the admin's basket — as a buyer builds one. */
export interface BuiltPack {
  /** Portions in each pack. */
  quantity: number;
  packs: number;
  /** In each pack. */
  extras: { id: string; name: string; price: number; quantity: number }[];
  choices: {
    groupId: string;
    groupName: string;
    options: { id: string; name: string; priceDelta: number }[];
  }[];
}

const MAX_PORTIONS = 10;
const MAX_EXTRA = 5;
const MAX_PACKS = 50;

const naira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

/** Whether a dish is built as a pack: it has extras to add or choices to answer. */
export function isBuildable(product: CatalogProduct): boolean {
  return (
    !product.isAddOn &&
    ((product.extras?.length ?? 0) > 0 || (product.choices?.length ?? 0) > 0)
  );
}

/** Every pack: portions with their options, plus the extras. */
export function packTotal(product: CatalogProduct, pack: BuiltPack): number {
  const perPortion =
    Number(product.price) +
    pack.choices.reduce(
      (sum, choice) =>
        sum + choice.options.reduce((s, o) => s + o.priceDelta, 0),
      0,
    );
  const extras = pack.extras.reduce((sum, e) => sum + e.price * e.quantity, 0);
  return (perPortion * pack.quantity + extras) * pack.packs;
}

/** "2 portions each · Protein: Fish · + Water ×1". */
export function packSummary(product: CatalogProduct, pack: BuiltPack): string {
  const unit = product.unit;
  const portions = unit
    ? `${pack.quantity} ${pack.quantity === 1 ? unit : `${unit}s`}`
    : `×${pack.quantity}`;
  return [
    `${portions}${pack.packs > 1 ? " each" : ""}`,
    ...pack.choices.map(
      (c) =>
        `${shortGroup(c.groupName)}: ${c.options.map((o) => o.name).join(" & ")}`,
    ),
    ...(pack.extras.length > 0
      ? [`+ ${pack.extras.map((e) => `${e.name} ×${e.quantity}`).join(", ")}`]
      : []),
  ].join(" · ");
}

function shortGroup(name: string): string {
  const short = name
    .trim()
    .replace(/^(choose|pick|select)\s+/i, "")
    .replace(/^(your|a|an|the)\s+/i, "");
  return short ? short.charAt(0).toUpperCase() + short.slice(1) : name;
}

/**
 * Build a pack of one dish, inside the order builder: portions, its choices (required
 * ones first answered), its extras, and how many packs. Opened again from the basket, it
 * edits that pack.
 */
export default function PackBuilder({
  product,
  initial,
  onDone,
  onCancel,
}: {
  product: CatalogProduct;
  initial?: BuiltPack;
  onDone: (pack: BuiltPack) => void;
  onCancel: () => void;
}) {
  const groups = product.choices ?? [];
  const [portions, setPortions] = useState(initial?.quantity ?? 1);
  const [packs, setPacks] = useState(initial?.packs ?? 1);
  const [extras, setExtras] = useState<Record<string, number>>(() =>
    Object.fromEntries((initial?.extras ?? []).map((e) => [e.id, e.quantity])),
  );
  const [picked, setPicked] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      (initial?.choices ?? []).map((c) => [
        c.groupId,
        c.options.map((o) => o.id),
      ]),
    ),
  );

  const pack: BuiltPack = {
    quantity: portions,
    packs,
    extras: (product.extras ?? [])
      .filter((extra) => (extras[extra.id] ?? 0) > 0)
      .map((extra) => ({ ...extra, quantity: extras[extra.id] })),
    choices: groups.flatMap((group) => {
      const options = group.options.filter(
        (o) => o.isAvailable && (picked[group.id] ?? []).includes(o.id),
      );
      return options.length > 0
        ? [
            {
              groupId: group.id,
              groupName: group.name,
              options: options.map(({ id, name, priceDelta }) => ({
                id,
                name,
                priceDelta,
              })),
            },
          ]
        : [];
    }),
  };
  const missing = groups.find(
    (group) =>
      (pack.choices.find((c) => c.groupId === group.id)?.options.length ?? 0) <
      group.minPick,
  );

  const pick = (group: ChoiceGroup, optionId: string) =>
    setPicked((current) => {
      const chosen = current[group.id] ?? [];
      if (chosen.includes(optionId)) {
        return {
          ...current,
          [group.id]: chosen.filter((id) => id !== optionId),
        };
      }
      if (group.maxPick === 1) return { ...current, [group.id]: [optionId] };
      if (chosen.length >= group.maxPick) return current;
      return { ...current, [group.id]: [...chosen, optionId] };
    });

  return (
    <div
      role="group"
      aria-label={`Build ${product.name}`}
      className="mb-3 flex flex-col gap-3 rounded-md border border-recommend-green/30 bg-recommend-green/[0.03] p-3 font-dm"
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-bold text-gray-900">{product.name}</p>
        <span className="text-[11px] text-gray-500">
          {naira(Number(product.price))}
          {product.unit ? ` per ${product.unit}` : ""}
        </span>
      </div>

      <Row label={product.unit ? `${capital(product.unit)}s` : "How many"}>
        <Stepper
          label={product.unit ? `${product.unit}s` : "how many"}
          value={portions}
          min={1}
          max={MAX_PORTIONS}
          onChange={setPortions}
        />
      </Row>

      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-gray-700">
            {group.name}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                group.required
                  ? "bg-orange-100 text-orange-700"
                  : "bg-black/5 text-gray-500"
              }`}
            >
              {group.required ? "Required" : "Optional"}
            </span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map((option) => {
              const on = (picked[group.id] ?? []).includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  role={group.maxPick === 1 ? "radio" : "checkbox"}
                  aria-checked={on}
                  disabled={!option.isAvailable}
                  onClick={() => pick(group, option.id)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] disabled:opacity-40 ${
                    on
                      ? "border-recommend-green bg-recommend-green text-white"
                      : "border-black/10 bg-white text-gray-700 hover:bg-black/5"
                  }`}
                >
                  {on && <Check className="h-3 w-3" />}
                  {option.name}
                  {!option.isAvailable
                    ? " · out"
                    : option.priceDelta > 0
                      ? ` +${naira(option.priceDelta)}`
                      : ""}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {(product.extras ?? []).length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold text-gray-700">
            Extras{packs > 1 ? " (in each pack)" : ""}
          </p>
          {(product.extras ?? []).map((extra) => (
            <Row key={extra.id} label={`${extra.name} · ${naira(extra.price)}`}>
              <Stepper
                label={extra.name}
                value={extras[extra.id] ?? 0}
                min={0}
                max={MAX_EXTRA}
                onChange={(next) =>
                  setExtras((c) => ({ ...c, [extra.id]: next }))
                }
              />
            </Row>
          ))}
        </div>
      )}

      <Row label="Packs like this">
        <Stepper
          label="packs"
          value={packs}
          min={1}
          max={MAX_PACKS}
          onChange={setPacks}
        />
      </Row>

      {missing && (
        <p className="text-[11px] font-semibold text-orange-700">
          {missing.name} — pick one
        </p>
      )}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-black/5"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onDone(pack)}
          disabled={!!missing}
          className="rounded-md bg-recommend-green px-3 py-1.5 text-xs font-bold text-white hover:bg-recommend-green-hover disabled:opacity-50"
        >
          {initial ? "Update" : "Add"} · {naira(packTotal(product, pack))}
        </button>
      </div>
    </div>
  );
}

function capital(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate text-[11px] text-gray-700">{label}</span>
      {children}
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`One fewer — ${label}`}
        className="grid h-6 w-6 place-items-center rounded border border-black/10 bg-white text-gray-600 disabled:opacity-40"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-5 text-center text-xs font-bold text-gray-800">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`One more — ${label}`}
        className="grid h-6 w-6 place-items-center rounded border border-black/10 bg-white text-gray-600 disabled:opacity-40"
      >
        <Plus className="h-3 w-3" />
      </button>
    </span>
  );
}
