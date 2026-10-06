import React, { useState } from 'react';
import {
  GitBranch,
  Layers,
  Radio,
  Train as TrainIcon,
  AlertTriangle,
  Flame,
  Shield,
  Eye,
  Activity,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  RotateCw,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Platform, Track, Signal, Train, TrackStatus, SignalAspect } from '../../types/railway';

export const StationMapVisualizer: React.FC = () => {
  const {
    station,
    platforms,
    tracks,
    signals,
    trains,
    selectedTrack,
    setSelectedTrack,
    selectedPlatform,
    setSelectedPlatform,
    selectedSignal,
    setSelectedSignal,
    selectedTrain,
    setSelectedTrain,
    updateTrackStatus,
    updateSignalAspect,
    changeTrainStatus,
  } = useRailway();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterLayer, setFilterLayer] = useState<'all' | 'platforms' | 'tracks' | 'signals' | 'trains'>('all');

  const getTrackColor = (status: TrackStatus) => {
    switch (status) {
      case 'Free':
        return '#10b981'; // Green
      case 'Reserved':
        return '#f59e0b'; // Yellow
      case 'Occupied':
        return '#ef4444'; // Red
      case 'Under Maintenance':
        return '#f97316'; // Orange
      case 'Emergency Block':
        return '#3b82f6'; // Blue
      case 'Blocked':
        return '#dc2626'; // Dark Red
      default:
        return '#64748b';
    }
  };

  const getSignalColor = (aspect: SignalAspect) => {
    switch (aspect) {
      case 'GREEN':
        return '#22c55e';
      case 'YELLOW':
        return '#eab308';
      case 'DOUBLE YELLOW':
        return '#f59e0b';
      case 'RED':
        return '#ef4444';
      default:
        return '#475569';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none">
      {/* Visualizer Toolbar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>{station.name} ({station.code}) — Interlocking Layout</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 font-mono">
                  LIVE INTERLOCKING
                </span>
              </h2>
              <div className="text-[11px] text-slate-400">
                Route Relay Interlocking (RRI) · 8 Platforms · 12 Controlled Track Circuits · Multi-Aspect Signals
              </div>
            </div>
          </div>
        </div>

        {/* Legend / Status Indicators */}
        <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300 text-[11px]">Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300 text-[11px]">Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-300 text-[11px]">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300 text-[11px]">Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-300 text-[11px]">Emergency Block</span>
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            {(['all', 'platforms', 'tracks', 'signals', 'trains'] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setFilterLayer(layer)}
                className={`px-2 py-1 rounded capitalize transition ${
                  filterLayer === layer ? 'bg-slate-900 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, +(z - 0.1).toFixed(1)))}
              className="px-2 py-0.5 text-xs text-slate-300 hover:text-white"
            >
              -
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, +(z + 0.1).toFixed(1)))}
              className="px-2 py-0.5 text-xs text-slate-300 hover:text-white"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagram Area & Telemetry Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* SVG Interlocking Map */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center relative">
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
            className="transition-transform duration-150 min-w-[1100px] min-h-[640px] bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-2xl relative"
          >
            {/* Station Concourse Top Badge */}
            <div className="absolute top-3 left-6 flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-950/80 px-3 py-1 rounded border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>PAHARGANJ ENTRY · NORTH CONCOURSE (METRO INTERCHANGE)</span>
            </div>

            <div className="absolute top-3 right-6 flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-950/80 px-3 py-1 rounded border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>AJMERI GATE ENTRY · SOUTH CONCOURSE (AIRPORT METRO EXPRESS)</span>
            </div>

            <svg viewBox="0 0 1050 560" className="w-full h-full">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                {/* Glow Filters */}
                <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background blueprint grid */}
              <rect width="1050" height="560" fill="url(#grid)" />

              {/* Approach Crossovers on Northern Entrance (Left) */}
              <g id="north-crossovers" stroke="#334155" strokeWidth="2" strokeDasharray="4 2">
                <line x1="80" y1="90" x2="220" y2="130" />
                <line x1="80" y1="130" x2="220" y2="170" />
                <line x1="80" y1="170" x2="220" y2="210" />
                <line x1="80" y1="210" x2="220" y2="250" />
                <line x1="80" y1="250" x2="220" y2="290" />
                <line x1="80" y1="290" x2="220" y2="330" />
                <line x1="80" y1="330" x2="220" y2="370" />
                <line x1="80" y1="370" x2="220" y2="410" />
                {/* Up/Down Through line links */}
                <line x1="80" y1="450" x2="220" y2="450" />
                <line x1="80" y1="490" x2="220" y2="490" />
              </g>

              {/* Departure Crossovers on Southern Exit (Right) */}
              <g id="south-crossovers" stroke="#334155" strokeWidth="2" strokeDasharray="4 2">
                <line x1="820" y1="90" x2="980" y2="130" />
                <line x1="820" y1="130" x2="980" y2="170" />
                <line x1="820" y1="170" x2="980" y2="210" />
                <line x1="820" y1="210" x2="980" y2="250" />
                <line x1="820" y1="250" x2="980" y2="290" />
                <line x1="820" y1="290" x2="980" y2="330" />
                <line x1="820" y1="330" x2="980" y2="370" />
                <line x1="820" y1="370" x2="980" y2="410" />
                <line x1="820" y1="450" x2="980" y2="450" />
                <line x1="820" y1="490" x2="980" y2="490" />
              </g>

              {/* Platforms (Gray platform islands alongside tracks) */}
              {platforms.map((pf, idx) => {
                const yPos = 75 + idx * 40;
                const isSelected = selectedPlatform?.id === pf.id;
                return (
                  <g
                    key={pf.id}
                    onClick={() => {
                      setSelectedPlatform(pf);
                      const trk = tracks.find((t) => t.id === pf.connectedTrackId);
                      if (trk) setSelectedTrack(trk);
                    }}
                    className="cursor-pointer transition hover:opacity-90"
                  >
                    {/* Platform concrete deck */}
                    <rect
                      x="230"
                      y={yPos}
                      width="580"
                      height="14"
                      rx="3"
                      fill={isSelected ? '#3b82f6' : '#1e293b'}
                      stroke={isSelected ? '#60a5fa' : '#334155'}
                      strokeWidth={isSelected ? '2' : '1'}
                    />
                    <text
                      x="240"
                      y={yPos + 10}
                      fill={isSelected ? '#ffffff' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      PF {pf.number} ({pf.lengthMeters}m)
                    </text>
                    <text
                      x="780"
                      y={yPos + 10}
                      fill="#64748b"
                      fontSize="8"
                      fontFamily="sans-serif"
                      textAnchor="end"
                    >
                      {pf.status}
                    </text>
                  </g>
                );
              })}

              {/* Tracks T-01 to T-12 */}
              {tracks.map((track, idx) => {
                const yPos = 90 + idx * 40;
                const trackColor = getTrackColor(track.status);
                const isSelected = selectedTrack?.id === track.id;
                const assignedSignal = signals.find((s) => s.id === track.assignedSignalId);

                return (
                  <g
                    key={track.id}
                    onClick={() => {
                      setSelectedTrack(track);
                      if (track.connectedPlatformId) {
                        const pf = platforms.find((p) => p.id === track.connectedPlatformId);
                        if (pf) setSelectedPlatform(pf);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {/* Track Rail Line */}
                    <line
                      x1="50"
                      y1={yPos}
                      x2="1000"
                      y2={yPos}
                      stroke={trackColor}
                      strokeWidth={isSelected ? '4' : '3'}
                      strokeDasharray={track.status === 'Under Maintenance' ? '8 4' : undefined}
                      className="transition-all"
                    />

                    {/* Track sleepers ticks */}
                    <line
                      x1="50"
                      y1={yPos - 2}
                      x2="1000"
                      y2={yPos - 2}
                      stroke={trackColor}
                      strokeWidth="0.5"
                      opacity="0.4"
                    />
                    <line
                      x1="50"
                      y1={yPos + 2}
                      x2="1000"
                      y2={yPos + 2}
                      stroke={trackColor}
                      strokeWidth="0.5"
                      opacity="0.4"
                    />

                    {/* Track ID label on Left */}
                    <rect
                      x="10"
                      y={yPos - 8}
                      width="35"
                      height="16"
                      rx="3"
                      fill="#0f172a"
                      stroke={isSelected ? '#38bdf8' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x="27"
                      y={yPos + 3}
                      fill={trackColor}
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {track.id}
                    </text>

                    {/* Speed Restriction Warning if restricted */}
                    {track.speedRestrictionKmph < 50 && (
                      <text
                        x="970"
                        y={yPos - 4}
                        fill="#f59e0b"
                        fontSize="8"
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                      >
                        TSR:{track.speedRestrictionKmph}k
                      </text>
                    )}

                    {/* Signal Aspect Marker at track approach */}
                    {assignedSignal && (
                      <g
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSignal(assignedSignal);
                        }}
                        className="cursor-pointer"
                      >
                        <rect
                          x="70"
                          y={yPos - 12}
                          width="20"
                          height="12"
                          rx="2"
                          fill="#0f172a"
                          stroke={getSignalColor(assignedSignal.aspect)}
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="76"
                          cy={yPos - 6}
                          r="3"
                          fill={getSignalColor(assignedSignal.aspect)}
                          className={assignedSignal.aspect === 'RED' ? 'animate-pulse' : ''}
                        />
                        <text
                          x="83"
                          y={yPos - 3}
                          fill="#94a3b8"
                          fontSize="7"
                          fontFamily="JetBrains Mono"
                        >
                          {assignedSignal.id.slice(2)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Moving Trains on Tracks */}
              {trains.map((train) => {
                if (train.status === 'Completed' || train.status === 'Cancelled') return null;

                // Determine Y position from current track
                const trkIdx = tracks.findIndex((t) => t.id === train.currentTrackId);
                const yPos = trkIdx !== -1 ? 90 + trkIdx * 40 : 90;

                // Calculate X position based on percentage (from left 100 to right 920)
                const minX = 110;
                const maxX = 900;
                const trainX =
                  train.direction === 'UP'
                    ? minX + (train.positionPercent / 100) * (maxX - minX)
                    : maxX - (train.positionPercent / 100) * (maxX - minX);

                const isSelected = selectedTrain?.id === train.id;

                return (
                  <g
                    key={train.id}
                    onClick={() => setSelectedTrain(train)}
                    className="cursor-pointer transition-transform"
                    transform={`translate(${trainX}, ${yPos - 10})`}
                  >
                    {/* Train Rake Box */}
                    <rect
                      x="-35"
                      y="-4"
                      width="70"
                      height="20"
                      rx="4"
                      fill={
                        isSelected
                          ? '#0284c7'
                          : train.category === 'Premium'
                          ? '#b45309'
                          : train.type === 'Freight / Container'
                          ? '#475569'
                          : '#1e3a8a'
                      }
                      stroke={isSelected ? '#38bdf8' : '#e2e8f0'}
                      strokeWidth="1.5"
                      filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))"
                    />

                    {/* Loco headlight / Direction Indicator */}
                    <polygon
                      points={train.direction === 'UP' ? '35,6 42,6 35,10' : '-35,6 -42,6 -35,10'}
                      fill="#facc15"
                    />

                    {/* Train Number & Speed Text */}
                    <text
                      x="0"
                      y="5"
                      fill="#ffffff"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {train.number}
                    </text>
                    <text
                      x="0"
                      y="13"
                      fill={train.currentSpeedKmph > 0 ? '#86efac' : '#cbd5e1'}
                      fontSize="7"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      {train.currentSpeedKmph > 0 ? `${train.currentSpeedKmph} km/h` : 'HALT'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Entity Telemetry Panel (Right Side Drawer) */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Telemetry & Object Inspector</span>
            </h3>
          </div>

          {/* Selected Train Card */}
          {selectedTrain && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-amber-300 font-mono text-sm">{selectedTrain.number}</div>
                  <div className="text-xs font-semibold text-slate-200">{selectedTrain.name}</div>
                  <div className="text-[10px] text-slate-400">{selectedTrain.type}</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-700/60 text-blue-300 font-mono">
                  {selectedTrain.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400">Speed:</span>
                  <div className="font-mono font-semibold text-slate-200">{selectedTrain.currentSpeedKmph} km/h</div>
                </div>
                <div>
                  <span className="text-slate-400">Track:</span>
                  <div className="font-mono font-semibold text-slate-200">{selectedTrain.currentTrackId || 'None'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Platform:</span>
                  <div className="font-mono font-semibold text-slate-200">{selectedTrain.currentPlatformId || 'None'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Delay:</span>
                  <div className="font-mono font-semibold text-amber-400">{selectedTrain.delayMinutes} mins</div>
                </div>
                <div>
                  <span className="text-slate-400">Loco:</span>
                  <div className="font-mono text-slate-300 truncate">{selectedTrain.locoNumber}</div>
                </div>
                <div>
                  <span className="text-slate-400">Pilot:</span>
                  <div className="text-slate-300 truncate">{selectedTrain.driverName || 'Designated'}</div>
                </div>
              </div>

              {/* Movement Override Controls */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Loco Movement Control
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <button
                    onClick={() => changeTrainStatus(selectedTrain.id, 'At Platform', 0)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    Halt
                  </button>
                  <button
                    onClick={() => changeTrainStatus(selectedTrain.id, 'In Transit', 45)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    Accelerate
                  </button>
                  <button
                    onClick={() => changeTrainStatus(selectedTrain.id, 'Departing', 25)}
                    className="p-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-[11px]"
                  >
                    Depart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Track Card */}
          {selectedTrack && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-amber-300 font-mono text-sm">{selectedTrack.id}</div>
                  <div className="text-xs text-slate-300">{selectedTrack.number}</div>
                </div>
                <span
                  style={{ color: getTrackColor(selectedTrack.status) }}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono font-bold"
                >
                  {selectedTrack.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400">Length:</span>
                  <div className="font-mono text-slate-200">{selectedTrack.lengthMeters}m</div>
                </div>
                <div>
                  <span className="text-slate-400">Speed Limit:</span>
                  <div className="font-mono text-slate-200">{selectedTrack.speedRestrictionKmph} km/h</div>
                </div>
                <div>
                  <span className="text-slate-400">Condition:</span>
                  <div className="font-semibold text-emerald-400">{selectedTrack.condition}</div>
                </div>
                <div>
                  <span className="text-slate-400">Signal:</span>
                  <div className="font-mono text-slate-200">{selectedTrack.assignedSignalId}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Track Interlocking Actions
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => updateTrackStatus(selectedTrack.id, 'Free')}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-medium"
                  >
                    Release Track
                  </button>
                  <button
                    onClick={() => updateTrackStatus(selectedTrack.id, 'Emergency Block')}
                    className="p-1.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 text-[11px] font-medium"
                  >
                    Emergency Block
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Platform Card */}
          {selectedPlatform && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-amber-300 font-mono text-sm">Platform {selectedPlatform.number}</div>
                  <div className="text-xs text-slate-400">Length: {selectedPlatform.lengthMeters} meters</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                  {selectedPlatform.status}
                </span>
              </div>

              <div className="text-[11px] space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Rake:</span>
                  <span className="font-mono text-amber-400">{selectedPlatform.currentTrainId || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Scheduled:</span>
                  <span className="font-mono text-slate-300">{selectedPlatform.nextScheduledTrainId || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Accessibility:</span>
                  <span className="text-emerald-400">
                    {selectedPlatform.accessible ? 'Escalator / Lift Live' : 'Ramp Only'}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-[10px] text-slate-400 mb-1">Amenities:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedPlatform.amenities.map((a) => (
                    <span key={a} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected Signal Card */}
          {selectedSignal && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-amber-300 font-mono text-sm">{selectedSignal.id}</div>
                  <div className="text-xs text-slate-300">{selectedSignal.name}</div>
                </div>
                <span
                  style={{ color: getSignalColor(selectedSignal.aspect) }}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono font-bold"
                >
                  {selectedSignal.aspect}
                </span>
              </div>

              <div className="text-[11px] space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="font-mono text-slate-300">{selectedSignal.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Track Circuit:</span>
                  <span className="font-mono text-slate-300">{selectedSignal.trackId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mode:</span>
                  <span className="text-slate-300">{selectedSignal.autoMode ? 'Auto Interlocking' : 'Manual Override'}</span>
                </div>
              </div>

              {/* Manual Override Aspects */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Manual Aspect Override
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <button
                    onClick={() => updateSignalAspect(selectedSignal.id, 'RED', false)}
                    className="p-1 rounded bg-red-950 text-red-300 border border-red-700/60 font-medium"
                  >
                    Danger (RED)
                  </button>
                  <button
                    onClick={() => updateSignalAspect(selectedSignal.id, 'GREEN', false)}
                    className="p-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-medium"
                  >
                    Clear (GREEN)
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedTrain && !selectedTrack && !selectedPlatform && !selectedSignal && (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Eye className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              Click any Track, Platform, Signal, or Train in the interlocking diagram to inspect live telemetry and dispatch controls.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
