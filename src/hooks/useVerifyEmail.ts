"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "@/services";
import { ApiError } from "@/lib/api";
import type { VerifyEmailPayload, VerifyEmailResponse } from "@/types";

export function useVerifyEmail() {
  return useMutation<VerifyEmailResponse, ApiError, VerifyEmailPayload>({
    mutationFn: verifyEmail,
  });
}
