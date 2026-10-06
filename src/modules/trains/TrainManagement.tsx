import React, { useState } from 'react';
import {
  Train as TrainIcon,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Train, TrainStatus, TrainType, TrainCategory } from '../../types/railway';

export const TrainManagement: React.FC = () => {
  const { trains, addTrain, updateTrain, changeTrainStatus, updateTrainSpeed } = useRailway();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(trains[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Train form state
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<TrainType>('Vande Bharat Express');
  const [newCategory, setNewCategory] = useState<TrainCategory>('Premium');
  const [newSource, setNewSource] = useState('New Delhi (NDLS)');
  const [newDest, setNewDest] = useState('Amritsar Junction (ASR)');
  const [newSpeed, setNewSpeed] = useState(130);
  const [newCoaches, setNewCoaches] = useState(16);
  const [newArr, setNewArr] = useState('17:00');
  const [newDep, setNewDep] = useState('17:30');

  const filteredTrains = trains.filter((t) => {
    const matchesSearch =
      t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destinationStation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreateTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber || !newName) return;

    addTrain({
      number: newNumber,
      name: newName,
      type: newType,
      category: newCategory,
      sourceStation: newSource,
      destinationStation: newDest,
      maxSpeedKmph: Number(newSpeed),
      coachesCount: Number(newCoaches),
      lengthMeters: Number(newCoaches) * 25,
      scheduledArrival: newArr,
      expectedArrival: newArr,
      scheduledDeparture: newDep,
      expectedDeparture: newDep,
      direction: 'DOWN',
      locoNumber: 'WAP-7 #30999 (NDLS Shed)',
    });

    setIsAddModalOpen(false);
    setNewNumber('');
    setNewName('');
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrainIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Train Management & Master Fleet Roster</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registry of all coaching rakes, freight trains, suburban MEMUs, and special trainsets operating through the junction.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Train</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search train by 5-digit number, name, or destination..."
            className="w-full bg-transparent text-slate-100 focus:outline-none placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          {(['ALL', 'Premium', 'Express', 'Suburban', 'Freight'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                categoryFilter === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Split Grid: Train List (Left) and Selected Train Details Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Train Registry Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Train</th>
                  <th className="p-3">Type & Rake</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Speed</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTrains.map((train) => {
                  const isSelected = selectedTrain?.id === train.id;
                  return (
                    <tr
                      key={train.id}
                      onClick={() => setSelectedTrain(train)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-amber-950/30 border-l-4 border-amber-400' : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-mono font-bold text-amber-300">{train.number}</div>
                        <div className="text-[11px] text-slate-200 font-medium truncate max-w-[160px]">
                          {train.name}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-300">{train.type}</div>
                        <div className="text-[10px] text-slate-500">
                          {train.coachesCount} Coaches ({train.lengthMeters}m)
                        </div>
                      </td>
                      <td className="p-3 text-[11px]">
                        <div>{train.sourceStation}</div>
                        <div className="text-slate-400 text-[10px]">to {train.destinationStation}</div>
                      </td>
                      <td className="p-3 font-mono">
                        <span className={train.currentSpeedKmph > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                          {train.currentSpeedKmph} km/h
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        {train.currentPlatformId ? (
                          <span className="text-emerald-400 font-bold">PF {train.currentPlatformId.slice(3)}</span>
                        ) : (
                          <span className="text-slate-500">-</span>
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
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {train.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Train Details Dashboard */}
        {selectedTrain ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <div className="text-xl font-bold font-mono text-amber-300">{selectedTrain.number}</div>
                <div className="font-semibold text-slate-100 text-sm">{selectedTrain.name}</div>
                <div className="text-xs text-slate-400">{selectedTrain.type} · Category: {selectedTrain.category}</div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-200 border border-slate-700">
                {selectedTrain.status}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Current Location:</span>
                <span className="font-semibold text-slate-200">{selectedTrain.currentLocation}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Current Track:</span>
                <span className="font-mono font-semibold text-slate-200">{selectedTrain.currentTrackId || 'None'}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Speed (Max {selectedTrain.maxSpeedKmph}):</span>
                <span className="font-mono font-semibold text-emerald-400">{selectedTrain.currentSpeedKmph} km/h</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Delay Status:</span>
                <span className="font-mono font-semibold text-amber-400">{selectedTrain.delayMinutes} mins delay</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Scheduled Arr / Dep:</span>
                <span className="font-mono text-slate-300">{selectedTrain.scheduledArrival} / {selectedTrain.scheduledDeparture}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Locomotive / Shed:</span>
                <span className="font-mono text-slate-300 truncate block">{selectedTrain.locoNumber}</span>
              </div>
            </div>

            {/* Quick Status Setter */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-[11px] text-slate-400 block font-semibold uppercase">Change Train Status</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['Approaching', 'At Platform', 'Departing', 'In Transit', 'Delayed', 'Under Maintenance'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => changeTrainStatus(selectedTrain.id, st)}
                      className={`p-1.5 rounded text-[11px] font-medium transition ${
                        selectedTrain.status === st
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Speed Adjuster */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Throttle Control:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedTrain.currentSpeedKmph} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max={selectedTrain.maxSpeedKmph}
                value={selectedTrain.currentSpeedKmph}
                onChange={(e) => updateTrainSpeed(selectedTrain.id, Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
            Select a train from the list to view telemetry and adjust controls.
          </div>
        )}
      </div>

      {/* Add Train Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <TrainIcon className="w-5 h-5 text-amber-400" />
              <span>Register New Train (Indian Railways Master)</span>
            </h3>

            <form onSubmit={handleCreateTrain} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Train Number (5-digit)</label>
                  <input
                    type="text"
                    required
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
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
                  <label className="text-slate-400 block mb-1">Train Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TrainType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  >
                    <option value="Vande Bharat Express">Vande Bharat Express</option>
                    <option value="Rajdhani Express">Rajdhani Express</option>
                    <option value="Shatabdi Express">Shatabdi Express</option>
                    <option value="Superfast Express">Superfast Express</option>
                    <option value="Mail / Express">Mail / Express</option>
                    <option value="Passenger / MEMU">Passenger / MEMU</option>
                    <option value="Freight / Container">Freight / Container</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TrainCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  >
                    <option value="Premium">Premium</option>
                    <option value="Express">Express</option>
                    <option value="Suburban">Suburban</option>
                    <option value="Freight">Freight</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Origin Station</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Destination Station</label>
                  <input
                    type="text"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Coaches</label>
                  <input
                    type="number"
                    value={newCoaches}
                    onChange={(e) => setNewCoaches(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Max Speed (km/h)</label>
                  <input
                    type="number"
                    value={newSpeed}
                    onChange={(e) => setNewSpeed(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sch. Arr / Dep</label>
                  <input
                    type="text"
                    value={newArr}
                    onChange={(e) => setNewArr(e.target.value)}
                    placeholder="17:00"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Create Train
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
