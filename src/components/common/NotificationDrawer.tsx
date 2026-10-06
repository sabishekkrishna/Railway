import React, { useState } from 'react';
import { X, Bell, Trash2, AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { NotificationPriority } from '../../types/railway';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, dismissNotification, clearNotifications } = useRailway();
  const [filter, setFilter] = useState<'ALL' | NotificationPriority>('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => filter === 'ALL' || n.priority === filter);

  const getPriorityIcon = (p: NotificationPriority) => {
    switch (p) {
      case 'CRITICAL':
        return <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  const getPriorityBadgeClass = (p: NotificationPriority) => {
    switch (p) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/80 border-red-800/60';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/80 border-orange-800/60';
      case 'WARNING':
        return 'text-amber-400 bg-amber-950/80 border-amber-800/60';
      case 'INFO':
        return 'text-blue-400 bg-blue-950/80 border-blue-800/60';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col text-slate-100 select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-sm">System Alerts & Incidents</h3>
          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {notifications.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition text-xs flex items-center gap-1"
              title="Clear all alerts"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-2 border-b border-slate-800 flex items-center gap-1 bg-slate-900 text-xs">
        {(['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition ${
              filter === tab
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            No {filter !== 'ALL' ? filter.toLowerCase() : ''} alerts at this time.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/90 text-xs space-y-1 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {getPriorityIcon(item.priority)}
                  <div>
                    <div className="font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono">{item.timestamp} IST</span>
                      <span>·</span>
                      <span className="text-slate-400">{item.module}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border ${getPriorityBadgeClass(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                  <button
                    onClick={() => dismissNotification(item.id)}
                    className="text-slate-500 hover:text-slate-300 p-0.5"
                    title="Dismiss alert"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-slate-300 text-[11px] pl-6 leading-relaxed">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
