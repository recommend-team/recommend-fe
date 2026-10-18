"use client";

import { useMemo, useState } from "react";
import { MapPin, Plus, Search, X } from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import Paginator from "@/components/atoms/admin/Paginator";
import { useConfirm } from "@/components/organisms/DialogProvider";
import {
  useAddAreaAlias,
  useAreasOverview,
  useCreateArea,
  useDismissUnplaced,
  usePlaceUnplaced,
  useRemoveAreaAlias,
  useRenameArea,
  useSetAreaActive,
  useUnplacedLocations,
} from "@/hooks";
import type { AreaOverview, StateOverview } from "@/types";

/** Areas on one page, and places waiting to be placed. */
const AREAS_PER_PAGE = 20;
const UNPLACED_PER_PAGE = 10;

/**
 * Where we deliver, and the names buyers use for places in each area.
 *
 * Buyers don't know our area names: someone in Ajah says "Badore" or "Abraham Adesanya".
 * Each area lists those other names, and the places buyers gave that matched nothing
 * wait at the top to be put in an area with one click. The assistant picks up every
 * change on the next message.
 */
export default function AreasPage() {
  const overview = useAreasOverview();
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);

  const states = useMemo(() => overview.data ?? [], [overview.data]);
  const needle = term.trim().toLowerCase();
  // Every matching area in state order, then one page of them, grouped by state again.
  const matching = states.flatMap((state) =>
    state.areas
      .filter(
        (area) =>
          !needle ||
          area.name.toLowerCase().includes(needle) ||
          area.aliases.some((alias) =>
            alias.name.toLowerCase().includes(needle),
          ),
      )
      .map((area) => ({ state, area })),
  );
  const pages = Math.max(1, Math.ceil(matching.length / AREAS_PER_PAGE));
  const current = Math.min(page, pages);
  const onPage = matching.slice(
    (current - 1) * AREAS_PER_PAGE,
    current * AREAS_PER_PAGE,
  );
  const shown = states
    .map((state) => ({
      ...state,
      areas: onPage
        .filter((row) => row.state.id === state.id)
        .map((row) => row.area),
    }))
    .filter((state) => state.areas.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Areas"
        description="Where vendors deliver, and the other names buyers use for places in each area — Badore is in Ajah, Chevron in Lekki."
        right={
          <button
            type="button"
            onClick={() => setAdding((on) => !on)}
            className="inline-flex items-center gap-1.5 rounded-full bg-recommend-green px-4 py-2 font-dm text-sm font-bold text-white hover:bg-recommend-green-hover"
          >
            <Plus size={15} /> Add area
          </button>
        }
      />

      {adding && <AddArea states={states} onDone={() => setAdding(false)} />}

      <Unplaced states={states} />

      <section className="flex flex-col gap-4 rounded-2xl border border-[#FFD91D] bg-white p-5 md:p-6">
        <label className="flex h-10 max-w-sm items-center gap-2 rounded-lg border border-gray-200 px-3 font-dm text-sm">
          <Search size={15} className="text-gray-400" />
          <input
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Find an area or a place in one"
            aria-label="Find an area"
            className="flex-1 outline-none"
          />
        </label>

        {overview.isLoading && (
          <p className="py-6 text-center font-dm text-sm text-gray-400">
            Loading areas…
          </p>
        )}
        {overview.isError && (
          <p className="py-6 text-center font-dm text-sm text-red-600">
            Couldn&apos;t load areas.
          </p>
        )}
        {!overview.isLoading && shown.length === 0 && (
          <p className="py-6 text-center font-dm text-sm text-gray-400">
            {needle
              ? "Nothing matches that."
              : "No areas yet. Add the first one."}
          </p>
        )}

        {shown.map((state) => (
          <div key={state.id} className="flex flex-col">
            <h2 className="font-dm text-xs font-bold uppercase tracking-wide text-gray-400">
              {state.name}
            </h2>
            <ul className="flex flex-col divide-y divide-gray-100">
              {state.areas.map((area) => (
                <AreaRow key={area.id} area={area} />
              ))}
            </ul>
          </div>
        ))}

        {matching.length > AREAS_PER_PAGE && (
          <Paginator
            page={current}
            total={matching.length}
            pageSize={AREAS_PER_PAGE}
            loadedOnThisPage={onPage.length}
            onChange={setPage}
            label="areas"
          />
        )}
      </section>
    </div>
  );
}

