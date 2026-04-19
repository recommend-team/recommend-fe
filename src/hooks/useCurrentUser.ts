"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/services";
import { clearSession, getAccessToken, getStoredUser } from "@/lib/auth";
import type { AuthUser } from "@/types";
import { queryKeys } from "./queryKeys";

export function useCurrentUser() {
  const queryClient = useQueryClient();

  return useQuery<AuthUser | null>({
    queryKey: queryKeys.currentUser(),
    queryFn: async () => {
      if (!getAccessToken()) return null;
      try {
        return await getProfile();
      } catch {
        clearSession();
        queryClient.setQueryData(queryKeys.currentUser(), null);
        return null;
      }
    },
    initialData: () => getStoredUser() ?? undefined,
    staleTime: 1000 * 60 * 5,
  });
}
