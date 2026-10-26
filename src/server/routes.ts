import { Router, Request, Response } from 'express';
import { globalStore } from './store';
import { Train, Schedule, MaintenanceWorkOrder, EmergencyIncident, Staff } from '../types/railway';

export const apiRouter = Router();

// ----------------------------------------------------------------------------
// Health and High-Level Status
// ----------------------------------------------------------------------------
apiRouter.get('/status', (req: Request, res: Response) => {
  const activeEmergencies = globalStore.emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed');
  const criticalConflicts = globalStore.conflicts.filter((c) => !c.resolved && c.risk === 'CRITICAL');
  const delayedTrains = globalStore.trains.filter((t) => t.delayMinutes > 0);
  const occupiedTracks = globalStore.tracks.filter((t) => t.status === 'Occupied');
  const availablePlatforms = globalStore.platforms.filter((p) => p.status === 'Available');

  res.json({
    status: 'ONLINE',
    station: globalStore.station,
    simulatedTime: globalStore.getCurrentSimulatedTime(),
    simulationRunning: globalStore.simulationRunning,
    simulationSpeed: globalStore.simulationSpeed,
    metrics: {
      totalTrains: globalStore.trains.length,
      activeTrains: globalStore.trains.filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled').length,
      delayedTrainsCount: delayedTrains.length,
      availablePlatformsCount: availablePlatforms.length,
      totalPlatformsCount: globalStore.platforms.length,
      occupiedTracksCount: occupiedTracks.length,
      totalTracksCount: globalStore.tracks.length,
      activeEmergenciesCount: activeEmergencies.length,
      criticalConflictsCount: criticalConflicts.length,
      openWorkOrdersCount: globalStore.workOrders.filter((w) => w.status !== 'COMPLETED').length,
    },
  });
});

// ----------------------------------------------------------------------------
// Train Management (Module 1)
// ----------------------------------------------------------------------------
apiRouter.get('/trains', (req: Request, res: Response) => {
  res.json(globalStore.trains);
});

apiRouter.get('/trains/:id', (req: Request, res: Response) => {
  const train = globalStore.trains.find((t) => t.id === req.params.id);
  if (!train) return res.status(404).json({ error: 'Train not found' });
  res.json(train);
});

apiRouter.post('/trains', (req: Request, res: Response) => {
  const trainData: Partial<Train> = req.body;
  if (!trainData.number || !trainData.name) {
    return res.status(400).json({ error: 'Train number and name are required' });
  }

  const newTrain: Train = {
    id: `TR-${trainData.number}`,
    number: trainData.number,
    name: trainData.name,
    type: trainData.type || 'Superfast Express',
    category: trainData.category || 'Express',
    sourceStation: trainData.sourceStation || 'New Delhi (NDLS)',
    destinationStation: trainData.destinationStation || 'Mumbai Central (MMCT)',
    intermediateStations: trainData.intermediateStations || ['Mathura', 'Kota', 'Ratlam'],
    coachesCount: trainData.coachesCount || 16,
    lengthMeters: trainData.lengthMeters || 420,
    composition: trainData.composition || [],
    maxSpeedKmph: trainData.maxSpeedKmph || 130,
    currentSpeedKmph: 0,
    status: 'Scheduled',
    currentLocation: 'Outer Signal Approach',
    direction: trainData.direction || 'UP',
    nextStation: trainData.nextStation || 'New Delhi Junction',
    scheduledArrival: trainData.scheduledArrival || '15:00',
    expectedArrival: trainData.expectedArrival || '15:00',
    scheduledDeparture: trainData.scheduledDeparture || '15:30',
    expectedDeparture: trainData.expectedDeparture || '15:30',
    delayMinutes: 0,
    maintenanceStatus: 'Healthy',
    positionPercent: 0,
    locoNumber: trainData.locoNumber || 'WAP-7 #30001',
    driverName: trainData.driverName || 'Unassigned',
  };

  globalStore.trains.push(newTrain);
  globalStore.recordAudit('Operator', 'Station Master', 'Add Train', 'Train Management', 'None', `${newTrain.number} ${newTrain.name}`);
  res.status(201).json(newTrain);
});

