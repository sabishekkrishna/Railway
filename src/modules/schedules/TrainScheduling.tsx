import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Schedule } from '../../types/railway';

export const TrainScheduling: React.FC = () => {
  const { schedules, trains, platforms, tracks, createSchedule, simulatedTime } = useRailway();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New schedule form state
  const [selectedTrainId, setSelectedTrainId] = useState(trains[0]?.id || '');
  const [arrTime, setArrTime] = useState('16:00');
  const [depTime, setDepTime] = useState('16:45');
  const [prefPlatform, setPrefPlatform] = useState('PF-03');
  const [prefTrack, setPrefTrack] = useState('T-03');

  // Detect timetable conflicts: Two schedules with overlapping arrival/departure on same platform
  const detectedConflicts: { schA: Schedule; schB: Schedule; reason: string }[] = [];
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      const a = schedules[i];
      const b = schedules[j];
      if (
        a.allocatedPlatformId &&
        b.allocatedPlatformId &&
        a.allocatedPlatformId === b.allocatedPlatformId &&
        a.status !== 'Completed' &&
        b.status !== 'Completed'
      ) {
        // Compare times (simplified HH:MM)
        const [aArrH, aArrM] = a.arrivalTime.split(':').map(Number);
        const [bArrH, bArrM] = b.arrivalTime.split(':').map(Number);
        const aMins = aArrH * 60 + aArrM;
        const bMins = bArrH * 60 + bArrM;

        if (Math.abs(aMins - bMins) < 40) {
          detectedConflicts.push({
            schA: a,
            schB: b,
            reason: `Both Train ${a.trainNumber} and Train ${b.trainNumber} scheduled on Platform ${a.allocatedPlatformId.slice(
              3
            )} within 40 minutes (${a.arrivalTime} vs ${b.arrivalTime}).`,
          });
        }
      }
    }
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const t = trains.find((tr) => tr.id === selectedTrainId);
    if (!t) return;

    createSchedule({
      trainId: t.id,
      trainNumber: t.number,
      trainName: t.name,
      arrivalTime: arrTime,
      departureTime: depTime,
      platformPreference: prefPlatform,
      trackPreference: prefTrack,
      allocatedPlatformId: prefPlatform,
      allocatedTrackId: prefTrack,
      journeyDurationMinutes: 180,
      stops: ['NDLS', 'MTJ', 'AGC'],
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Train Scheduling & Master Timetable</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated conflict detection identifies platform overlaps and headway violations before train approach.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Schedule Slot</span>
        </button>
      </div>

      {/* Schedule Conflicts Alert Banner */}
      {detectedConflicts.length > 0 && (
        <div className="p-4 bg-amber-950/60 border border-amber-600/70 rounded-xl text-amber-200 space-y-2 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 className="font-bold text-sm text-amber-300">
              {detectedConflicts.length} Timetable Platform Conflict(s) Detected
            </h3>
          </div>
          <div className="space-y-1.5 text-xs">
            {detectedConflicts.map((c, i) => (
              <div key={i} className="p-2.5 bg-slate-950/80 rounded-lg border border-amber-900/60 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-400">
                    Train {c.schA.trainNumber} & Train {c.schB.trainNumber}:
                  </span>{' '}
                  <span className="text-slate-200">{c.reason}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  PLATFORM OVERLAP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedules Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
            Current Station Operational Timetable ({schedules.length} Scheduled Runs)
          </span>
          <span className="text-xs font-mono text-slate-400">Station Clock: {simulatedTime} IST</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Schedule ID</th>
                <th className="p-3">Train</th>
                <th className="p-3">Arrival Time</th>
                <th className="p-3">Departure Time</th>
                <th className="p-3">Allocated Platform</th>
                <th className="p-3">Allocated Track</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {schedules.map((sch) => {
                const isConflicted = detectedConflicts.some(
                  (c) => c.schA.id === sch.id || c.schB.id === sch.id
                );

                return (
                  <tr key={sch.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3 font-mono text-slate-400">{sch.id}</td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-300">{sch.trainNumber}</div>
                      <div className="text-slate-200 text-[11px] font-medium">{sch.trainName}</div>
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-200">{sch.arrivalTime}</td>
                    <td className="p-3 font-mono text-slate-300">{sch.departureTime}</td>
                    <td className="p-3 font-mono">
                      {sch.allocatedPlatformId ? (
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            isConflicted
                              ? 'bg-red-950 text-red-300 border border-red-700'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          PF {sch.allocatedPlatformId.slice(3)}
                        </span>
                      ) : (
                        <span className="text-slate-500">Unallocated</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-300">{sch.allocatedTrackId || 'Track Siding'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                        {sch.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Create Train Timetable Schedule</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Train</label>
                <select
                  value={selectedTrainId}
                  onChange={(e) => setSelectedTrainId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                >
                  {trains.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.number} - {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Arrival Time</label>
                  <input
                    type="text"
                    required
                    value={arrTime}
                    onChange={(e) => setArrTime(e.target.value)}
                    placeholder="16:00"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Departure Time</label>
                  <input
                    type="text"
                    required
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                    placeholder="16:45"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Platform Preference</label>
                  <select
                    value={prefPlatform}
                    onChange={(e) => setPrefPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  >
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        Platform {p.number}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Track Preference</label>
                  <select
                    value={prefTrack}
                    onChange={(e) => setPrefTrack(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  >
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} ({t.number})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
