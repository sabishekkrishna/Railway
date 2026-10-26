import React, { useState } from 'react';
import {
  GitBranch,
  Sliders,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ShieldAlert,
  Wrench,
  Lock,
  Unlock,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Track, TrackStatus } from '../../types/railway';

export const TrackManagement: React.FC = () => {
  const { tracks, updateTrackStatus, simulatedTime } = useRailway();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(tracks[0] || null);

  const currentTrack = tracks.find((t) => t.id === selectedTrack?.id) || tracks[0] || selectedTrack;
  const [newSpeedLimit, setNewSpeedLimit] = useState<number>(currentTrack?.speedRestrictionKmph || 130);

  const getTrackBadge = (status: TrackStatus) => {
    switch (status) {
      case 'Free':
        return { label: 'FREE', class: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
      case 'Occupied':
        return { label: 'OCCUPIED', class: 'bg-red-950 text-red-400 border-red-800' };
      case 'Reserved':
        return { label: 'RESERVED', class: 'bg-amber-950 text-amber-400 border-amber-800' };
      case 'Under Maintenance':
        return { label: 'MAINTENANCE', class: 'bg-orange-950 text-orange-400 border-orange-800' };
      case 'Emergency Block':
        return { label: 'EMERGENCY BLOCK', class: 'bg-blue-950 text-blue-400 border-blue-800 animate-pulse' };
      case 'Blocked':
        return { label: 'BLOCKED', class: 'bg-red-950 text-red-300 border-red-800' };
      default:
        return { label: status, class: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const handleApplySpeedLimit = () => {
    if (currentTrack) {
      updateTrackStatus(currentTrack.id, currentTrack.status, newSpeedLimit);
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Track Infrastructure & Speed Restriction Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            12 controlled track circuits, crossover turnouts, 25kV catenary feed sections, and Permanent Way (P-Way) caution orders.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>CONTINUOUS CIRCUIT MONITORING</span>
        </div>
      </div>

      {/* Grid: Track List & Selected Track Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Track Circuits Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Track Circuit Registry ({tracks.length} Sections)
            </span>
            <span className="text-xs font-mono text-slate-400">Time: {simulatedTime} IST</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Track ID</th>
                  <th className="p-3">Section Name</th>
                  <th className="p-3">Direction</th>
                  <th className="p-3">Speed Limit</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {tracks.map((track) => {
                  const badge = getTrackBadge(track.status);
                  const isSelected = currentTrack?.id === track.id;

                  return (
                    <tr
                      key={track.id}
                      onClick={() => {
                        setSelectedTrack(track);
                        setNewSpeedLimit(track.speedRestrictionKmph);
                      }}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-amber-950/30 border-l-4 border-amber-400' : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-amber-300">{track.id}</td>
                      <td className="p-3 text-slate-200 font-medium">{track.number}</td>
                      <td className="p-3 font-mono text-slate-400">{track.direction}</td>
                      <td className="p-3 font-mono">
                        <span className={track.speedRestrictionKmph < 40 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                          {track.speedRestrictionKmph} km/h
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-medium ${
                            track.condition === 'Optimal' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {track.condition}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${badge.class}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Track Controller */}
        {currentTrack ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <div className="text-xl font-bold font-mono text-amber-300">{currentTrack.id}</div>
                <div className="text-sm font-semibold text-slate-100">{currentTrack.number}</div>
                <div className="text-xs text-slate-400">Length: {currentTrack.lengthMeters}m · 25kV Electrified</div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getTrackBadge(currentTrack.status).class}`}>
                {currentTrack.status}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Track Circuit State Override
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => updateTrackStatus(currentTrack.id, 'Free')}
                  className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold"
                >
                  Mark Free (Clear)
                </button>
                <button
                  onClick={() => updateTrackStatus(currentTrack.id, 'Reserved')}
                  className="p-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/60 font-semibold"
                >
                  Mark Reserved
                </button>
                <button
                  onClick={() => updateTrackStatus(currentTrack.id, 'Under Maintenance')}
                  className="p-2 rounded-lg bg-orange-950/80 hover:bg-orange-900 text-orange-300 border border-orange-700/60 font-semibold"
                >
                  Engineering Work
                </button>
                <button
                  onClick={() => updateTrackStatus(currentTrack.id, 'Emergency Block')}
                  className="p-2 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/60 font-semibold"
                >
                  Emergency Block
                </button>
              </div>
            </div>

            {/* Temporary Speed Restriction (TSR) Editor */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Caution Order Speed Restriction (TSR)
              </div>
              <p className="text-[11px] text-slate-400">
                Impose speed restriction on train pilots entering this track section:
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="130"
                  value={newSpeedLimit}
                  onChange={(e) => setNewSpeedLimit(Number(e.target.value))}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs font-mono text-slate-100"
                />
                <span className="text-xs text-slate-300">km/h</span>

                <button
                  onClick={handleApplySpeedLimit}
                  className="ml-auto px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Issue TSR
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-center justify-center text-slate-400 text-xs">
            No track selected.
          </div>
        )}
      </div>
    </div>
  );
};
