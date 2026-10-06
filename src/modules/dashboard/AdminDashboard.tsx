import React from 'react';
import {
  Box,
  Train as TrainIcon,
  Layers,
  GitBranch,
  ShieldAlert,
  AlertTriangle,
  Wrench,
  Users,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const AdminDashboard: React.FC = () => {
  const {
    station,
    trains,
    platforms,
    tracks,
    emergencies,
    workOrders,
    conflicts,
    staff,
    resources,
    setActiveTab,
    simulatedTime,
  } = useRailway();

  const activeTrains = trains.filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled');
  const delayedTrains = trains.filter((t) => t.delayMinutes > 0);
  const availablePlatforms = platforms.filter((p) => p.status === 'Available');
  const occupiedTracks = tracks.filter((t) => t.status === 'Occupied');
  const activeEmergencies = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed');
  const criticalConflicts = conflicts.filter((c) => !c.resolved && c.risk === 'CRITICAL');

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Super Administrator & DRM Operations Command</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Divisional Railway Manager (DRM - Delhi) executive overview across traffic operations, fleet availability, infrastructure reliability, and incident control.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>DRM DELHI · SYSTEM OVERVIEW · {simulatedTime} IST</span>
        </div>
      </div>

      {/* Primary KPI Command Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Registered Fleet</span>
            <TrainIcon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-black text-slate-100">{trains.length}</div>
          <div className="text-[11px] text-slate-400">{activeTrains.length} actively operating in section</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Platform Availability</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-black text-emerald-400">
            {availablePlatforms.length} <span className="text-sm font-normal text-slate-500">/ {platforms.length}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {platforms.length - availablePlatforms.length} berths occupied or maintenance
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Critical Conflicts</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className={`text-3xl font-mono font-black ${criticalConflicts.length > 0 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
            {criticalConflicts.length}
          </div>
          <div className="text-[11px] text-slate-400">Interlocking collision avoidance</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Active Emergencies</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`text-3xl font-mono font-black ${activeEmergencies.length > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {activeEmergencies.length}
          </div>
          <div className="text-[11px] text-slate-400">Disaster management teams deployed</div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Track Occupancy */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-slate-300 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-blue-400" /> Track Infrastructure
            </span>
            <span className="text-xs font-mono text-emerald-400">{occupiedTracks.length} / {tracks.length} Occupied</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All 12 track circuits electrified with 25kV OHE catenary. Continuous track circuit detection enabled.
          </p>
          <button
            onClick={() => setActiveTab('tracks')}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 pt-1"
          >
            Manage Track Sections <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Maintenance Alerts */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-slate-300 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-400" /> Rolling Stock Maintenance
            </span>
            <span className="text-xs font-mono text-amber-400">
              {workOrders.filter((w) => w.status !== 'COMPLETED').length} Active Orders
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Coaching depot pit wheel lathe and LHB periodic overhaul teams actively inspecting braking and traction components.
          </p>
          <button
            onClick={() => setActiveTab('maintenance')}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 pt-1"
          >
            Open Maintenance Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Staff & Shift Roster */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-400" /> Staff on Duty
            </span>
            <span className="text-xs font-mono text-emerald-400">{staff.filter((s) => s.available).length} / {staff.length} Present</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full shift deployment across Station Masters, Train Controllers, Loco Pilots, and RPF Security Officers.
          </p>
          <button
            onClick={() => setActiveTab('staff')}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 pt-1"
          >
            View Staff Roster <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
