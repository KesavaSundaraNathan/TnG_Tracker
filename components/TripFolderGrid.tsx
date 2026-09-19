"use client";

import { Folder } from "lucide-react";
import { formatRM, formatShortDate } from "@/lib/format";
import { getMode } from "@/lib/transit";
import type { TransitMode, TripGroup } from "@/lib/types";

export default function TripFolderGrid({ trips, onOpen }: { trips: TripGroup[]; onOpen: (trip: TripGroup) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {trips.map((trip) => {
        const modes = Array.from(new Set(trip.journeys.map((j) => j.mode))) as TransitMode[];
        return (
          <li key={trip.name}>
            <button
              type="button"
              onClick={() => onOpen(trip)}
              className="flex w-full flex-col items-start rounded-2xl bg-white p-3.5 text-left transition active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-card"
            >
              <span className="relative">
                <Folder className="h-16 w-16 text-manila" fill="currentColor" strokeWidth={1} stroke="#C9971F" aria-hidden />
                <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-0.5">
                  {modes.slice(0, 4).map((m) => (
                    <span key={m} className={`h-1.5 w-3 rounded-full ${getMode(m).solid.split(" ")[0]}`} />
                  ))}
                </span>
              </span>
              <span className="mt-1 line-clamp-2 w-full break-words text-[15px] font-semibold leading-snug text-ink">{trip.name}</span>
              <span className="mt-0.5 text-xs text-slate-500">
                {trip.journeys.length} {trip.journeys.length === 1 ? "journey" : "journeys"}, {formatShortDate(trip.lastTripTime)}
              </span>
              <span className="mt-1.5 text-sm font-semibold tabular-nums text-ink">{formatRM(trip.total)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
