import React, { useState } from 'react';
import {
  GitBranch,
  Layers,
  Clock,
  Tv,
  AlertTriangle,
  Train,
  CheckCircle2,
  LayoutDashboard,
  MapPin,
  Box,
  Radio,
  Navigation,
  ShieldAlert,
  Flame,
  Wrench,
  Activity,
  Users,
  Sparkles,
  BarChart3,
  FileText,
  Search,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, conflicts, emergencies, platforms, trains, workOrders } = useRailway();
  const [navMode, setNavMode] = useState<'station' | 'all'>('station');
  const [searchFilter, setSearchFilter] = useState('');

  const activeConflictCount = conflicts.filter((c) => !c.resolved).length;
  const activeEmergenciesCount = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed').length;
  const occupiedPlatformsCount = platforms.filter((p) => p.status === 'Occupied').length;
  const delayedTrainsCount = trains.filter((t) => t.delayMinutes > 0).length;
  const pendingWorkOrders = workOrders.filter((w) => w.status === 'IN_PROGRESS' || w.status === 'PENDING').length;

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

  const occNavGroups = [
    {
      title: 'Operational Desks',
      items: [
        { id: 'control-room', label: 'Control Room OCC', icon: LayoutDashboard },
        { id: 'station-master', label: 'Station Master Desk', icon: MapPin },
        { id: 'admin-dashboard', label: 'DRM Admin Command', icon: Box },
        { id: 'passenger-pids', label: 'Passenger PIDS Board', icon: Tv },
      ],
    },
    {
      title: 'Interlocking & Movement',
      items: [
        { id: 'station-interlocking', label: 'Live Station Interlocking', icon: GitBranch },
        { id: 'station-map', label: 'Full Yard Track Diagram', icon: GitBranch },
        { id: 'trains', label: 'Master Train Fleet', icon: Train },
        { id: 'schedules', label: 'Train Scheduling Slots', icon: Clock },
        { id: 'platforms', label: 'Platform Allocation', icon: Layers },
        { id: 'tracks', label: 'Track Circuits & TSR', icon: GitBranch },
        { id: 'signals', label: 'Signalling MACLS Panel', icon: Radio },
        { id: 'movement', label: 'Movement & Speed Control', icon: Navigation },
      ],
    },
    {
      title: 'Safety & Emergency',
      items: [
        {
          id: 'collision',
          label: 'Collision Prevention / Kavach',
          icon: ShieldAlert,
          badge: activeConflictCount > 0 ? `${activeConflictCount}` : undefined,
          badgeType: 'critical',
        },
        {
          id: 'emergency',
          label: 'Station Emergency Hold',
          icon: AlertTriangle,
          badge: activeEmergenciesCount > 0 ? `${activeEmergenciesCount}` : undefined,
          badgeType: 'emergency',
        },
        {
          id: 'emergency-ops',
          label: 'Disaster Incident Command',
          icon: ShieldAlert,
          badge: activeEmergenciesCount > 0 ? `${activeEmergenciesCount}` : undefined,
          badgeType: 'emergency',
        },
        { id: 'scenarios', label: 'Disaster Scenario Lab', icon: Flame },
      ],
    },
    {
      title: 'Engineering & Assets',
      items: [
        {
          id: 'maintenance',
          label: 'Rolling Stock Maintenance',
          icon: Wrench,
          badge: pendingWorkOrders > 0 ? `${pendingWorkOrders}` : undefined,
          badgeType: 'warning',
        },
        { id: 'sensors', label: 'Train Health Telemetry', icon: Activity },
        { id: 'resources', label: 'Station Resources & CCTV', icon: Box },
      ],
    },
    {
      title: 'Intelligence & Insights',
      items: [
        { id: 'ai-decision', label: 'AI Decision Advisory', icon: Sparkles },
        { id: 'delays', label: 'Cascading Delay Analysis', icon: Clock },
        { id: 'staff', label: 'Staff Roster & Duty', icon: Users },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'audit', label: 'Cryptographic Audit Trail', icon: FileText },
      ],
    },
  ];

  // If user is currently on an OCC module, automatically show OCC mode if user hasn't switched
  const isStationModule = essentialStationFunctions.some((f) => f.id === activeTab);

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 select-none">
      {/* Station Master Quick Summary Card */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
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

      {/* Mode Switcher Tabs */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/40 shrink-0 flex items-center gap-1">
        <button
          onClick={() => {
            setNavMode('station');
            setSearchFilter('');
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition text-center ${
            navMode === 'station'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
          }`}
        >
          Station Master
        </button>
        <button
          onClick={() => {
            setNavMode('all');
            setSearchFilter('');
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition text-center ${
            navMode === 'all'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
          }`}
        >
          All Modules (25)
        </button>
      </div>

      {/* Search Input when in All Modules mode */}
      {navMode === 'all' && (
        <div className="p-2 border-b border-slate-800 bg-slate-950/20 shrink-0">
          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search all 25 modules..."
              className="bg-transparent text-slate-200 placeholder-slate-500 text-xs focus:outline-none w-full"
            />
          </div>
        </div>
      )}

      {/* Main Navigation Area */}
      <div className="p-2 space-y-4 flex-1 overflow-y-auto">
        {navMode === 'station' ? (
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Essential Station Functions
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
        ) : (
          <div className="space-y-4">
            {occNavGroups.map((group) => {
              const filteredItems = group.items.filter((item) =>
                item.label.toLowerCase().includes(searchFilter.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={group.title}>
                  <div className="px-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {group.title}
                  </div>
                  <div className="space-y-0.5">
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                            isActive
                              ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-sm'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-amber-400' : 'text-slate-400'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Clean Station Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1 shrink-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-300">Station Terminal</span>
          <span className="font-mono text-emerald-400 text-[10px]">25kV OHE LIVE</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Indian Railways Integrated OCC Simulation
        </div>
      </div>
    </aside>
  );
};