apiRouter.put('/trains/:id', (req: Request, res: Response) => {
  const index = globalStore.trains.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Train not found' });

  const old = globalStore.trains[index];
  globalStore.trains[index] = { ...old, ...req.body };
  globalStore.recordAudit('Operator', 'Train Controller', 'Update Train', 'Train Management', old.status, globalStore.trains[index].status);
  res.json(globalStore.trains[index]);
});

apiRouter.post('/trains/:id/status', (req: Request, res: Response) => {
  const train = globalStore.trains.find((t) => t.id === req.params.id);
  if (!train) return res.status(404).json({ error: 'Train not found' });

  const prevStatus = train.status;
  train.status = req.body.status;
  if (req.body.currentSpeedKmph !== undefined) {
    train.currentSpeedKmph = req.body.currentSpeedKmph;
  }

  globalStore.recordAudit('Operator', 'Train Controller', 'Change Train Status', 'Train Movement', prevStatus, train.status);
  globalStore.updateSignals();
  globalStore.detectConflicts();
  res.json(train);
});

apiRouter.delete('/trains/:id', (req: Request, res: Response) => {
  const index = globalStore.trains.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Train not found' });

  const removed = globalStore.trains.splice(index, 1)[0];
  globalStore.recordAudit('Admin', 'Super Administrator', 'Deactivate Train', 'Train Management', removed.number, 'Deactivated');
  res.json({ message: 'Train removed', train: removed });
});

// ----------------------------------------------------------------------------
// Train Scheduling (Module 2)
// ----------------------------------------------------------------------------
apiRouter.get('/schedules', (req: Request, res: Response) => {
  res.json(globalStore.schedules);
});

apiRouter.post('/schedules', (req: Request, res: Response) => {
  const data: Partial<Schedule> = req.body;
  const newSchedule: Schedule = {
    id: `SCH-${Date.now()}`,
    trainId: data.trainId || 'TR-CUSTOM',
    trainNumber: data.trainNumber || '99999',
    trainName: data.trainName || 'Special Express',
    arrivalTime: data.arrivalTime || '16:00',
    departureTime: data.departureTime || '16:30',
    platformPreference: data.platformPreference || 'PF-01',
    trackPreference: data.trackPreference || 'T-01',
    allocatedPlatformId: data.allocatedPlatformId,
    allocatedTrackId: data.allocatedTrackId,
    journeyDurationMinutes: data.journeyDurationMinutes || 120,
    stops: data.stops || ['NDLS', 'GZB'],
    status: 'Scheduled',
  };

  globalStore.schedules.push(newSchedule);
  globalStore.recordAudit('Scheduler', 'Station Master', 'Create Train Schedule', 'Scheduling', 'None', `${newSchedule.trainNumber} at ${newSchedule.arrivalTime}`);
  res.status(201).json(newSchedule);
});

apiRouter.put('/schedules/:id', (req: Request, res: Response) => {
  const index = globalStore.schedules.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Schedule not found' });

  globalStore.schedules[index] = { ...globalStore.schedules[index], ...req.body };
  res.json(globalStore.schedules[index]);
});

// ----------------------------------------------------------------------------
// Platform Allocation (Module 3) & AI Recommendation
// ----------------------------------------------------------------------------
apiRouter.get('/platforms', (req: Request, res: Response) => {
  res.json(globalStore.platforms);
});

apiRouter.get('/platforms/recommend/:trainId', (req: Request, res: Response) => {
  const trainId = Array.isArray(req.params.trainId) ? req.params.trainId[0] : req.params.trainId;
  const recommendations = globalStore.recommendPlatform(trainId);
  if (recommendations.length === 0) {
    return res.status(404).json({ error: 'Train not found or no platforms eligible' });
  }
  res.json({
    trainId: req.params.trainId,
    bestRecommendation: recommendations[0],
    allRecommendations: recommendations,
  });
});

