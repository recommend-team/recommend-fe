"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/services";
import { ApiError } from "@/lib/api";
import { setSession } from "@/lib/auth";
import type { LoginPayload, LoginResponse } from "@/types";
import { queryKeys } from "./queryKeys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        data.user
      );
      queryClient.setQueryData(queryKeys.currentUser(), data.user);
    },
  });
}
