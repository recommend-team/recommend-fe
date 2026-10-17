import type { Product } from "./product";
import type { Vendor } from "./vendor";

export interface StorefrontData {
  vendor: Vendor;
  products: Product[];
  /** What delivery costs — the same figure checkout charges. Absent from an older server. */
  deliveryFee?: number;
  /** Whether buyers may collect instead. Absent from an older server: no. */
  pickupEnabled?: boolean;
  /** How long a delivery is expected to take. Absent from an older server: 30. */
  deliveryEtaMinutes?: number;
}
