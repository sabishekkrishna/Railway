import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Radio,
  Train as TrainIcon,
  Layers,
  GitBranch,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  Activity,
  CheckCircle2,
  Flame,
  Volume2,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { StationMapVisualizer } from '../stationMap/StationMapVisualizer';

export const ControlRoomDashboard: React.FC = () => {
  const {
    station,
    simulatedTime,
    trains,
    platforms,
    tracks,
    conflicts,
    emergencies,
    workOrders,
    executeConflictAction,
    resolveConflict,
    rerouteTrain,
    setActiveTab,
    playChime,
  } = useRailway();

  const activeConflicts = conflicts.filter((c) => !c.resolved);
  const activeEmergencies = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed');
  const activeTrains = trains.filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled');
  const delayedTrains = trains.filter((t) => t.delayMinutes > 0);
  const occupiedPlatforms = platforms.filter((p) => p.status === 'Occupied');
  const availablePlatforms = platforms.filter((p) => p.status === 'Available');

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Active Trains</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">{activeTrains.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{trains.length} total registered</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Available Platforms</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {availablePlatforms.length} <span className="text-xs text-slate-500 font-normal">/ {platforms.length}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{occupiedPlatforms.length} rakes berthed</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Delayed Trains</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{delayedTrains.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Avg delay:{' '}
            {delayedTrains.length
              ? Math.round(delayedTrains.reduce((a, b) => a + b.delayMinutes, 0) / delayedTrains.length)
              : 0}{' '}
            min
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Active Conflicts</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${activeConflicts.length > 0 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
            {activeConflicts.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Automated detection</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Emergencies</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${activeEmergencies.length > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {activeEmergencies.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Disaster Response Active</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">Interlocking Status</div>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>RRI NORMAL</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Multi-aspect colour signals</div>
        </div>
      </div>

      {/* Critical Conflict Banner (if any) */}
      {activeConflicts.length > 0 && (
        <div className="p-4 bg-red-950/80 border border-red-600 rounded-xl text-red-200 shadow-xl space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded bg-red-600 text-white">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-red-100 text-sm tracking-wide">
                  CRITICAL INTERLOCKING CONFLICT DETECTED
                </h3>
                <p className="text-xs text-red-300 mt-0.5">
                  Automated collision prevention algorithms identified immediate train routing conflict.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-red-900 text-white border border-red-700">
              TIME TO CONFLICT: {activeConflicts[0].estimatedMinutesToConflict} MIN
            </span>
          </div>

          <div className="p-3 bg-red-900/40 rounded-lg border border-red-800/80 text-xs space-y-2">
            <div className="font-semibold text-white">{activeConflicts[0].description}</div>
            <div className="text-amber-200 font-medium">
              <span className="text-slate-300">Recommended OCC Action:</span> {activeConflicts[0].recommendedAction}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-red-800/60">
              <button
                onClick={() => executeConflictAction(activeConflicts[0].id)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition shadow-md flex items-center gap-1.5"
              >
                <span>Execute Action (ATS Stop & Trip Signals)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              {activeConflicts[0]?.id.startsWith('CONF-EMG') && activeConflicts[0]?.trainAId && (
                <button
                  onClick={() => {
                    executeConflictAction(activeConflicts[0].id);
                    rerouteTrain(activeConflicts[0].trainAId!, 'T-11');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition shadow-md flex items-center gap-1.5"
                  title="Divert train from blocked track to North Goods Bypass T-11"
                >
                  <span>Divert to Safe Bypass (T-11)</span>
                </button>
              )}
              <button
                onClick={() => resolveConflict(activeConflicts[0].id)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Map Preview + Operational Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Live Station Interlocking Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[520px]">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-xs text-slate-100">Live Station Track & Platform Interlocking</span>
            </div>
            <button
              onClick={() => setActiveTab('station-map')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              Full Screen Map <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <StationMapVisualizer />
          </div>
        </div>

        {/* Right Col: Live Approaching Trains & Platform Assignments */}
        <div className="space-y-4">
          {/* Real-time Train Movement Tracker */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <TrainIcon className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-xs text-slate-100">Active Train Movements</h3>
              </div>
              <button
                onClick={() => setActiveTab('trains')}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Manage All
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {activeTrains.map((train) => (
                <div
                  key={train.id}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-amber-400">{train.number}</span>{' '}
                      <span className="font-medium text-slate-200">{train.name}</span>
                    </div>
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded font-bold ${
                        train.status === 'At Platform'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : train.status === 'Approaching'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : train.status === 'Delayed'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {train.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>
                      {train.currentPlatformId
                        ? `Berthed: Platform ${train.currentPlatformId.slice(3)}`
                        : train.currentTrackId
                        ? `Track ${train.currentTrackId}`
                        : 'Outer approach'}
                    </span>
                    <span className="font-mono text-slate-300">
                      {train.currentSpeedKmph > 0 ? `${train.currentSpeedKmph} km/h` : 'Stopped'}
                    </span>
                  </div>

                  {train.delayMinutes > 0 && (
                    <div className="text-[10px] text-amber-400 font-mono font-medium">
                      Delayed by {train.delayMinutes} mins (ETA {train.expectedArrival})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform Status Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-xs text-slate-100">Platform Utilization</h3>
              </div>
              <button
                onClick={() => setActiveTab('platforms')}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Auto-Allocate
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {platforms.map((pf) => (
                <div
                  key={pf.id}
                  className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold font-mono text-slate-200">PF {pf.number}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[85px]">
                      {pf.currentTrainId
                        ? trains.find((t) => t.id === pf.currentTrainId)?.number || 'Occupied'
                        : 'Available'}
                    </div>
                  </div>
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      pf.status === 'Available'
                        ? 'bg-emerald-500'
                        : pf.status === 'Occupied'
                        ? 'bg-red-500'
                        : pf.status === 'Reserved'
                        ? 'bg-amber-400'
                        : 'bg-orange-500'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
