"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectPending } from "@/services";
import { ApiError } from "@/lib/api";
import type { RejectPendingPayload } from "@/types";

export function useRejectPending() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, RejectPendingPayload>({
    mutationFn: ({ id, reason }) => rejectPending(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
