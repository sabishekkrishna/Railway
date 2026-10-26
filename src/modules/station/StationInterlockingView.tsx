import React from 'react';
import {
  GitBranch,
  AlertOctagon,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Train as TrainIcon,
  Radio,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { StationMapVisualizer } from '../stationMap/StationMapVisualizer';

export const StationInterlockingView: React.FC = () => {
  const {
    station,
    simulatedTime,
    trains,
    platforms,
    tracks,
    conflicts,
    executeConflictAction,
    rerouteTrain,
    resolveConflict,
    changeTrainStatus,
    updateSignalAspect,
  } = useRailway();

  const activeConflicts = conflicts.filter((c) => !c.resolved);
  const activeTrains = trains.filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled');
  const availablePlatforms = platforms.filter((p) => p.status === 'Available');

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Top Conflict Alert Bar (if collision hazard detected) */}
      {activeConflicts.length > 0 && (
        <div className="bg-red-950/90 border-b border-red-600 px-4 py-2.5 text-xs text-red-200 flex items-center justify-between gap-4 animate-in fade-in shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
            <div className="truncate">
              <span className="font-bold text-white uppercase tracking-wider">
                INTERLOCKING CONFLICT DETECTED:
              </span>{' '}
              <span className="text-red-200 font-medium">{activeConflicts[0]?.description}</span>
              {activeConflicts[0]?.recommendedAction && (
                <span className="text-amber-300 ml-2 font-mono text-[11px] hidden lg:inline">
                  [Action: {activeConflicts[0].recommendedAction}]
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => executeConflictAction(activeConflicts[0].id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1 transition"
              title={activeConflicts[0]?.recommendedAction || 'Execute immediate safety action'}
            >
              <span>Hold Train & Trip Signals (Enforce ATS)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            {activeConflicts[0]?.id.startsWith('CONF-EMG') && activeConflicts[0]?.trainAId && (
              <button
                onClick={() => {
                  executeConflictAction(activeConflicts[0].id);
                  rerouteTrain(activeConflicts[0].trainAId!, 'T-11');
                }}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1 transition"
                title="Divert train from blocked track to North Goods Bypass T-11"
              >
                <span>Divert to Bypass (T-11)</span>
              </button>
            )}
            <button
              onClick={() => resolveConflict(activeConflicts[0].id)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Map Area (Takes full primary focus) */}
      <div className="flex-1 overflow-hidden relative">
        <StationMapVisualizer />
      </div>

      {/* Bottom Station Berthing Bar (Quick station master reference) */}
      <div className="bg-slate-900 border-t border-slate-800 p-2.5 shrink-0">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Berthing Status (PF 1 to PF 8)</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {availablePlatforms.length} Platforms Free · {8 - availablePlatforms.length} Occupied
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {platforms.map((pf) => {
            const currentRake = trains.find((t) => t.id === pf.currentTrainId);
            const isOccupied = pf.status === 'Occupied';
            const isFree = pf.status === 'Available';

            return (
              <div
                key={pf.id}
                className={`p-2 rounded-lg border text-xs flex flex-col justify-between transition ${
                  isOccupied
                    ? 'bg-slate-950 border-red-800/80'
                    : isFree
                    ? 'bg-slate-950 border-emerald-800/80'
                    : 'bg-slate-950 border-amber-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-200">PF {pf.number}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOccupied ? 'bg-red-500' : isFree ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <div className="mt-1 truncate">
                  {currentRake ? (
                    <div className="font-mono font-bold text-amber-300 text-[11px] truncate">
                      {currentRake.number}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-[10px]">Clear</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
