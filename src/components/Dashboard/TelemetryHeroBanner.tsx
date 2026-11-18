// ============================================================
// src/components/Dashboard/TelemetryHeroBanner.tsx
// Top Hero KPI banner, boundary inversion telemetry & interactive simulation controls
// Decomposed from AirTelemetryDashboard to enforce strict modularity (<120 lines)
// ============================================================

import { memo } from 'react';
import type { UrbanZone, AQICategory } from '@/types';
import type { InversionRiskResult } from '@/lib/aqiCompute';

interface TelemetryHeroBannerProps {
  currentZone: UrbanZone;
  aqiCategory: AQICategory;
  aqiColor: string;
  inversionStatus: InversionRiskResult;
  onSimulateSmogSpike: () => void;
  onSimulateCleanDispersion: () => void;
}

export const TelemetryHeroBanner = memo(function TelemetryHeroBanner({
  currentZone,
  aqiCategory,
  aqiColor,
  inversionStatus,
  onSimulateSmogSpike,
  onSimulateCleanDispersion,
}: TelemetryHeroBannerProps): React.JSX.Element {
  return (
    <div className="bg-slate-900/70 border border-slate-700/50 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
      <div
        className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: aqiColor }}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Selected Hyperlocal Sector
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="text-xs text-slate-300 font-semibold">{currentZone.zoneName}</span>
          </div>

          <div className="flex items-baseline gap-4 mt-2">
            <h1 className="text-5xl font-black text-white tracking-tight" style={{ color: aqiColor }}>
              {currentZone.aqi}
            </h1>
            <div>
              <span className="text-lg font-bold text-white block leading-snug">
                {aqiCategory}
              </span>
              <span className="text-xs text-slate-400">
                Dominant Pollutant: <strong className="text-slate-200">{currentZone.dominantPollutant}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Meteorological & Inversion Risk Indicator */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 min-w-[200px]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Boundary Layer</span>
              <span className="text-sm" aria-hidden="true">🌡️</span>
            </div>
            <div className="text-base font-bold text-white mt-1">
              {currentZone.temperatureC}°C <span className="text-xs text-slate-400 font-normal">/ {currentZone.humidityPercent}% RH</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Wind: <strong className="text-slate-200">{currentZone.windSpeedKmh} km/h</strong>
            </div>
          </div>

          <div
            className={`rounded-2xl p-4 min-w-[230px] border transition-all ${
              inversionStatus.isInversion
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Inversion Risk</span>
              <span aria-hidden="true">{inversionStatus.isInversion ? '⚠️' : '✅'}</span>
            </div>
            <div className="text-sm font-black mt-1 capitalize">
              {inversionStatus.severity} Risk
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug line-clamp-2">
              {inversionStatus.rationale}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Telemetry Simulation Engine:</span>
          <button
            type="button"
            onClick={onSimulateSmogSpike}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-900/60 border border-red-500/50 text-red-200 hover:bg-red-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            ⚡ Simulate Winter Smog Spike (+45 AQI)
          </button>
          <button
            type="button"
            onClick={onSimulateCleanDispersion}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 hover:bg-emerald-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            🍃 Simulate Solar Wind Cleansing (-50 AQI)
          </button>
        </div>
        <span className="text-[11px] text-slate-400">
          Updated: {new Date(currentZone.lastUpdated).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
});
