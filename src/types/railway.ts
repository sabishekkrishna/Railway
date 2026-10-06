/**
 * Indian Railways Operations Control & Station Management System
 * Core Domain Types & Data Contracts
 * Academic & Engineering Simulation System
 */

export type UserRole =
  | 'Super Administrator'
  | 'Railway Control Room Operator'
  | 'Station Master'
  | 'Train Controller'
  | 'Platform/Operations Manager'
  | 'Maintenance Engineer'
  | 'Maintenance Technician'
  | 'Emergency Response Officer'
  | 'Railway Security Officer'
  | 'Ticket/Passenger Service Staff'
  | 'Train Driver'
  | 'System Auditor';

export type TrainType =
  | 'Vande Bharat Express'
  | 'Rajdhani Express'
  | 'Shatabdi Express'
  | 'Superfast Express'
  | 'Mail / Express'
  | 'Passenger / MEMU'
  | 'Freight / Container'
  | 'Special Express';

export type TrainCategory = 'Premium' | 'Express' | 'Suburban' | 'Freight' | 'Departmental';

export type TrainStatus =
  | 'Scheduled'
  | 'Approaching'
  | 'Arrived'
  | 'At Platform'
  | 'Departing'
  | 'In Transit'
  | 'Delayed'
  | 'Cancelled'
  | 'Under Maintenance'
  | 'Emergency'
  | 'Completed';

export type PlatformStatus =
  | 'Available'
  | 'Occupied'
  | 'Reserved'
  | 'Under Maintenance'
  | 'Blocked'
  | 'Emergency Use';

export type TrackStatus =
  | 'Free'
  | 'Occupied'
  | 'Reserved'
  | 'Blocked'
  | 'Under Maintenance'
  | 'Emergency Block';

export type SignalAspect = 'RED' | 'YELLOW' | 'DOUBLE YELLOW' | 'GREEN' | 'NOT AVAILABLE';

export type ConflictRisk = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type MaintenanceStatus =
  | 'Healthy'
  | 'Inspection Due'
  | 'Maintenance Scheduled'
  | 'Under Maintenance'
  | 'Critical Issue'
  | 'Maintenance Completed';

export type EmergencyType =
  | 'Train accident'
  | 'Fire'
  | 'Medical emergency'
  | 'Track obstruction'
  | 'Signal failure'
  | 'Power failure'
  | 'Train derailment'
  | 'Flooding'
  | 'Security threat'
  | 'Platform overcrowding'
  | 'Equipment failure';

export type EmergencyStatus =
  | 'Reported'
  | 'Acknowledged'
  | 'Response Team Assigned'
  | 'Responding'
  | 'Under Control'
  | 'Resolved'
  | 'Closed';

export type NotificationPriority = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export interface CoachInfo {
  id: string;
  code: string; // e.g. "LOCO", "EOG", "H1", "A1", "B1", "S1", "GS", "SLR"
  type: string; // "WAP-7", "AC First", "AC 2-Tier", "AC 3-Tier", "Sleeper", "General", "Luggage"
  capacity: number;
  occupancy: number;
}

export interface Train {
  id: string;
  number: string; // e.g. "12002"
  name: string; // e.g. "New Delhi - Bhopal Shatabdi Express"
  type: TrainType;
  category: TrainCategory;
  sourceStation: string;
  destinationStation: string;
  intermediateStations: string[];
  coachesCount: number;
  lengthMeters: number;
  composition: CoachInfo[];
  maxSpeedKmph: number;
  currentSpeedKmph: number;
  status: TrainStatus;
  currentLocation: string; // e.g. "Outer Signal S-02", "Track T-03", "Platform PF-02"
  currentTrackId?: string;
  currentPlatformId?: string;
  direction: 'UP' | 'DOWN'; // UP: towards Delhi, DOWN: away from Delhi
  nextStation: string;
  scheduledArrival: string; // "14:30"
  expectedArrival: string;
  scheduledDeparture: string;
  expectedDeparture: string;
  delayMinutes: number;
  maintenanceStatus: MaintenanceStatus;
  positionPercent: number; // 0 to 100 on the approach/station layout
  driverName?: string;
  locoNumber: string; // e.g. "WAP-7 #30412"
}

export interface Platform {
  id: string;
  number: string; // "1", "2", "3", etc.
  lengthMeters: number; // e.g. 600m
  connectedTrackId: string;
  status: PlatformStatus;
  electrification: boolean; // 25kV OHE
  accessible: boolean; // Escalators / Lifts available
  currentTrainId?: string;
  nextScheduledTrainId?: string;
  clearanceTime?: string;
  amenities: string[];
}

export interface Track {
  id: string; // "T-01"
  number: string; // "Track 1 - Up Main"
  connectedPlatformId?: string;
  direction: 'UP' | 'DOWN' | 'BI-DIRECTIONAL';
  electrification: boolean;
  lengthMeters: number;
  status: TrackStatus;
  currentTrainId?: string;
  condition: 'Optimal' | 'Minor Wear' | 'Caution' | 'Damaged';
  maintenanceStatus: 'None' | 'Scheduled' | 'Active';
  speedRestrictionKmph: number; // Normal line speed or temporary restriction (TSR)
  assignedSignalId: string;
}