apiRouter.post('/platforms/allocate', (req: Request, res: Response) => {
  const { trainId, platformId } = req.body;
  const train = globalStore.trains.find((t) => t.id === trainId);
  const platform = globalStore.platforms.find((p) => p.id === platformId);

  if (!train || !platform) {
    return res.status(400).json({ error: 'Invalid train or platform ID' });
  }

  // Check if platform is blocked
  if (platform.status === 'Blocked' || platform.status === 'Emergency Use') {
    return res.status(409).json({
      error: `Platform allocation failed: Platform ${platform.number} is blocked (${platform.status}).`,
    });
  }

  // Check train length vs platform length
  if (train.lengthMeters > platform.lengthMeters) {
    return res.status(409).json({
      error: `Platform allocation failed: Train length (${train.lengthMeters}m) exceeds Platform ${platform.number} length (${platform.lengthMeters}m).`,
    });
  }

  // Update previous platform if any
  if (train.currentPlatformId) {
    const prevPf = globalStore.platforms.find((p) => p.id === train.currentPlatformId);
    if (prevPf && prevPf.id !== platform.id) {
      prevPf.status = 'Available';
      prevPf.currentTrainId = undefined;
    }
  }

  const prevAlloc = train.currentPlatformId || 'None';
  train.currentPlatformId = platform.id;
  train.currentTrackId = platform.connectedTrackId;
  platform.nextScheduledTrainId = train.id;

  // Also sync schedule
  const schedule = globalStore.schedules.find((s) => s.trainId === train.id);
  if (schedule) {
    schedule.allocatedPlatformId = platform.id;
    schedule.allocatedTrackId = platform.connectedTrackId;
  }

  globalStore.recordAudit('Station Master', 'Station Master', 'Allocate Platform', 'Platform Allocation', prevAlloc, `Platform ${platform.number}`);
  globalStore.updateSignals();
  globalStore.detectConflicts();

  res.json({
    message: `Train ${train.number} allocated to Platform ${platform.number}`,
    train,
    platform,
  });
});

// ----------------------------------------------------------------------------
// Track Management (Module 4)
// ----------------------------------------------------------------------------
apiRouter.get('/tracks', (req: Request, res: Response) => {
  res.json(globalStore.tracks);
});

apiRouter.post('/tracks/:id/status', (req: Request, res: Response) => {
  const track = globalStore.tracks.find((t) => t.id === req.params.id);
  if (!track) return res.status(404).json({ error: 'Track not found' });

  const prevStatus = track.status;
  track.status = req.body.status;
  if (req.body.speedRestrictionKmph !== undefined) {
    track.speedRestrictionKmph = req.body.speedRestrictionKmph;
  }

  globalStore.recordAudit('Control Operator', 'Railway Control Room Operator', 'Change Track Status', 'Track Management', prevStatus, track.status);
  globalStore.updateSignals();
  globalStore.detectConflicts();

  res.json(track);
});

// ----------------------------------------------------------------------------
// Collision Prevention (Module 5)
// ----------------------------------------------------------------------------
apiRouter.get('/conflicts', (req: Request, res: Response) => {
  const conflicts = globalStore.detectConflicts();
  res.json(conflicts);
});

apiRouter.post('/conflicts/:id/execute-action', (req: Request, res: Response) => {
  const conflict = globalStore.conflicts.find((c) => c.id === req.params.id);
  if (!conflict) return res.status(404).json({ error: 'Conflict alert not found' });

  // Resolve conflict by holding train and switching signals
  conflict.resolved = true;
  conflict.acknowledged = true;

  if (conflict.trainBId) {
    const t2 = globalStore.trains.find((t) => t.id === conflict.trainBId);
    if (t2) {
      t2.currentSpeedKmph = 0;
      t2.status = 'Delayed';
      t2.delayMinutes += 5;
    }
  }

  globalStore.recordAudit('Control Operator', 'Railway Control Room Operator', 'Execute Anti-Collision Action', 'Collision Prevention', 'Active Alert', 'Action Executed / Resolved');
  res.json({ message: 'Recommended collision prevention action executed successfully', conflict });
});

// ----------------------------------------------------------------------------
// Signals (Module 6)
// ----------------------------------------------------------------------------
apiRouter.get('/signals', (req: Request, res: Response) => {
  res.json(globalStore.signals);
});

