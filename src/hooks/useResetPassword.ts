"use client";

import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services";
import { ApiError } from "@/lib/api";
import type { ResetPasswordPayload } from "@/types";

export function useResetPassword() {
  return useMutation<null, ApiError, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });
}
