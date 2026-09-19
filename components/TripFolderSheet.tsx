"use client";

import { Clock } from "lucide-react";
import { formatDateTime, formatRM } from "@/lib/format";
import type { TripGroup } from "@/lib/types";
import ModeBadge from "./ModeBadge";
import Sheet from "./Sheet";

export default function TripFolderSheet({ trip, onClose }: { trip: TripGroup | null; onClose: () => void }) {
  return (
    <Sheet open={!!trip} onClose={onClose} title={trip?.name ?? ""}>
      {trip && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {trip.journeys.length} {trip.journeys.length === 1 ? "journey" : "journeys"} totalling{" "}
            <span className="font-semibold text-ink tabular-nums">{formatRM(trip.total)}</span>
          </p>

          <ol className="space-y-3">
            {trip.journeys.map((j) => (
              <li key={j.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <ModeBadge mode={j.mode} />
                  <span className="text-base font-semibold tabular-nums text-ink">−{formatRM(j.amount)}</span>
                </div>

                {/* origin → destination as a mini route line */}
                <div className="mt-3 grid grid-cols-[14px_1fr] gap-x-3">
                  <span className="mt-1.5 h-3 w-3 rounded-full border-[3px] border-card bg-white" aria-hidden />
                  <p className="text-[15px] font-medium text-ink">
                    <span className="sr-only">From </span>
                    {j.origin}
                  </p>
                  <span className="mx-auto h-4 w-[3px] bg-card/30" aria-hidden />
                  <span />
                  <span className="mt-1.5 h-3 w-3 rounded-full bg-card" aria-hidden />
                  <p className="text-[15px] font-medium text-ink">
                    <span className="sr-only">To </span>
                    {j.destination}
                  </p>
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {formatDateTime(j.tripTime)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Sheet>
  );
}
