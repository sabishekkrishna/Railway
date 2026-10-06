import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  ArrowRight,
  GitBranch,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Train } from '../../types/railway';

export const DelayManagement: React.FC = () => {
  const { trains, platforms, schedules, simulatedTime } = useRailway();
  const [selectedTrainId, setSelectedTrainId] = useState<string>(trains.find((t) => t.delayMinutes > 0)?.id || trains[0]?.id || '');
  const [injectedDelay, setInjectedDelay] = useState<number>(25);

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];

  // Cascading ripple analysis logic
  const cascadingImpacts: {
    affectedTrain: Train;
    impactType: 'Shared Platform Bottleneck' | 'Track Section Bottleneck' | 'Turnaround Rake Delay';
    rippleDelayMins: number;
    recommendedMitigation: string;
  }[] = [];

  for (const t of trains) {
    if (t.id === selectedTrain.id) continue;

    // Check shared platform
    if (t.currentPlatformId && t.currentPlatformId === selectedTrain.currentPlatformId) {
      cascadingImpacts.push({
        affectedTrain: t,
        impactType: 'Shared Platform Bottleneck',
        rippleDelayMins: Math.max(5, injectedDelay - 10),
        recommendedMitigation: `Divert Train ${t.number} to Platform 3 or 5 to prevent outer signal holding.`,
      });
    }

    // Check shared track
    if (t.currentTrackId && t.currentTrackId === selectedTrain.currentTrackId) {
      cascadingImpacts.push({
        affectedTrain: t,
        impactType: 'Track Section Bottleneck',
        rippleDelayMins: Math.max(10, injectedDelay - 5),
        recommendedMitigation: `Route Train ${t.number} via Freight Bypass Track 11 or loop line.`,
      });
    }
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Cascading Delay & Punctuality Ripple Analyzer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate delay propagation across shared platform slots, single-line track bottlenecks, and turnaround rakes.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
          STATION CLOCK: {simulatedTime} IST
        </span>
      </div>

      {/* Simulator Inputs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
        <h3 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">
          Delay Simulation Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Target Train (Primary Delay Source)</label>
            <select
              value={selectedTrainId}
              onChange={(e) => setSelectedTrainId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-100"
            >
              {trains.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.number} - {t.name} (Current delay: {t.delayMinutes}m)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Simulated Injected Delay:</span>
              <span className="font-mono font-bold text-amber-400">+{injectedDelay} minutes</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={injectedDelay}
              onChange={(e) => setInjectedDelay(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer mt-1"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex flex-col justify-between">
            <span className="text-slate-400">Primary Train Delay Impact:</span>
            <div className="font-mono font-bold text-amber-300 text-sm">
              Expected Arrival: {selectedTrain.scheduledArrival} → +{injectedDelay} min
            </div>
          </div>
        </div>
      </div>

      {/* Ripple Effects Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <span>Downstream Cascading Ripple Effects ({cascadingImpacts.length} Affected Services)</span>
          </h3>
          <span className="text-xs text-slate-400">Predictive Impact Model</span>
        </div>

        {cascadingImpacts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            No secondary cascading delays projected. The buffer window and platform clearances absorb this delay.
          </div>
        ) : (
          <div className="space-y-3">
            {cascadingImpacts.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-amber-300 text-sm">{item.affectedTrain.number}</span>{' '}
                    <span className="font-semibold text-xs text-slate-200">{item.affectedTrain.name}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.impactType}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded border border-red-800">
                    CASCADE DELAY: +{item.rippleDelayMins}m
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Recommended Recovery Action:</div>
                  <div className="text-slate-300 mt-0.5">{item.recommendedMitigation}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