/** The places buyers gave that no area or name explains — most asked-about first. */
function Unplaced({ states }: { states: StateOverview[] }) {
  const unplaced = useUnplacedLocations();
  const place = usePlaceUnplaced();
  const dismiss = useDismissUnplaced();
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const all = unplaced.data ?? [];
  if (all.length === 0) return null;
  // Placing or dismissing the last on a page leaves the page empty: step back.
  const current = Math.min(page, Math.ceil(all.length / UNPLACED_PER_PAGE));
  const rows = all.slice(
    (current - 1) * UNPLACED_PER_PAGE,
    current * UNPLACED_PER_PAGE,
  );

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 md:p-6">
      <div>
        <h2 className="font-dm text-base font-bold text-gray-900">
          Places buyers typed that we couldn&apos;t place
        </h2>
        <p className="font-dm text-xs text-gray-600">
          Choose the area each is in. It becomes one of that area&apos;s names,
          and the assistant understands it from the next message on.
        </p>
      </div>
      {failure && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-2 font-dm text-sm text-red-600"
        >
          {failure}
        </p>
      )}
      <ul className="flex flex-col divide-y divide-amber-100">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-center gap-3 py-2.5 font-dm text-sm"
          >
            <span className="min-w-0 flex-1">
              <b className="text-gray-900">{row.text}</b>
              <span className="ml-2 text-xs text-gray-500">
                ×{row.timesSeen} · last{" "}
                {new Date(row.lastSeenAt).toLocaleDateString()}
              </span>
            </span>
            <AreaSelect
              states={states}
              value={chosen[row.id] ?? ""}
              onChange={(areaId) =>
                setChosen((c) => ({ ...c, [row.id]: areaId }))
              }
              label={`Area for ${row.text}`}
            />
            <button
              type="button"
              disabled={!chosen[row.id] || place.isPending}
              onClick={() => {
                setFailure(null);
                place.mutate(
                  { id: row.id, areaId: chosen[row.id] },
                  {
                    onSuccess: () => void unplaced.refetch(),
                    onError: (e) => setFailure(e.message),
                  },
                );
              }}
              className="rounded-full bg-recommend-green px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
            >
              Add to area
            </button>
            <button
              type="button"
              onClick={() =>
                dismiss.mutate(row.id, {
                  onSuccess: () => void unplaced.refetch(),
                })
              }
              className="rounded-full px-2 py-1.5 text-xs font-bold text-gray-500 hover:bg-white"
            >
              Dismiss
            </button>
          </li>
        ))}
      </ul>
      {all.length > UNPLACED_PER_PAGE && (
        <Paginator
          page={current}
          total={all.length}
          pageSize={UNPLACED_PER_PAGE}
          loadedOnThisPage={rows.length}
          onChange={setPage}
          label="places"
        />
      )}
    </section>
  );
}

