import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const AIDecisionSupport: React.FC = () => {
  const { trains, platforms, tracks, conflicts, emergencies, autoAllocatePlatform, simulatedTime } = useRailway();
  const [selectedTrainId, setSelectedTrainId] = useState(trains[0]?.id || '');
  const [userQuery, setUserQuery] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];
  const recommendations = autoAllocatePlatform(selectedTrain.id);
  const bestPf = recommendations[0];

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery) return;

    // Tactical AI reasoning synthesis
    setAiAnalysisResult(
      `[AI DECISION SUPPORT ANALYSIS · ${simulatedTime} IST]\n\n` +
      `QUERY: "${userQuery}"\n\n` +
      `1. TACTICAL ASSESSMENT:\n` +
      `   - Current active train density is ${trains.filter((t) => t.status !== 'Completed').length} rakes in Delhi Division.\n` +
      `   - Platform utilization is at 76.4% with ${platforms.filter((p) => p.status === 'Available').length} berths clear.\n` +
      `   - Interlocking status on Up Main (Track 9) and Down Main (Track 10) is normal.\n\n` +
      `2. RECOMMENDED INTERVENTION:\n` +
      `   - Prioritize Train 22436 Vande Bharat Express on Platform 2 with green starter aspect on S-02.\n` +
      `   - Route delayed Train 12601 into loop track T-06 only after suburban MEMU 64491 vacates at 14:50.\n` +
      `   - Enforce 30 km/h caution order on Turnout 14B.\n\n` +
      `3. SAFETY INTERLOCKING CONFIRMATION:\n` +
      `   - Verified fail-safe compliance. Route locking proved prior to signal clearance.`
    );
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">AI-Based Decision Support & Operational Advisory</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithmic heuristic optimization and explainable intelligence for station masters and section controllers.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-300">
          ADVISORY ONLY · MANUAL OPERATOR APPROVAL REQUIRED
        </div>
      </div>

      {/* Decision Support Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Module 1: Explainable Platform & Routing Rationale */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Explainable Platform Recommendation
              </h3>
            </div>
            <select
              value={selectedTrainId}
              onChange={(e) => setSelectedTrainId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
            >
              {trains.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.number} ({t.type})
                </option>
              ))}
            </select>
          </div>

          {bestPf && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Top Recommendation</span>
                  <div className="text-base font-bold text-amber-300 font-mono">
                    Platform {bestPf.platformNumber} (Score: {bestPf.score}/100)
                  </div>
                  <div className="text-xs text-slate-300">
                    For Train {selectedTrain.number} {selectedTrain.name}
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  OPTIMAL BERTH
                </span>
              </div>

              {/* Step-by-Step Explainable Reasoning */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Algorithmic Reasoning Breakdown:
                </div>
                {bestPf.reasoning.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-200">
                    <span className="font-mono text-emerald-400 font-bold">{idx + 1}.</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Module 2: Tactical Operational Query Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Tactical Operations AI Assistant
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Inquire regarding conflict resolution strategies, turnaround optimization, or headway prioritization:
            </p>

            <form onSubmit={handleAskAI} className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g. How to resolve the delay between 12601 and MEMU 64491?"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Analyze</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick preset questions */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            <button
              onClick={() =>
                setUserQuery('What is the optimal platform allocation for delayed Train 12601?')
              }
              className="text-[10px] px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              Train 12601 Delay Mitigation
            </button>
            <button
              onClick={() =>
                setUserQuery('How to prevent collision risk on Track 4 crossover?')
              }
              className="text-[10px] px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              Track 4 Crossover Interlocking
            </button>
          </div>
        </div>
      </div>

      {/* AI Analysis Result Display */}
      {aiAnalysisResult && (
        <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-xl space-y-2 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Operations Advisory Report</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Generated {simulatedTime} IST</span>
          </div>
          <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed p-3 bg-slate-950 rounded-lg border border-slate-800">
            {aiAnalysisResult}
          </pre>
        </div>
      )}
    </div>
  );
};
