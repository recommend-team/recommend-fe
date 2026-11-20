"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateAdmin, changeAdminRole } from "@/services";
import { ApiError } from "@/lib/api";
import type { AdminUser } from "@/types";

/** Reactivate a suspended admin or customer service agent. */
export function useActivateAdmin() {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, ApiError, string>({
    mutationFn: activateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

/** Make an account an admin or customer service. */
export function useChangeAdminRole() {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, ApiError, { id: string; role: "ADMIN" | "SUPPORT" }>({
    mutationFn: changeAdminRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}
