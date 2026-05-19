// ShelfIQ — data contract.
// Mirrors docs/spec.md §"Data shapes". No implementation; pure types.

export type Category =
  | "Beer"
  | "Energy"
  | "Cold Beverages"
  | "Salty Snacks"
  | "Candy"
  | "Sports Drinks";

export type FixtureType =
  | "cold-vault"
  | "gondola"
  | "endcap"
  | "rollergrill"
  | "tobacco-gantry"
  | "counter";

export type Daypart = "morning" | "afternoon" | "late-night";

export type PlanStatus =
  | "draft"
  | "in-review"
  | "approved"
  | "live"
  | "archived";

export type StoreFormat = "urban" | "suburban" | "highway";

export type SwingDirection = "left" | "right" | "french";

export interface Dimensions {
  w: number;
  h: number;
  d: number;
}

export interface Product {
  id: string;
  upc: string;
  name: string;
  brand: string;
  vendor: string;
  category: Category;
  subcategory: string;
  dimensions: Dimensions;
  retailPrice: number;
  unitsPerWeek: number;
  marginPct: number;
  daysOfSupply: number;
  swatchColor: string;
}

export interface Fixture {
  id: string;
  name: string;
  type: FixtureType;
  dimensions: Dimensions;
  doors?: number;
  shelvesPerDoor?: number;
  temperature?: number;
  swingDirection?: SwingDirection;
}

export interface Position {
  id: string;
  productId: string;
  doorIndex: number;
  shelfIndex: number;
  slotIndex: number;
  facings: number;
  daypart: Daypart[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Plan {
  id: string;
  name: string;
  version: string;
  category: string;
  banner: string;
  cluster: string;
  status: PlanStatus;
  effectiveDate: string;
  owner: User;
  fixtureId: string;
  positions: Position[];
  parentVersionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreAddress {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface Store {
  id: string;
  number: string;
  name: string;
  address: StoreAddress;
  banner: string;
  cluster: string;
  sqft: number;
  format: StoreFormat;
  compliancePct: number;
}
