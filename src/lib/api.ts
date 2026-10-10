import { getAccessToken } from "./auth";

const STAGING_API_URL = "https://recommend-staging.onrender.com/api/v1";

function resolveApiUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;

  if (!fromEnv) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not set. Configure it in your environment before building for production."
      );
    }
    return STAGING_API_URL;
  }

  return fromEnv;
}

export const API_URL = resolveApiUrl();

export interface ApiFieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: ApiFieldError[];
  readonly raw?: unknown;

  constructor(
    message: string,
    status: number,
    fieldErrors?: ApiFieldError[],
    raw?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.raw = raw;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
  errors?: ApiFieldError[];
}

export async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getAccessToken();
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...options?.headers,
      },
    });
  } catch (cause) {
    throw new ApiError(
      "Network request failed. Check your connection and try again.",
      0,
      undefined,
      cause
    );
  }

  const body = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!res.ok || body.success === false) {
    throw new ApiError(
      body.message ?? body.error ?? `API error: ${res.status}`,
      body.statusCode ?? res.status,
      body.errors,
      body
    );
  }

  return body.data as T;
}
