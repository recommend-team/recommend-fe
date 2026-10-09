export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  /**
   * An extra — drinks, extra protein — sold only with a main item from the same vendor.
   * Absent from a server older than add-ons, which reads as false.
   */
  isAddOn?: boolean;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}
