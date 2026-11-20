// ============================================================
// src/hooks/useAirAnalytics.ts
// Encapsulates air quality telemetry calculations, inversion risk, and history
// Per CODING_CONVENTIONS.md §1 & ARCHITECTURE_PATTERNS.md §2.2
// ============================================================

import { useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  calculateAQICategory,
  getAQIColor,
  evaluateInversionRisk,
  type InversionRiskResult,
} from '@/lib/aqiCompute';
import {
  PollutantType,
  type PollutantReading,
  type UrbanZone,
  type AQICategory,
} from '@/types';

// Meteorological boundary layer temperature offset constants (°C)
// Simulates upper-air radiative inversion cap delta vs. normal adiabatic lapse
const INVERSION_LAPSE_OFFSET_CELSIUS = 3.2;
const NORMAL_LAPSE_OFFSET_CELSIUS = 2.5;

export interface AirAnalyticsResult {
  zones: UrbanZone[];
  currentZone: UrbanZone;
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  aqiCategory: AQICategory;
  aqiColor: string;
  inversionStatus: InversionRiskResult;
  pollutantBreakdown: PollutantReading[];
  simulateSmogSpike: () => void;
  simulateCleanDispersion: () => void;
}

export function useAirAnalytics(): AirAnalyticsResult {
  const { zones, selectedZoneId, setSelectedZoneId, updateZone } = useAppContext();

  const currentZone = useMemo(() => {
    return zones.find((z) => z.zoneId === selectedZoneId) || zones[0];
  }, [zones, selectedZoneId]);

  const aqiCategory = useMemo(() => {
    return calculateAQICategory(currentZone.aqi);
  }, [currentZone.aqi]);

  const aqiColor = useMemo(() => {
    return getAQIColor(currentZone.aqi);
  }, [currentZone.aqi]);

  const inversionStatus = useMemo(() => {
    // Ground temperature from zone, simulated upper air temperature based on inversion flag
    const upperTemp = currentZone.inversionRisk
      ? currentZone.temperatureC + INVERSION_LAPSE_OFFSET_CELSIUS
      : currentZone.temperatureC - NORMAL_LAPSE_OFFSET_CELSIUS;
    return evaluateInversionRisk(currentZone.temperatureC, upperTemp, currentZone.windSpeedKmh);
  }, [currentZone.temperatureC, currentZone.inversionRisk, currentZone.windSpeedKmh]);

  const pollutantBreakdown = useMemo<PollutantReading[]>(() => {
    return [
      {
        type: PollutantType.PM25,
        current: currentZone.pm25,
        unit: 'µg/m³',
        aqiContribution: Math.round((currentZone.pm25 / 150) * 100),
        history: currentZone.history.map((v) => Math.round(v * 0.7)),
        threshold: 35.4,
        status: currentZone.pm25 > 55 ? 'Hazardous' : currentZone.pm25 > 35 ? 'Moderate' : 'Good',
      },
      {
        type: PollutantType.PM10,
        current: currentZone.pm10,
        unit: 'µg/m³',
        aqiContribution: Math.round((currentZone.pm10 / 250) * 100),
        history: currentZone.history.map((v) => Math.round(v * 0.9)),
        threshold: 154,
        status: currentZone.pm10 > 154 ? 'Unhealthy' : 'Moderate',
      },
      {
        type: PollutantType.NO2,
        current: currentZone.no2,
        unit: 'ppb',
        aqiContribution: Math.round((currentZone.no2 / 100) * 100),
        history: currentZone.history.map((v) => Math.round(v * 0.4)),
        threshold: 100,
        status: currentZone.no2 > 100 ? 'Hazardous' : 'Good',
      },
      {
        type: PollutantType.CO,
        current: currentZone.co,
        unit: 'ppm',
        aqiContribution: Math.round((currentZone.co / 9) * 100),
        history: currentZone.history.map((v) => Math.round(v * 0.05 * 10) / 10),
        threshold: 9,
        status: currentZone.co > 9 ? 'Critical' : 'Good',
      },
      {
        type: PollutantType.O3,
        current: currentZone.o3,
        unit: 'ppb',
        aqiContribution: Math.round((currentZone.o3 / 70) * 100),
        history: currentZone.history.map((v) => Math.round(v * 0.3)),
        threshold: 70,
        status: currentZone.o3 > 70 ? 'Moderate' : 'Good',
      },
    ];
  }, [currentZone]);

  const simulateSmogSpike = useCallback(() => {
    const spikedAqi = Math.min(500, currentZone.aqi + 45);
    updateZone(currentZone.zoneId, {
      aqi: spikedAqi,
      pm25: Math.round((currentZone.pm25 + 38) * 10) / 10,
      inversionRisk: true,
      history: [...currentZone.history.slice(1), spikedAqi],
    });
  }, [currentZone, updateZone]);

  const simulateCleanDispersion = useCallback(() => {
    updateZone(currentZone.zoneId, {
      aqi: Math.max(35, currentZone.aqi - 50),
      pm25: Math.max(10, Math.round((currentZone.pm25 - 40) * 10) / 10),
      inversionRisk: false,
      history: [...currentZone.history.slice(1), Math.max(35, currentZone.aqi - 50)],
    });
  }, [currentZone, updateZone]);

  return {
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
  };
}
