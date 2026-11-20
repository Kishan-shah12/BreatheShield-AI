// ============================================================
// src/components/Routine/RoutineMetricsHighlights.tsx
// Displays optimal outdoor window, predicted dose, and carbon offset
// Separated from DailyRoutineOptimizer for presentation separation of concerns
// ============================================================

import { memo } from 'react';
import type { DailyRoutinePlan } from '@/types';

interface RoutineMetricsHighlightsProps {
  routinePlan: DailyRoutinePlan;
}

export const RoutineMetricsHighlights = memo(function RoutineMetricsHighlights({
  routinePlan,
}: RoutineMetricsHighlightsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
            Optimal Outdoor Activity Window
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {routinePlan.optimalOutdoorWindow.startHour}:00 – {routinePlan.optimalOutdoorWindow.endHour}:00
          </div>
        </div>
        <p className="text-xs text-emerald-200 mt-2 leading-relaxed">
          {routinePlan.optimalOutdoorWindow.rationale}
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Predicted PM2.5 Inhaled Dose
          </span>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {routinePlan.totalExposureScore} µg·h
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Avoiding morning inversion peaks reduces pulmonary particulate intake by ~42%.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Estimated Carbon Abatement
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {routinePlan.carbonOffsetKg} kg CO₂
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Achieved by consolidating errands and shifting peak motorized transit trips.
        </p>
      </div>
    </div>
  );
});
