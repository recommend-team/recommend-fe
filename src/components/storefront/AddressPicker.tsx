"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { resolvePlace, suggestPlaces } from "@/services";
import type { PickedPlace, PlaceSuggestion } from "@/types";

/** Wait for a pause in typing before asking: every search is a paid request. */
const PAUSE_MS = 350;

function newSession(): string {
  return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * The delivery address, picked from Google rather than typed: the buyer types a few
 * letters, picks their place, and it comes back with its full address and our area.
 *
 * One session runs from the first letter to the pick, so Google bills the search as one.
 * If Google can't be reached, `onUnavailable` lets the page fall back to typing.
 */
export function AddressPicker({
  picked,
  onPick,
  onClear,
  onUnavailable,
  areaId,
  invalid = false,
}: {
  picked: PickedPlace | null;
  onPick: (picked: PickedPlace) => void;
  onClear: () => void;
  onUnavailable: () => void;
  /** Lean suggestions towards this area, when there is one obvious one. */
  areaId?: string;
  invalid?: boolean;
}) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  /** What the shown suggestions are for — so "no matches" only follows a real search. */
  const [searched, setSearched] = useState("");
  const [resolving, setResolving] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const session = useRef(newSession());

  useEffect(() => {
    const q = text.trim();
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const found = await suggestPlaces(q, session.current, areaId);
        if (!cancelled) {
          setSuggestions(found);
          setSearched(q);
          setFailure(null);
        }
      } catch {
        if (!cancelled) onUnavailable();
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, PAUSE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, areaId, onUnavailable]);

  const choose = async (suggestion: PlaceSuggestion) => {
    setResolving(suggestion.placeId);
    setFailure(null);
    try {
      const result = await resolvePlace(suggestion.placeId, session.current);
      onPick(result);
      setSuggestions([]);
      setText("");
      // The pick ends the session; a change of mind starts a new one.
      session.current = newSession();
    } catch {
      setFailure("Couldn't get that address. Try another, or type it instead.");
    } finally {
      setResolving(null);
    }
  };

  if (picked) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
        <MapPin
          size={16}
          className="mt-0.5 shrink-0 text-recommend-orange"
          aria-hidden
        />
        <p className="min-w-0 flex-1 text-sm text-gray-900">
          {picked.place.address}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-xs font-bold text-[#C2410C] hover:underline"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <label
        className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 ${
          invalid
            ? "border-red-400"
            : "border-gray-200 focus-within:border-recommend-orange"
        }`}
      >
        <Search size={15} className="shrink-0 text-gray-400" aria-hidden />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing your street or estate"
          aria-label="Search for your address"
          autoComplete="off"
          className="min-w-0 flex-1 text-sm text-gray-900 outline-none"
        />
        {searching && (
          <Loader2 size={15} className="shrink-0 animate-spin text-gray-400" />
        )}
      </label>

      {suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Addresses"
          className="mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.placeId}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => void choose(suggestion)}
                disabled={!!resolving}
                className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 disabled:opacity-60"
              >
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-gray-400"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-gray-900">
                    {suggestion.main}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {suggestion.secondary}
                  </span>
                </span>
                {resolving === suggestion.placeId && (
                  <Loader2
                    size={14}
                    className="mt-0.5 shrink-0 animate-spin text-gray-400"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {searched === text.trim() &&
        searched.length >= 3 &&
        suggestions.length === 0 && (
          <p className="mt-1 text-xs text-gray-500">
            No matches yet — keep typing.
          </p>
        )}
      {failure && <p className="mt-1 text-xs text-red-600">{failure}</p>}
    </div>
  );
}
