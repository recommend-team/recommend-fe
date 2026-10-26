/** A delivery address picked from Google Places (`GET /places/...`). */

export interface PlaceSuggestion {
  placeId: string;
  /** "Abraham Adesanya, Ajah, Lekki, Nigeria" */
  text: string;
  /** "Abraham Adesanya" */
  main: string;
  /** "Ajah, Lekki, Nigeria" */
  secondary: string;
}

export interface DeliveryPlace {
  placeId: string;
  address: string;
  latitude: number;
  longitude: number;
  /** Our area it is in — null when none of Google's names for it is one of ours. */
  areaId: string | null;
  areaName: string | null;
}

/** The pick, and the token checkout accepts for it. */
export interface PickedPlace {
  place: DeliveryPlace;
  token: string;
}
