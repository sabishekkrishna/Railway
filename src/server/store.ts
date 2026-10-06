import {
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
  Staff,
  StationInfo,
  StationResource,
  Track,
  Train,
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

export class RailwayStore {
  station: StationInfo;
  platforms: Platform[];
  tracks: Track[];
  signals: Signal[];
  trains: Train[];
  schedules: Schedule[];
  workOrders: MaintenanceWorkOrder[];
  telemetries: Record<string, TrainTelemetry>;
  emergencyTeams: EmergencyTeam[];
  emergencies: EmergencyIncident[];
  staff: Staff[];
  resources: StationResource[];
  auditLogs: AuditRecord[];
  conflicts: ConflictAlert[];
  simulationRunning: boolean = true;
  simulationSpeed: number = 1; // 1x, 2x, 5x, 10x
  simulatedMinutes: number = 14 * 60 + 30; // 14:30 IST

  constructor() {
    this.station = { ...initialStation };
    this.platforms = JSON.parse(JSON.stringify(initialPlatforms));
    this.tracks = JSON.parse(JSON.stringify(initialTracks));
    this.signals = JSON.parse(JSON.stringify(initialSignals));
    this.trains = JSON.parse(JSON.stringify(initialTrains));
    this.schedules = JSON.parse(JSON.stringify(initialSchedules));
    this.workOrders = JSON.parse(JSON.stringify(initialWorkOrders));
    this.telemetries = JSON.parse(JSON.stringify(initialTelemetries));
    this.emergencyTeams = JSON.parse(JSON.stringify(initialEmergencyTeams));
    this.emergencies = JSON.parse(JSON.stringify(initialEmergencies));
    this.staff = JSON.parse(JSON.stringify(initialStaff));
    this.resources = JSON.parse(JSON.stringify(initialStationResources));
    this.auditLogs = [];
    this.conflicts = [];

    // Initial audit log
    this.recordAudit(
      'System',
      'Super Administrator',
      'System Startup',
      'Core Engine',
      'Offline',
      'NDLS Station Operations Simulation Online'
    );

    // Initial conflict scan
    this.detectConflicts();
  }

  getCurrentSimulatedTime(): string {
    const hours = Math.floor(this.simulatedMinutes / 60) % 24;
    const mins = Math.floor(this.simulatedMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  recordAudit(
    userName: string,
    userRole: UserRole,
    action: string,
    module: string,
    previousValue: string,
    newValue: string
  ) {
    const record: AuditRecord = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName,
      userRole,
      action,
      module,
      previousValue,
      newValue,
      ipAddress: '10.24.110.1 (OCC Terminal)',
    };
    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  // --------------------------------------------------------------------------
  // Intelligent Platform Allocation Algorithm
  // --------------------------------------------------------------------------
  recommendPlatform(trainId: string): PlatformRecommendation[] {
    const train = this.trains.find((t) => t.id === trainId);
    if (!train) return [];

    const recommendations: PlatformRecommendation[] = [];

    for (const pf of this.platforms) {
      const reasoning: string[] = [];
      const warnings: string[] = [];
      let score = 50; // base score

      const lengthFits = pf.lengthMeters >= train.lengthMeters;
      if (lengthFits) {
        score += 25;
        reasoning.push(
          `Platform length (${pf.lengthMeters}m) accommodates train rake length (${train.lengthMeters}m)`
        );
      } else {
        score -= 50;
        warnings.push(
          `Train length (${train.lengthMeters}m) EXCEEDS platform length (${pf.lengthMeters}m)`
        );
      }

      const isFree = pf.status === 'Available';
      if (isFree) {
        score += 30;
        reasoning.push(`Platform ${pf.number} is currently free and clear`);
      } else if (pf.status === 'Reserved') {
        score += 10;
        reasoning.push(`Platform ${pf.number} is reserved for compatible time slot`);
      } else if (pf.status === 'Occupied') {
        score -= 40;
        warnings.push(`Platform ${pf.number} is currently occupied by another train`);
      } else if (pf.status === 'Under Maintenance' || pf.status === 'Blocked' || pf.status === 'Emergency Use') {
        score -= 100;
        warnings.push(`Platform ${pf.number} is blocked (${pf.status})`);
      }

      // Track condition
      const track = this.tracks.find((t) => t.id === pf.connectedTrackId);
      const trackAccessible = !!track && track.status !== 'Blocked' && track.status !== 'Emergency Block';
      if (trackAccessible) {
        score += 15;
        reasoning.push(`Connected Track ${track?.number || pf.connectedTrackId} has normal interlocking clearance`);
      } else {
        score -= 60;
        warnings.push(`Track ${pf.connectedTrackId} is blocked or locked`);
      }

      // Electrification check
      const electrified = pf.electrification;
      if (electrified) {
        score += 10;
        reasoning.push('25kV AC OHE traction feed active');
      }

      // Passenger convenience bonus for premium trains
      if (train.category === 'Premium' && (pf.number === '1' || pf.number === '2' || pf.number === '3')) {
        score += 15;
        reasoning.push(`Direct VIP concourse & escalator access suitable for ${train.type}`);
      }

      // Check upcoming conflicts in schedule
      const conflictingSchedule = this.schedules.find(
        (s) =>
          s.allocatedPlatformId === pf.id &&
          s.trainId !== train.id &&
          s.status !== 'Completed' &&
          s.status !== 'Cancelled'
      );
      const noUpcomingConflicts = !conflictingSchedule;
      if (!noUpcomingConflicts) {
        score -= 25;
        warnings.push(
          `Schedule overlap with Train ${conflictingSchedule.trainNumber} at ${conflictingSchedule.arrivalTime}`
        );
      } else {
        score += 10;
        reasoning.push('No schedule overlap within departure buffer window');
      }

      recommendations.push({
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
          electrified,
        },
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  // --------------------------------------------------------------------------
  // Rule-Based Collision & Conflict Detection Engine
  // --------------------------------------------------------------------------
  detectConflicts(): ConflictAlert[] {
    const alerts: ConflictAlert[] = [];
    const nowTime = this.getCurrentSimulatedTime();

    // 1. Two trains assigned or occupying the same track
    const trackOccupancy: Record<string, Train[]> = {};
    for (const train of this.trains) {
      if (train.currentTrackId && train.status !== 'Completed' && train.status !== 'Cancelled') {
        if (!trackOccupancy[train.currentTrackId]) {
          trackOccupancy[train.currentTrackId] = [];
        }
        trackOccupancy[train.currentTrackId].push(train);
      }
    }

    for (const [trackId, assignedTrains] of Object.entries(trackOccupancy)) {
      if (assignedTrains.length > 1) {
        const t1 = assignedTrains[0];
        const t2 = assignedTrains[1];
        const track = this.tracks.find((t) => t.id === trackId);
        alerts.push({
          id: `CONF-${trackId}-${Date.now()}`,
          timestamp: nowTime,
          risk: 'CRITICAL',
          trainAId: t1.id,
          trainANumber: t1.number,
          trainBId: t2.id,
          trainBNumber: t2.number,
          trackId,
          estimatedMinutesToConflict: 2.5,
          description: `Simultaneous track occupancy on ${track?.number || trackId}. Train ${t1.number} and Train ${t2.number} on same section.`,
          recommendedAction: `Hold Train ${t2.number} immediately at previous home signal. Switch crossover switch to bypass loop.`,
          resolved: false,
          acknowledged: false,
        });
      }
    }

    // 2. Platform Conflict: Train approaching while platform still occupied
    for (const pf of this.platforms) {
      if (pf.currentTrainId) {
        const occupyingTrain = this.trains.find((t) => t.id === pf.currentTrainId);
        // Find next scheduled train approaching this platform
        const nextTrain = this.trains.find(
          (t) =>
            t.currentPlatformId === pf.id &&
            t.id !== pf.currentTrainId &&
            (t.status === 'Approaching' || t.status === 'In Transit' || t.delayMinutes > 0)
        );

        if (occupyingTrain && nextTrain) {
          alerts.push({
            id: `CONF-PF-${pf.id}-${Date.now()}`,
            timestamp: nowTime,
            risk: 'HIGH',
            trainAId: occupyingTrain.id,
            trainANumber: occupyingTrain.number,
            trainBId: nextTrain.id,
            trainBNumber: nextTrain.number,
            platformId: pf.id,
            estimatedMinutesToConflict: 6.0,
            description: `Platform ${pf.number} occupied by Train ${occupyingTrain.number} while Train ${nextTrain.number} is approaching.`,
            recommendedAction: `Reallocate Train ${nextTrain.number} to Platform 3 or 5 using Auto-Allocation engine.`,
            resolved: false,
            acknowledged: false,
          });
        }
      }
    }

    // 3. Train entering a Blocked or Emergency Block track
    for (const train of this.trains) {
      if (train.currentTrackId) {
        const track = this.tracks.find((t) => t.id === train.currentTrackId);
        if (track && (track.status === 'Blocked' || track.status === 'Emergency Block')) {
          alerts.push({
            id: `CONF-BLK-${track.id}-${Date.now()}`,
            timestamp: nowTime,
            risk: 'CRITICAL',
            trainAId: train.id,
            trainANumber: train.number,
            trackId: track.id,
            estimatedMinutesToConflict: 0.5,
            description: `Train ${train.number} on ${track.number} which has an ACTIVE EMERGENCY BLOCK!`,
            recommendedAction: `Apply emergency brake (SPAD trip). Halt traction feed immediately.`,
            resolved: false,
            acknowledged: false,
          });
        }
      }
    }

    // 4. Opposing movements on single line / through line
    const upTrains = this.trains.filter((t) => t.direction === 'UP' && t.currentSpeedKmph > 0);
    const downTrains = this.trains.filter((t) => t.direction === 'DOWN' && t.currentSpeedKmph > 0);
    for (const up of upTrains) {
      for (const down of downTrains) {
        if (up.currentTrackId && up.currentTrackId === down.currentTrackId) {
          alerts.push({
            id: `CONF-HEADON-${up.currentTrackId}-${Date.now()}`,
            timestamp: nowTime,
            risk: 'CRITICAL',
            trainAId: up.id,
            trainANumber: up.number,
            trainBId: down.id,
            trainBNumber: down.number,
            trackId: up.currentTrackId,
            estimatedMinutesToConflict: 1.8,
            description: `HEAD-ON COLLISION HAZARD: Opposing movements detected on Track ${up.currentTrackId}!`,
            recommendedAction: `Trip upstream signals to Danger (RED). Apply emergency brakes on both rakes.`,
            resolved: false,
            acknowledged: false,
          });
        }
      }
    }

    this.conflicts = alerts;
    return alerts;
  }

  // --------------------------------------------------------------------------
  // Interlocking and Signal Simulator
  // --------------------------------------------------------------------------
  updateSignals() {
    for (const signal of this.signals) {
      if (!signal.autoMode) continue; // Manual override preserved

      const track = this.tracks.find((t) => t.id === signal.trackId);
      if (!track) continue;

      if (track.status === 'Emergency Block' || track.status === 'Blocked' || track.status === 'Under Maintenance') {
        signal.aspect = 'RED';
      } else if (track.status === 'Occupied') {
        signal.aspect = 'RED';
      } else if (track.status === 'Reserved') {
        signal.aspect = 'YELLOW';
      } else {
        // Free track
        if (signal.type === 'DISTANT') {
          signal.aspect = 'DOUBLE YELLOW';
        } else {
          signal.aspect = 'GREEN';
        }
      }
      signal.lastUpdated = this.getCurrentSimulatedTime();
    }
  }

  // --------------------------------------------------------------------------
  // Real-Time Simulation Ticker
  // --------------------------------------------------------------------------
  simulationTick() {
    if (!this.simulationRunning) return;

    // Advance time by 0.5 minute scaled by speed
    this.simulatedMinutes += 0.25 * this.simulationSpeed;

    // Update moving trains
    for (const train of this.trains) {
      if (train.status === 'Approaching' || train.status === 'In Transit') {
        train.positionPercent = Math.min(100, train.positionPercent + 0.8 * this.simulationSpeed);

        // Transition from approaching to platform if reached threshold
        if (train.positionPercent >= 50 && train.status === 'Approaching' && !train.currentPlatformId) {
          // If allocated platform exists
          const alloc = this.schedules.find((s) => s.trainId === train.id)?.allocatedPlatformId;
          if (alloc) {
            const pf = this.platforms.find((p) => p.id === alloc);
            if (pf && pf.status === 'Available') {
              train.currentPlatformId = pf.id;
              train.currentTrackId = pf.connectedTrackId;
              train.status = 'At Platform';
              train.currentSpeedKmph = 0;
              train.currentLocation = `Platform ${pf.number}`;
              pf.status = 'Occupied';
              pf.currentTrainId = train.id;

              const trk = this.tracks.find((t) => t.id === pf.connectedTrackId);
              if (trk) {
                trk.status = 'Occupied';
                trk.currentTrainId = train.id;
              }
            }
          }
        }
      } else if (train.status === 'Departing') {
        train.positionPercent = Math.min(100, train.positionPercent + 1.2 * this.simulationSpeed);
        if (train.positionPercent >= 100) {
          train.status = 'Completed';
          train.currentSpeedKmph = 0;
          if (train.currentPlatformId) {
            const pf = this.platforms.find((p) => p.id === train.currentPlatformId);
            if (pf) {
              pf.status = 'Available';
              pf.currentTrainId = undefined;
            }
            train.currentPlatformId = undefined;
          }
          if (train.currentTrackId) {
            const trk = this.tracks.find((t) => t.id === train.currentTrackId);
            if (trk) {
              trk.status = 'Free';
              trk.currentTrainId = undefined;
            }
            train.currentTrackId = undefined;
          }
        }
      }

      // Simulate telemetry jitter
      const tel = this.telemetries[train.id];
      if (tel) {
        if (train.currentSpeedKmph > 0) {
          tel.engineTemperatureC = Math.min(105, +(tel.engineTemperatureC + (Math.random() * 0.4 - 0.2)).toFixed(1));
          tel.wheelBogieHuntingMps2 = +(0.08 + Math.random() * 0.08).toFixed(2);
        } else {
          tel.engineTemperatureC = Math.max(50, +(tel.engineTemperatureC - 0.1).toFixed(1));
          tel.wheelBogieHuntingMps2 = 0.02;
        }
        tel.lastUpdated = this.getCurrentSimulatedTime();
      }
    }

    this.updateSignals();
    this.detectConflicts();
  }

  // --------------------------------------------------------------------------
  // Scenario Trigger
  // --------------------------------------------------------------------------
  triggerScenario(scenarioId: string, operatorName: string = 'Control Operator'): EmergencyIncident | null {
    const preset = emergencyScenarios.find((s) => s.id === scenarioId);
    if (!preset) return null;

    const incident: EmergencyIncident = {
      id: `INC-${Date.now()}`,
      type: preset.type,
      title: preset.title,
      description: preset.description,
      location: preset.location,
      trackId: preset.trackId,
      platformId: preset.platformId,
      affectedTrainIds: [],
      reportedAt: this.getCurrentSimulatedTime(),
      status: 'Reported',
      assignedTeamIds: [],
      timeline: [
        {
          time: this.getCurrentSimulatedTime(),
          action: `Scenario "${preset.title}" triggered in simulation engine.`,
          actor: operatorName,
        },
      ],
    };

    // Apply immediate railway actions based on scenario
    if (preset.trackId) {
      const track = this.tracks.find((t) => t.id === preset.trackId);
      if (track) {
        track.status = 'Emergency Block';
        incident.timeline.push({
          time: this.getCurrentSimulatedTime(),
          action: `Track ${track.number} placed under EMERGENCY BLOCK (Signal held RED).`,
          actor: 'Interlocking System',
        });
      }
      const sig = this.signals.find((s) => s.trackId === preset.trackId);
      if (sig) {
        sig.aspect = 'RED';
        sig.autoMode = false;
      }
    }

    if (preset.platformId) {
      const pf = this.platforms.find((p) => p.id === preset.platformId);
      if (pf) {
        pf.status = 'Emergency Use';
        incident.timeline.push({
          time: this.getCurrentSimulatedTime(),
          action: `Platform ${pf.number} isolated for Emergency Response.`,
          actor: 'Station Master',
        });
      }
    }

    // Auto assign closest team
    let recTeam = this.emergencyTeams.find((t) => t.status === 'Available');
    if (preset.type === 'Fire') {
      recTeam = this.emergencyTeams.find((t) => t.type === 'Fire & Rescue') || recTeam;
    } else if (preset.type === 'Medical emergency') {
      recTeam = this.emergencyTeams.find((t) => t.type === 'Medical') || recTeam;
    } else if (preset.type === 'Signal failure' || preset.type === 'Power failure') {
      recTeam = this.emergencyTeams.find((t) => t.type === 'Electrical' || t.type === 'Engineering') || recTeam;
    } else if (preset.type === 'Track obstruction') {
      recTeam = this.emergencyTeams.find((t) => t.type === 'Track Maintenance') || recTeam;
    }

    if (recTeam) {
      recTeam.status = 'Dispatched';
      incident.assignedTeamIds.push(recTeam.id);
      incident.status = 'Response Team Assigned';
      incident.timeline.push({
        time: this.getCurrentSimulatedTime(),
        action: `Assigned response team: ${recTeam.name} (ETA: ${recTeam.responseMinutes} mins).`,
        actor: 'Emergency Command',
      });
    }

    this.emergencies.unshift(incident);
    this.recordAudit(
      operatorName,
      'Emergency Response Officer',
      `Triggered Emergency Scenario: ${preset.title}`,
      'Emergency Management',
      'Normal Operations',
      `Active Incident ${incident.id}`
    );

    this.updateSignals();
    this.detectConflicts();
    return incident;
  }
}

// Global Singleton Instance for backend
export const globalStore = new RailwayStore();

// Setup timer for server simulation
setInterval(() => {
  globalStore.simulationTick();
}, 1000);
