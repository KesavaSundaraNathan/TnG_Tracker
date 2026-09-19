import type { ReactNode } from "react";

/** Label + control wrapper. Inputs use text-base so iOS Safari doesn't zoom on focus. */
export default function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-base text-ink placeholder:text-slate-400 outline-none transition focus:border-card focus:bg-white focus:ring-4 focus:ring-card/15";
