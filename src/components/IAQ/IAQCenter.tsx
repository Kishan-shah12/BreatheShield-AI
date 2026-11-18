// ============================================================
// src/components/IAQ/IAQCenter.tsx
// Indoor Air Quality (IAQ), Room CADR Calculator, and Low-Cost DIY Hack Center
// Per PROBLEM_ALIGNMENT.md §1.4 & EFFICIENCY.md §2
// ============================================================

import { memo, useState, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  calculateRoomVolume,
  calculateRequiredCADR,
  estimatePurificationTime,
} from '@/lib/aqiCompute';
import { WindowSchedule } from './WindowSchedule';
import { DIYHackGrid } from './DIYHackGrid';
import { CADRCalculatorCard } from './CADRCalculatorCard';
import {
  TARGET_RESIDENTIAL_ACH,
  BASE_NATURAL_INFILTRATION_ACH,
  STANDARD_PURIFICATION_TARGET_EFFICIENCY,
  UNVENTILATED_FALLBACK_MINUTES,
  MINIMUM_ROOM_AREA_SQ_METERS,
} from '@/lib/constants/iaq';

export const IAQCenter = memo(function IAQCenter(): React.JSX.Element {
  const { rooms, updateRoom, selectedZone } = useAppContext();
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0].roomId);

  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.roomId === selectedRoomId) || rooms[0];
  }, [rooms, selectedRoomId]);

  const roomVolumeM3 = useMemo(() => {
    return calculateRoomVolume(activeRoom.areaSqMeters, activeRoom.ceilingHeightMeters);
  }, [activeRoom.areaSqMeters, activeRoom.ceilingHeightMeters]);

  const requiredCadrM3H = useMemo(() => {
    return calculateRequiredCADR(roomVolumeM3, TARGET_RESIDENTIAL_ACH);
  }, [roomVolumeM3]);

  const effectiveAch = useMemo(() => {
    if (activeRoom.purifierCadrM3H <= 0) return BASE_NATURAL_INFILTRATION_ACH;
    return Math.round((activeRoom.purifierCadrM3H / roomVolumeM3) * 10) / 10;
  }, [activeRoom.purifierCadrM3H, roomVolumeM3]);

  const purificationTimeMins = useMemo(() => {
    if (activeRoom.purifierCadrM3H <= 0) return UNVENTILATED_FALLBACK_MINUTES;
    return estimatePurificationTime(roomVolumeM3, activeRoom.purifierCadrM3H, STANDARD_PURIFICATION_TARGET_EFFICIENCY);
  }, [roomVolumeM3, activeRoom.purifierCadrM3H]);

  const cadrDeficit = useMemo(() => {
    return Math.max(0, requiredCadrM3H - activeRoom.purifierCadrM3H);
  }, [requiredCadrM3H, activeRoom.purifierCadrM3H]);

  const handleAreaChange = useCallback(
    (area: number) => {
      updateRoom(activeRoom.roomId, { areaSqMeters: Math.max(MINIMUM_ROOM_AREA_SQ_METERS, area) });
    },
    [activeRoom.roomId, updateRoom]
  );

  const handleCadrChange = useCallback(
    (cadr: number) => {
      updateRoom(activeRoom.roomId, {
        purifierCadrM3H: Math.max(0, cadr),
        hasAirPurifier: cadr > 0,
      });
    },
    [activeRoom.roomId, updateRoom]
  );

  return (
    <section aria-label="Indoor Air Quality and Low-Cost Hack Center" className="flex flex-col gap-6 fade-in">
      {/* CADR Calculator & Room Profile Card */}
      <CADRCalculatorCard
        rooms={rooms}
        selectedRoomId={selectedRoomId}
        onSelectRoom={setSelectedRoomId}
        activeRoom={activeRoom}
        roomVolumeM3={roomVolumeM3}
        requiredCadrM3H={requiredCadrM3H}
        effectiveAch={effectiveAch}
        purificationTimeMins={purificationTimeMins}
        cadrDeficit={cadrDeficit}
        onAreaChange={handleAreaChange}
        onCadrChange={handleCadrChange}
      />

      {/* Inversion-Aware Window Ventilation Guidance */}
      <WindowSchedule currentAqi={selectedZone.aqi} />

      {/* Open-Source Low-Cost DIY Hacks */}
      <DIYHackGrid />
    </section>
  );
});
