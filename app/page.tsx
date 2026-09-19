"use client";

import { Plus, Route } from "lucide-react";
import { useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import JourneySheet from "@/components/JourneySheet";
import RecentActivity from "@/components/RecentActivity";
import ReloadSheet from "@/components/ReloadSheet";

export default function DashboardPage() {
  const [reloadOpen, setReloadOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);

  return (
    <div className="space-y-6">
      <BalanceCard />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setReloadOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-semibold text-card shadow-sm ring-1 ring-slate-200 transition active:scale-[0.97]"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Reload
        </button>
        <button
          type="button"
          onClick={() => setJourneyOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-ink py-4 text-base font-semibold text-white transition active:scale-[0.97]"
        >
          <Route className="h-5 w-5" aria-hidden />
          Add Journey
        </button>
      </div>

      <RecentActivity />

      <ReloadSheet open={reloadOpen} onClose={() => setReloadOpen(false)} />
      <JourneySheet open={journeyOpen} onClose={() => setJourneyOpen(false)} />
    </div>
  );
}
