import type { Product } from "./product";
import type { Vendor } from "./vendor";

export interface StorefrontData {
  vendor: Vendor;
  products: Product[];
}
