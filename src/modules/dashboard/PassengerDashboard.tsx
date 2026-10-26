import React, { useState } from 'react';
import {
  Tv,
  Volume2,
  Clock,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { Train } from '../../types/railway';

export const PassengerDashboard: React.FC = () => {
  const { station, simulatedTime, trains, platforms, playChime } = useRailway();
  const [languageMode, setLanguageMode] = useState<'bilingual' | 'english' | 'hindi'>('bilingual');
  const [selectedTrainForCoach, setSelectedTrainForCoach] = useState<Train | null>(trains[0] || null);

  const currentTrain = trains.find((t) => t.id === selectedTrainForCoach?.id) || trains[0] || selectedTrainForCoach;

  const getPIDSStatusBadge = (t: Train) => {
    if (t.status === 'Cancelled') {
      return { label: 'CANCELLED / रद्द', class: 'text-red-400 bg-red-950/80 border-red-800' };
    }
    if (t.status === 'At Platform') {
      return { label: 'BOARDING / सवार हों', class: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' };
    }
    if (t.status === 'Approaching') {
      return { label: 'ARRIVING / आगमन', class: 'text-blue-400 bg-blue-950/80 border-blue-800' };
    }
    if (t.status === 'Departing') {
      return { label: 'DEPARTING / प्रस्थान', class: 'text-purple-400 bg-purple-950/80 border-purple-800' };
    }
    if (t.delayMinutes > 0) {
      return { label: `DELAYED ${t.delayMinutes}m`, class: 'text-amber-400 bg-amber-950/80 border-amber-800' };
    }
    return { label: 'ON TIME / समय पर', class: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' };
  };

  const handleAnnounceTrain = (t: Train) => {
    playChime();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const pf = platforms.find((p) => p.id === t.currentPlatformId)?.number || '1';
      const text = `यात्रियों कृपया ध्यान दें: गाड़ी संख्या ${t.number} ${t.name}, प्लेटफॉर्म संख्या ${pf} पर उपस्थित है। Attention please: Train number ${t.number} ${t.name} is on platform number ${pf}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-100 select-none">
      {/* Station Solari LED Display Header */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-600/60 rounded-xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
            <Tv className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xl font-black font-mono tracking-wider text-amber-300">
              नई दिल्ली · NEW DELHI JUNCTION (NDLS)
            </div>
            <div className="text-xs font-mono text-amber-200/80 mt-0.5">
              यात्री सूचना प्रणाली / PASSENGER INFORMATION DISPLAY SYSTEM (PIDS)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-lg border border-amber-700/60 text-xs">
            <Languages className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
            <button
              onClick={() => setLanguageMode('bilingual')}
              className={`px-2 py-1 rounded transition ${
                languageMode === 'bilingual' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              द्विभाषी / Bilingual
            </button>
            <button
              onClick={() => setLanguageMode('english')}
              className={`px-2 py-1 rounded transition ${
                languageMode === 'english' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguageMode('hindi')}
              className={`px-2 py-1 rounded transition ${
                languageMode === 'hindi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Clock */}
          <div className="bg-slate-950/90 border border-amber-600/70 px-4 py-2 rounded-lg shadow-inner">
            <div className="text-[10px] text-amber-400 uppercase tracking-widest font-mono">IST TIME</div>
            <div className="text-lg font-bold font-mono text-amber-300">{simulatedTime}:00</div>
          </div>
        </div>
      </div>

      {/* Main Solari LED Departure Board */}
      <div className="bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE ARRIVAL & DEPARTURE BOARD / आगमन एवं प्रस्थान समय सारणी</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">PIDS BOARD #01 · MAIN CONCOURSE</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-slate-900/90 text-amber-400 text-xs border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-3">गाड़ी सं. / TRAIN</th>
                <th className="p-3">गाड़ी का नाम / NAME</th>
                <th className="p-3">गंतव्य / DESTINATION</th>
                <th className="p-3">समय / SCHED.</th>
                <th className="p-3">अनुमानित / EXP.</th>
                <th className="p-3 text-center">प्लेटफ़ॉर्म / PF</th>
                <th className="p-3">स्थिति / STATUS</th>
                <th className="p-3 text-right">घोषणा / AUDIO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs text-amber-100">
              {trains.map((train) => {
                const statusBadge = getPIDSStatusBadge(train);
                const pf = platforms.find((p) => p.id === train.currentPlatformId);
                const isSelected = currentTrain?.id === train.id;

                return (
                  <tr
                    key={train.id}
                    onClick={() => setSelectedTrainForCoach(train)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-amber-950/40 border-l-4 border-amber-400' : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <td className="p-3 font-bold text-amber-300 text-sm">{train.number}</td>
                    <td className="p-3 font-medium text-slate-100">{train.name}</td>
                    <td className="p-3 text-slate-300">{train.destinationStation}</td>
                    <td className="p-3 text-slate-300">{train.scheduledDeparture}</td>
                    <td className="p-3 font-bold text-amber-300">{train.expectedDeparture}</td>
                    <td className="p-3 text-center">
                      {pf ? (
                        <span className="text-base font-black px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow-sm">
                          {pf.number}
                        </span>
                      ) : (
                        <span className="text-slate-500">TBD</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnnounceTrain(train);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
                        title="Broadcast Train Announcement"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Train Coach Composition Position Guide (PIDS Feature) */}
      {currentTrain && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>डिब्बा स्थिति दर्शक / COACH POSITION GUIDE</span>
                <span className="text-amber-400 font-mono">
                  — {currentTrain.number} {currentTrain.name}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Platform berthing sequence from Engine to Rear Power Car (Engine at front)
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
              {currentTrain.composition?.length || 0} Coaches · {currentTrain.lengthMeters}m Rake
            </span>
          </div>

          {/* Coach Sequence Track Visualizer */}
          <div className="overflow-x-auto py-2">
            <div className="flex items-center gap-1.5 min-w-[700px]">
              {(currentTrain.composition || []).map((c, index) => (
                <div
                  key={c.id || index}
                  className={`p-2 rounded-lg border text-center shrink-0 min-w-[65px] font-mono ${
                    c.code === 'LOCO' || c.code === 'DTC'
                      ? 'bg-red-950/80 border-red-700 text-red-300'
                      : c.code.startsWith('H') || c.code.startsWith('A')
                      ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                      : c.code.startsWith('B')
                      ? 'bg-blue-950/80 border-blue-700 text-blue-300'
                      : c.code.startsWith('S')
                      ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{c.code}</div>
                  <div className="text-[9px] text-slate-400 truncate max-w-[60px]">{c.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
