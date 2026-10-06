import React, { useState } from 'react';
import { AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

export const AuditBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="bg-amber-950/40 border-b border-amber-800/50 px-4 py-1 text-xs flex items-center justify-between text-amber-300">
        <span className="flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          Academic & Operational Simulation Model — Not for live railway signalling or safety-critical field control
        </span>
        <button
          onClick={() => setCollapsed(false)}
          className="text-amber-400 hover:text-amber-200 flex items-center gap-1 text-[11px] underline"
        >
          Expand Details <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-600/40 px-4 py-2 text-xs text-amber-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 mt-0.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <div className="font-semibold text-amber-300 flex items-center gap-2">
              <span>ACADEMIC & ENGINEERING SIMULATION SYSTEM</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                Non-Safety Critical
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
              This application simulates Indian Railways (IR) station interlocking, platform scheduling, route clearance, collision avoidance, and emergency workflows. All train numbers, timings, track parameters, and telemetry data are simulated for educational and systems demonstration purposes.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-amber-400 hover:text-amber-200 p-1 text-[11px] flex items-center gap-1 shrink-0"
          title="Collapse Banner"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
