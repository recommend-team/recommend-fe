"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Archive, History, Pencil, Percent, Plus, RotateCcw, X } from "lucide-react";
import {
  useCategories,
  useCategoryRateHistory,
  useChangeCategoryRate,
  useCreateCategory,
  useCurrentUser,
  useUpdateCategory,
} from "@/hooks";
import { useConfirm } from "@/components/organisms/DialogProvider";
import UncategorisedVendors from "@/components/organisms/UncategorisedVendors";
import { describeRateChange, parseWords, percentText } from "@/lib/categories";
import type { Category } from "@/types";

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * The categories Recommend offers, and what it keeps of each one's sales. Any admin adds,
 * renames and archives categories and edits their words; only the Super Admin changes a
 * percentage.
 */
export default function CategoriesPage() {
  const { data: me } = useCurrentUser();
  const isSuperAdmin = me?.role === "SUPER_ADMIN";
  const list = useCategories();
  const [creating, setCreating] = useState(false);

  const categories = list.data?.categories ?? [];
  const standard = list.data?.standardPercent ?? 20;
  const uncategorised = list.data?.uncategorisedVendors ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-dm text-2xl font-bold text-gray-900 md:text-3xl">Categories</h1>
          <p className="font-dm text-sm text-gray-500">
            What Recommend offers, and what it keeps of each sale.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-recommend-green px-4 py-2 font-dm text-sm font-bold text-white hover:bg-recommend-green-hover"
          >
            <Plus size={16} />
            New category
          </button>
        )}
      </div>

      <p className="rounded-xl bg-white px-4 py-3 font-dm text-sm text-gray-600">
        A rate change applies from the next order — orders already placed keep the rate
        they were charged at.{" "}
        {uncategorised > 0
          ? `${uncategorised} vendor${uncategorised === 1 ? " isn't" : "s aren't"} in a category yet and pay${uncategorised === 1 ? "s" : ""} the standard ${percentText(standard)}.`
          : `Vendors in no category pay the standard ${percentText(standard)}.`}
        {!isSuperAdmin && " Only the Super Admin can change a percentage."}
      </p>

      <UncategorisedVendors
        categories={categories.filter((category) => category.isActive)}
        standardPercent={standard}
      />

      {creating && (
        <CreateCategoryForm
          isSuperAdmin={isSuperAdmin}
          standard={standard}
          onDone={() => setCreating(false)}
        />
      )}

      <section className="flex flex-col gap-3">
        {list.isLoading ? (
          <p className="py-6 text-center font-dm text-sm text-gray-400">Loading categories…</p>
        ) : list.isError ? (
          <p className="py-6 text-center font-dm text-sm text-red-600">
            Couldn&apos;t load the categories. Refresh to try again.
          </p>
        ) : categories.length === 0 ? (
          <p className="py-6 text-center font-dm text-sm text-gray-400">No categories yet.</p>
        ) : (
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} isSuperAdmin={isSuperAdmin} />
          ))
        )}
      </section>
    </div>
  );
}

