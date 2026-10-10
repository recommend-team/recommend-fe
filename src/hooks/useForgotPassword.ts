"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services";
import { ApiError } from "@/lib/api";
import type { ForgotPasswordPayload } from "@/types";

export function useForgotPassword() {
  return useMutation<null, ApiError, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });
}
