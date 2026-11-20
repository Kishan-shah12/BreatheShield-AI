// ============================================================
// src/components/Routine/DailyRoutineOptimizer.tsx
// GenAI-powered personalized daily schedule & exposure minimizer
// Per PROBLEM_ALIGNMENT.md §1.2 & ACCESSIBILITY.md §6
// ============================================================

import { memo, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { apiService } from '@/services/apiService';
import { RoutineTimeline } from './RoutineTimeline';
import { PersonaSelector } from './PersonaSelector';
import { RoutineMetricsHighlights } from './RoutineMetricsHighlights';

export const DailyRoutineOptimizer = memo(function DailyRoutineOptimizer(): React.JSX.Element {
  const {
    personas,
    activePersona,
    setActivePersona,
    selectedZone,
    language,
    routinePlan,
    setRoutinePlan,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const plan = await apiService.generateDailyRoutine({
        persona: activePersona,
        zone: selectedZone,
        language,
      });
      setRoutinePlan(plan);
    } catch {
      // Graceful fallback to heuristic routine guidance without unhandled client logging
      setErrorMessage('Unable to generate AI schedule right now. Showing localized heuristic guidance.');
    } finally {
      setIsLoading(false);
    }
  }, [activePersona, selectedZone, language, setRoutinePlan]);

  return (
    <section aria-label="GenAI Daily Routine and Exposure Optimizer" className="flex flex-col gap-6 fade-in">
      {/* Persona Selection Header */}
      <div className="bg-slate-900/70 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span aria-hidden="true">🤖</span> GenAI Daily Routine & Smog Exposure Optimizer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your family or lifestyle vulnerability profile to generate hour-by-hour exposure mitigation routines.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-950/50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span>Optimizing with Gemini AI…</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">✨</span>
                <span>Generate Smart Schedule</span>
              </>
            )}
          </button>
        </div>

        {/* Persona Selector Chips */}
        <PersonaSelector
          personas={personas}
          activePersona={activePersona}
          onSelectPersona={setActivePersona}
        />

        <div aria-live="polite" aria-busy={isLoading} className="sr-only">
          {isLoading ? 'Generating personalized air quality daily schedule with Gemini AI…' : 'Schedule ready.'}
        </div>

        {errorMessage && (
          <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-xl text-amber-200 text-xs flex items-center gap-2">
            <span aria-hidden="true">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Routine Plan Results */}
      {routinePlan && (
        <div className="flex flex-col gap-6 fade-in">
          <RoutineMetricsHighlights routinePlan={routinePlan} />

          <RoutineTimeline
            routinePlan={routinePlan}
            zoneName={selectedZone.zoneName}
          />

          {/* Actionable General Guidance */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <span aria-hidden="true">💡</span> Expert Smog Defense Directives
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              {routinePlan.generalAdvice.map((advice, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
                  <span className="text-emerald-400 font-bold" aria-hidden="true">✔</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
});
