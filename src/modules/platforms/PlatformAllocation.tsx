import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Accessibility,
  ArrowRight,
  Train as TrainIcon,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { PlatformRecommendation, Train } from '../../types/railway';

export const PlatformAllocation: React.FC = () => {
  const {
    platforms,
    trains,
    tracks,
    allocatePlatform,
    autoAllocatePlatform,
    simulatedTime,
  } = useRailway();

  const [selectedTrainId, setSelectedTrainId] = useState<string>(trains[0]?.id || '');
  const [recommendations, setRecommendations] = useState<PlatformRecommendation[]>([]);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [selectedPfManual, setSelectedPfManual] = useState<string>('PF-03');

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];

  const handleRunAutoAllocate = () => {
    if (selectedTrainId) {
      const recs = autoAllocatePlatform(selectedTrainId);
      setRecommendations(recs);
      setHasCalculated(true);
    }
  };

  const handleApplyRecommendation = (platformId: string) => {
    allocatePlatform(selectedTrainId, platformId);
    handleRunAutoAllocate();
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Intelligent Platform Allocation & Berthing</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-based multi-factor algorithmic allocation considering rake length, catenary feed, schedule conflict risk, and accessibility.
          </p>
        </div>

        {/* Selected Train Selector */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Select Incoming / Berthing Train</div>
            <select
              value={selectedTrainId}
              onChange={(e) => {
                setSelectedTrainId(e.target.value);
                setHasCalculated(false);
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono mt-0.5"
            >
              {trains.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.number} - {t.name} ({t.lengthMeters}m · {t.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunAutoAllocate}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-md transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auto Allocate Platform</span>
          </button>
        </div>
      </div>

      {/* Algorithmic Recommendation Result Section (Explainable AI / Rules) */}
      {hasCalculated && recommendations.length > 0 && (
        <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-amber-300">
                Algorithmic Evaluation for Train {selectedTrain?.number || selectedTrainId} ({selectedTrain?.lengthMeters || 0}m, {selectedTrain?.type || ""})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Evaluated {recommendations.length} Platforms at {simulatedTime} IST
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendations.slice(0, 4).map((rec, idx) => {
              const pf = platforms.find((p) => p.id === rec.platformId);
              const isBest = idx === 0;

              return (
                <div
                  key={rec.platformId}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                    isBest
                      ? 'bg-amber-950/30 border-amber-500/60 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-base font-mono text-slate-100">
                          Platform {rec.platformNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Length: {pf?.lengthMeters}m · Track {pf?.connectedTrackId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-base font-mono font-black ${
                            rec.score >= 80 ? 'text-emerald-400' : rec.score >= 50 ? 'text-amber-400' : 'text-red-400'
                          }`}
                        >
                          {rec.score} <span className="text-[10px] font-normal text-slate-400">/ 100</span>
                        </div>
                        {isBest && (
                          <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-700">
                            OPTIMAL
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reasoning Points */}
                    <div className="space-y-1 text-[11px] pt-1 border-t border-slate-800/80">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Selection Rationale:</div>
                      {rec.reasoning.slice(0, 3).map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                      {rec.warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyRecommendation(rec.platformId)}
                    className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition ${
                      isBest
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    Assign to PF {rec.platformNumber}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Platform Status Matrix (All Platforms) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Station Platform Infrastructure (PF 1 to PF 8)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Total Length: 4,520m Berthing Capacity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {platforms.map((pf) => {
            const currentRake = trains.find((t) => t.id === pf.currentTrainId);
            const nextRake = trains.find((t) => t.id === pf.nextScheduledTrainId);
            const trk = tracks.find((t) => t.id === pf.connectedTrackId);

            return (
              <div
                key={pf.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-base text-amber-400">Platform {pf.number}</span>
                    <div className="text-[10px] text-slate-400">Length: {pf.lengthMeters} meters</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      pf.status === 'Available'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : pf.status === 'Occupied'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : pf.status === 'Reserved'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-orange-950 text-orange-300 border border-orange-800'
                    }`}
                  >
                    {pf.status}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Connected Track:</span>
                    <span className="font-mono text-slate-200">{pf.connectedTrackId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Berthed Rake:</span>
                    <span className="font-mono font-semibold text-amber-300">
                      {currentRake ? `${currentRake.number} (${currentRake.name.slice(0, 15)}...)` : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Scheduled:</span>
                    <span className="font-mono text-slate-300">
                      {nextRake ? `${nextRake.number}` : 'None'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Zap className="w-3 h-3" /> 25kV OHE
                  </span>
                  <span className="flex items-center gap-1 text-blue-400">
                    <Accessibility className="w-3 h-3" /> {pf.accessible ? 'Divyangjan Ready' : 'Standard'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
