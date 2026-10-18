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
  /** What the price is for — "portion", "plate". Null or absent: no unit shown. */
  unit?: string | null;
  /** The vendor's extras that go with this dish. Absent from an older server. */
  extraIds?: string[];
  /** On an extra: the products it goes with. */
  dishIds?: string[];
  /** Questions the buyer answers for this dish — "Choose your protein". */
  choices?: ChoiceGroup[];
}

/** What a price can be per — the vendor app's list. */
export const PRODUCT_UNITS = [
  "portion",
  "plate",
  "piece",
  "pack",
  "wrap",
  "bottle",
  "bowl",
  "cup",
] as const;

/** A choice as saved: an id keeps an existing one (and carts holding it) working. */
export interface ChoiceGroupInput {
  id?: string;
  name: string;
  required: boolean;
  minPick: number;
  maxPick: number;
  options: {
    id?: string;
    name: string;
    priceDelta: number;
    isAvailable: boolean;
  }[];
}

export interface ChoiceGroup {
  id: string;
  name: string;
  required: boolean;
  /** How many options to pick: at least `minPick`, at most `maxPick`. */
  minPick: number;
  maxPick: number;
  options: ChoiceOption[];
}

export interface ChoiceOption {
  id: string;
  name: string;
  /** Added to the dish's price, per portion. */
  priceDelta: number;
  isAvailable: boolean;
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
