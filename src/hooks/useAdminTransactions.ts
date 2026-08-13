"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeTransaction,
  dispatchTransaction,
  getAdminTransactions,
  getTransactionHistory,
  overrideTransactionStatus,
  verifyAdminTransaction,
} from "@/services";
import { ApiError } from "@/lib/api";
import type {
  AdminStatusEvent,
  AdminTransactionSummary,
  PaginatedResult,
  TransactionListFilters,
} from "@/types";
import { queryKeys } from "./queryKeys";

export function useAdminTransactions(filters: TransactionListFilters = {}) {
  return useQuery<PaginatedResult<AdminTransactionSummary>>({
    queryKey: queryKeys.adminTransactions(filters),
    queryFn: () => getAdminTransactions(filters),
    staleTime: 1000 * 30,
  });
}

export function useVerifyTransaction() {
  const queryClient = useQueryClient();

  return useMutation<AdminTransactionSummary, ApiError, string>({
    mutationFn: verifyAdminTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

/**
 * The lifecycle actions, all invalidating the same two lists.
 *
 * A checkout moving can move its vendor orders with it — completion does — so patching
 * the cache by hand would drift from what the server actually did.
 */
function useLifecycleAction<TInput>(
  action: (input: TInput) => Promise<AdminTransactionSummary>
) {
  const queryClient = useQueryClient();

  return useMutation<AdminTransactionSummary, ApiError, TInput>({
    mutationFn: action,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

export function useDispatchTransaction() {
  return useLifecycleAction(dispatchTransaction);
}

export function useCompleteTransaction() {
  return useLifecycleAction(completeTransaction);
}

export function useOverrideTransactionStatus() {
  return useLifecycleAction(overrideTransactionStatus);
}

/** Fetched only when the history panel is actually open. */
export function useTransactionHistory(reference: string | null) {
  return useQuery<AdminStatusEvent[]>({
    queryKey: ["admin", "transactions", "history", reference],
    queryFn: () => getTransactionHistory(reference!),
    enabled: !!reference,
  });
}
