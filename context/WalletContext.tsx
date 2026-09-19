"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { makeId, roundMoney } from "@/lib/format";
import type { JourneyInput, JourneyTransaction, Transaction, TripGroup } from "@/lib/types";

const STORAGE_KEY = "tng-tracker:v1";

type Action =
  | { type: "add"; tx: Transaction }
  | { type: "remove"; id: string }
  | { type: "load"; txs: Transaction[] }
  | { type: "reset" };

function reducer(state: Transaction[], action: Action): Transaction[] {
  switch (action.type) {
    case "add":
      return [action.tx, ...state];
    case "remove":
      return state.filter((t) => t.id !== action.id);
    case "load":
      return action.txs;
    case "reset":
      return [];
  }
}

interface WalletContextValue {
  transactions: Transaction[];
  balance: number;
  totalSpent: number;
  journeyCount: number;
  trips: TripGroup[];
  tripNames: string[];
  ready: boolean;
  addReload: (amount: number) => void;
  addJourney: (input: JourneyInput) => void;
  removeTransaction: (id: string) => void;
  resetAll: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [transactions, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);

  // Load saved data once on the client. State lives in React; localStorage
  // just keeps it across refreshes.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: "load", txs: parsed as Transaction[] });
      }
    } catch {
      // Corrupt or unavailable storage: start fresh.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
      // Private mode or full storage: the app still works in-memory.
    }
  }, [transactions, ready]);

  // Balance is derived from the ledger, so it's always in sync with every add/remove.
  const balance = useMemo(
    () =>
      roundMoney(
        transactions.reduce((sum, t) => (t.type === "reload" ? sum + t.amount : sum - t.amount), 0),
      ),
    [transactions],
  );

  const journeys = useMemo(
    () => transactions.filter((t): t is JourneyTransaction => t.type === "journey"),
    [transactions],
  );

  const totalSpent = useMemo(
    () => roundMoney(journeys.reduce((sum, j) => sum + j.amount, 0)),
    [journeys],
  );

  const trips = useMemo<TripGroup[]>(() => {
    const map = new Map<string, TripGroup>();
    for (const j of journeys) {
      // Group case-insensitively so "Work" and "work" share a folder.
      const key = j.tripName.trim().toLowerCase();
      const group = map.get(key);
      if (group) {
        group.journeys.push(j);
        group.total = roundMoney(group.total + j.amount);
        if (j.tripTime > group.lastTripTime) group.lastTripTime = j.tripTime;
      } else {
        map.set(key, { name: j.tripName.trim(), journeys: [j], total: j.amount, lastTripTime: j.tripTime });
      }
    }
    const groups = Array.from(map.values());
    groups.forEach((g) => g.journeys.sort((a, b) => b.tripTime.localeCompare(a.tripTime)));
    return groups.sort((a, b) => b.lastTripTime.localeCompare(a.lastTripTime));
  }, [journeys]);

  const tripNames = useMemo(() => trips.map((t) => t.name), [trips]);

  const addReload = useCallback((amount: number) => {
    dispatch({
      type: "add",
      tx: { id: makeId(), type: "reload", amount: roundMoney(amount), createdAt: new Date().toISOString() },
    });
  }, []);

  const addJourney = useCallback((input: JourneyInput) => {
    dispatch({
      type: "add",
      tx: {
        id: makeId(),
        type: "journey",
        createdAt: new Date().toISOString(),
        ...input,
        amount: roundMoney(input.amount),
        tripName: input.tripName.trim(),
        origin: input.origin.trim(),
        destination: input.destination.trim(),
      },
    });
  }, []);

  const removeTransaction = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const resetAll = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo(
    () => ({
      transactions,
      balance,
      totalSpent,
      journeyCount: journeys.length,
      trips,
      tripNames,
      ready,
      addReload,
      addJourney,
      removeTransaction,
      resetAll,
    }),
    [transactions, balance, totalSpent, journeys.length, trips, tripNames, ready, addReload, addJourney, removeTransaction, resetAll],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");
  return ctx;
}
