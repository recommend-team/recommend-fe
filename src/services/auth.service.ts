import { request } from "@/lib/api";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RefreshTokenPayload,
  AuthTokens,
  RegisterVendorPayload,
  RegisterVendorResponse,
  ResendVerificationPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from "@/types";

export async function registerVendor(
  payload: RegisterVendorPayload
): Promise<RegisterVendorResponse> {
  return request<RegisterVendorResponse>("/auth/register/vendor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(
  payload: VerifyEmailPayload
): Promise<VerifyEmailResponse> {
  return request<VerifyEmailResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendVerification(
  payload: ResendVerificationPayload
): Promise<null> {
  return request<null>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshTokens(
  payload: RefreshTokenPayload
): Promise<AuthTokens> {
  return request<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getProfile(): Promise<AuthUser> {
  return request<AuthUser>("/auth/profile");
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<null> {
  return request<null>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<null> {
  return request<null>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
