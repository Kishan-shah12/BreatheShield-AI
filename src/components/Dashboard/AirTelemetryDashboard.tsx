// ============================================================
// src/components/Dashboard/AirTelemetryDashboard.tsx
// Hyperlocal AQI telemetry, custom SVG heatmap, and pollutant sparklines
// Per ACCESSIBILITY.md §3 (Twin Representation) & EFFICIENCY.md §3
// ============================================================

import { memo } from 'react';
import { useAirAnalytics } from '@/hooks/useAirAnalytics';
import { Sparkline } from '@/components/shared/Sparkline';
import { ZoneCard } from '@/components/shared/ZoneCard';
import { SmogHeatmap } from './SmogHeatmap';
import { TelemetryHeroBanner } from './TelemetryHeroBanner';

// Layout dimensions for dashboard pollutant trend sparklines (px)
const SPARKLINE_PREVIEW_WIDTH = 130;
const SPARKLINE_PREVIEW_HEIGHT = 32;

export const AirTelemetryDashboard = memo(function AirTelemetryDashboard(): React.JSX.Element {
  const {
    zones,
    currentZone,
    selectedZoneId,
    setSelectedZoneId,
    aqiCategory,
    aqiColor,
    inversionStatus,
    pollutantBreakdown,
    simulateSmogSpike,
    simulateCleanDispersion,
  } = useAirAnalytics();

  return (
    <section aria-label="Hyperlocal AQI Telemetry Dashboard" className="flex flex-col gap-6 fade-in">
      {/* Top Hero KPI Banner & Meteorological Controls */}
      <TelemetryHeroBanner
        currentZone={currentZone}
        aqiCategory={aqiCategory}
        aqiColor={aqiColor}
        inversionStatus={inversionStatus}
        onSimulateSmogSpike={simulateSmogSpike}
        onSimulateCleanDispersion={simulateCleanDispersion}
      />

      {/* Grid: SVG Heatmap (Left) & Pollutant Sparklines (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <SmogHeatmap
          zones={zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
        />

        {/* Pollutant Sparklines Panel */}
        <div className="lg:col-span-5 bg-slate-900/60 rounded-3xl border border-slate-700/50 p-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span aria-hidden="true">📈</span> Pollutant Trend Sparklines
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-parameter gas and particle telemetry ({currentZone.zoneName})
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {pollutantBreakdown.map((pollutant) => (
              <div
                key={pollutant.type}
                className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-[90px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{pollutant.type}</span>
                    <span className="text-[10px] text-slate-400">({pollutant.unit})</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">
                    {pollutant.current} <span className="text-[10px] text-slate-400">/ max {pollutant.threshold}</span>
                  </div>
                </div>

                <div className="flex-1 flex justify-center">
                  <Sparkline
                    values={pollutant.history}
                    color={pollutant.current > pollutant.threshold ? '#ef4444' : '#10b981'}
                    width={SPARKLINE_PREVIEW_WIDTH}
                    height={SPARKLINE_PREVIEW_HEIGHT}
                    label={`${pollutant.type} 7-hour trend`}
                  />
                </div>

                <div className="text-right min-w-[70px]">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      pollutant.status === 'Hazardous' || pollutant.status === 'Critical'
                        ? 'bg-red-950 text-red-400 border border-red-500/40'
                        : pollutant.status === 'Unhealthy' || pollutant.status === 'Moderate'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {pollutant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
            💡 <strong>Winter Smog Insight:</strong> Secondary PM2.5 formation surges when ambient humidity exceeds 75% in the presence of vehicle-emitted NO2 and sulfur precursors.
          </div>
        </div>
      </div>

      {/* Municipal Zone Selector Cards */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span aria-hidden="true">🏙️</span> Monitored Urban Sectors ({zones.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.zoneId}
              zone={zone}
              isSelected={zone.zoneId === selectedZoneId}
              onSelect={setSelectedZoneId}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
