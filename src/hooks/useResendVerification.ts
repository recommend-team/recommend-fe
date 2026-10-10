"use client";

import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "@/services";
import { ApiError } from "@/lib/api";
import type { ResendVerificationPayload } from "@/types";

export function useResendVerification() {
  return useMutation<null, ApiError, ResendVerificationPayload>({
    mutationFn: resendVerification,
  });
}
