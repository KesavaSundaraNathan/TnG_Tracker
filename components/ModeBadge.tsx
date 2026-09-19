import { getMode } from "@/lib/transit";
import type { TransitMode } from "@/lib/types";

export default function ModeBadge({ mode }: { mode: TransitMode }) {
  const m = getMode(mode);
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${m.chip}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {m.label}
    </span>
  );
}
