import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Shield,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  MapPin,
  Send,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { EmergencyIncident, EmergencyType, EmergencyStatus } from '../../types/railway';

export const EmergencyManagement: React.FC = () => {
  const {
    emergencies,
    emergencyTeams,
    tracks,
    platforms,
    createEmergencyIncident,
    assignEmergencyTeam,
    updateEmergencyStatus,
    simulatedTime,
    setActiveTab,
  } = useRailway();

  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(emergencies[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Incident state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<EmergencyType>('Track obstruction');
  const [newLocation, setNewLocation] = useState('Track T-10, Outer Approach');
  const [newTrackId, setNewTrackId] = useState('T-10');
  const [newDesc, setNewDesc] = useState('');

  const activeIncidents = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    createEmergencyIncident({
      title: newTitle,
      type: newType,
      location: newLocation,
      trackId: newTrackId,
      description: newDesc,
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-slate-100">Disaster Management & Emergency Response Command</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time incident tracking, track interlocking isolation, and Accident Relief Train (ART) / Medical Relief Van (MRV) dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scenarios')}
            className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-300 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Launch Simulation Scenarios</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Incident Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Active Incidents</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{activeIncidents.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Station Area Command</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Deployed Response Units</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {emergencyTeams.filter((t) => t.status === 'Dispatched').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">On scene / en route</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Available Standby Units</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {emergencyTeams.filter((t) => t.status === 'Available').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">MRV, Fire, RPF, ART</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">Average Response Time</div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">4.2 min</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Gold standard &lt; 15 min</div>
        </div>
      </div>

      {/* Incident Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Incident List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center justify-between">
            <span>Incident Registry ({emergencies.length})</span>
            <span className="text-xs font-mono text-slate-400">Clock: {simulatedTime} IST</span>
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {emergencies.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded-xl border cursor-pointer transition space-y-1.5 ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-600/70 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-rose-400">{inc.id}</span>
                      <div className="font-semibold text-xs text-slate-100 leading-tight">{inc.title}</div>
                    </div>
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                        inc.status === 'Under Control' || inc.status === 'Resolved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{inc.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Command Console */}
        {selectedIncident ? (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400">{selectedIncident.id} · {selectedIncident.type}</span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">{selectedIncident.title}</h3>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>Location: {selectedIncident.location}</span>
                  <span>·</span>
                  <span>Reported at {selectedIncident.reportedAt} IST</span>
                </div>
              </div>

              {/* Status Updater */}
              <div className="flex items-center gap-1.5">
                {(['Responding', 'Under Control', 'Resolved', 'Closed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateEmergencyStatus(selectedIncident.id, st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                      selectedIncident.status === st
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              {selectedIncident.description}
            </p>

            {/* Response Teams Section */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Emergency Teams & Deployment</span>
                <span className="text-[11px] font-normal text-slate-400">Click to deploy standby unit</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {emergencyTeams.map((team) => {
                  const isAssigned = selectedIncident.assignedTeamIds.includes(team.id);
                  return (
                    <div
                      key={team.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition ${
                        isAssigned
                          ? 'bg-rose-950/40 border-rose-700 text-rose-200'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-100">{team.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {team.membersCount} Members · Lead: {team.teamLead} (ETA {team.responseMinutes}m)
                        </div>
                      </div>

                      {isAssigned ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900 text-white font-bold">
                          DEPLOYED
                        </span>
                      ) : (
                        <button
                          onClick={() => assignEmergencyTeam(selectedIncident.id, team.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium text-[11px] transition"
                        >
                          Deploy Team
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Log */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Incident Response Action Timeline
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedIncident.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{item.action}</span>
                      <div className="text-[10px] text-slate-400">By: {item.actor}</div>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px] shrink-0 ml-2">{item.time} IST</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500 text-xs">
            Select an incident from the registry to view actions, timeline, and assign response teams.
          </div>
        )}
      </div>

      {/* Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Report Emergency Railway Incident</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Incident Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Signal failure at Turnout S-04"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Emergency Classification</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as EmergencyType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  >
                    <option value="Train accident">Train accident</option>
                    <option value="Fire">Fire</option>
                    <option value="Medical emergency">Medical emergency</option>
                    <option value="Track obstruction">Track obstruction</option>
                    <option value="Signal failure">Signal failure</option>
                    <option value="Power failure">Power failure</option>
                    <option value="Train derailment">Train derailment</option>
                    <option value="Flooding">Flooding</option>
                    <option value="Security threat">Security threat</option>
                    <option value="Equipment failure">Equipment failure</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Affected Track</label>
                  <select
                    value={newTrackId}
                    onChange={(e) => setNewTrackId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  >
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} ({t.number})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Location Details</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description & Field Observations</label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe situation, affected trains, casualties if any..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Trigger Emergency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
