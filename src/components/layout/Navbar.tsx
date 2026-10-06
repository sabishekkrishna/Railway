import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Bell,
  AlertOctagon,
  AlertTriangle,
  Clock,
  Train,
  CheckCircle2,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

interface NavbarProps {
  onToggleNotifications: () => void;
  showNotifications: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleNotifications, showNotifications }) => {
  const {
    station,
    simulatedTime,
    simRunning,
    simSpeed,
    toggleSimulation,
    setSimulationSpeed,
    resetSimulation,
    conflicts,
    emergencies,
    notifications,
    playChime,
  } = useRailway();

  const activeConflicts = conflicts.filter((c) => !c.resolved);
  const activeEmergencies = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed');
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 select-none shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Brand & Station Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-700/90 border border-red-500/40 flex items-center justify-center text-white shadow-inner shrink-0">
            <Train className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">IR Station Control</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-mono">
                {station.code}
              </span>
              <span className="text-slate-300 text-xs hidden sm:inline font-medium">
                · {station.name}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>Station Operations Console</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-emerald-400 font-mono">25kV OHE Active</span>
            </div>
          </div>
        </div>

        {/* Center: Live Station Clock & Simulation Controls */}
        <div className="flex items-center gap-3">
          {/* Simulated Station Time */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner">
            <div className={`w-2.5 h-2.5 rounded-full ${simRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
              {simulatedTime} <span className="text-[10px] text-slate-400 font-normal">IST</span>
            </span>
          </div>

          {/* Simulation Ticker Controls */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/70">
            <button
              onClick={toggleSimulation}
              title={simRunning ? 'Pause Station Simulation' : 'Resume Station Simulation'}
              className={`p-1.5 rounded transition ${
                simRunning
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {simRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Speed multipliers */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimulationSpeed(s)}
                  className={`px-2 py-0.5 text-xs font-mono font-medium rounded transition ${
                    simSpeed === s
                      ? 'bg-slate-900 text-amber-400 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={resetSimulation}
              title="Reset Station to Baseline 14:30 IST"
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-700/60 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audio Station Chime */}
          <button
            onClick={playChime}
            title="Play Indian Railways Station Chime (4-Tone Gong)"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Station Chime</span>
          </button>
        </div>

        {/* Right Section: Alert Badges & Notifications Drawer */}
        <div className="flex items-center gap-2.5">
          {activeConflicts.length > 0 && (
            <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-600/70 text-red-300 px-2.5 py-1 rounded-lg text-xs font-medium animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span>{activeConflicts.length} Conflict</span>
            </div>
          )}

          {activeEmergencies.length > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-600/70 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{activeEmergencies.length} Incident</span>
            </div>
          )}

          {/* Notifications Toggle */}
          <button
            onClick={onToggleNotifications}
            className={`relative p-2 rounded-lg border transition ${
              showNotifications
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Station Alerts Feed"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
