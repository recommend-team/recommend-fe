"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateUser } from "@/services";
import { ApiError } from "@/lib/api";

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, string>({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "buyers"] });
    },
  });
}