function CreateCategoryForm({
  isSuperAdmin,
  standard,
  onDone,
}: {
  isSuperAdmin: boolean;
  standard: number;
  onDone: () => void;
}) {
  const create = useCreateCategory();
  const [name, setName] = useState("");
  const [words, setWords] = useState("");
  const [percent, setPercent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const feePercent = isSuperAdmin && percent.trim() !== "" ? Number(percent) : undefined;
    if (feePercent !== undefined && !Number.isFinite(feePercent)) {
      setError("Enter the percentage as a number, like 10.");
      return;
    }
    try {
      await create.mutateAsync({
        name: name.trim(),
        keywords: parseWords(words),
        feePercent,
      });
      onDone();
    } catch (cause) {
      setError(errorText(cause, "Couldn't create the category."));
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-2xl border border-[#FFD91D] bg-white p-5 font-dm md:p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">New category</h2>
        <button
          type="button"
          onClick={onDone}
          aria-label="Close"
          className="grid h-8 w-8 place-items-center rounded-full text-gray-500 hover:bg-black/5"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-gray-700">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Pets"
            required
            minLength={2}
            maxLength={60}
            className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:border-recommend-green"
          />
        </label>
        {isSuperAdmin ? (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-gray-700">Recommend keeps (%)</span>
            <input
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
              inputMode="decimal"
              placeholder={String(standard)}
              className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:border-recommend-green"
            />
          </label>
        ) : (
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-gray-700">Recommend keeps</span>
            <span className="flex h-10 items-center text-gray-500">
              {percentText(standard)} to start
            </span>
          </div>
        )}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-gray-700">
          Words buyers might use <span className="font-normal text-gray-400">(optional)</span>
        </span>
        <textarea
          value={words}
          onChange={(event) => setWords(event.target.value)}
          placeholder="dog food, cat litter, pet toys"
          rows={2}
          className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-recommend-green"
        />
        <span className="text-xs text-gray-500">
          Separate with commas. The assistant already finds products by name — these help
          when a buyer asks more loosely, like &quot;something for my dog&quot;.
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="h-10 rounded-full px-4 text-sm font-semibold text-gray-600 hover:bg-black/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={create.isPending || name.trim().length < 2}
          className="h-10 rounded-full bg-recommend-green px-5 text-sm font-bold text-white hover:bg-recommend-green-hover disabled:opacity-40"
        >
          {create.isPending ? "Creating…" : "Create category"}
        </button>
      </div>
    </form>
  );
}

function CategoryCard({
  category,
  isSuperAdmin,
}: {
  category: Category;
  isSuperAdmin: boolean;
}) {
  const confirm = useConfirm();
  const update = useUpdateCategory();
  const changeRate = useChangeCategoryRate();
  const [mode, setMode] = useState<"view" | "edit" | "rate">("view");
  const [showHistory, setShowHistory] = useState(false);
  const [name, setName] = useState(category.name);
  const [words, setWords] = useState(category.keywords.join(", "));
  const [percent, setPercent] = useState(String(category.feePercent));
  const [error, setError] = useState<string | null>(null);
  const history = useCategoryRateHistory(category.id, showHistory);

  const vendors = `${category.vendorCount} vendor${category.vendorCount === 1 ? "" : "s"}`;
  const shownWords = category.keywords.slice(0, 14);
  const moreWords = category.keywords.length - shownWords.length;

  const open = (next: "edit" | "rate") => {
    setError(null);
    setName(category.name);
    setWords(category.keywords.join(", "));
    setPercent(String(category.feePercent));
    setMode(next);
  };

  const saveEdit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const renamed = name.trim() !== category.name;
    if (renamed) {
      const ok = await confirm({
        title: `Rename ${category.name} to ${name.trim()}?`,
        message: `Its ${vendors} move with it and keep their rate.`,
        confirmLabel: "Rename",
      });
      if (!ok) return;
    }
    try {
      await update.mutateAsync({
        id: category.id,
        changes: { ...(renamed ? { name: name.trim() } : {}), keywords: parseWords(words) },
      });
      setMode("view");
    } catch (cause) {
      setError(errorText(cause, "Couldn't save the category."));
    }
  };

  const saveRate = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const next = Number(percent);
    if (percent.trim() === "" || !Number.isFinite(next)) {
      setError("Enter the percentage as a number, like 10.");
      return;
    }
    if (next === category.feePercent) {
      setMode("view");
      return;
    }
    const ok = await confirm({
      title: `Change ${category.name} from ${percentText(category.feePercent)} to ${percentText(next)}?`,
      message: `Applies to ${vendors} from their next order. Orders already placed stay at ${percentText(category.feePercent)}.`,
      confirmLabel: `Change to ${percentText(next)}`,
    });
    if (!ok) return;
    try {
      await changeRate.mutateAsync({ id: category.id, feePercent: next });
      setMode("view");
    } catch (cause) {
      setError(errorText(cause, "Couldn't change the rate."));
    }
  };

  const toggleArchived = async () => {
    setError(null);
    if (category.isActive) {
      const ok = await confirm({
        title: `Archive ${category.name}?`,
        message: `The assistant stops offering it. Its ${vendors} keep selling, at ${percentText(category.feePercent)}.`,
        confirmLabel: "Archive",
      });
      if (!ok) return;
    }
    try {
      await update.mutateAsync({ id: category.id, changes: { isActive: !category.isActive } });
    } catch (cause) {
      setError(errorText(cause, "Couldn't update the category."));
    }
  };

  return (
    <article
      className={[
        "flex flex-col gap-3 rounded-2xl border bg-white p-5 font-dm",
        category.isActive ? "border-[#FFD91D]" : "border-gray-200 opacity-75",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {category.name}
            {!category.isActive && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                Archived
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500">{vendors}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-recommend-green">
            {percentText(category.feePercent)}
          </p>
          <p className="text-xs text-gray-500">Recommend keeps</p>
        </div>
      </div>

      {mode === "edit" ? (
        <form onSubmit={saveEdit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-gray-700">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={60}
              className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:border-recommend-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-gray-700">Words buyers might use</span>
            <textarea
              value={words}
              onChange={(event) => setWords(event.target.value)}
              rows={3}
              className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-recommend-green"
            />
            <span className="text-xs text-gray-500">Separate with commas.</span>
          </label>
          <FormButtons
            busy={update.isPending}
            label="Save"
            onCancel={() => setMode("view")}
          />
        </form>
      ) : mode === "rate" ? (
        <form onSubmit={saveRate} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-gray-700">Recommend keeps (%)</span>
            <input
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
              inputMode="decimal"
              aria-label={`New percentage for ${category.name}`}
              className="h-10 w-32 rounded-lg border border-gray-200 px-3 outline-none focus:border-recommend-green"
            />
          </label>
          <FormButtons
            busy={changeRate.isPending}
            label="Change rate"
            onCancel={() => setMode("view")}
          />
        </form>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {shownWords.length === 0 ? (
            <span className="text-xs text-gray-400">
              No words yet — the assistant finds it by its name.
            </span>
          ) : (
            shownWords.map((word) => (
              <span key={word} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                {word}
              </span>
            ))
          )}
          {moreWords > 0 && (
            <span className="px-1 py-0.5 text-xs text-gray-500">+{moreWords} more</span>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {mode === "view" && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
          <CardButton onClick={() => open("edit")} icon={<Pencil size={14} />}>
            Edit
          </CardButton>
          {isSuperAdmin && (
            <CardButton onClick={() => open("rate")} icon={<Percent size={14} />}>
              Change rate
            </CardButton>
          )}
          <CardButton
            onClick={() => setShowHistory((shown) => !shown)}
            icon={<History size={14} />}
            expanded={showHistory}
          >
            {showHistory ? "Hide rate history" : "Rate history"}
          </CardButton>
          <CardButton
            onClick={() => void toggleArchived()}
            icon={category.isActive ? <Archive size={14} /> : <RotateCcw size={14} />}
            disabled={update.isPending}
          >
            {category.isActive ? "Archive" : "Restore"}
          </CardButton>
        </div>
      )}

      {showHistory && (
        <div className="rounded-xl bg-black/[0.03] px-3 py-2">
          {history.isLoading ? (
            <p className="text-xs text-gray-400">Loading…</p>
          ) : !history.data?.length ? (
            <p className="text-xs text-gray-500">No changes recorded.</p>
          ) : (
            <ol className="flex flex-col gap-1.5">
              {history.data.map((change) => (
                <li key={change.id} className="text-xs text-gray-700">
                  <span className="text-gray-400">{when(change.createdAt)} · </span>
                  {describeRateChange(change)}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </article>
  );
}

function CardButton({
  onClick,
  icon,
  children,
  disabled,
  expanded,
}: {
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-expanded={expanded}
      className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-gray-700 hover:bg-black/5 disabled:opacity-50"
    >
      {icon}
      {children}
    </button>
  );
}

function FormButtons({
  busy,
  label,
  onCancel,
}: {
  busy: boolean;
  label: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="h-10 rounded-full px-4 text-sm font-semibold text-gray-600 hover:bg-black/5"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={busy}
        className="h-10 rounded-full bg-recommend-green px-5 text-sm font-bold text-white hover:bg-recommend-green-hover disabled:opacity-40"
      >
        {busy ? "Saving…" : label}
      </button>
    </div>
  );
}