function AreaRow({ area }: { area: AreaOverview }) {
  const addAlias = useAddAreaAlias();
  const removeAlias = useRemoveAreaAlias();
  const rename = useRenameArea();
  const setActive = useSetAreaActive();
  const confirm = useConfirm();
  const [name, setName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const add = () => {
    if (name.trim().length < 2) return;
    setFailure(null);
    addAlias.mutate(
      { areaId: area.id, name: name.trim() },
      { onSuccess: () => setName(""), onError: (e) => setFailure(e.message) },
    );
  };

  return (
    <li className="flex flex-col gap-2 py-3 font-dm">
      <div className="flex flex-wrap items-center gap-3">
        <MapPin
          size={15}
          className={area.isActive ? "text-recommend-green" : "text-gray-300"}
        />
        {renaming !== null ? (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setFailure(null);
              rename.mutate(
                { areaId: area.id, name: renaming.trim() },
                {
                  onSuccess: () => setRenaming(null),
                  onError: (er) => setFailure(er.message),
                },
              );
            }}
          >
            <input
              autoFocus
              value={renaming}
              onChange={(e) => setRenaming(e.target.value)}
              aria-label={`New name for ${area.name}`}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
            />
            <button
              type="submit"
              className="text-xs font-bold text-recommend-green"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setRenaming(null)}
              className="text-xs text-gray-500"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setRenaming(area.name)}
            title="Rename"
            className={`text-sm font-bold ${area.isActive ? "text-gray-900" : "text-gray-400 line-through"}`}
          >
            {area.name}
          </button>
        )}
        <span className="text-xs text-gray-500">
          {area.vendorCount === 0
            ? "No vendors yet"
            : `${area.vendorCount} vendor${area.vendorCount === 1 ? "" : "s"}`}
        </span>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs font-bold text-gray-600">
          <input
            type="checkbox"
            checked={area.isActive}
            disabled={setActive.isPending}
            aria-label={`${area.name} switched on`}
            onChange={async (e) => {
              const active = e.target.checked;
              if (!active && area.vendorCount > 0) {
                const ok = await confirm({
                  title: `Switch off ${area.name}?`,
                  message: `${area.vendorCount} vendor${area.vendorCount === 1 ? " delivers" : "s deliver"} here. Buyers in ${area.name} won't find them until it's back on.`,
                  confirmLabel: "Switch off",
                  variant: "danger",
                });
                if (!ok) return;
              }
              setActive.mutate({ areaId: area.id, active });
            }}
          />
          {area.isActive ? "On" : "Off"}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pl-6">
        <span className="text-xs text-gray-500">Also known as:</span>
        {area.aliases.length === 0 && (
          <span className="text-xs text-gray-400">—</span>
        )}
        {area.aliases.map((alias) => (
          <span
            key={alias.id}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-0.5 pl-2.5 pr-1 text-xs text-gray-700"
          >
            {alias.name}
            <button
              type="button"
              onClick={() => removeAlias.mutate(alias.id)}
              aria-label={`Remove ${alias.name} from ${area.name}`}
              className="grid h-4 w-4 place-items-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <form
          className="inline-flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="+ Add a place"
            aria-label={`Add a place in ${area.name}`}
            className="w-32 rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-xs outline-none focus:border-recommend-green"
          />
        </form>
      </div>
      {failure && (
        <p role="alert" className="pl-6 text-xs text-red-600">
          {failure}
        </p>
      )}
    </li>
  );
}

function AddArea({
  states,
  onDone,
}: {
  states: StateOverview[];
  onDone: () => void;
}) {
  const create = useCreateArea();
  const [stateId, setStateId] = useState(states[0]?.id ?? "");
  const [name, setName] = useState("");
  const [failure, setFailure] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setFailure(null);
        create.mutate(
          { stateId, name: name.trim() },
          { onSuccess: onDone, onError: (er) => setFailure(er.message) },
        );
      }}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-gray-200 bg-white p-4 font-dm text-sm"
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-gray-600">State</span>
        <select
          value={stateId}
          onChange={(e) => setStateId(e.target.value)}
          className="rounded-lg border border-gray-200 px-2 py-2"
        >
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-gray-600">Area name</span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ogudu"
          className="rounded-lg border border-gray-200 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={name.trim().length < 2 || !stateId || create.isPending}
        className="rounded-full bg-recommend-green px-4 py-2 font-bold text-white disabled:opacity-40"
      >
        Add area
      </button>
      <button
        type="button"
        onClick={onDone}
        className="px-2 py-2 text-gray-500"
      >
        Cancel
      </button>
      {failure && (
        <p role="alert" className="basis-full text-xs text-red-600">
          {failure}
        </p>
      )}
    </form>
  );
}

function AreaSelect({
  states,
  value,
  onChange,
  label,
}: {
  states: StateOverview[];
  value: string;
  onChange: (areaId: string) => void;
  label: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
    >
      <option value="">Which area is it in?</option>
      {states.map((state) => (
        <optgroup key={state.id} label={state.name}>
          {state.areas
            .filter((area) => area.isActive)
            .map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );
}
