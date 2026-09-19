"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useWallet } from "@/context/WalletContext";
import { formatRM, parseAmount } from "@/lib/format";
import Field, { inputClass } from "./Field";
import Sheet from "./Sheet";

const QUICK_AMOUNTS = [10, 20, 50, 100];

export default function ReloadSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addReload, balance } = useWallet();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setAmount("");
      setError("");
    }
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = parseAmount(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount above RM 0, e.g. 20 or 20.50.");
      return;
    }
    addReload(value);
    onClose();
  };

  const preview = parseAmount(amount);

  return (
    <Sheet open={open} onClose={onClose} title="Reload card">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field label="Amount (RM)" htmlFor="reload-amount">
          <input
            id="reload-amount"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            className={`${inputClass} text-2xl font-bold tabular-nums`}
            aria-invalid={!!error}
            aria-describedby={error ? "reload-error" : undefined}
          />
        </Field>

        <div className="grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setAmount(String(q));
                setError("");
              }}
              className="rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-ink transition active:scale-95"
            >
              RM {q}
            </button>
          ))}
        </div>

        {error && (
          <p id="reload-error" className="text-sm font-medium text-rose-700">
            {error}
          </p>
        )}

        <p className="text-sm text-slate-600">
          New balance:{" "}
          <span className="font-semibold text-ink tabular-nums">
            {formatRM(Number.isFinite(preview) ? balance + preview : balance)}
          </span>
        </p>

        <button type="submit" className="w-full rounded-2xl bg-card py-4 text-base font-semibold text-white transition active:scale-[0.98]">
          Reload
        </button>
      </form>
    </Sheet>
  );
}
