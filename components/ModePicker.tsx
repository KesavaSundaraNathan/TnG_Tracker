"use client";

import { MODES } from "@/lib/transit";
import type { TransitMode } from "@/lib/types";

interface ModePickerProps {
  value: TransitMode;
  onChange: (mode: TransitMode) => void;
}

export default function ModePicker({ value, onChange }: ModePickerProps) {
  return (
    <div role="radiogroup" aria-label="Mode of transportation" className="grid grid-cols-4 gap-2">
      {MODES.map((m) => {
        const selected = m.id === value;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(m.id)}
            className={`flex flex-col items-center gap-1 rounded-2xl py-2.5 text-sm font-semibold transition active:scale-95 ${
              selected ? m.solid : "bg-slate-100 text-slate-600"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
