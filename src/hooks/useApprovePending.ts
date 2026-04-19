"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approvePending } from "@/services";
import { ApiError } from "@/lib/api";

export function useApprovePending() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, string>({
    mutationFn: approvePending,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
