import { request } from "@/lib/api";
import type { StorefrontData } from "@/types";

export async function getStorefront(slug: string): Promise<StorefrontData> {
  return request<StorefrontData>(`/store/${slug}`);
}
