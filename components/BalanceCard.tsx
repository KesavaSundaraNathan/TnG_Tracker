"use client";

import { Nfc } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { formatRM } from "@/lib/format";

const LOW_BALANCE = 10;

/** The balance, drawn as a physical transit card. */
export default function BalanceCard() {
  const { balance, totalSpent, journeyCount, transactions, ready } = useWallet();
  const [pulse, setPulse] = useState(0);
  const first = useRef(true);

  // Briefly pop the number whenever the balance changes after load.
  useEffect(() => {
    if (!ready) return;
    if (first.current) {
      first.current = false;
      return;
    }
    setPulse((p) => p + 1);
  }, [balance, ready]);

  const low = ready && transactions.length > 0 && balance < LOW_BALANCE;

  return (
    <section aria-label="Card balance" className="space-y-3">
      <div className="relative aspect-[1.586] w-full overflow-hidden rounded-[22px] bg-card p-5 text-white shadow-[0_18px_40px_-18px_rgba(14,51,120,0.7)]">
        {/* route line running across the card */}
        <div className="absolute -right-10 top-0 h-full w-40 rotate-12 bg-card-deep/70" aria-hidden />
        <div className="absolute top-[40%] left-0 h-2 w-full bg-signal" aria-hidden />
        <div className="absolute top-[40%] left-[18%] h-4 w-4 -translate-y-1 rounded-full border-[3px] border-signal bg-card" aria-hidden />
        <div className="absolute top-[40%] left-[62%] h-4 w-4 -translate-y-1 rounded-full border-[3px] border-signal bg-card" aria-hidden />

        <div className="relative flex items-start justify-between">
          <p className="text-[15px] font-semibold">TnG Tracker</p>
          <Nfc className="h-6 w-6 text-white/80" aria-hidden />
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-sm text-white/75">Current Balance</p>
          <h1
            key={pulse}
            className={`mt-0.5 text-[clamp(2.25rem,11vw,3.25rem)] font-extrabold leading-none tracking-tight tabular-nums ${pulse ? "animate-balance-pop" : ""}`}
            aria-live="polite"
          >
            {ready ? formatRM(balance) : "RM —"}
          </h1>
        </div>
      </div>

      <p className="px-1 text-sm text-slate-600">
        {low ? (
          <span className="font-medium text-rose-700">Balance is low. Reload before your next trip.</span>
        ) : journeyCount > 0 ? (
          <>
            {formatRM(totalSpent)} spent across {journeyCount} {journeyCount === 1 ? "journey" : "journeys"}
          </>
        ) : (
          "Reload your card, then log each journey as you ride."
        )}
      </p>
    </section>
  );
}
