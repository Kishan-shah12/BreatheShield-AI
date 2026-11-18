// ============================================================
// src/components/Routine/PersonaSelector.tsx
// Target family and commuter persona selection buttons and risk indicators
// Decomposed from DailyRoutineOptimizer to enforce strict modularity (<100 lines)
// ============================================================

import { memo } from 'react';
import type { PersonaProfile } from '@/types';

interface PersonaSelectorProps {
  personas: PersonaProfile[];
  activePersona: PersonaProfile;
  onSelectPersona: (persona: PersonaProfile) => void;
}

export const PersonaSelector = memo(function PersonaSelector({
  personas,
  activePersona,
  onSelectPersona,
}: PersonaSelectorProps): React.JSX.Element {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-xs font-semibold text-slate-300">Target Family & Commuter Persona:</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {personas.map((p: PersonaProfile) => {
          const isSelected = p.id === activePersona.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectPersona(p)}
              className={`p-3.5 rounded-2xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {p.name}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    p.sensitivityLevel === 'high'
                      ? 'bg-red-950 text-red-400 border border-red-500/40'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {p.sensitivityLevel} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
});
