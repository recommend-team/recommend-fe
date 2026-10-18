"use client";

import { Trash2 } from "lucide-react";
import type { ChoiceGroup, ChoiceGroupInput } from "@/types";
import { INPUT } from "./form";

/**
 * Questions on a dish — "Choose your protein: Chicken / Beef / Fish (+₦300)" — the same
 * editor the vendor app has.
 *
 * Each choice: a name, whether the buyer must answer it, how many they pick ("exactly 1",
 * "up to 2"), and its options with an extra cost per portion. One answer covers the whole
 * pack. Existing choices keep their ids, so carts already holding them keep working.
 */

export interface DraftOption {
  key: string;
  id?: string;
  name: string;
  /** As typed — a price box. */
  priceDelta: string;
  isAvailable: boolean;
}

export interface DraftChoice {
  key: string;
  id?: string;
  name: string;
  required: boolean;
  /** "exactly N" only makes sense when required; an optional choice is "up to N". */
  mode: "exactly" | "upTo";
  count: number;
  options: DraftOption[];
}

let counter = 0;
const newKey = () => `k${Date.now().toString(36)}${(counter++).toString(36)}`;

export function newOption(name = ""): DraftOption {
  return { key: newKey(), name, priceDelta: "", isAvailable: true };
}

export function newChoice(): DraftChoice {
  return {
    key: newKey(),
    name: "",
    required: true,
    mode: "exactly",
    count: 1,
    options: [newOption(), newOption()],
  };
}

export function toDrafts(groups: ChoiceGroup[] = []): DraftChoice[] {
  return groups.map((group) => ({
    key: newKey(),
    id: group.id,
    name: group.name,
    required: group.required,
    mode:
      group.required && group.minPick === group.maxPick ? "exactly" : "upTo",
    count: group.maxPick,
    options: group.options.map((option) => ({
      key: newKey(),
      id: option.id,
      name: option.name,
      priceDelta: option.priceDelta ? String(option.priceDelta) : "",
      isAvailable: option.isAvailable,
    })),
  }));
}

/** The first thing wrong with a choice, said so it can be fixed — or null. */
export function choiceProblem(choice: DraftChoice): string | null {
  if (choice.name.trim().length < 2)
    return "Name the choice, e.g. Choose your protein";
  const options = choice.options.filter((option) => option.name.trim());
  if (options.length === 0) return "Add at least one option";
  if (choice.options.some((o) => !o.name.trim() && o.priceDelta.trim())) {
    return "Give every option a name";
  }
  for (const option of options) {
    const cost = option.priceDelta.trim() ? Number(option.priceDelta) : 0;
    if (!Number.isFinite(cost) || cost < 0)
      return `Check the extra cost on ${option.name}`;
  }
  if (choice.count > options.length) {
    return `Buyers can pick ${choice.count}, but there ${options.length === 1 ? "is" : "are"} only ${options.length} option${options.length === 1 ? "" : "s"}`;
  }
  return null;
}

export function toChoiceInputs(drafts: DraftChoice[]): ChoiceGroupInput[] {
  return drafts.map((choice) => {
    const exactly = choice.required && choice.mode === "exactly";
    return {
      ...(choice.id ? { id: choice.id } : {}),
      name: choice.name.trim(),
      required: choice.required,
      minPick: exactly ? choice.count : choice.required ? 1 : 0,
      maxPick: choice.count,
      options: choice.options
        .filter((option) => option.name.trim())
        .map((option) => ({
          ...(option.id ? { id: option.id } : {}),
          name: option.name.trim(),
          priceDelta: option.priceDelta.trim()
            ? Math.round(Number(option.priceDelta) * 100) / 100
            : 0,
          isAvailable: option.isAvailable,
        })),
    };
  });
}

