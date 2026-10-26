import React from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Train as TrainIcon,
  GitBranch,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { ConflictRisk } from '../../types/railway';

export const CollisionPrevention: React.FC = () => {
  const { conflicts, trains, tracks, executeConflictAction, resolveConflict, rerouteTrain, simulatedTime } = useRailway();

  const getRiskBadge = (risk: ConflictRisk) => {
    switch (risk) {
      case 'CRITICAL':
        return { label: 'CRITICAL CONFLICT', class: 'bg-red-600 text-white animate-pulse' };
      case 'HIGH':
        return { label: 'HIGH RISK', class: 'bg-orange-600 text-white' };
      case 'MEDIUM':
        return { label: 'MEDIUM RISK', class: 'bg-amber-600 text-white' };
      case 'LOW':
        return { label: 'LOW RISK', class: 'bg-blue-600 text-white' };
      default:
        return { label: 'NONE', class: 'bg-slate-700 text-slate-300' };
    }
  };

  const activeConflicts = conflicts.filter((c) => !c.resolved);
  const resolvedConflicts = conflicts.filter((c) => c.resolved);

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Collision & Conflict Prevention Engine</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-red-400 border border-slate-700">
                SAFETY SIMULATION MODULE
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous spatial monitoring of track circuit occupancy, block section headway, signal aspects, and opposing movements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>ACTIVE MONITORING ENGINE · SCAN INTERVAL: 1.0s</span>
        </div>
      </div>

      {/* Safety Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Critical Conflicts</div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {activeConflicts.filter((c) => c.risk === 'CRITICAL').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Immediate intervention required</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Headway Closures</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {activeConflicts.filter((c) => c.risk === 'HIGH' || c.risk === 'MEDIUM').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Platform or block overlap</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Monitored Track Sections</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{tracks.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Continuous circuit telemetry</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Safety Interlocking Status</div>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>KAVACH SIMULATED</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Automatic Train Protection (ATP)</div>
        </div>
      </div>

      {/* Active Conflict Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Active Conflict Alerts ({activeConflicts.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Timestamp: {simulatedTime} IST</span>
        </div>

        {activeConflicts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            No active spatial conflicts or interlocking violations detected across all 12 track circuits.
          </div>
        ) : (
          <div className="space-y-3">
            {activeConflicts.map((item) => {
              const badge = getRiskBadge(item.risk);
              return (
                <div
                  key={item.id}
                  className="p-4 bg-red-950/40 border border-red-700/60 rounded-xl space-y-2.5 shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${badge.class}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-mono text-slate-300">ALERT ID: {item.id}</span>
                      <span className="text-xs text-slate-400">· Detected at {item.timestamp} IST</span>
                    </div>

                    <div className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      ESTIMATED IMPACT: {item.estimatedMinutesToConflict} MINUTES
                    </div>
                  </div>

                  <div className="text-xs text-slate-200 font-medium leading-relaxed">{item.description}</div>

                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="text-[10px] font-semibold uppercase text-amber-400">
                      Recommended Preventive Action:
                    </div>
                    <div className="text-slate-200">{item.recommendedAction}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => executeConflictAction(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow"
                    >
                      <span>Execute Action (Hold & Trip Signals)</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    {item.id.startsWith('CONF-EMG') && item.trainAId && (
                      <button
                        onClick={() => {
                          executeConflictAction(item.id);
                          rerouteTrain(item.trainAId!, 'T-11');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow"
                        title="Divert train from blocked track to North Goods Bypass T-11"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Divert to Safe Bypass (T-11)</span>
                      </button>
                    )}
                    <button
                      onClick={() => resolveConflict(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    >
                      Acknowledge & Clear Alert
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved Conflicts History */}
      {resolvedConflicts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
            Conflict Resolution History ({resolvedConflicts.length})
          </h3>
          <div className="space-y-2">
            {resolvedConflicts.map((c) => (
              <div
                key={c.id}
                className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs flex items-center justify-between text-slate-400"
              >
                <div>
                  <span className="font-mono text-emerald-400 font-bold">RESOLVED</span> · {c.description}
                </div>
                <span className="font-mono text-[11px] text-slate-500">{c.timestamp} IST</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
