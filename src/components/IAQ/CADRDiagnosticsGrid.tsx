// ============================================================
// src/components/IAQ/CADRDiagnosticsGrid.tsx
// Displays CADR target, effective ACH, and purification clean time
// Separated from CADRCalculatorCard for presentation separation of concerns
// ============================================================

import { memo } from 'react';

interface CADRDiagnosticsGridProps {
  requiredCadrM3H: number;
  effectiveAch: number;
  purificationTimeMins: number;
  roomVolumeM3: number;
  ceilingHeightMeters: number;
}

export const CADRDiagnosticsGrid = memo(function CADRDiagnosticsGrid({
  requiredCadrM3H,
  effectiveAch,
  purificationTimeMins,
  roomVolumeM3,
  ceilingHeightMeters,
}: CADRDiagnosticsGridProps): React.JSX.Element {
  return (
    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Target CADR (4 ACH)
        </span>
        <div className="text-2xl font-black text-white mt-2">
          {requiredCadrM3H} <span className="text-xs font-normal text-slate-400">m³/h</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Volume: {roomVolumeM3} m³ ({ceilingHeightMeters}m ceiling).
        </p>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Effective Air Changes
        </span>
        <div className="text-2xl font-black text-emerald-400 mt-2">
          {effectiveAch} <span className="text-xs font-normal text-slate-400">ACH</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {effectiveAch >= 4
            ? '✅ Meets hospital-grade clean room target.'
            : '⚠️ Sub-optimal air recycling rate.'}
        </p>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          80% Clean Time
        </span>
        <div className="text-2xl font-black text-sky-400 mt-2">
          {purificationTimeMins > 120 ? 'No Purifier' : `${purificationTimeMins} mins`}
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Time required to filter out airborne ambient particles.
        </p>
      </div>
    </div>
  );
});
