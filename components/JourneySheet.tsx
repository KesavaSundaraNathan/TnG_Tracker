"use client";

import { ArrowUpDown } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useWallet } from "@/context/WalletContext";
import { formatRM, parseAmount, toLocalInputValue } from "@/lib/format";
import type { TransitMode } from "@/lib/types";
import Field, { inputClass } from "./Field";
import ModePicker from "./ModePicker";
import Sheet from "./Sheet";

interface FormState {
  tripName: string;
  origin: string;
  destination: string;
  tripTime: string;
  fare: string;
  mode: TransitMode;
}

const emptyForm = (): FormState => ({
  tripName: "",
  origin: "",
  destination: "",
  tripTime: toLocalInputValue(),
  fare: "",
  mode: "MRT",
});

export default function JourneySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addJourney, balance, tripNames } = useWallet();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(emptyForm());
      setError("");
    }
  }, [open]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fare = parseAmount(form.fare);

    if (!form.tripName.trim()) return setError("Give this journey a trip name so it can be filed.");
    if (!form.origin.trim() || !form.destination.trim()) return setError("Enter both the origin and destination.");
    if (!form.tripTime) return setError("Choose when the trip happened.");
    if (!Number.isFinite(fare) || fare <= 0) return setError("Enter the fare, e.g. 2.40.");
    if (fare > balance) return setError(`Fare is more than your balance of ${formatRM(balance)}. Reload first.`);

    addJourney({
      tripName: form.tripName,
      origin: form.origin,
      destination: form.destination,
      tripTime: new Date(form.tripTime).toISOString(),
      mode: form.mode,
      amount: fare,
    });
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Add journey">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Trip name" htmlFor="trip-name">
          <input
            id="trip-name"
            list="trip-name-options"
            placeholder="e.g. Office commute"
            value={form.tripName}
            onChange={(e) => set("tripName", e.target.value)}
            className={inputClass}
            autoComplete="off"
          />
          <datalist id="trip-name-options">
            {tripNames.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
          {tripNames.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 [scrollbar-width:none]">
              {tripNames.slice(0, 8).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("tripName", n)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                    form.tripName.trim().toLowerCase() === n.toLowerCase() ? "bg-ink text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </Field>

        <div className="relative space-y-2">
          <Field label="From" htmlFor="origin">
            <input id="origin" placeholder="e.g. KL Sentral" value={form.origin} onChange={(e) => set("origin", e.target.value)} className={inputClass} />
          </Field>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, origin: f.destination, destination: f.origin }))}
            className="absolute right-3 top-[58%] z-10 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition active:scale-95"
            aria-label="Swap origin and destination"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
          <Field label="To" htmlFor="destination">
            <input id="destination" placeholder="e.g. Bukit Bintang" value={form.destination} onChange={(e) => set("destination", e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Time of trip" htmlFor="trip-time">
            <input id="trip-time" type="datetime-local" value={form.tripTime} onChange={(e) => set("tripTime", e.target.value)} className={`${inputClass} min-h-[50px] text-sm`} />
          </Field>
          <Field label="Fare (RM)" htmlFor="fare">
            <input id="fare" inputMode="decimal" placeholder="0.00" value={form.fare} onChange={(e) => set("fare", e.target.value)} className={`${inputClass} tabular-nums`} autoComplete="off" />
          </Field>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700">Mode of transportation</p>
          <ModePicker value={form.mode} onChange={(m) => set("mode", m)} />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-rose-700">
            {error}
          </p>
        )}

        <button type="submit" className="w-full rounded-2xl bg-ink py-4 text-base font-semibold text-white transition active:scale-[0.98]">
          Save journey
        </button>
      </form>
    </Sheet>
  );
}
