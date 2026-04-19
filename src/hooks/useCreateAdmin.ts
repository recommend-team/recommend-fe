"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdmin } from "@/services";
import { ApiError } from "@/lib/api";
import type { AdminUser, CreateAdminPayload } from "@/types";

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, ApiError, CreateAdminPayload>({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
