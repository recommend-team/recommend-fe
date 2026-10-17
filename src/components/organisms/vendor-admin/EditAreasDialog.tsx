"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Modal from "@/components/atoms/admin/Modal";
import { useAllAreas, useUpdateVendor } from "@/hooks";
import type { AdminVendorDetail } from "@/types";
import { FormActions, FormError } from "./form";

/** The server's ceiling — a vendor can serve at most 20 areas. */
const MAX_AREAS = 20;

/**
 * Where the vendor delivers. Buyers in these areas find them; checkout refuses a delivery
 * anywhere else. Every active area, grouped by state, with a search.
 */
export default function EditAreasDialog({
  vendor,
  current,
  onClose,
}: {
  vendor: AdminVendorDetail["vendor"];
  current: AdminVendorDetail["serviceAreas"];
  onClose: () => void;
}) {
  const update = useUpdateVendor(vendor.id);
  const areas = useAllAreas(true);
  const [chosen, setChosen] = useState<Set<string>>(
    () => new Set(current.map((area) => area.id))
  );
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (areas.data ?? [])
      .map(({ state, areas: list }) => ({
        state,
        areas: term
          ? list.filter(
              (area) =>
                area.name.toLowerCase().includes(term) ||
                state.name.toLowerCase().includes(term)
            )
          : list,
      }))
      .filter((group) => group.areas.length > 0);
  }, [areas.data, query]);

  const toggle = (id: string) =>
    setChosen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const unchanged =
    chosen.size === current.length && current.every((area) => chosen.has(area.id));
  const tooMany = chosen.size > MAX_AREAS;

  return (
    <Modal
      title="Delivery areas"
      description="Buyers here can find and order from this vendor."
      onClose={onClose}
      width="max-w-lg"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (unchanged) return onClose();
          update.mutate({ areaIds: [...chosen] }, { onSuccess: onClose });
        }}
        className="flex flex-col gap-3"
      >
        <label className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 text-gray-500 focus-within:border-recommend-green">
          <Search size={15} aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search areas"
            aria-label="Search areas"
            className="flex-1 bg-transparent font-dm text-sm text-gray-900 outline-none"
          />
        </label>

        <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200">
          {areas.isLoading && (
            <p className="p-4 text-center font-dm text-sm text-gray-400">Loading areas…</p>
          )}
          {areas.isError && (
            <p className="p-4 text-center font-dm text-sm text-red-600">
              Couldn&apos;t load the areas.
            </p>
          )}
          {!areas.isLoading && groups.length === 0 && (
            <p className="p-4 text-center font-dm text-sm text-gray-400">No area matches.</p>
          )}
          {groups.map(({ state, areas: list }) => (
            <fieldset key={state.id} className="border-b border-gray-100 last:border-b-0">
              <legend className="sr-only">{state.name}</legend>
              <p className="sticky top-0 bg-gray-50 px-3 py-1.5 font-dm text-[11px] font-bold uppercase tracking-wide text-gray-500">
                {state.name}
              </p>
              <div className="grid grid-cols-2 gap-x-2 p-2">
                {list.map((area) => (
                  <label
                    key={area.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 font-dm text-sm text-gray-800 hover:bg-amber-50"
                  >
                    <input
                      type="checkbox"
                      checked={chosen.has(area.id)}
                      onChange={() => toggle(area.id)}
                    />
                    {area.name}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <p className="font-dm text-xs text-gray-500">
          {chosen.size} chosen{tooMany ? ` — at most ${MAX_AREAS}` : ""}
        </p>

        <FormError
          message={
            tooMany
              ? `A vendor can serve at most ${MAX_AREAS} areas.`
              : update.isError
                ? update.error.message
                : null
          }
        />
        <FormActions onCancel={onClose} saving={update.isPending} disabled={tooMany} />
      </form>
    </Modal>
  );
}
