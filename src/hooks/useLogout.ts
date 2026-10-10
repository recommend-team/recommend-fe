"use client";

import { useQueryClient } from "@tanstack/react-query";
import { clearSession } from "@/lib/auth";
import { queryKeys } from "./queryKeys";

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearSession();
    queryClient.setQueryData(queryKeys.currentUser(), null);
    queryClient.removeQueries();
  };
}
