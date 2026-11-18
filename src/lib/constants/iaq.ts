// ============================================================
// src/lib/constants/iaq.ts
// Baseline room IAQ configurations and low-cost DIY air purification hacks
// ============================================================

import type { IAQRoomConfig } from '@/types';

export const DEFAULT_ROOMS: IAQRoomConfig[] = [
  {
    roomId: 'room-nursery',
    roomName: 'Infant Nursery / Children Bedroom',
    areaSqMeters: 16,
    ceilingHeightMeters: 2.8,
    occupantsCount: 2,
    hasAirPurifier: true,
    purifierCadrM3H: 180,
    indoorPlantsCount: 2,
    currentIndoorAQI: 42,
    targetIndoorAQI: 25,
  },
  {
    roomId: 'room-living',
    roomName: 'Living & Dining Room',
    areaSqMeters: 38,
    ceilingHeightMeters: 2.8,
    occupantsCount: 4,
    hasAirPurifier: true,
    purifierCadrM3H: 260,
    indoorPlantsCount: 4,
    currentIndoorAQI: 88,
    targetIndoorAQI: 40,
  },
  {
    roomId: 'room-elderly',
    roomName: 'Elderly Relatives Suite',
    areaSqMeters: 20,
    ceilingHeightMeters: 2.8,
    occupantsCount: 1,
    hasAirPurifier: false,
    purifierCadrM3H: 0,
    indoorPlantsCount: 1,
    currentIndoorAQI: 115,
    targetIndoorAQI: 35,
  },
  {
    roomId: 'room-kitchen',
    roomName: 'Kitchen & Ventilation Utility',
    areaSqMeters: 12,
    ceilingHeightMeters: 2.6,
    occupantsCount: 1,
    hasAirPurifier: false,
    purifierCadrM3H: 0,
    indoorPlantsCount: 0,
    currentIndoorAQI: 142,
    targetIndoorAQI: 50,
  },
];

export const DIY_HACKS = [
  {
    id: 'hack-corsi-box',
    title: 'Corsi-Rosenthal Box (DIY HEPA Fan Retrofit)',
    category: 'Filtration',
    costRating: '$ (Under $40)',
    cadrDelivery: 'Up to 350 m³/h',
    materials: '1x 20" Box Fan + 4x MERV-13 Furnace Filters + Duct Tape',
    instructions: 'Tape four MERV-13 filters in a cube with a cardboard base, sealing the fan on top blowing upward. Delivers commercial-grade CADR for a fraction of retail price.',
    efficiencyBonus: '90% reduction of PM2.5 in 25 minutes',
  },
  {
    id: 'hack-ventilation-timing',
    title: 'Inversion-Aware Cross-Ventilation Windows',
    category: 'Ventilation',
    costRating: '$0 (Free)',
    cadrDelivery: 'Natural displacement',
    materials: 'Outdoor AQI sensor or BreatheShield real-time monitor',
    instructions: 'Never open windows between 6:00 AM – 10:30 AM (peak winter inversion trap). Only crack opposing windows between 1:30 PM – 3:30 PM when solar radiation breaks the boundary layer.',
    efficiencyBonus: 'Prevents 85% outdoor particulate intrusion',
  },
  {
    id: 'hack-plants',
    title: 'Targeted Phytoremediation Plant Setup',
    category: 'Natural Biofiltration',
    costRating: '$ (Under $25)',
    cadrDelivery: 'Low VOC & particulate capture',
    materials: 'Snake Plant (Sansevieria), Areca Palm, Peace Lily',
    instructions: 'Place Snake Plants in bedrooms (they release oxygen at night through CAM photosynthesis) and Areca Palms in living spaces for natural humidity regulation (40-50% ideal range).',
    efficiencyBonus: 'Maintains optimal airway humidity & reduces fine dust settling',
  },
  {
    id: 'hack-wet-towel',
    title: 'Electrostatic Air Seal & Damp Barrier Micro-Hacks',
    category: 'Sealing',
    costRating: '$0 (Free)',
    cadrDelivery: 'Draft barrier',
    materials: 'Rolled damp towels, weatherstripping foam tape',
    instructions: 'Place damp rolled towels at the base of exterior doors and leaky window sills during severe AQI (>250) spikes to capture intruding soot particles.',
    efficiencyBonus: 'Reduces draft infiltration rate by 35%',
  },
];

// ASHRAE 62.2 residential target for air changes per hour (ACH)
export const TARGET_RESIDENTIAL_ACH = 4;
// Natural baseline infiltration rate for sealed rooms without mechanical ventilation (ACH)
export const BASE_NATURAL_INFILTRATION_ACH = 0.3;
// Standard target clearance efficiency fraction (80% particulate reduction)
export const STANDARD_PURIFICATION_TARGET_EFFICIENCY = 0.8;
// Fallback duration indicator when mechanical air delivery rate is zero (minutes)
export const UNVENTILATED_FALLBACK_MINUTES = 999;
// Architectural lower bound for residential room area input (m²)
export const MINIMUM_ROOM_AREA_SQ_METERS = 4;

