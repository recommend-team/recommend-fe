"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { suspendAdmin } from "@/services";
import { ApiError } from "@/lib/api";
import type { AdminUser } from "@/types";

export function useSuspendAdmin() {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, ApiError, string>({
    mutationFn: suspendAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}
