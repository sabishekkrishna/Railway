import React, { useState } from 'react';
import {
  FileText,
  Search,
  Shield,
  Download,
  Filter,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useRailway();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      log.newValue.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const modules = ['ALL', 'Platform Allocation', 'Track Management', 'Train Movement', 'Collision Prevention', 'Emergency Management', 'Maintenance', 'Signalling'];

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Operational Audit Trail & Safety Log</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-proof chronological record of all route relay interlocking changes, emergency declarations, speed restrictions, and platform allocations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400">
          <Lock className="w-3.5 h-3.5" />
          <span>CRYPTOGRAPHIC INTEGRITY: SEALED</span>
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
            placeholder="Search audit trail by user, action, or module..."
            className="w-full bg-transparent text-slate-100 focus:outline-none placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs">
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                moduleFilter === m
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp (UTC/IST)</th>
                <th className="p-3">Operator & Role</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Previous State</th>
                <th className="p-3">New State</th>
                <th className="p-3 text-right">Terminal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No matching audit entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-200 font-sans">{log.userName}</div>
                      <div className="text-[10px] text-amber-400 font-sans">{log.userRole}</div>
                    </td>
                    <td className="p-3 text-slate-300 font-sans">{log.module}</td>
                    <td className="p-3 font-semibold text-slate-100 font-sans">{log.action}</td>
                    <td className="p-3 text-slate-400">{log.previousValue}</td>
                    <td className="p-3 text-emerald-400 font-bold">{log.newValue}</td>
                    <td className="p-3 text-right text-slate-500 text-[10px]">{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
