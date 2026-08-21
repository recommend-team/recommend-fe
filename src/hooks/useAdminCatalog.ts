"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCatalogAreas,
  getCatalogProducts,
  getCatalogStores,
  setConversationArea,
} from "@/services";
import type {
  CatalogArea,
  CatalogContext,
  CatalogProduct,
  CatalogStore,
} from "@/types";

const CATALOG_KEY = (id: string) => ["admin", "conversation", id, "catalog"];

/** Areas, with the one this conversation already believes the buyer is in. */
export function useCatalogAreas(
  conversationId: string,
  search: string,
  enabled = true
) {
  return useQuery<CatalogContext>({
    queryKey: [...CATALOG_KEY(conversationId), "areas", search],
    queryFn: () => getCatalogAreas(conversationId, search || undefined),
    enabled,
    placeholderData: keepPreviousData,
  });
}

/**
 * Remembering the area writes to the conversation, so everything scoped to it — the
 * stores, the products — has to be reconsidered afterwards.
 */
export function useSetConversationArea(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation<CatalogArea, Error, string>({
    mutationFn: (areaId) => setConversationArea(conversationId, areaId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: CATALOG_KEY(conversationId),
      });
    },
  });
}

/** Stores that can actually deliver to this buyer. */
export function useCatalogStores(
  conversationId: string,
  params: { areaId?: string; search?: string },
  enabled = true
) {
  return useQuery<CatalogStore[]>({
    queryKey: [...CATALOG_KEY(conversationId), "stores", params],
    queryFn: () => getCatalogStores(conversationId, params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

/** What one store sells, or a search across every store serving the buyer. */
export function useCatalogProducts(
  conversationId: string,
  params: { areaId?: string; vendorId?: string; search?: string },
  enabled = true
) {
  return useQuery<CatalogProduct[]>({
    queryKey: [...CATALOG_KEY(conversationId), "products", params],
    queryFn: () => getCatalogProducts(conversationId, params),
    enabled,
    placeholderData: keepPreviousData,
  });
}
