import { Bus, TrainFront, TrainTrack, TramFront, type LucideIcon } from "lucide-react";
import type { TransitMode } from "./types";

export interface ModeMeta {
  id: TransitMode;
  label: string;
  icon: LucideIcon;
  /** Solid colour used for the selected pill and the line marker. */
  solid: string;
  /** Soft tinted chip used in lists. */
  chip: string;
}

// Colours loosely follow Klang Valley line signage.
export const MODES: ModeMeta[] = [
  { id: "MRT", label: "MRT", icon: TrainFront, solid: "bg-emerald-600 text-white", chip: "bg-emerald-50 text-emerald-700" },
  { id: "LRT", label: "LRT", icon: TramFront, solid: "bg-rose-600 text-white", chip: "bg-rose-50 text-rose-700" },
  { id: "KTM", label: "KTM", icon: TrainTrack, solid: "bg-sky-700 text-white", chip: "bg-sky-50 text-sky-800" },
  { id: "BUS", label: "Bus", icon: Bus, solid: "bg-amber-500 text-ink", chip: "bg-amber-50 text-amber-800" },
];

export const getMode = (id: TransitMode) => MODES.find((m) => m.id === id) ?? MODES[0];
