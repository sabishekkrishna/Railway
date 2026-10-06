import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  AppNotification,
  AuditRecord,
  ConflictAlert,
  EmergencyIncident,
  EmergencyScenarioPreset,
  EmergencyTeam,
  MaintenanceWorkOrder,
  Platform,
  PlatformRecommendation,
  Schedule,
  Signal,
  SignalAspect,
  Staff,
  StationInfo,
  StationResource,
  Track,
  TrackStatus,
  Train,
  TrainStatus,
  TrainTelemetry,
  UserRole,
} from '../types/railway';
import {
  emergencyScenarios,
  initialEmergencies,
  initialEmergencyTeams,
  initialPlatforms,
  initialSchedules,
  initialSignals,
  initialStaff,
  initialStation,
  initialStationResources,
  initialTelemetries,
  initialTracks,
  initialTrains,
  initialWorkOrders,
} from '../data/initialData';
import { railwayAudio } from '../utils/audio';

interface RailwayContextType {
  station: StationInfo;
  trains: Train[];
  schedules: Schedule[];
  platforms: Platform[];
  tracks: Track[];
  signals: Signal[];
  conflicts: ConflictAlert[];
  telemetries: Record<string, TrainTelemetry>;
  workOrders: MaintenanceWorkOrder[];
  emergencies: EmergencyIncident[];
  emergencyTeams: EmergencyTeam[];
  staff: Staff[];
  resources: StationResource[];
  auditLogs: AuditRecord[];
  notifications: AppNotification[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  simulatedTime: string;
  simRunning: boolean;
  simSpeed: number;
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  resetSimulation: () => void;
  selectedTrain: Train | null;
  setSelectedTrain: (train: Train | null) => void;
  selectedTrack: Track | null;
  setSelectedTrack: (track: Track | null) => void;
  selectedPlatform: Platform | null;
  setSelectedPlatform: (platform: Platform | null) => void;
  selectedSignal: Signal | null;
  setSelectedSignal: (signal: Signal | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Actions
  allocatePlatform: (trainId: string, platformId: string) => { success: boolean; message: string };
  autoAllocatePlatform: (trainId: string) => PlatformRecommendation[];
  changeTrainStatus: (trainId: string, status: TrainStatus, speed?: number) => void;
  updateTrainSpeed: (trainId: string, speed: number) => void;
  updateTrackStatus: (trackId: string, status: TrackStatus, speedRestriction?: number) => void;
  updateSignalAspect: (signalId: string, aspect: SignalAspect, autoMode?: boolean) => void;
  resolveConflict: (conflictId: string) => void;
  executeConflictAction: (conflictId: string) => void;
  createWorkOrder: (data: Partial<MaintenanceWorkOrder>) => void;
  updateWorkOrderStatus: (id: string, status: MaintenanceWorkOrder['status']) => void;
  createEmergencyIncident: (data: Partial<EmergencyIncident>) => void;
  triggerEmergencyScenario: (scenarioId: string) => void;
  assignEmergencyTeam: (incidentId: string, teamId: string) => void;
  updateEmergencyStatus: (incidentId: string, status: EmergencyIncident['status']) => void;
  addTrain: (train: Partial<Train>) => void;
  updateTrain: (id: string, train: Partial<Train>) => void;
  createSchedule: (schedule: Partial<Schedule>) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  playChime: () => void;
}

const RailwayContext = createContext<RailwayContextType | undefined>(undefined);

export const RailwayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [station] = useState<StationInfo>(initialStation);
  const [trains, setTrains] = useState<Train[]>(initialTrains);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [conflicts, setConflicts] = useState<ConflictAlert[]>([]);
  const [telemetries, setTelemetries] = useState<Record<string, TrainTelemetry>>(initialTelemetries);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(initialWorkOrders);
  const [emergencies, setEmergencies] = useState<EmergencyIncident[]>(initialEmergencies);
  const [emergencyTeams, setEmergencyTeams] = useState<EmergencyTeam[]>(initialEmergencyTeams);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [resources, setResources] = useState<StationResource[]>(initialStationResources);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'N-1',
      timestamp: '14:28',
      title: 'OCC Interlocking Active',
      message: 'New Delhi (NDLS) Central Route Relay Interlocking operational.',
      priority: 'INFO',
      module: 'Signalling',
      read: false,
    },
    {
      id: 'N-2',
      timestamp: '14:25',
      title: 'Platform 6 Conflict Risk',
      message: 'Train 12601 delayed 20 min; Platform 6 currently occupied by MEMU 64491.',
      priority: 'WARNING',
      module: 'Scheduling',
      read: false,
    },
  ]);

  const [activeRole, setActiveRole] = useState<UserRole>('Station Master');
  const [simulatedMinutes, setSimulatedMinutes] = useState<number>(14 * 60 + 30); // 14:30
  const [simRunning, setSimRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('station-interlocking');

  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const simulatedTime = useMemo(() => {
    const hours = Math.floor(simulatedMinutes / 60) % 24;
    const mins = Math.floor(simulatedMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, [simulatedMinutes]);

  const addNotification = useCallback((title: string, message: string, priority: AppNotification['priority'], module: string) => {
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      title,
      message,
      priority,
      module,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);

    if (priority === 'CRITICAL') {
      railwayAudio.playEmergencySiren();
    } else if (priority === 'HIGH' || priority === 'WARNING') {
      railwayAudio.playConflictWarning();
    }
  }, []);

  const recordAudit = useCallback((action: string, module: string, previousValue: string, newValue: string) => {
    const record: AuditRecord = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: 'Current Operator',
      userRole: activeRole,
      action,
      module,
      previousValue,
      newValue,
      ipAddress: '10.24.110.1 (OCC Console)',
    };
    setAuditLogs((prev) => [record, ...prev.slice(0, 199)]);
  }, [activeRole]);

  // --------------------------------------------------------------------------
  // Intelligent Platform Recommendation Algorithm
  // --------------------------------------------------------------------------
  const autoAllocatePlatform = useCallback((trainId: string): PlatformRecommendation[] => {
    const train = trains.find((t) => t.id === trainId);
    if (!train) return [];

    const recs: PlatformRecommendation[] = [];

    for (const pf of platforms) {
      const reasoning: string[] = [];
      const warnings: string[] = [];
      let score = 50;

      const lengthFits = pf.lengthMeters >= train.lengthMeters;
      if (lengthFits) {
        score += 25;
        reasoning.push(`Platform length (${pf.lengthMeters}m) fits train rake length (${train.lengthMeters}m)`);
      } else {
        score -= 50;
        warnings.push(`Train length (${train.lengthMeters}m) exceeds platform length (${pf.lengthMeters}m)`);
      }

      const isFree = pf.status === 'Available';
      if (isFree) {
        score += 30;
        reasoning.push(`Platform ${pf.number} is completely available and cleared`);
      } else if (pf.status === 'Reserved') {
        score += 10;
        reasoning.push(`Platform ${pf.number} is reserved for future turnaround`);
      } else if (pf.status === 'Occupied') {
        score -= 40;
        warnings.push(`Platform ${pf.number} is currently occupied`);
      } else {
        score -= 100;
        warnings.push(`Platform ${pf.number} is ${pf.status}`);
      }

      const track = tracks.find((t) => t.id === pf.connectedTrackId);
      const trackAccessible = !!track && track.status !== 'Blocked' && track.status !== 'Emergency Block';
      if (trackAccessible) {
        score += 15;
        reasoning.push(`Track ${track?.number || pf.connectedTrackId} interlocking clear`);
      } else {
        score -= 60;
        warnings.push(`Connected track is in ${track?.status} state`);
      }

      if (pf.electrification) {
        score += 10;
        reasoning.push('25kV AC OHE traction live');
      }

      if (train.category === 'Premium' && ['1', '2', '3'].includes(pf.number)) {
        score += 15;
        reasoning.push('Direct main concourse VIP/Executive lounge access');
      }

      const conflicting = schedules.find(
        (s) => s.allocatedPlatformId === pf.id && s.trainId !== train.id && s.status !== 'Completed' && s.status !== 'Cancelled'
      );
      const noUpcomingConflicts = !conflicting;
      if (!noUpcomingConflicts) {
        score -= 25;
        warnings.push(`Conflict with scheduled Train ${conflicting.trainNumber}`);
      } else {
        score += 10;
        reasoning.push('No conflicting scheduled movements in time slot');
      }

      recs.push({
        platformId: pf.id,
        platformNumber: pf.number,
        score: Math.max(0, Math.min(100, score)),
        reasoning,
        warnings,
        compatibility: {
          lengthFits,
          isFree,
          noUpcomingConflicts,
          trackAccessible,
          electrified: pf.electrification,
        },
      });
    }

    return recs.sort((a, b) => b.score - a.score);
  }, [trains, platforms, tracks, schedules]);

  // --------------------------------------------------------------------------
  // Platform Allocation
  // --------------------------------------------------------------------------
  const allocatePlatform = useCallback((trainId: string, platformId: string) => {
    const train = trains.find((t) => t.id === trainId);
    const platform = platforms.find((p) => p.id === platformId);

    if (!train || !platform) {
      return { success: false, message: 'Invalid train or platform ID' };
    }

    if (platform.status === 'Blocked' || platform.status === 'Emergency Use' || platform.status === 'Under Maintenance') {
      const msg = `Platform allocation failed: Platform ${platform.number} is unavailable (${platform.status}).`;
      addNotification('Allocation Blocked', msg, 'WARNING', 'Platform Allocation');
      return { success: false, message: msg };
    }

    if (train.lengthMeters > platform.lengthMeters) {
      const msg = `Platform allocation failed: Train rake length (${train.lengthMeters}m) exceeds Platform ${platform.number} (${platform.lengthMeters}m).`;
      addNotification('Rake Overlength Warning', msg, 'WARNING', 'Platform Allocation');
      return { success: false, message: msg };
    }

    const prevPfId = train.currentPlatformId;
    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === prevPfId && p.id !== platform.id) {
          return { ...p, status: 'Available', currentTrainId: undefined };
        }
        if (p.id === platform.id) {
          return { ...p, nextScheduledTrainId: train.id };
        }
        return p;
      })
    );

    setTrains((prev) =>
      prev.map((t) =>
        t.id === train.id
          ? { ...t, currentPlatformId: platform.id, currentTrackId: platform.connectedTrackId }
          : t
      )
    );

    setSchedules((prev) =>
      prev.map((s) =>
        s.trainId === train.id
          ? { ...s, allocatedPlatformId: platform.id, allocatedTrackId: platform.connectedTrackId }
          : s
      )
    );

    const msg = `Train ${train.number} (${train.name}) assigned to Platform ${platform.number}.`;
    addNotification('Platform Allocated', msg, 'INFO', 'Platform Allocation');
    recordAudit('Platform Allocation', 'Platform Management', prevPfId || 'None', `Platform ${platform.number}`);
    return { success: true, message: msg };
  }, [trains, platforms, addNotification, recordAudit]);

  // --------------------------------------------------------------------------
  // Collision & Conflict Detection
  // --------------------------------------------------------------------------
  const detectConflicts = useCallback(() => {
    const newAlerts: ConflictAlert[] = [];

    // Track dual occupancy
    const trackMap: Record<string, Train[]> = {};
    for (const t of trains) {
      if (t.currentTrackId && t.status !== 'Completed' && t.status !== 'Cancelled') {
        if (!trackMap[t.currentTrackId]) trackMap[t.currentTrackId] = [];
        trackMap[t.currentTrackId].push(t);
      }
    }

    for (const [trackId, trList] of Object.entries(trackMap)) {
      if (trList.length > 1) {
        const t1 = trList[0];
        const t2 = trList[1];
        const trk = tracks.find((tr) => tr.id === trackId);
        newAlerts.push({
          id: `CONF-${trackId}`,
          timestamp: simulatedTime,
          risk: 'CRITICAL',
          trainAId: t1.id,
          trainANumber: t1.number,
          trainBId: t2.id,
          trainBNumber: t2.number,
          trackId,
          estimatedMinutesToConflict: 2.0,
          description: `Simultaneous track occupancy on ${trk?.number || trackId}. Both Train ${t1.number} and Train ${t2.number} on same section.`,
          recommendedAction: `Hold Train ${t2.number} at outer home signal. Set starter signal S-${trackId.slice(2)} to RED.`,
          resolved: false,
          acknowledged: false,
        });
      }
    }

    // Platform dual overlap
    for (const pf of platforms) {
      if (pf.currentTrainId) {
        const occ = trains.find((t) => t.id === pf.currentTrainId);
        const next = trains.find(
          (t) => t.currentPlatformId === pf.id && t.id !== pf.currentTrainId && (t.status === 'Approaching' || t.status === 'In Transit')
        );
        if (occ && next) {
          newAlerts.push({
            id: `CONF-PF-${pf.id}`,
            timestamp: simulatedTime,
            risk: 'HIGH',
            trainAId: occ.id,
            trainANumber: occ.number,
            trainBId: next.id,
            trainBNumber: next.number,
            platformId: pf.id,
            estimatedMinutesToConflict: 5.5,
            description: `Platform ${pf.number} occupied by Train ${occ.number} while Train ${next.number} is arriving.`,
            recommendedAction: `Divert Train ${next.number} to available platform using Auto-Allocate.`,
            resolved: false,
            acknowledged: false,
          });
        }
      }
    }

    // Train on Emergency Block track
    for (const t of trains) {
      if (t.currentTrackId) {
        const trk = tracks.find((tr) => tr.id === t.currentTrackId);
        if (trk && (trk.status === 'Emergency Block' || trk.status === 'Blocked')) {
          newAlerts.push({
            id: `CONF-EMG-${trk.id}`,
            timestamp: simulatedTime,
            risk: 'CRITICAL',
            trainAId: t.id,
            trainANumber: t.number,
            trackId: trk.id,
            estimatedMinutesToConflict: 0.5,
            description: `Train ${t.number} entered Track ${trk.number} which is under ${trk.status}!`,
            recommendedAction: `Trip OHE traction circuit breaker. Enforce automatic train stop (ATS).`,
            resolved: false,
            acknowledged: false,
          });
        }
      }
    }

    setConflicts(newAlerts);
  }, [trains, tracks, platforms, simulatedTime]);

  // --------------------------------------------------------------------------
  // Update Signals based on Interlocking logic
  // --------------------------------------------------------------------------
  const updateSignalsInterlocking = useCallback(() => {
    setSignals((prev) =>
      prev.map((sig) => {
        if (!sig.autoMode) return sig;
        const trk = tracks.find((t) => t.id === sig.trackId);
        if (!trk) return sig;

        let aspect: SignalAspect = 'GREEN';
        if (trk.status === 'Emergency Block' || trk.status === 'Blocked' || trk.status === 'Under Maintenance') {
          aspect = 'RED';
        } else if (trk.status === 'Occupied') {
          aspect = 'RED';
        } else if (trk.status === 'Reserved') {
          aspect = 'YELLOW';
        } else {
          aspect = sig.type === 'DISTANT' ? 'DOUBLE YELLOW' : 'GREEN';
        }
        return { ...sig, aspect, lastUpdated: simulatedTime };
      })
    );
  }, [tracks, simulatedTime]);

  // --------------------------------------------------------------------------
  // Periodic Simulation Tick
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!simRunning) return;

    const interval = setInterval(() => {
      setSimulatedMinutes((prev) => prev + 0.2 * simSpeed);

      setTrains((prev) =>
        prev.map((train) => {
          if (train.status === 'Approaching' || train.status === 'In Transit') {
            const nextPercent = Math.min(100, train.positionPercent + 0.6 * simSpeed);
            if (nextPercent >= 50 && train.status === 'Approaching' && !train.currentPlatformId) {
              const prefPfId = train.currentPlatformId || 'PF-03';
              return {
                ...train,
                positionPercent: nextPercent,
                status: 'At Platform',
                currentSpeedKmph: 0,
                currentLocation: `Platform ${prefPfId.slice(3)}`,
                currentPlatformId: prefPfId,
              };
            }
            return { ...train, positionPercent: nextPercent };
          } else if (train.status === 'Departing') {
            const nextPercent = Math.min(100, train.positionPercent + 1.0 * simSpeed);
            if (nextPercent >= 100) {
              return { ...train, positionPercent: 100, status: 'Completed', currentSpeedKmph: 0 };
            }
            return { ...train, positionPercent: nextPercent };
          }
          return train;
        })
      );

      // Jitter sensor data slightly
      setTelemetries((prev) => {
        const next = { ...prev };
        for (const [id, tel] of Object.entries(next)) {
          next[id] = {
            ...tel,
            engineTemperatureC: +(tel.engineTemperatureC + (Math.random() * 0.4 - 0.2)).toFixed(1),
            brakePipePressureBar: +(4.9 + Math.random() * 0.1).toFixed(2),
            feedPipePressureBar: +(5.9 + Math.random() * 0.1).toFixed(2),
            lastUpdated: simulatedTime,
          };
        }
        return next;
      });

      detectConflicts();
      updateSignalsInterlocking();
    }, 1000);

    return () => clearInterval(interval);
  }, [simRunning, simSpeed, simulatedTime, detectConflicts, updateSignalsInterlocking]);

  // --------------------------------------------------------------------------
  // User Actions
  // --------------------------------------------------------------------------
  const changeTrainStatus = useCallback((trainId: string, status: TrainStatus, speed?: number) => {
    setTrains((prev) =>
      prev.map((t) => {
        if (t.id === trainId) {
          const updated = { ...t, status };
          if (speed !== undefined) updated.currentSpeedKmph = speed;
          if (status === 'At Platform' && !updated.currentPlatformId) {
            updated.currentPlatformId = 'PF-01';
          }
          recordAudit('Train Status Change', 'Train Movement', t.status, status);
          return updated;
        }
        return t;
      })
    );
    addNotification('Train Status Updated', `Train ${trainId} status set to ${status}`, 'INFO', 'Train Movement');
  }, [recordAudit, addNotification]);

  const updateTrainSpeed = useCallback((trainId: string, speed: number) => {
    setTrains((prev) =>
      prev.map((t) => (t.id === trainId ? { ...t, currentSpeedKmph: Math.max(0, speed) } : t))
    );
  }, []);

  const updateTrackStatus = useCallback((trackId: string, status: TrackStatus, speedRestriction?: number) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const old = t.status;
          const updated = { ...t, status };
          if (speedRestriction !== undefined) updated.speedRestrictionKmph = speedRestriction;
          recordAudit('Track Status Change', 'Track Management', old, status);
          return updated;
        }
        return t;
      })
    );
    addNotification('Track Status Altered', `Track ${trackId} is now ${status}`, status === 'Emergency Block' ? 'CRITICAL' : 'INFO', 'Track Management');
  }, [recordAudit, addNotification]);

  const updateSignalAspect = useCallback((signalId: string, aspect: SignalAspect, autoMode: boolean = false) => {
    setSignals((prev) =>
      prev.map((s) => {
        if (s.id === signalId) {
          const old = s.aspect;
          recordAudit('Signal Aspect Override', 'Signal Simulation', old, aspect);
          return { ...s, aspect, autoMode, lastUpdated: simulatedTime };
        }
        return s;
      })
    );
    addNotification('Signal Override', `Signal ${signalId} forced to ${aspect}`, 'INFO', 'Signals');
  }, [recordAudit, simulatedTime, addNotification]);

  const resolveConflict = useCallback((conflictId: string) => {
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, resolved: true, acknowledged: true } : c))
    );
    addNotification('Conflict Acknowledged', `Conflict ${conflictId} marked resolved`, 'INFO', 'Collision Prevention');
  }, [addNotification]);

  const executeConflictAction = useCallback((conflictId: string) => {
    const conf = conflicts.find((c) => c.id === conflictId);
    if (!conf) return;

    if (conf.trainBId) {
      changeTrainStatus(conf.trainBId, 'Delayed', 0);
    }
    if (conf.trackId) {
      const sig = signals.find((s) => s.trackId === conf.trackId);
      if (sig) updateSignalAspect(sig.id, 'RED', false);
    }

    resolveConflict(conflictId);
    recordAudit('Execute Conflict Action', 'Collision Prevention', 'Active Alert', 'Action Executed');
    addNotification('Anti-Collision Action Executed', `Safeguards applied for conflict ${conf.id}`, 'HIGH', 'Collision Prevention');
  }, [conflicts, signals, changeTrainStatus, updateSignalAspect, resolveConflict, recordAudit, addNotification]);

  const createWorkOrder = useCallback((data: Partial<MaintenanceWorkOrder>) => {
    const newWo: MaintenanceWorkOrder = {
      id: `WO-${Date.now()}`,
      trainId: data.trainId || 'TR-12002',
      trainNumber: data.trainNumber || '12002',
      issue: data.issue || 'Preventive Mechanical Overhaul',
      priority: data.priority || 'MEDIUM',
      assignedEngineer: data.assignedEngineer || 'Dr. Rameshwar Nath',
      startDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      expectedCompletion: data.expectedCompletion || '2026-10-07 16:00',
      status: 'IN_PROGRESS',
      remarks: data.remarks || 'Initiated via Maintenance console',
      component: data.component || 'Brakes',
    };

    setWorkOrders((prev) => [newWo, ...prev]);
    recordAudit('Create Work Order', 'Maintenance', 'None', `${newWo.id} for Train ${newWo.trainNumber}`);
    addNotification('Work Order Created', `Order ${newWo.id} issued for Train ${newWo.trainNumber}`, 'INFO', 'Maintenance');
  }, [recordAudit, addNotification]);

  const updateWorkOrderStatus = useCallback((id: string, status: MaintenanceWorkOrder['status']) => {
    setWorkOrders((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status, actualCompletion: status === 'COMPLETED' ? simulatedTime : undefined } : w))
    );
  }, [simulatedTime]);

  const createEmergencyIncident = useCallback((data: Partial<EmergencyIncident>) => {
    const incident: EmergencyIncident = {
      id: `INC-${Date.now()}`,
      type: data.type || 'Track obstruction',
      title: data.title || 'Emergency Event',
      description: data.description || 'Reported incident requiring immediate intervention.',
      location: data.location || 'NDLS Station Yard',
      trackId: data.trackId,
      platformId: data.platformId,
      affectedTrainIds: data.affectedTrainIds || [],
      reportedAt: simulatedTime,
      status: 'Reported',
      assignedTeamIds: [],
      timeline: [
        { time: simulatedTime, action: 'Incident reported in control room', actor: activeRole },
      ],
    };

    setEmergencies((prev) => [incident, ...prev]);
    addNotification(`EMERGENCY: ${incident.title}`, incident.description, 'CRITICAL', 'Emergency');
    recordAudit('Create Emergency Incident', 'Emergency Management', 'Normal', incident.title);
  }, [simulatedTime, activeRole, addNotification, recordAudit]);

  const triggerEmergencyScenario = useCallback((scenarioId: string) => {
    const preset = emergencyScenarios.find((s) => s.id === scenarioId);
    if (!preset) return;

    const incident: EmergencyIncident = {
      id: `INC-${Date.now()}`,
      type: preset.type,
      title: preset.title,
      description: preset.description,
      location: preset.location,
      trackId: preset.trackId,
      platformId: preset.platformId,
      affectedTrainIds: [],
      reportedAt: simulatedTime,
      status: 'Reported',
      assignedTeamIds: [],
      timeline: [
        { time: simulatedTime, action: `Scenario "${preset.title}" triggered`, actor: activeRole },
      ],
    };

    if (preset.trackId) {
      updateTrackStatus(preset.trackId, 'Emergency Block');
      const sig = signals.find((s) => s.trackId === preset.trackId);
      if (sig) updateSignalAspect(sig.id, 'RED', false);
    }

    if (preset.platformId) {
      setPlatforms((prev) =>
        prev.map((p) => (p.id === preset.platformId ? { ...p, status: 'Emergency Use' } : p))
      );
    }

    // Auto-dispatch team
    const team = emergencyTeams.find((t) => t.status === 'Available');
    if (team) {
      team.status = 'Dispatched';
      incident.assignedTeamIds.push(team.id);
      incident.status = 'Response Team Assigned';
      incident.timeline.push({
        time: simulatedTime,
        action: `Assigned response team: ${team.name}`,
        actor: 'Emergency Command',
      });
    }

    setEmergencies((prev) => [incident, ...prev]);
    addNotification(`CRITICAL SCENARIO: ${preset.title}`, preset.impactSummary, 'CRITICAL', 'Emergency');
    recordAudit('Trigger Scenario', 'Emergency Simulation', 'Normal', preset.title);
  }, [activeRole, simulatedTime, signals, updateTrackStatus, updateSignalAspect, emergencyTeams, addNotification, recordAudit]);

  const assignEmergencyTeam = useCallback((incidentId: string, teamId: string) => {
    setEmergencyTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, status: 'Dispatched', currentIncidentId: incidentId } : t))
    );
    setEmergencies((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const team = emergencyTeams.find((t) => t.id === teamId);
          return {
            ...inc,
            status: 'Response Team Assigned',
            assignedTeamIds: Array.from(new Set([...inc.assignedTeamIds, teamId])),
            timeline: [
              ...inc.timeline,
              { time: simulatedTime, action: `Dispatched ${team?.name || teamId}`, actor: activeRole },
            ],
          };
        }
        return inc;
      })
    );
    addNotification('Team Dispatched', `Emergency team deployed to incident`, 'HIGH', 'Emergency');
  }, [emergencyTeams, simulatedTime, activeRole, addNotification]);

  const updateEmergencyStatus = useCallback((incidentId: string, status: EmergencyIncident['status']) => {
    setEmergencies((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status,
            timeline: [
              ...inc.timeline,
              { time: simulatedTime, action: `Incident status updated to ${status}`, actor: activeRole },
            ],
          };
        }
        return inc;
      })
    );
  }, [simulatedTime, activeRole]);

  const addTrain = useCallback((trainData: Partial<Train>) => {
    const newTrain: Train = {
      id: `TR-${trainData.number || Date.now()}`,
      number: trainData.number || '99999',
      name: trainData.name || 'Special Express',
      type: trainData.type || 'Superfast Express',
      category: trainData.category || 'Express',
      sourceStation: trainData.sourceStation || 'NDLS',
      destinationStation: trainData.destinationStation || 'MMCT',
      intermediateStations: trainData.intermediateStations || [],
      coachesCount: trainData.coachesCount || 16,
      lengthMeters: trainData.lengthMeters || 400,
      composition: [],
      maxSpeedKmph: trainData.maxSpeedKmph || 130,
      currentSpeedKmph: 0,
      status: 'Scheduled',
      currentLocation: 'Approaching Outer Siding',
      direction: trainData.direction || 'UP',
      nextStation: 'New Delhi',
      scheduledArrival: trainData.scheduledArrival || '16:00',
      expectedArrival: trainData.expectedArrival || '16:00',
      scheduledDeparture: trainData.scheduledDeparture || '16:30',
      expectedDeparture: trainData.expectedDeparture || '16:30',
      delayMinutes: 0,
      maintenanceStatus: 'Healthy',
      positionPercent: 0,
      locoNumber: trainData.locoNumber || 'WAP-7 #30999',
      driverName: trainData.driverName || 'Designated Driver',
    };
    setTrains((prev) => [newTrain, ...prev]);
    addNotification('Train Added', `Train ${newTrain.number} added to system`, 'INFO', 'Train Management');
    recordAudit('Add Train', 'Train Management', 'None', `${newTrain.number} ${newTrain.name}`);
  }, [addNotification, recordAudit]);

  const updateTrain = useCallback((id: string, trainData: Partial<Train>) => {
    setTrains((prev) => prev.map((t) => (t.id === id ? { ...t, ...trainData } : t)));
  }, []);

  const createSchedule = useCallback((schData: Partial<Schedule>) => {
    const newSch: Schedule = {
      id: `SCH-${Date.now()}`,
      trainId: schData.trainId || 'TR-CUSTOM',
      trainNumber: schData.trainNumber || '99999',
      trainName: schData.trainName || 'Special',
      arrivalTime: schData.arrivalTime || '16:00',
      departureTime: schData.departureTime || '16:30',
      platformPreference: schData.platformPreference || 'PF-01',
      trackPreference: schData.trackPreference || 'T-01',
      allocatedPlatformId: schData.allocatedPlatformId,
      allocatedTrackId: schData.allocatedTrackId,
      journeyDurationMinutes: schData.journeyDurationMinutes || 120,
      stops: schData.stops || ['NDLS', 'GZB'],
      status: 'Scheduled',
    };
    setSchedules((prev) => [newSch, ...prev]);
    addNotification('Schedule Created', `Timetable slot added for Train ${newSch.trainNumber}`, 'INFO', 'Scheduling');
  }, [addNotification]);

  const toggleSimulation = useCallback(() => {
    setSimRunning((prev) => !prev);
  }, []);

  const setSimulationSpeed = useCallback((speed: number) => {
    setSimSpeed(speed);
  }, []);

  const resetSimulation = useCallback(() => {
    setSimulatedMinutes(14 * 60 + 30);
    setTrains(JSON.parse(JSON.stringify(initialTrains)));
    setPlatforms(JSON.parse(JSON.stringify(initialPlatforms)));
    setTracks(JSON.parse(JSON.stringify(initialTracks)));
    setSignals(JSON.parse(JSON.stringify(initialSignals)));
    setEmergencies(JSON.parse(JSON.stringify(initialEmergencies)));
    setEmergencyTeams(JSON.parse(JSON.stringify(initialEmergencyTeams)));
    addNotification('Simulation Reset', 'Station simulation returned to baseline 14:30 IST state', 'INFO', 'Simulation');
  }, [addNotification]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const playChime = useCallback(() => {
    railwayAudio.playStationChime();
  }, []);

  return (
    <RailwayContext.Provider
      value={{
        station,
        trains,
        schedules,
        platforms,
        tracks,
        signals,
        conflicts,
        telemetries,
        workOrders,
        emergencies,
        emergencyTeams,
        staff,
        resources,
        auditLogs,
        notifications,
        activeRole,
        setActiveRole,
        simulatedTime,
        simRunning,
        simSpeed,
        toggleSimulation,
        setSimulationSpeed,
        resetSimulation,
        selectedTrain,
        setSelectedTrain,
        selectedTrack,
        setSelectedTrack,
        selectedPlatform,
        setSelectedPlatform,
        selectedSignal,
        setSelectedSignal,
        activeTab,
        setActiveTab,
        allocatePlatform,
        autoAllocatePlatform,
        changeTrainStatus,
        updateTrainSpeed,
        updateTrackStatus,
        updateSignalAspect,
        resolveConflict,
        executeConflictAction,
        createWorkOrder,
        updateWorkOrderStatus,
        createEmergencyIncident,
        triggerEmergencyScenario,
        assignEmergencyTeam,
        updateEmergencyStatus,
        addTrain,
        updateTrain,
        createSchedule,
        dismissNotification,
        clearNotifications,
        playChime,
      }}
    >
      {children}
    </RailwayContext.Provider>
  );
};

export const useRailway = () => {
  const context = useContext(RailwayContext);
  if (!context) {
    throw new Error('useRailway must be used within a RailwayProvider');
  }
  return context;
};
