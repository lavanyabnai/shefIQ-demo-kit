// Typed access to the curated demo seed. JSON is the source of truth;
// this module just narrows JSON inferred types to the spec interfaces.

import type { Fixture, Plan, PlanStatus, Product, Store, User } from "@/lib/types";

import productsData from "./products.json";
import fixturesData from "./fixtures.json";
import storesData from "./stores.json";
import usersData from "./users.json";
import planogramsData from "./planograms.json";
import dashboardData from "./dashboard.json";

import beerV41 from "./plans/beer-v41.json";
import energyQ2 from "./plans/energy-q2-draft.json";
import saltyV3 from "./plans/salty-v3.json";
import rollerV2 from "./plans/roller-v2.json";

export const products = productsData as unknown as Product[];
export const fixtures = fixturesData as unknown as Fixture[];
export const stores = storesData as unknown as Store[];

export interface SeedUser extends User {
  role: string;
  team: string;
}
export const users = usersData as SeedUser[];

export const plans: Record<string, Plan> = {
  "beer-v41": beerV41 as unknown as Plan,
  "energy-q2-draft": energyQ2 as unknown as Plan,
  "salty-v3": saltyV3 as unknown as Plan,
  "roller-v2": rollerV2 as unknown as Plan,
};

export interface PlanSummary {
  id: string;
  name: string;
  version: string;
  category: string;
  banner: string;
  cluster: string;
  status: PlanStatus;
  effectiveDate: string;
  updatedAt: string;
  skuCount: number;
  facingCount: number;
  owner: User;
  parentVersionId?: string;
}
export const planograms = planogramsData as unknown as PlanSummary[];

export const dashboard = dashboardData;

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function findFixture(id: string): Fixture | undefined {
  return fixtures.find((f) => f.id === id);
}

export function getPlan(id: string): Plan | undefined {
  return plans[id];
}