export interface Signal {
  id: string; // "S-01"
  name: string; // "Home Signal 1"
  trackId: string;
  aspect: SignalAspect;
  type: 'HOME' | 'ROUTING' | 'STARTER' | 'ADVANCED STARTER' | 'DISTANT';
  autoMode: boolean; // Automatic interlocking control
  lastUpdated: string;
}

export interface Schedule {
  id: string;
  trainId: string;
  trainNumber: string;
  trainName: string;
  arrivalTime: string;
  departureTime: string;
  platformPreference: string;
  trackPreference: string;
  allocatedPlatformId?: string;
  allocatedTrackId?: string;
  journeyDurationMinutes: number;
  stops: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  conflictDetected?: boolean;
  conflictDetails?: string;
}

export interface ConflictAlert {
  id: string;
  timestamp: string;
  risk: ConflictRisk;
  trainAId: string;
  trainANumber: string;
  trainBId?: string;
  trainBNumber?: string;
  trackId?: string;
  platformId?: string;
  estimatedMinutesToConflict: number;
  description: string;
  recommendedAction: string;
  resolved: boolean;
  acknowledged: boolean;
}

export interface TrainTelemetry {
  trainId: string;
  engineTemperatureC: number;
  brakePipePressureBar: number; // 5.0 bar standard
  feedPipePressureBar: number; // 6.0 bar standard
  wheelBogieHuntingMps2: number; // lateral acceleration (< 0.20 optimal)
  axleBoxBearingTempC: number; // < 75 C optimal
  batteryLevelPercent: number;
  doorsLocked: boolean;
  coachTemperatureC: number;
  pantographVoltageKv: number; // 25.0 kV OHE
  gpsLatitude: number;
  gpsLongitude: number;
  lastUpdated: string;
}

export interface MaintenanceWorkOrder {
  id: string;
  trainId: string;
  trainNumber: string;
  issue: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedEngineer: string;
  startDate: string;
  expectedCompletion: string;
  actualCompletion?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  remarks: string;
  component: 'Brakes' | 'Engine' | 'Wheels' | 'Electrical' | 'HVAC' | 'Couplers' | 'OHE Pantograph';
}

export interface EmergencyIncident {
  id: string;
  type: EmergencyType;
  title: string;
  description: string;
  location: string;
  trackId?: string;
  platformId?: string;
  affectedTrainIds: string[];
  reportedAt: string;
  status: EmergencyStatus;
  assignedTeamIds: string[];
  timeline: {
    time: string;
    action: string;
    actor: string;
  }[];
  resolutionNotes?: string;
}

export interface EmergencyTeam {
  id: string;
  name: string;
  type:
    | 'Medical'
    | 'Fire & Rescue'
    | 'Railway Protection Force'
    | 'Railway Police'
    | 'Engineering'
    | 'Electrical'
    | 'Track Maintenance'
    | 'Station Operations';
  currentLocation: string;
  status: 'Available' | 'Dispatched' | 'On Scene' | 'Standby';
  responseMinutes: number;
  contactNumber: string;
  teamLead: string;
  membersCount: number;
  currentIncidentId?: string;
}

export interface Staff {
  id: string;
  employeeId: string; // e.g. "IR-EMP-4019"
  name: string;
  role: UserRole;
  department:
    | 'Traffic / Operating'
    | 'Mechanical'
    | 'Electrical'
    | 'Civil / Track'
    | 'Security / RPF'
    | 'Commercial'
    | 'Safety';
  shift: 'Morning (06:00 - 14:00)' | 'Evening (14:00 - 22:00)' | 'Night (22:00 - 06:00)';
  qualification: string;
  assignedStation: string;
  available: boolean;
  currentAssignment: string;
  phone: string;
}

export interface StationResource {
  id: string;
  name: string;
  category: 'Platform' | 'Track' | 'Signal' | 'Passenger Amenity' | 'Safety' | 'Electrical' | 'Telecom';
  location: string;
  status: 'Operational' | 'Maintenance Required' | 'Degraded' | 'Offline';
  conditionScore: number; // 0 to 100
  lastInspected: string;
  nextInspectionDue: string;
}

export interface AppNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  module: string;
  read: boolean;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  previousValue: string;
  newValue: string;
  ipAddress: string;
}

export interface StationInfo {
  code: string; // "NDLS"
  name: string; // "New Delhi Central Junction"
  division: string; // "Delhi Division, Northern Railway (NR)"
  electrified: boolean;
  platformsCount: number;
  tracksCount: number;
  dailyTrainsAverage: number;
  currentActiveTrains: number;
}

export interface PlatformRecommendation {
  platformId: string;
  platformNumber: string;
  score: number;
  reasoning: string[];
  warnings: string[];
  compatibility: {
    lengthFits: boolean;
    isFree: boolean;
    noUpcomingConflicts: boolean;
    trackAccessible: boolean;
    electrified: boolean;
  };
}

export interface EmergencyScenarioPreset {
  id: string;
  title: string;
  type: EmergencyType;
  description: string;
  location: string;
  trackId?: string;
  platformId?: string;
  trainNumber?: string;
  impactSummary: string;
  protocolWorkflow: string[];
}
