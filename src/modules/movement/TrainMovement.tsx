import React, { useState } from 'react';
import {
  Navigation,
  Play,
  Pause,
  Sliders,
  Compass,
  ArrowRight,
  Radio,
  Train as TrainIcon,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Train } from '../../types/railway';

export const TrainMovement: React.FC = () => {
  const { trains, changeTrainStatus, updateTrainSpeed, simulatedTime } = useRailway();
  const [selectedTrainId, setSelectedTrainId] = useState<string>(trains[0]?.id || '');

  const activeTrains = trains.filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled');
  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || activeTrains[0] || trains[0];

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Train Movement Simulation & Speed Regulation</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate train approach from outer distant signals, station approach, platform stop, passenger boarding, and section clearance.
          </p>
        </div>

        <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          TIMETABLE CLOCK: {simulatedTime} IST
        </div>
      </div>

      {/* Movement Controller Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Train Movement List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-sm text-slate-100">Active Movements in Block Section</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {activeTrains.map((train) => {
              const isSelected = selectedTrain.id === train.id;
              return (
                <div
                  key={train.id}
                  onClick={() => setSelectedTrainId(train.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition space-y-2 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-amber-300 text-sm">{train.number}</span>
                      <div className="font-medium text-xs text-slate-200">{train.name}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {train.status}
                    </span>
                  </div>

                  {/* Progress bar along block section */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                      <span>Outer Home</span>
                      <span>Platform Berthing</span>
                      <span>Section Exit</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        style={{ width: `${train.positionPercent}%` }}
                        className="h-full bg-amber-400 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Speed: {train.currentSpeedKmph} km/h</span>
                    <span>Track: {train.currentTrackId || 'None'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Train Throttle & Control Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-2xl font-black font-mono text-amber-300">{selectedTrain.number}</div>
              <div className="text-base font-bold text-slate-100">{selectedTrain.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Loco Pilot: <span className="text-slate-200 font-medium">{selectedTrain.driverName || 'Designated Driver'}</span> ·{' '}
                {selectedTrain.locoNumber}
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-black font-mono text-emerald-400">
                {selectedTrain.currentSpeedKmph} <span className="text-xs text-slate-400 font-normal">KM/H</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Max Authorized: {selectedTrain.maxSpeedKmph} km/h</div>
            </div>
          </div>

          {/* Quick Simulated Movement Actions */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Loco Pilot / Traffic Controller Dispatch Controls
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => changeTrainStatus(selectedTrain.id, 'Approaching', 45)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 transition"
              >
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <span>Simulate Approach</span>
              </button>

              <button
                onClick={() => changeTrainStatus(selectedTrain.id, 'At Platform', 0)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 transition"
              >
                <Pause className="w-4 h-4 text-amber-400" />
                <span>Halt at Platform</span>
              </button>

              <button
                onClick={() => changeTrainStatus(selectedTrain.id, 'Departing', 30)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex flex-col items-center gap-1.5 transition"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Simulate Departure</span>
              </button>

              <button
                onClick={() => changeTrainStatus(selectedTrain.id, 'Delayed', 0)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-amber-300 text-xs font-semibold flex flex-col items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Hold at Signal</span>
              </button>
            </div>
          </div>

          {/* Speed Throttle Slider */}
          <div className="space-y-2 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Traction Motor Throttle:</span>
              <span className="font-mono text-emerald-400 font-bold">{selectedTrain.currentSpeedKmph} km/h</span>
            </div>
            <input
              type="range"
              min="0"
              max={selectedTrain.maxSpeedKmph}
              value={selectedTrain.currentSpeedKmph}
              onChange={(e) => updateTrainSpeed(selectedTrain.id, Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 km/h (Standstill)</span>
              <span>Cautious Yard (30 km/h)</span>
              <span>Line Speed ({selectedTrain.maxSpeedKmph} km/h)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
