import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Train as TrainIcon,
  Layers,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Train, TrainStatus } from '../../types/railway';

export const StationTimetableView: React.FC = () => {
  const { trains, platforms, changeTrainStatus, allocatePlatform, addTrain, simulatedTime } = useRailway();
  const [filter, setFilter] = useState<'ALL' | 'BERTHED' | 'APPROACHING' | 'DELAYED'>('ALL');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Train Modal State
  const [newNum, setNewNum] = useState('');
  const [newName, setNewName] = useState('');
  const [newArr, setNewArr] = useState('16:00');
  const [newDep, setNewDep] = useState('16:30');
  const [newPf, setNewPf] = useState('PF-03');

  const filteredTrains = trains.filter((t) => {
    const matchesSearch =
      t.number.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.destinationStation.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'BERTHED') return t.status === 'At Platform';
    if (filter === 'APPROACHING') return t.status === 'Approaching';
    if (filter === 'DELAYED') return t.delayMinutes > 0;
    return true;
  });

  const handleAddTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNum || !newName) return;

    addTrain({
      number: newNum,
      name: newName,
      type: 'Superfast Express',
      category: 'Express',
      sourceStation: 'New Delhi (NDLS)',
      destinationStation: 'Mumbai Central (MMCT)',
      scheduledArrival: newArr,
      expectedArrival: newArr,
      scheduledDeparture: newDep,
      expectedDeparture: newDep,
      currentPlatformId: newPf,
      direction: 'DOWN',
      lengthMeters: 450,
      coachesCount: 18,
    });

    setIsAddModalOpen(false);
    setNewNum('');
    setNewName('');
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Station Timetable & Movement Control</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor train arrivals, departures, platform assignments, and operational delays for New Delhi (NDLS).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
            STATION CLOCK: {simulatedTime} IST
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Train to Timetable</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by train number, name, or destination..."
            className="w-full bg-transparent text-slate-100 focus:outline-none placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          {(['ALL', 'BERTHED', 'APPROACHING', 'DELAYED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === tab
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab === 'BERTHED' ? 'At Platform' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timetable Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Train No. & Name</th>
                <th className="p-3">Route</th>
                <th className="p-3">Sch. Arr / Dep</th>
                <th className="p-3">Exp. Arr / Dep</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Delay</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Quick Station Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTrains.map((train) => {
                const pf = platforms.find((p) => p.id === train.currentPlatformId);

                return (
                  <tr key={train.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-300 text-sm">{train.number}</div>
                      <div className="font-medium text-slate-100 text-xs">{train.name}</div>
                      <div className="text-[10px] text-slate-400">{train.type}</div>
                    </td>
                    <td className="p-3 text-[11px]">
                      <div className="text-slate-300">{train.sourceStation}</div>
                      <div className="text-slate-400 text-[10px]">to {train.destinationStation}</div>
                    </td>
                    <td className="p-3 font-mono">
                      <div>Arr: {train.scheduledArrival}</div>
                      <div className="text-slate-400">Dep: {train.scheduledDeparture}</div>
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-200">
                      <div>Arr: {train.expectedArrival}</div>
                      <div className="text-slate-400">Dep: {train.expectedDeparture}</div>
                    </td>
                    <td className="p-3 font-mono">
                      {pf ? (
                        <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800 text-xs">
                          PF {pf.number}
                        </span>
                      ) : (
                        <span className="text-slate-500">Unallocated</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      {train.delayMinutes > 0 ? (
                        <span className="text-amber-400 font-bold">+{train.delayMinutes} min</span>
                      ) : (
                        <span className="text-emerald-400">Right Time</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          train.status === 'At Platform'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : train.status === 'Approaching'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : train.status === 'Delayed'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : train.status === 'Departing'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {train.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {train.status !== 'At Platform' && (
                          <button
                            onClick={() => changeTrainStatus(train.id, 'At Platform', 0)}
                            className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded font-medium text-[11px] transition"
                            title="Mark arrived at platform"
                          >
                            Mark Berthed
                          </button>
                        )}
                        {train.status === 'At Platform' && (
                          <button
                            onClick={() => changeTrainStatus(train.id, 'Departing', 25)}
                            className="px-2.5 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-700/60 text-purple-300 rounded font-medium text-[11px] transition"
                            title="Signal train departure"
                          >
                            Depart
                          </button>
                        )}
                        <button
                          onClick={() => changeTrainStatus(train.id, 'Delayed')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] transition"
                          title="Flag as delayed"
                        >
                          +Delay
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Train Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <TrainIcon className="w-5 h-5 text-amber-400" />
              <span>Add Train to Station Timetable</span>
            </h3>

            <form onSubmit={handleAddTrain} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Train Number</label>
                  <input
                    type="text"
                    required
                    value={newNum}
                    onChange={(e) => setNewNum(e.target.value)}
                    placeholder="e.g. 12004"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Train Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Lucknow Shatabdi"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Scheduled Arrival</label>
                  <input
                    type="text"
                    required
                    value={newArr}
                    onChange={(e) => setNewArr(e.target.value)}
                    placeholder="16:00"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Scheduled Departure</label>
                  <input
                    type="text"
                    required
                    value={newDep}
                    onChange={(e) => setNewDep(e.target.value)}
                    placeholder="16:30"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Platform Assignment</label>
                <select
                  value={newPf}
                  onChange={(e) => setNewPf(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                >
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      Platform {p.number} ({p.status} - {p.lengthMeters}m)
                    </option>
                  ))}
                </select>
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
                  Add Train
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
