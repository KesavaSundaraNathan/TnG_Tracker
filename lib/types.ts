export type TransitMode = "MRT" | "LRT" | "KTM" | "BUS";

interface BaseTransaction {
  id: string;
  amount: number; // always positive, in RM
  createdAt: string; // ISO timestamp when recorded
}

export interface ReloadTransaction extends BaseTransaction {
  type: "reload";
}

export interface JourneyTransaction extends BaseTransaction {
  type: "journey";
  tripName: string;
  origin: string;
  destination: string;
  tripTime: string; // ISO timestamp of the trip itself
  mode: TransitMode;
}

export type Transaction = ReloadTransaction | JourneyTransaction;

export type JourneyInput = Pick<
  JourneyTransaction,
  "tripName" | "origin" | "destination" | "tripTime" | "mode" | "amount"
>;

export interface TripGroup {
  name: string;
  journeys: JourneyTransaction[];
  total: number;
  lastTripTime: string;
}
