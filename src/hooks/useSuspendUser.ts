"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { suspendUser } from "@/services";
import { ApiError } from "@/lib/api";

export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, string>({
    mutationFn: suspendUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "buyers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "pending"] });
    },
  });
}