export function ChoicesEditor({
  choices,
  onChange,
  problems,
}: {
  choices: DraftChoice[];
  onChange: (next: DraftChoice[]) => void;
  /** By choice key. */
  problems: Record<string, string | null>;
}) {
  const update = (key: string, patch: Partial<DraftChoice>) =>
    onChange(choices.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  const updateOption = (
    choice: DraftChoice,
    optionKey: string,
    patch: Partial<DraftOption>,
  ) =>
    update(choice.key, {
      options: choice.options.map((o) =>
        o.key === optionKey ? { ...o, ...patch } : o,
      ),
    });

  return (
    <section className="flex flex-col gap-3 font-dm">
      <div>
        <h4 className="text-sm font-bold text-gray-900">Choices</h4>
        <p className="text-xs text-gray-500">
          Questions buyers answer when they add this dish, e.g. &ldquo;Choose
          your protein&rdquo;. One answer covers the whole pack.
        </p>
      </div>

      {choices.map((choice, index) => (
        <div
          key={choice.key}
          className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3"
        >
          <div className="flex items-center gap-2">
            <input
              aria-label={`Choice ${index + 1} name`}
              value={choice.name}
              maxLength={60}
              placeholder="e.g. Choose your protein"
              onChange={(e) => update(choice.key, { name: e.target.value })}
              className={`${INPUT} font-bold`}
            />
            <button
              type="button"
              onClick={() =>
                onChange(choices.filter((c) => c.key !== choice.key))
              }
              aria-label={`Remove ${choice.name || `choice ${index + 1}`}`}
              className="rounded-full p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-800">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={choice.required}
                onChange={() =>
                  update(choice.key, {
                    required: !choice.required,
                    mode: choice.required ? "upTo" : choice.mode,
                  })
                }
                aria-label={`${choice.name || `Choice ${index + 1}`} required`}
              />
              <span>
                <b>Required</b> — can&apos;t be added without it
              </span>
            </label>
            <span className="flex items-center gap-2">
              Buyers pick
              {choice.required ? (
                <select
                  aria-label="Exactly or up to"
                  value={choice.mode}
                  onChange={(e) =>
                    update(choice.key, {
                      mode: e.target.value as DraftChoice["mode"],
                    })
                  }
                  className="rounded-lg border border-gray-200 px-2 py-1"
                >
                  <option value="exactly">exactly</option>
                  <option value="upTo">up to</option>
                </select>
              ) : (
                <span>up to</span>
              )}
              <select
                aria-label="How many"
                value={choice.count}
                onChange={(e) =>
                  update(choice.key, { count: Number(e.target.value) })
                }
                className="rounded-lg border border-gray-200 px-2 py-1"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </span>
          </div>

          <ul className="flex flex-col gap-2">
            {choice.options.map((option, optionIndex) => (
              <li key={option.key} className="flex items-center gap-2">
                <input
                  aria-label={`Option ${optionIndex + 1}`}
                  value={option.name}
                  maxLength={60}
                  placeholder={optionIndex === 0 ? "e.g. Chicken" : "Option"}
                  onChange={(e) =>
                    updateOption(choice, option.key, { name: e.target.value })
                  }
                  className={`${INPUT} min-w-0 flex-1 ${option.isAvailable ? "" : "text-gray-400 line-through"}`}
                />
                <div className="relative w-28 shrink-0">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    +₦
                  </span>
                  <input
                    aria-label={`Extra cost for ${option.name || `option ${optionIndex + 1}`}, per portion`}
                    inputMode="decimal"
                    value={option.priceDelta}
                    placeholder="0"
                    onChange={(e) =>
                      updateOption(choice, option.key, {
                        priceDelta: e.target.value.replace(/[^\d.]/g, ""),
                      })
                    }
                    className={`${INPUT} pl-8`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateOption(choice, option.key, {
                      isAvailable: !option.isAvailable,
                    })
                  }
                  aria-pressed={!option.isAvailable}
                  aria-label={`${option.name || "Option"} ${option.isAvailable ? "available — click when it runs out" : "out — click when it is back"}`}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${option.isAvailable ? "bg-recommend-green/10 text-recommend-green" : "bg-amber-100 text-amber-800"}`}
                >
                  {option.isAvailable ? "In" : "Out"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update(choice.key, {
                      options: choice.options.filter(
                        (o) => o.key !== option.key,
                      ),
                    })
                  }
                  aria-label={`Remove ${option.name || `option ${optionIndex + 1}`}`}
                  className="shrink-0 px-1 text-lg leading-none text-gray-400 hover:text-red-600"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                update(choice.key, {
                  options: [...choice.options, newOption()],
                })
              }
              disabled={choice.options.length >= 10}
              className="text-sm font-bold text-recommend-green disabled:opacity-40"
            >
              + Add option
            </button>
            <span className="text-xs text-gray-400">
              Extra cost is per portion
            </span>
          </div>

          {problems[choice.key] && (
            <p role="alert" className="text-xs font-bold text-red-600">
              {problems[choice.key]}
            </p>
          )}
        </div>
      ))}

      {choices.length < 5 && (
        <button
          type="button"
          onClick={() => onChange([...choices, newChoice()])}
          className="rounded-xl border border-dashed border-recommend-green/50 py-2 text-sm font-bold text-recommend-green hover:bg-recommend-green/5"
        >
          + Add a choice
        </button>
      )}
    </section>
  );
}
