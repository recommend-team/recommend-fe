export type VendorType = "REGISTERED" | "NON_REGISTERED";

export type RiderType = "INDIVIDUAL" | "COMPANY";

export type UserRole = "SELLER" | "RIDER" | "BUYER" | "ADMIN" | "SUPER_ADMIN";

export type UserStatus = "PENDING" | "APPROVED" | "SUSPENDED" | "DEACTIVATED";

export interface RegisterVendorPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vendorType: VendorType;
  businessName: string;
  businessAddress: string;
  businessCategory: string;
  businessDescription?: string;
}

export interface RegisterVendorResponse {
  email: string;
}

export interface RegisterRiderPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  riderType: RiderType;
  bvn?: string;
  guarantorName?: string;
  guarantorPhone?: string;
}

export interface RegisterRiderResponse {
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  vendorType?: VendorType | null;
  riderType?: RiderType | null;
  businessName?: string | null;
  businessAddress?: string | null;
  businessCategory?: string | null;
  businessDescription?: string | null;
  businessLogoUrl?: string | null;
  businessBannerUrl?: string | null;
  isEmailVerified: boolean;
  orderQuota?: number | null;
  monthlyOrderCount?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  user: AuthUser;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}
