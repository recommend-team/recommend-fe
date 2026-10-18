/** The admin Areas page: where we deliver, and what buyers call places in each area. */

export interface AreaAliasRow {
  id: string;
  /** "Badore" — a place inside the area, as buyers name it. */
  name: string;
}

export interface AreaOverview {
  id: string;
  name: string;
  isActive: boolean;
  /** Vendors who deliver here. */
  vendorCount: number;
  aliases: AreaAliasRow[];
}

export interface StateOverview {
  id: string;
  name: string;
  isActive: boolean;
  areas: AreaOverview[];
}

/** A place buyers gave that matched no area — to put in one, or dismiss. */
export interface UnplacedLocation {
  id: string;
  text: string;
  timesSeen: number;
  lastSeenAt: string;
}
