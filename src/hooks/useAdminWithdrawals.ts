"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  failWithdrawal,
  getAdminWithdrawals,
  getWalletStatement,
  retryWithdrawal,
} from "@/services";
import { ApiError } from "@/lib/api";
import type {
  AdminWithdrawal,
  PaginatedResult,
  WalletEntry,
  WithdrawalListFilters,
  WithdrawalStatus,
} from "@/types";
import { queryKeys } from "./queryKeys";

export function useAdminWithdrawals(filters: WithdrawalListFilters = {}) {
  return useQuery<PaginatedResult<AdminWithdrawal>>({
    queryKey: queryKeys.adminWithdrawals(filters),
    queryFn: () => getAdminWithdrawals(filters),
    staleTime: 1000 * 30,
  });
}

/** Fetched only once opened — most visits to a vendor never need the ledger. */
export function useWalletStatement(userId: string | null) {
  return useQuery<WalletEntry[]>({
    queryKey: ["admin", "vendors", userId, "statement"],
    queryFn: () => getWalletStatement(userId!),
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
}

/**
 * Both actions move a vendor's balance or status, so the vendor pages are refetched too —
 * their Payout tab shows the same withdrawals.
 */
function useWithdrawalAction<TInput, TResult>(
  action: (input: TInput) => Promise<TResult>
) {
  const queryClient = useQueryClient();

  return useMutation<TResult, ApiError, TInput>({
    mutationFn: action,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
    },
  });
}

export function useRetryWithdrawal() {
  return useWithdrawalAction<string, { status: WithdrawalStatus; attempts: number }>(
    retryWithdrawal
  );
}

export function useFailWithdrawal() {
  return useWithdrawalAction<
    { id: string; reason: string },
    { status: WithdrawalStatus }
  >(failWithdrawal);
}
