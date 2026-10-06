import React from 'react';
import {
  GitBranch,
  Layers,
  Clock,
  Tv,
  AlertTriangle,
  Train,
  CheckCircle2,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, conflicts, emergencies, platforms, trains } = useRailway();

  const activeConflictCount = conflicts.filter((c) => !c.resolved).length;
  const activeEmergenciesCount = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed').length;
  const occupiedPlatformsCount = platforms.filter((p) => p.status === 'Occupied').length;
  const delayedTrainsCount = trains.filter((t) => t.delayMinutes > 0).length;

  const essentialStationFunctions = [
    {
      id: 'station-interlocking',
      label: 'Live Interlocking & Yard',
      subtitle: 'Track diagram, signals & rakes',
      icon: GitBranch,
      badge: activeConflictCount > 0 ? `${activeConflictCount} Alert` : undefined,
      badgeType: 'critical',
    },
    {
      id: 'platforms',
      label: 'Platform Berthing',
      subtitle: `${occupiedPlatformsCount}/8 Berthed · Smart allocation`,
      icon: Layers,
    },
    {
      id: 'timetable',
      label: 'Timetable & Movements',
      subtitle: `${delayedTrainsCount > 0 ? `${delayedTrainsCount} Delayed` : 'All On Time'}`,
      icon: Clock,
      badge: delayedTrainsCount > 0 ? `${delayedTrainsCount} Del.` : undefined,
      badgeType: 'warning',
    },
    {
      id: 'passenger-pids',
      label: 'Passenger Board & PIDS',
      subtitle: 'LED display & audio announcements',
      icon: Tv,
    },
    {
      id: 'emergency',
      label: 'Station Safety & Emergency',
      subtitle: 'Incident protocol & track block',
      icon: AlertTriangle,
      badge: activeEmergenciesCount > 0 ? `${activeEmergenciesCount} Active` : undefined,
      badgeType: 'emergency',
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 select-none">
      {/* Station Master Quick Summary Card */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/60">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Station Operations Console
        </div>
        <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
          <span>NDLS Central Station</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
            OPERATIONAL
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Available Platforms</span>
            <span className="font-mono font-bold text-emerald-400">
              {platforms.filter((p) => p.status === 'Available').length} / 8 Free
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Active Trains</span>
            <span className="font-mono font-bold text-amber-300">
              {trains.filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled').length} in Station
            </span>
          </div>
        </div>
      </div>

      {/* 5 Essential Station Functions */}
      <div className="p-2 space-y-1 flex-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Station Management Functions
        </div>

        {essentialStationFunctions.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.subtitle}</div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    item.badgeType === 'critical'
                      ? 'bg-red-600 text-white animate-pulse'
                      : item.badgeType === 'emergency'
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Clean Station Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-300">Station Terminal</span>
          <span className="font-mono text-emerald-400 text-[10px]">25kV OHE LIVE</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Indian Railways Station Operations Terminal
        </div>
      </div>
    </aside>
  );
};
