import React from 'react';
import {
  Radio,
  Sliders,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  GitBranch,
  Lock,
  Unlock,
  RotateCw,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { SignalAspect } from '../../types/railway';

export const SignalSimulation: React.FC = () => {
  const { signals, tracks, updateSignalAspect, simulatedTime } = useRailway();

  const getAspectGlowClass = (aspect: SignalAspect) => {
    switch (aspect) {
      case 'GREEN':
        return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] border-emerald-300';
      case 'YELLOW':
        return 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)] border-yellow-200';
      case 'DOUBLE YELLOW':
        return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] border-amber-300';
      case 'RED':
        return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] border-red-300';
      default:
        return 'bg-slate-700 border-slate-600';
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Multi-Aspect Colour Light Signalling (MACLS) Board</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interlocking Route Relay panel with automatic fail-safe fallback to Danger (RED) upon track occupancy or point detection loss.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>INTERLOCKING STATUS: LOCKED & PROVED</span>
        </div>
      </div>

      {/* Signalling Legend Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] shrink-0" />
          <div>
            <div className="font-bold text-xs text-red-300">RED (Danger)</div>
            <div className="text-[10px] text-slate-400">Stop dead. Block section occupied.</div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] shrink-0" />
          <div>
            <div className="font-bold text-xs text-amber-300">YELLOW (Caution)</div>
            <div className="text-[10px] text-slate-400">Proceed. Prepare to stop at next signal.</div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <div className="flex flex-col gap-1 shrink-0">
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          </div>
          <div>
            <div className="font-bold text-xs text-amber-300">DOUBLE YELLOW (Attention)</div>
            <div className="text-[10px] text-slate-400">Run through at caution / loop diversion.</div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] shrink-0" />
          <div>
            <div className="font-bold text-xs text-emerald-300">GREEN (Clear)</div>
            <div className="text-[10px] text-slate-400">Proceed at authorized line speed.</div>
          </div>
        </div>
      </div>

      {/* Visual Signal Rack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {signals.map((sig) => {
          const track = tracks.find((t) => t.id === sig.trackId);

          return (
            <div
              key={sig.id}
              className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono font-bold text-amber-300 text-sm">{sig.id}</div>
                  <div className="font-semibold text-xs text-slate-200 truncate max-w-[150px]">{sig.name}</div>
                  <div className="text-[10px] text-slate-400">{sig.type} SIGNAL</div>
                </div>

                {/* Aspect Visual Lamp Post */}
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg flex flex-col items-center gap-1.5 shadow-inner">
                  <div
                    className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                      sig.aspect === 'RED'
                        ? getAspectGlowClass('RED')
                        : 'bg-slate-800/80 border-slate-700'
                    }`}
                  />
                  <div
                    className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                      sig.aspect === 'YELLOW' || sig.aspect === 'DOUBLE YELLOW'
                        ? getAspectGlowClass('YELLOW')
                        : 'bg-slate-800/80 border-slate-700'
                    }`}
                  />
                  <div
                    className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                      sig.aspect === 'GREEN'
                        ? getAspectGlowClass('GREEN')
                        : 'bg-slate-800/80 border-slate-700'
                    }`}
                  />
                </div>
              </div>

              {/* Status details */}
              <div className="space-y-1 text-[11px] pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Track Section:</span>
                  <span className="font-mono text-slate-200">
                    {track?.number || sig.trackId} ({track?.status})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Aspect:</span>
                  <span className="font-mono font-bold text-amber-300">{sig.aspect}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Control Mode:</span>
                  <span className="text-slate-300 font-medium">
                    {sig.autoMode ? 'Auto Interlocking' : 'Manual Override'}
                  </span>
                </div>
              </div>

              {/* Manual Override Controls */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Aspect Control</span>
                  {sig.autoMode ? (
                    <span className="text-emerald-400 font-mono text-[9px] flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> AUTO
                    </span>
                  ) : (
                    <span className="text-amber-400 font-mono text-[9px] flex items-center gap-1">
                      <Unlock className="w-2.5 h-2.5" /> OVERRIDE
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <button
                    onClick={() => updateSignalAspect(sig.id, 'RED', false)}
                    className="p-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 font-semibold"
                  >
                    RED
                  </button>
                  <button
                    onClick={() => updateSignalAspect(sig.id, 'YELLOW', false)}
                    className="p-1 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-300 font-semibold"
                  >
                    YELLOW
                  </button>
                  <button
                    onClick={() => updateSignalAspect(sig.id, 'GREEN', false)}
                    className="p-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-semibold"
                  >
                    GREEN
                  </button>
                </div>

                <button
                  onClick={() => updateSignalAspect(sig.id, sig.aspect, true)}
                  className="w-full text-center text-[10px] text-slate-400 hover:text-slate-200 underline pt-0.5"
                >
                  Return to Automatic Interlocking
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
