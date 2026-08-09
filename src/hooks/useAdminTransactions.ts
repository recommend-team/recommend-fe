"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminTransactions, verifyAdminTransaction } from "@/services";
import { ApiError } from "@/lib/api";
import type {
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
