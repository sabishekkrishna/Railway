import React, { useState } from 'react';
import {
  Activity,
  Gauge,
  Thermometer,
  Zap,
  Lock,
  Unlock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

export const TrainHealthSensors: React.FC = () => {
  const { trains, telemetries, simulatedTime } = useRailway();
  const [selectedTrainId, setSelectedTrainId] = useState<string>(trains[0]?.id || '');

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];
  const trainId = selectedTrain?.id || "TR-12002";
  const telemetry = (selectedTrain ? telemetries[selectedTrain.id] : undefined) || {
    trainId: trainId,
    engineTemperatureC: 68,
    brakePipePressureBar: 5.0,
    feedPipePressureBar: 6.0,
    wheelBogieHuntingMps2: 0.05,
    axleBoxBearingTempC: 54,
    batteryLevelPercent: 98,
    doorsLocked: true,
    coachTemperatureC: 22.5,
    pantographVoltageKv: 25.1,
    gpsLatitude: 28.6429,
    gpsLongitude: 77.2195,
    lastUpdated: simulatedTime,
  };

  const getStatusColor = (value: number, warnThresh: number, critThresh: number) => {
    if (value >= critThresh) return 'text-red-400';
    if (value >= warnThresh) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Rolling Stock Health & Telemetry Telematics</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulated IoT on-board sensor stream tracking traction motor temperature, bogie hunting stability, brake pipe pressure, and axle bearings.
          </p>
        </div>

        {/* Train Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Rake:</span>
          <select
            value={selectedTrainId}
            onChange={(e) => setSelectedTrainId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
          >
            {trains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.number} - {t.name} ({t.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Telemetry Cockpit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Engine / Traction Motor Temperature */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-400" /> Traction Motor Temp
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                telemetry.engineTemperatureC > 95
                  ? 'text-red-400'
                  : telemetry.engineTemperatureC > 80
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {telemetry.engineTemperatureC > 95 ? 'CRITICAL' : telemetry.engineTemperatureC > 80 ? 'WARNING' : 'NORMAL'}
            </span>
          </div>

          <div className="text-3xl font-mono font-black text-slate-100">
            {telemetry.engineTemperatureC}°C
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              style={{ width: `${Math.min(100, (telemetry.engineTemperatureC / 120) * 100)}%` }}
              className={`h-full transition-all duration-300 ${
                telemetry.engineTemperatureC > 95
                  ? 'bg-red-500'
                  : telemetry.engineTemperatureC > 80
                  ? 'bg-amber-400'
                  : 'bg-emerald-500'
              }`}
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Optimal: &lt; 75°C</span>
            <span>Limit: 110°C</span>
          </div>
        </div>

        {/* Brake Pipe & Feed Pipe Pressure */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-blue-400" /> Pneumatic Brake Pressures
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">HOLDING</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-[10px] text-slate-400">Brake Pipe (BP):</div>
              <div className="text-2xl font-mono font-bold text-slate-100">{telemetry.brakePipePressureBar} kg/cm²</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Feed Pipe (FP):</div>
              <div className="text-2xl font-mono font-bold text-slate-100">{telemetry.feedPipePressureBar} kg/cm²</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between border-t border-slate-800/80 pt-1">
            <span>Standard BP: 5.0 kg/cm²</span>
            <span>Standard FP: 6.0 kg/cm²</span>
          </div>
        </div>

        {/* Bogie Hunting / Lateral Vibration */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" /> Bogie Hunting Stability
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">STABLE</span>
          </div>

          <div className="text-3xl font-mono font-black text-slate-100">
            {telemetry.wheelBogieHuntingMps2} <span className="text-sm font-normal text-slate-400">m/s²</span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              style={{ width: `${Math.min(100, (telemetry.wheelBogieHuntingMps2 / 0.3) * 100)}%` }}
              className="h-full bg-purple-500 transition-all duration-300"
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Ride Index: 2.1 (Superior)</span>
            <span>Condemn Limit: 0.25 m/s²</span>
          </div>
        </div>

        {/* Hot Axle Box Bearing Temperature */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-400" /> Axle Box Bearing Temp
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">NORMAL</span>
          </div>

          <div className="text-3xl font-mono font-black text-slate-100">
            {telemetry.axleBoxBearingTempC}°C
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              style={{ width: `${Math.min(100, (telemetry.axleBoxBearingTempC / 90) * 100)}%` }}
              className="h-full bg-rose-500 transition-all duration-300"
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Ambient + 25°C</span>
            <span>Hot Axle Alarm: 80°C</span>
          </div>
        </div>
      </div>

      {/* Secondary Subsystems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* OHE Catenary Voltage */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Pantograph Voltage
            </span>
            <span className="font-mono text-emerald-400 font-bold">{telemetry.pantographVoltageKv} kV</span>
          </div>
          <div className="text-[10px] text-slate-500">25,000V AC Single Phase Catenary</div>
        </div>

        {/* Battery State */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Coach Battery Bank
            </span>
            <span className="font-mono text-emerald-400 font-bold">{telemetry.batteryLevelPercent}%</span>
          </div>
          <div className="text-[10px] text-slate-500">110V DC VRLA Coach Backup</div>
        </div>

        {/* Door Interlocking */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              {telemetry.doorsLocked ? (
                <Lock className="w-4 h-4 text-emerald-400" />
              ) : (
                <Unlock className="w-4 h-4 text-amber-400" />
              )}
              Door Interlock
            </span>
            <span className={`font-mono font-bold ${telemetry.doorsLocked ? 'text-emerald-400' : 'text-amber-400'}`}>
              {telemetry.doorsLocked ? 'LOCKED' : 'OPEN'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500">Automatic Plug Door Circuit</div>
        </div>

        {/* GPS Track Coordinates */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-blue-400" /> Real-Time Telematics GPS
            </span>
            <span className="font-mono text-slate-300 text-[10px]">FIX ACTIVE</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {telemetry.gpsLatitude.toFixed(4)}°N, {telemetry.gpsLongitude.toFixed(4)}°E
          </div>
        </div>
      </div>
    </div>
  );
};
