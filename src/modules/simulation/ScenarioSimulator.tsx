import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  Play,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Droplets,
  HeartPulse,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { emergencyScenarios } from '../../data/initialData';
import { EmergencyScenarioPreset } from '../../types/railway';

export const ScenarioSimulator: React.FC = () => {
  const { triggerEmergencyScenario, setActiveTab, simulatedTime } = useRailway();
  const [activePreset, setActivePreset] = useState<EmergencyScenarioPreset>(emergencyScenarios[0]);
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'Fire':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Power failure':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Flooding':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'Medical emergency':
        return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'Train accident':
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleLaunchScenario = (preset: EmergencyScenarioPreset) => {
    triggerEmergencyScenario(preset.id);
    setActivePreset(preset);
    setHasTriggered(true);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-slate-100">Disaster Simulation & Operational Failure Lab</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrate Indian Railways emergency response procedures, automated interlocking fail-safes, and inter-departmental dispatch.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
          SIMULATION PROTOCOL SUITE · 8 SCENARIOS
        </span>
      </div>

      {/* Grid of 8 Presets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {emergencyScenarios.map((scenario) => {
          const isSelected = activePreset.id === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => {
                setActivePreset(scenario);
                setHasTriggered(false);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-rose-950/40 border-rose-500 shadow-xl'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    {getScenarioIcon(scenario.type)}
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {scenario.id}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-100 leading-snug">{scenario.title}</h4>
                  <div className="text-[10px] text-slate-400 mt-1">{scenario.type} · {scenario.location}</div>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLaunchScenario(scenario);
                }}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Inject Scenario</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Scenario Detailed Inspection & Workflow Execution View */}
      {activePreset && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-400">{activePreset.id}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                  {activePreset.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{activePreset.title}</h3>
              <div className="text-xs text-slate-400">
                Location: <span className="text-slate-200 font-semibold">{activePreset.location}</span>
              </div>
            </div>

            <button
              onClick={() => handleLaunchScenario(activePreset)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg transition"
            >
              <Play className="w-4 h-4" />
              <span>Simulate Scenario Now</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Impact Summary */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="font-semibold text-rose-300 uppercase tracking-wider text-[11px]">
                Operational Impact & Threat Analysis:
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">{activePreset.impactSummary}</p>
            </div>

            {/* Protocol Workflow */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="font-semibold text-amber-300 uppercase tracking-wider text-[11px]">
                Standard Operating Procedure (SOP) Automated Workflow:
              </div>
              <div className="space-y-1.5">
                {activePreset.protocolWorkflow.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="font-mono text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {hasTriggered && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600/70 rounded-xl text-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>
                  Scenario successfully injected at {simulatedTime} IST! Track circuit locked, signals tripped, and teams dispatched.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('emergency')}
                className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-medium flex items-center gap-1"
              >
                <span>View Emergency Incident</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
