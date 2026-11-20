// ============================================================
// src/components/IAQ/CADRCalculatorCard.tsx
// Room CADR calculator form controls, slider inputs, and diagnostic metrics
// Decomposed from IAQCenter to enforce strict modularity (<140 lines)
// ============================================================

import { memo } from 'react';
import type { IAQRoomConfig } from '@/types';
import { CADRDiagnosticsGrid } from './CADRDiagnosticsGrid';

interface CADRCalculatorCardProps {
  rooms: IAQRoomConfig[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  activeRoom: IAQRoomConfig;
  roomVolumeM3: number;
  requiredCadrM3H: number;
  effectiveAch: number;
  purificationTimeMins: number;
  cadrDeficit: number;
  onAreaChange: (area: number) => void;
  onCadrChange: (cadr: number) => void;
}

export const CADRCalculatorCard = memo(function CADRCalculatorCard({
  rooms,
  selectedRoomId,
  onSelectRoom,
  activeRoom,
  roomVolumeM3,
  requiredCadrM3H,
  effectiveAch,
  purificationTimeMins,
  cadrDeficit,
  onAreaChange,
  onCadrChange,
}: CADRCalculatorCardProps): React.JSX.Element {
  return (
    <div className="bg-slate-900/70 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span aria-hidden="true">💨</span> Room CADR & Indoor Air Quality (IAQ) Calculator
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Calculate Clean Air Delivery Rate (CADR) requirements, air changes per hour (ACH), and purification duration.
        </p>
      </div>

      {/* Room Tab Selection */}
      <div className="flex flex-wrap gap-2">
        {rooms.map((room) => {
          const isSelected = room.roomId === selectedRoomId;
          return (
            <button
              key={room.roomId}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectRoom(room.roomId)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700/70'
              }`}
            >
              {room.roomName}
            </button>
          );
        })}
      </div>

      {/* Room Parameters & Live Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <label htmlFor="room-area-range">Floor Area:</label>
              <span className="text-emerald-400 font-bold">{activeRoom.areaSqMeters} m²</span>
            </div>
            <input
              id="room-area-range"
              type="range"
              min="6"
              max="80"
              step="1"
              value={activeRoom.areaSqMeters}
              onChange={(e) => onAreaChange(parseFloat(e.target.value))}
              className="w-full mt-2 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <label htmlFor="room-cadr-range">Purifier Clean Air Delivery Rate (CADR):</label>
              <span className="text-emerald-400 font-bold">{activeRoom.purifierCadrM3H} m³/h</span>
            </div>
            <input
              id="room-cadr-range"
              type="range"
              min="0"
              max="600"
              step="20"
              value={activeRoom.purifierCadrM3H}
              onChange={(e) => onCadrChange(parseFloat(e.target.value))}
              className="w-full mt-2 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Diagnostic Metrics Display */}
        <CADRDiagnosticsGrid
          requiredCadrM3H={requiredCadrM3H}
          effectiveAch={effectiveAch}
          purificationTimeMins={purificationTimeMins}
          roomVolumeM3={roomVolumeM3}
          ceilingHeightMeters={activeRoom.ceilingHeightMeters}
        />
      </div>

      {cadrDeficit > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">⚠️</span>
            <div>
              <span className="text-xs font-bold text-amber-200 block">
                CADR Deficit Detected: -{cadrDeficit} m³/h below 4 ACH baseline
              </span>
              <span className="text-[11px] text-slate-400">
                Consider retrofitting a low-cost DIY Corsi-Rosenthal Box below to bridge filtration capacity.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
