import { request } from "@/lib/api";
import type { AreaAliasRow, StateOverview, UnplacedLocation } from "@/types";

/** Every state and area, with vendor counts and other names. */
export async function getAreasOverview(): Promise<StateOverview[]> {
  return request<StateOverview[]>("/admin/locations/overview");
}

export async function addAreaAlias(
  areaId: string,
  name: string,
): Promise<AreaAliasRow> {
  return request<AreaAliasRow>(`/admin/locations/areas/${areaId}/aliases`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function removeAreaAlias(aliasId: string): Promise<unknown> {
  return request<unknown>(`/admin/locations/aliases/${aliasId}`, {
    method: "DELETE",
  });
}

export async function createArea(
  stateId: string,
  name: string,
): Promise<unknown> {
  return request<unknown>("/admin/locations/areas", {
    method: "POST",
    body: JSON.stringify({ stateId, name }),
  });
}

export async function renameArea(
  areaId: string,
  name: string,
): Promise<unknown> {
  return request<unknown>(`/admin/locations/areas/${areaId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function setAreaActive(
  areaId: string,
  active: boolean,
): Promise<unknown> {
  return request<unknown>(
    `/admin/locations/areas/${areaId}/${active ? "activate" : "deactivate"}`,
    { method: "PATCH" },
  );
}

/** Places buyers gave that matched no area, most asked-about first. */
export async function getUnplacedLocations(): Promise<UnplacedLocation[]> {
  return request<UnplacedLocation[]>("/admin/locations/unplaced");
}

export async function placeUnplaced(
  id: string,
  areaId: string,
): Promise<unknown> {
  return request<unknown>(`/admin/locations/unplaced/${id}/place`, {
    method: "POST",
    body: JSON.stringify({ areaId }),
  });
}

export async function dismissUnplaced(id: string): Promise<unknown> {
  return request<unknown>(`/admin/locations/unplaced/${id}`, {
    method: "DELETE",
  });
}
