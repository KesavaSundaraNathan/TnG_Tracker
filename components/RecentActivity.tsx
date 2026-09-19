"use client";

import { ArrowDownLeft, Trash2 } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { formatDateTime, formatRM } from "@/lib/format";
import { getMode } from "@/lib/transit";

export default function RecentActivity() {
  const { transactions, removeTransaction, ready } = useWallet();
  const recent = transactions.slice(0, 10);

  const confirmRemove = (id: string, label: string) => {
    if (window.confirm(`Delete "${label}"? Your balance will be recalculated.`)) removeTransaction(id);
  };

  return (
    <section aria-labelledby="recent-heading" className="space-y-3">
      <h2 id="recent-heading" className="px-1 text-base font-semibold text-ink">
        Recent activity
      </h2>

      {ready && recent.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          No transactions yet. Start with a reload.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white">
          {recent.map((t) => {
            const isReload = t.type === "reload";
            const mode = !isReload ? getMode(t.mode) : null;
            const Icon = mode ? mode.icon : ArrowDownLeft;
            const title = isReload ? "Card reload" : `${t.origin} to ${t.destination}`;
            return (
              <li key={t.id} className="group flex items-center gap-3 px-4 py-3">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                    isReload ? "bg-emerald-50 text-emerald-700" : mode!.chip
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-ink">{title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {isReload ? formatDateTime(t.createdAt) : `${t.tripName}, ${formatDateTime(t.tripTime)}`}
                  </p>
                </div>
                <span className={`shrink-0 text-[15px] font-semibold tabular-nums ${isReload ? "text-emerald-700" : "text-ink"}`}>
                  {isReload ? "+" : "−"}
                  {formatRM(t.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => confirmRemove(t.id, title)}
                  className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                  aria-label={`Delete ${title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
