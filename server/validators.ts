// ============================================================
// server/validators.ts
// Strict boundary type guards and input sanitization
// ============================================================

export function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function sanitizeText(text: unknown, maxLen = 2000): string {
  if (typeof text !== 'string') return '';
  const controlCharPattern = new RegExp('[' + String.fromCharCode(0) + '-' + String.fromCharCode(31) + ']', 'g');
  return text.replace(controlCharPattern, '').trim().slice(0, maxLen);
}

export interface ValidatedZone {
  zoneId: string;
  zoneName: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  temperatureC: number;
  windSpeedKmh: number;
  inversionRisk: boolean;
}

export function validateZone(z: unknown): z is ValidatedZone {
  if (typeof z !== 'object' || z === null) return false;
  const obj = z as Record<string, unknown>;

  if (typeof obj.zoneId !== 'string' || obj.zoneId.length === 0 || obj.zoneId.length > 50) return false;
  if (typeof obj.zoneName !== 'string' || obj.zoneName.length === 0 || obj.zoneName.length > 100) return false;
  if (!isFiniteNumber(obj.aqi) || obj.aqi < 0 || obj.aqi > 2000) return false;
  if (!isFiniteNumber(obj.pm25) || obj.pm25 < 0 || obj.pm25 > 2000) return false;
  if (!isFiniteNumber(obj.pm10) || obj.pm10 < 0 || obj.pm10 > 2000) return false;
  if (!isFiniteNumber(obj.no2) || obj.no2 < 0 || obj.no2 > 1000) return false;
  if (!isFiniteNumber(obj.temperatureC) || obj.temperatureC < -50 || obj.temperatureC > 60) return false;
  if (!isFiniteNumber(obj.windSpeedKmh) || obj.windSpeedKmh < 0 || obj.windSpeedKmh > 250) return false;

  return true;
}

export interface ValidatedPersona {
  id: string;
  name: string;
  subCategory: string;
  sensitivityLevel: string;
  preferredStartHour: number;
  preferredEndHour: number;
}

export function validatePersona(p: unknown): p is ValidatedPersona {
  if (typeof p !== 'object' || p === null) return false;
  const obj = p as Record<string, unknown>;

  if (typeof obj.id !== 'string' || obj.id.length === 0 || obj.id.length > 50) return false;
  if (typeof obj.name !== 'string' || obj.name.length === 0 || obj.name.length > 100) return false;
  if (typeof obj.subCategory !== 'string' || obj.subCategory.length === 0) return false;
  if (!isFiniteNumber(obj.preferredStartHour) || obj.preferredStartHour < 0 || obj.preferredStartHour > 23) return false;
  if (!isFiniteNumber(obj.preferredEndHour) || obj.preferredEndHour < 0 || obj.preferredEndHour > 23) return false;

  return true;
}

export interface ValidatedHourlySlot {
  hour: number;
  timeLabel: string;
  activity: string;
  recommendation: string;
  predictedAQI: number;
  smogDispersionFactor: number;
  inversionLikelihood: string;
  healthImpactNotes: string;
  environmentalOffsetNotes: string;
}

export interface ValidatedRoutineResult {
  generatedAt: number;
  persona: string;
  language: string;
  optimalOutdoorWindow: {
    startHour: number;
    endHour: number;
    rationale: string;
  };
  hourlySchedule: ValidatedHourlySlot[];
  totalExposureScore: number;
  carbonOffsetKg: number;
  generalAdvice: string[];
}

export function validateRoutineResult(data: unknown): data is ValidatedRoutineResult {
  if (typeof data !== 'object' || data === null) return false;
  const r = data as Record<string, unknown>;

  if (typeof r.persona !== 'string' || r.persona.length === 0) return false;
  if (!isFiniteNumber(r.totalExposureScore) || r.totalExposureScore < 0) return false;
  if (!isFiniteNumber(r.carbonOffsetKg) || r.carbonOffsetKg < 0) return false;

  if (typeof r.optimalOutdoorWindow !== 'object' || r.optimalOutdoorWindow === null) return false;
  const w = r.optimalOutdoorWindow as Record<string, unknown>;
  if (
    !isFiniteNumber(w.startHour) ||
    w.startHour < 0 ||
    w.startHour > 23 ||
    !isFiniteNumber(w.endHour) ||
    w.endHour < 0 ||
    w.endHour > 23 ||
    typeof w.rationale !== 'string'
  ) {
    return false;
  }

  if (!Array.isArray(r.hourlySchedule) || r.hourlySchedule.length === 0) return false;
  for (const slot of r.hourlySchedule) {
    if (typeof slot !== 'object' || slot === null) return false;
    const s = slot as Record<string, unknown>;
    if (
      !isFiniteNumber(s.hour) ||
      typeof s.timeLabel !== 'string' ||
      typeof s.activity !== 'string' ||
      typeof s.recommendation !== 'string' ||
      !isFiniteNumber(s.predictedAQI)
    ) {
      return false;
    }
  }

  if (!Array.isArray(r.generalAdvice) || r.generalAdvice.length === 0) return false;
  if (!r.generalAdvice.every((a) => typeof a === 'string')) return false;

  return true;
}
