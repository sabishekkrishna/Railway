import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Phone,
  Radio,
  Play,
  ArrowRight,
  Zap,
  Lock,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { EmergencyIncident } from '../../types/railway';

export const StationEmergencyView: React.FC = () => {
  const {
    emergencies,
    emergencyTeams,
    tracks,
    signals,
    updateTrackStatus,
    updateSignalAspect,
    triggerEmergencyScenario,
    assignEmergencyTeam,
    updateEmergencyStatus,
    simulatedTime,
  } = useRailway();

  const [allSignalsHeld, setAllSignalsHeld] = useState(false);

  const activeIncidents = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed');

  // One-click master emergency stop: Holds all station signals at RED
  const handleMasterEmergencyStop = () => {
    signals.forEach((sig) => {
      updateSignalAspect(sig.id, 'RED', false);
    });
    setAllSignalsHeld(true);
  };

  const handleResumeSignals = () => {
    signals.forEach((sig) => {
      updateSignalAspect(sig.id, 'GREEN', true);
    });
    setAllSignalsHeld(false);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-slate-100">Station Safety, Interlocking Lock & Emergency Command</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Emergency procedures for New Delhi (NDLS) station: instant signal holding, track isolation, and station response dispatch.
          </p>
        </div>

        {/* Master Emergency Hold Switch */}
        <div className="flex items-center gap-2">
          {allSignalsHeld ? (
            <button
              onClick={handleResumeSignals}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-lg flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Resume Normal Signalling</span>
            </button>
          ) : (
            <button
              onClick={handleMasterEmergencyStop}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs shadow-lg flex items-center gap-2 transition animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>EMERGENCY STOP (HOLD ALL SIGNALS RED)</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Station Emergency Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Station Emergency Drill & Incident Triggers</span>
        </h3>
        <p className="text-xs text-slate-400">
          Simulate a real emergency at the station to test automated interlocking safeguards, signal tripping, and team dispatch:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={() => triggerEmergencyScenario('SCENARIO-2')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-left transition space-y-1"
          >
            <div className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Platform Fire Alarm
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              OHE sparking on Platform 3 canopy. Isolate track & call Fire Brigade.
            </div>
          </button>

          <button
            onClick={() => triggerEmergencyScenario('SCENARIO-3')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-left transition space-y-1"
          >
            <div className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Track Obstruction
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Fallen mast on Up Main track. Emergency block & dispatch P-Way gang.
            </div>
          </button>

          <button
            onClick={() => triggerEmergencyScenario('SCENARIO-7')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-left transition space-y-1"
          >
            <div className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> Medical Emergency
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Cardiac arrest on incoming Rajdhani. Priority berthing & ambulance at ramp.
            </div>
          </button>

          <button
            onClick={() => triggerEmergencyScenario('SCENARIO-4')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-left transition space-y-1"
          >
            <div className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-yellow-400" /> Signal Point Failure
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Point machine detection loss at Switch S-04. Signals fail-safe to RED.
            </div>
          </button>
        </div>
      </div>

      {/* Active Incidents & Response Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Incidents List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Active Station Emergencies ({activeIncidents.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">{simulatedTime} IST</span>
          </div>

          {activeIncidents.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              No active emergency incidents at New Delhi station. Normal operating condition.
            </div>
          ) : (
            <div className="space-y-3">
              {activeIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 bg-slate-950 rounded-xl border border-rose-800/80 space-y-2 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-rose-400">{inc.id} · {inc.type}</span>
                      <h4 className="font-bold text-xs text-slate-100">{inc.title}</h4>
                      <div className="text-[11px] text-slate-400">Location: {inc.location}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                      {inc.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{inc.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400">
                      Reported: <span className="font-mono text-slate-200">{inc.reportedAt} IST</span>
                    </span>
                    <button
                      onClick={() => updateEmergencyStatus(inc.id, 'Resolved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Clear & Resolve Incident
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Station Emergency Teams Dispatch */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Station Response Units & Availability</span>
            </h3>
            <span className="text-[11px] text-slate-400">Immediate Dispatch</span>
          </div>

          <div className="space-y-2.5">
            {emergencyTeams.map((team) => (
              <div
                key={team.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="font-bold text-slate-200">{team.name}</div>
                  <div className="text-[11px] text-slate-400">
                    Lead: {team.teamLead} · Base: {team.currentLocation}
                  </div>
                  <div className="font-mono text-amber-400 text-[10px] mt-0.5">
                    Contact: {team.contactNumber} (ETA {team.responseMinutes} mins)
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    team.status === 'Available'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {team.status === 'Available' ? 'READY' : 'DEPLOYED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
