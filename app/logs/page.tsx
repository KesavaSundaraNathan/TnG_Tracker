"use client";

import { FolderPlus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import TripFolderGrid from "@/components/TripFolderGrid";
import TripFolderSheet from "@/components/TripFolderSheet";
import { useWallet } from "@/context/WalletContext";

export default function TripLogsPage() {
  const { trips, ready } = useWallet();
  const [query, setQuery] = useState("");
  const [openName, setOpenName] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? trips.filter((t) => t.name.toLowerCase().includes(q)) : trips;
  }, [trips, query]);

  // Look the folder up by name so its contents stay current.
  const openTrip = trips.find((t) => t.name === openName) ?? null;

  return (
    <div className="space-y-5">
      <header className="px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Trip Logs</h1>
        <p className="mt-1 text-sm text-slate-600">
          {trips.length} {trips.length === 1 ? "folder" : "folders"}. Journeys are filed by trip name.
        </p>
      </header>

      {trips.length > 3 && (
        <label className="relative block">
          <span className="sr-only">Search trips</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips"
            className="w-full rounded-xl bg-white py-3 pl-10 pr-3 text-base text-ink outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-card"
          />
        </label>
      )}

      {ready && trips.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
          <FolderPlus className="h-10 w-10 text-slate-400" aria-hidden />
          <p className="mt-3 font-semibold text-ink">No trips logged yet</p>
          <p className="mt-1 text-sm text-slate-600">Each trip name you use becomes a folder here.</p>
          <Link href="/" className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            Add a journey
          </Link>
        </div>
      ) : filtered.length === 0 && query ? (
        <p className="px-1 text-sm text-slate-600">No trips match &ldquo;{query}&rdquo;.</p>
      ) : (
        <TripFolderGrid trips={filtered} onOpen={(t) => setOpenName(t.name)} />
      )}

      <TripFolderSheet trip={openTrip} onClose={() => setOpenName(null)} />
    </div>
  );
}
