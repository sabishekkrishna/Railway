import React from 'react';
import {
  Box,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  GitBranch,
  Shield,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const StationResources: React.FC = () => {
  const { resources } = useRailway();

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Station Resource & Asset Infrastructure</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time condition monitoring of critical station assets including escalators, Divyangjan lifts, 25kV traction substations, CCTV networks, and fire ring mains.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
          MONITORED ASSETS: {resources.length} NODES
        </span>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-md hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{res.id}</span>
                <h4 className="font-bold text-sm text-slate-100">{res.name}</h4>
                <div className="text-xs text-slate-400">{res.category} · {res.location}</div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  res.status === 'Operational'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {res.status}
              </span>
            </div>

            {/* Condition Score Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Condition Rating:</span>
                <span className="font-mono font-bold text-slate-200">{res.conditionScore} / 100</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${res.conditionScore}%` }}
                  className={`h-full ${
                    res.conditionScore >= 90
                      ? 'bg-emerald-500'
                      : res.conditionScore >= 70
                      ? 'bg-amber-400'
                      : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800/80">
              <span>Last Check: {res.lastInspected}</span>
              <span className="text-slate-300 font-mono">Due: {res.nextInspectionDue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
