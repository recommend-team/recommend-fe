import { request } from "@/lib/api";
import type { PickedPlace, PlaceSuggestion } from "@/types";

/** Address suggestions for what the buyer has typed, one session per address search. */
export async function suggestPlaces(
  q: string,
  session: string,
  areaId?: string,
): Promise<PlaceSuggestion[]> {
  const query = new URLSearchParams({ q, session });
  if (areaId) query.set("areaId", areaId);
  return request<PlaceSuggestion[]>(`/places/suggest?${query.toString()}`);
}

/** The picked suggestion: its full address, pin, our area, and the token checkout takes. */
export async function resolvePlace(
  placeId: string,
  session: string,
): Promise<PickedPlace> {
  const query = new URLSearchParams({ placeId, session });
  return request<PickedPlace>(`/places/resolve?${query.toString()}`);
}
