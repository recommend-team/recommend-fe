/** Where a delivery address was picked on the map. */
export interface DeliveryPin {
  latitude: number;
  longitude: number;
  placeId: string;
}

/**
 * The pin in Google Maps — opens the app on a phone, so it can go straight to a rider.
 * Needs no API key.
 */
export function mapsUrl(pin: DeliveryPin): string {
  const query = new URLSearchParams({
    api: "1",
    query: `${pin.latitude},${pin.longitude}`,
    query_place_id: pin.placeId,
  });
  return `https://www.google.com/maps/search/?${query.toString()}`;
}
