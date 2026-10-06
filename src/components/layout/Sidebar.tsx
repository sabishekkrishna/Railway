import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Train,
  Calendar,
  Layers,
  GitBranch,
  ShieldAlert,
  Radio,
  Navigation,
  Wrench,
  Activity,
  AlertTriangle,
  Flame,
  Users,
  Clock,
  Box,
  BarChart3,
  FileText,
  Sparkles,
  Tv,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, conflicts, emergencies, workOrders } = useRailway();

  const activeConflictCount = conflicts.filter((c) => !c.resolved).length;
  const activeEmergenciesCount = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed').length;
  const pendingWorkOrders = workOrders.filter((w) => w.status === 'IN_PROGRESS' || w.status === 'PENDING').length;

  const navGroups = [
    {
      title: 'Operational Desks',
      items: [
        { id: 'control-room', label: 'Control Room OCC', icon: LayoutDashboard },
        { id: 'station-master', label: 'Station Master Desk', icon: MapPin },
        { id: 'admin-dashboard', label: 'Admin Command', icon: Box },
        { id: 'passenger-pids', label: 'Passenger Display (PIDS)', icon: Tv },
      ],
    },
    {
      title: 'Interlocking & Movement',
      items: [
        { id: 'station-map', label: 'Station Track Diagram', icon: GitBranch },
        { id: 'trains', label: 'Train Management', icon: Train },
        { id: 'schedules', label: 'Train Scheduling', icon: Calendar },
        { id: 'platforms', label: 'Platform Allocation', icon: Layers },
        { id: 'tracks', label: 'Track Management', icon: GitBranch },
        { id: 'signals', label: 'Signal Simulation', icon: Radio },
        { id: 'movement', label: 'Train Movement Control', icon: Navigation },
      ],
    },
    {
      title: 'Safety & Emergency',
      items: [
        {
          id: 'collision',
          label: 'Collision Prevention',
          icon: ShieldAlert,
          badge: activeConflictCount > 0 ? activeConflictCount : undefined,
          badgeType: 'critical',
        },
        {
          id: 'emergency',
          label: 'Emergency Incidents',
          icon: AlertTriangle,
          badge: activeEmergenciesCount > 0 ? activeEmergenciesCount : undefined,
          badgeType: 'emergency',
        },
        { id: 'scenarios', label: 'Scenario Simulator', icon: Flame },
      ],
    },
    {
      title: 'Engineering & Assets',
      items: [
        {
          id: 'maintenance',
          label: 'Train Maintenance',
          icon: Wrench,
          badge: pendingWorkOrders > 0 ? pendingWorkOrders : undefined,
          badgeType: 'warning',
        },
        { id: 'sensors', label: 'Health Telemetry', icon: Activity },
        { id: 'resources', label: 'Station Resources', icon: Box },
      ],
    },
    {
      title: 'Coordination & Insights',
      items: [
        { id: 'delays', label: 'Cascading Delay Analysis', icon: Clock },
        { id: 'staff', label: 'Staff Management', icon: Users },
        { id: 'ai-decision', label: 'AI Decision Support', icon: Sparkles },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'audit', label: 'Audit Log Trail', icon: FileText },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 overflow-y-auto select-none">
      <div className="p-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition ${
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

                    {item.badge !== undefined && (
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          item.badgeType === 'critical'
                            ? 'bg-red-600 text-white animate-pulse'
                            : item.badgeType === 'emergency'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-600/80 text-white'
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
        ))}
      </div>

      <div className="mt-auto p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>IR-OCC System Build</span>
          <span className="font-mono text-slate-300">v4.2-OCC</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Indian Railways Simulation Platform
        </div>
      </div>
    </aside>
  );
};
