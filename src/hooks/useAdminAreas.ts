"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAreaAlias,
  createArea,
  dismissUnplaced,
  getAreasOverview,
  getUnplacedLocations,
  placeUnplaced,
  removeAreaAlias,
  renameArea,
  setAreaActive,
} from "@/services";
import type { ApiError } from "@/lib/api";
import type { StateOverview, UnplacedLocation } from "@/types";

const AREAS = ["admin", "areas"] as const;
const UNPLACED = ["admin", "areas", "unplaced"] as const;

export function useAreasOverview() {
  return useQuery<StateOverview[]>({
    queryKey: AREAS,
    queryFn: getAreasOverview,
    staleTime: 1000 * 30,
  });
}

export function useUnplacedLocations() {
  return useQuery<UnplacedLocation[]>({
    queryKey: UNPLACED,
    queryFn: getUnplacedLocations,
    staleTime: 1000 * 30,
  });
}

/** Any change here can move a name from the unplaced list into an area: refresh both. */
function useAreaMutation<T>(fn: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, T>({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AREAS }),
  });
}

export const useAddAreaAlias = () =>
  useAreaMutation(({ areaId, name }: { areaId: string; name: string }) =>
    addAreaAlias(areaId, name),
  );
export const useRemoveAreaAlias = () =>
  useAreaMutation((aliasId: string) => removeAreaAlias(aliasId));
export const useCreateArea = () =>
  useAreaMutation(({ stateId, name }: { stateId: string; name: string }) =>
    createArea(stateId, name),
  );
export const useRenameArea = () =>
  useAreaMutation(({ areaId, name }: { areaId: string; name: string }) =>
    renameArea(areaId, name),
  );
export const useSetAreaActive = () =>
  useAreaMutation(({ areaId, active }: { areaId: string; active: boolean }) =>
    setAreaActive(areaId, active),
  );
export const usePlaceUnplaced = () =>
  useAreaMutation(({ id, areaId }: { id: string; areaId: string }) =>
    placeUnplaced(id, areaId),
  );
export const useDismissUnplaced = () =>
  useAreaMutation((id: string) => dismissUnplaced(id));
