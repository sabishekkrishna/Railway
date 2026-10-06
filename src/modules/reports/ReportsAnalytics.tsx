import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Layers,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const ReportsAnalytics: React.FC = () => {
  const { trains, platforms, tracks, emergencies, workOrders, conflicts, simulatedTime } = useRailway();
  const [reportDate, setReportDate] = useState('2026-10-06');

  const delayedCount = trains.filter((t) => t.delayMinutes > 0).length;
  const onTimeCount = trains.length - delayedCount;
  const punctualityPercent = Math.round((onTimeCount / (trains.length || 1)) * 100);

  // Platform utilization calculation
  const platformStats = platforms.map((p) => ({
    name: `PF ${p.number}`,
    utilization: p.status === 'Occupied' ? 88 : p.status === 'Reserved' ? 65 : p.status === 'Available' ? 32 : 12,
  }));

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Train Number,Name,Type,Status,Scheduled Arrival,Delay Minutes\n' +
      trains.map((t) => `${t.number},"${t.name}",${t.type},${t.status},${t.scheduledArrival},${t.delayMinutes}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NDLS_Operations_Report_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Operational Reporting & Station Analytics</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical analysis of train punctuality, platform occupancy hours, track headway, maintenance turnarounds, and safety alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
          />
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Headline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Station Punctuality Index</span>
          <div className="text-3xl font-mono font-black text-emerald-400">{punctualityPercent}%</div>
          <div className="text-[10px] text-slate-500">Target: &gt; 92% (Northern Railway)</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Platform Utilization Factor</span>
          <div className="text-3xl font-mono font-black text-amber-400">76.4%</div>
          <div className="text-[10px] text-slate-500">Average dwell time: 24.5 min</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Emergency Incidents Handled</span>
          <div className="text-3xl font-mono font-black text-rose-400">{emergencies.length}</div>
          <div className="text-[10px] text-slate-500">All incidents resolved safely</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Maintenance Orders Logged</span>
          <div className="text-3xl font-mono font-black text-blue-400">{workOrders.length}</div>
          <div className="text-[10px] text-slate-500">Carriage & Wagon Depot</div>
        </div>
      </div>

      {/* Analytics Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Platform Occupancy Bar Chart Visualizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Platform Berth Utilization Rates (%)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Daily Average</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {platformStats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-300">{stat.name}</span>
                  <span className="font-mono font-bold text-amber-400">{stat.utilization}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${stat.utilization}%` }}
                    className={`h-full ${
                      stat.utilization > 80 ? 'bg-amber-500' : stat.utilization > 50 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delay Breakdown by Train Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Punctuality Adherence by Category
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Active Rakes</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">Vande Bharat & Shatabdi (Premium)</span>
                <div className="text-[10px] text-slate-400">Strict Green Corridor priority</div>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">100% On-Time</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">Rajdhani Express (Premium AC)</span>
                <div className="text-[10px] text-slate-400">Long distance cross-zone rakes</div>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">94.5% On-Time</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">Mail / Express (Mixed Composition)</span>
                <div className="text-[10px] text-slate-400">Suburban and passenger traffic interactions</div>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">88.0% On-Time</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">Freight & Container Rakes</span>
                <div className="text-[10px] text-slate-400">Dedicated freight bypass operation</div>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">96.0% On-Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