apiRouter.post('/signals/:id/aspect', (req: Request, res: Response) => {
  const signal = globalStore.signals.find((s) => s.id === req.params.id);
  if (!signal) return res.status(404).json({ error: 'Signal not found' });

  const prev = signal.aspect;
  signal.aspect = req.body.aspect;
  signal.autoMode = req.body.autoMode ?? false; // manual override
  signal.lastUpdated = globalStore.getCurrentSimulatedTime();

  globalStore.recordAudit('Station Master', 'Station Master', 'Signal Aspect Override', 'Signal Simulation', prev, signal.aspect);
  res.json(signal);
});

// ----------------------------------------------------------------------------
// Maintenance (Module 8 & 9)
// ----------------------------------------------------------------------------
apiRouter.get('/maintenance/work-orders', (req: Request, res: Response) => {
  res.json(globalStore.workOrders);
});

apiRouter.post('/maintenance/work-orders', (req: Request, res: Response) => {
  const wo: MaintenanceWorkOrder = {
    id: `WO-${Date.now()}`,
    trainId: req.body.trainId || 'TR-12002',
    trainNumber: req.body.trainNumber || '12002',
    issue: req.body.issue || 'Routine preventive maintenance',
    priority: req.body.priority || 'MEDIUM',
    assignedEngineer: req.body.assignedEngineer || 'Dr. Rameshwar Nath',
    startDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    expectedCompletion: req.body.expectedCompletion || '2026-10-07 18:00',
    status: 'IN_PROGRESS',
    remarks: req.body.remarks || 'Initiated via Maintenance console',
    component: req.body.component || 'Brakes',
  };

  globalStore.workOrders.unshift(wo);
  globalStore.recordAudit('Maintenance Engineer', 'Maintenance Engineer', 'Create Maintenance Work Order', 'Maintenance', 'None', `${wo.id} for ${wo.trainNumber}`);
  res.status(201).json(wo);
});

apiRouter.get('/sensors/telemetry', (req: Request, res: Response) => {
  res.json(globalStore.telemetries);
});

// ----------------------------------------------------------------------------
// Emergency Management (Module 10 & 11)
// ----------------------------------------------------------------------------
apiRouter.get('/emergencies', (req: Request, res: Response) => {
  res.json(globalStore.emergencies);
});

apiRouter.get('/emergencies/teams', (req: Request, res: Response) => {
  res.json(globalStore.emergencyTeams);
});

apiRouter.post('/emergencies/scenarios/trigger', (req: Request, res: Response) => {
  const { scenarioId, operatorName } = req.body;
  const incident = globalStore.triggerScenario(scenarioId, operatorName);
  if (!incident) return res.status(404).json({ error: 'Scenario not found' });
  res.status(201).json(incident);
});

// ----------------------------------------------------------------------------
// Staff Management (Module 14)
// ----------------------------------------------------------------------------
apiRouter.get('/staff', (req: Request, res: Response) => {
  res.json(globalStore.staff);
});

// ----------------------------------------------------------------------------
// Station Resources (Module 15)
// ----------------------------------------------------------------------------
apiRouter.get('/resources', (req: Request, res: Response) => {
  res.json(globalStore.resources);
});

// ----------------------------------------------------------------------------
// Audit Logs (Module 18)
// ----------------------------------------------------------------------------
apiRouter.get('/audit', (req: Request, res: Response) => {
  res.json(globalStore.auditLogs);
});

// ----------------------------------------------------------------------------
// Simulation Controls (Module 7 & 31)
// ----------------------------------------------------------------------------
apiRouter.get('/simulation', (req: Request, res: Response) => {
  res.json({
    running: globalStore.simulationRunning,
    speed: globalStore.simulationSpeed,
    simulatedTime: globalStore.getCurrentSimulatedTime(),
  });
});

apiRouter.post('/simulation/control', (req: Request, res: Response) => {
  const { running, speed, reset } = req.body;
  if (running !== undefined) globalStore.simulationRunning = running;
  if (speed !== undefined) globalStore.simulationSpeed = Number(speed);
  if (reset) {
    globalStore.simulatedMinutes = 14 * 60 + 30;
  }
  res.json({
    running: globalStore.simulationRunning,
    speed: globalStore.simulationSpeed,
    simulatedTime: globalStore.getCurrentSimulatedTime(),
  });
});
