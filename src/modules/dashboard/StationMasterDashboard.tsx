import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Layers,
  Train as TrainIcon,
  Volume2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Radio,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Platform } from '../../types/railway';

export const StationMasterDashboard: React.FC = () => {
  const {
    station,
    simulatedTime,
    trains,
    platforms,
    schedules,
    conflicts,
    allocatePlatform,
    autoAllocatePlatform,
    playChime,
    setActiveTab,
    triggerEmergencyScenario,
  } = useRailway();

  const [announcementText, setAnnouncementText] = useState<string>(
    'यात्रियों कृपया ध्यान दें: गाड़ी संख्या 12002 भोपाल शताब्दी एक्सप्रेस प्लेटफॉर्म संख्या 1 पर तैयार है।'
  );
  const [selectedTrainForAlloc, setSelectedTrainForAlloc] = useState<string>(trains[0]?.id || '');
  const [targetPlatform, setTargetPlatform] = useState<string>('PF-03');
  const [announcing, setAnnouncing] = useState<boolean>(false);

  const handleMakeAnnouncement = () => {
    playChime();
    setAnnouncing(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(announcementText);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setAnnouncing(false);
      utterance.onerror = () => setAnnouncing(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAnnouncing(false), 3000);
    }
  };

  const handleQuickAllocate = () => {
    if (selectedTrainForAlloc && targetPlatform) {
      allocatePlatform(selectedTrainForAlloc, targetPlatform);
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Station Master Desk · {station.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                STATION CODE: {station.code}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Northern Railway (Delhi Division) · Station Operations & Passenger Flow Command
            </p>
          </div>
        </div>

        {/* Quick Station Master Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('passenger-pids')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
          >
            <span>Open PIDS Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 flex items-center gap-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Intelligent Platform Allocator</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Live Arrivals & Departures Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm">Station Master Timetable & Movement Control</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Current Time: {simulatedTime} IST</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                  <tr>
                    <th className="p-2.5">Train</th>
                    <th className="p-2.5">Route</th>
                    <th className="p-2.5">Sch. Arr / Dep</th>
                    <th className="p-2.5">Platform</th>
                    <th className="p-2.5">Delay</th>
                    <th className="p-2.5">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {trains.map((train) => {
                    const pf = platforms.find((p) => p.id === train.currentPlatformId);
                    return (
                      <tr key={train.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-2.5">
                          <div className="font-mono font-bold text-amber-300">{train.number}</div>
                          <div className="text-[11px] text-slate-200 truncate max-w-[150px]">{train.name}</div>
                          <div className="text-[10px] text-slate-400">{train.type}</div>
                        </td>
                        <td className="p-2.5 text-[11px]">
                          <div>{train.sourceStation}</div>
                          <div className="text-slate-400 text-[10px]">to {train.destinationStation}</div>
                        </td>
                        <td className="p-2.5 font-mono">
                          <div>Arr: {train.scheduledArrival}</div>
                          <div className="text-slate-400">Dep: {train.scheduledDeparture}</div>
                        </td>
                        <td className="p-2.5">
                          {pf ? (
                            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                              PF {pf.number}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono">Pending</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {train.delayMinutes > 0 ? (
                            <span className="text-amber-400 font-mono font-bold">+{train.delayMinutes}m</span>
                          ) : (
                            <span className="text-emerald-400 font-mono">Right Time</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              train.status === 'At Platform'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : train.status === 'Approaching'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : train.status === 'Delayed'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {train.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Platform Berthing Assignment Tool */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Manual Platform Berthing Override</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Select Train</label>
                <select
                  value={selectedTrainForAlloc}
                  onChange={(e) => setSelectedTrainForAlloc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
                >
                  {trains.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.number} - {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Assign Platform</label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
                >
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      Platform {p.number} ({p.status} - {p.lengthMeters}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleQuickAllocate}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition"
                >
                  Allocate Berthing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Public Address Announcement & Station Master Emergency */}
        <div className="space-y-4">
          {/* Public Address Announcement Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-sm">Station Public Address (PA) Console</h3>
            </div>

            <p className="text-xs text-slate-400">
              Broadcast synthesized bilingual audio announcements across station concourses, platforms, and foot over-bridges.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 block">Announcement Script (Hindi / English):</label>
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 leading-relaxed"
              />

              {/* Preset Announcement Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() =>
                    setAnnouncementText(
                      'यात्रियों कृपया ध्यान दें: गाड़ी संख्या 12002 भोपाल शताब्दी एक्सप्रेस प्लेटफॉर्म संख्या 1 पर तैयार है।'
                    )
                  }
                  className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  12002 Boarding
                </button>
                <button
                  onClick={() =>
                    setAnnouncementText(
                      'यात्रियों कृपया ध्यान दें: गाड़ी संख्या 12601 मंगलोर मेल लगभग 20 मिनट के विलंब से चल रही है। असुविधा के लिए खेद है।'
                    )
                  }
                  className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  12601 Delay
                </button>
                <button
                  onClick={() =>
                    setAnnouncementText(
                      'May I have your attention please: Train 22436 Vande Bharat Express is departing shortly from Platform Number 2.'
                    )
                  }
                  className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  22436 Departure
                </button>
              </div>

              <button
                onClick={handleMakeAnnouncement}
                disabled={announcing}
                className={`w-full mt-2 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  announcing
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{announcing ? 'Broadcasting Announcement...' : 'Broadcast with Station Chime'}</span>
              </button>
            </div>
          </div>

          {/* Station Master Caution Order Dispatch */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Station Master Caution Orders</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Active Temporary Speed Restrictions (TSR) enforced in Delhi Junction yard:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-amber-300">TSR-NDLS-04: 30 km/h on Track 6 (Suburban Loop)</div>
              <div className="text-[10px] text-slate-400">Reason: P-Way turn-out tamping inspection.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
