# Relational Database Design & Schema Specifications

## 1. Entity-Relationship Overview

The database models Indian Railways station operations using a normalized relational architecture:

```
[Station] 1 --- * [Platform] 1 --- 1 [Track] 1 --- 1 [Signal]
    |                  |                 |               |
    |                  *                 *               |
    |            [PlatformAllocation] [TrackReservation] |
    |                  |                 |               |
    *                  *                 *               *
 [Schedule] * ------- 1 [Train] 1 ------ * [TrainMovement]
    |                     |
    |                     +--- * [CoachInfo]
    |                     +--- 1 [TrainTelemetry]
    |                     +--- * [MaintenanceWorkOrder]
    |
 [EmergencyIncident] * --- * [EmergencyTeam]
    |
 [AuditLog]
```

---

## 2. Table Definitions

### `Train`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(64) PRIMARY KEY | Unique train ID (e.g. `TR-12002`) |
| `number` | VARCHAR(10) UNIQUE | Indian Railways 5-digit number (e.g. `12002`) |
| `name` | VARCHAR(128) | Official name (e.g. `Bhopal Shatabdi Express`) |
| `type` | VARCHAR(64) | Vande Bharat, Rajdhani, Shatabdi, Superfast, Freight |
| `category` | VARCHAR(32) | Premium, Express, Suburban, Freight |
| `sourceStation` | VARCHAR(64) | Originating station (e.g. `New Delhi (NDLS)`) |
| `destinationStation` | VARCHAR(64) | Terminating station (e.g. `Rani Kamlapati`) |
| `coachesCount` | INTEGER | Number of coaches in rake (e.g. `16`) |
| `lengthMeters` | INTEGER | Physical rake length in meters (e.g. `410`) |
| `maxSpeedKmph` | INTEGER | Maximum permissible speed (e.g. `150`) |
| `currentSpeedKmph` | INTEGER | Real-time simulated speed |
| `status` | VARCHAR(32) | At Platform, Approaching, In Transit, Delayed, etc. |
| `currentTrackId` | VARCHAR(32) | FK to `Track` |
| `currentPlatformId` | VARCHAR(32) | FK to `Platform` |
| `direction` | VARCHAR(8) | `UP` (towards Delhi) or `DOWN` |
| `scheduledArrival` | TIME | Timetable arrival time |
| `delayMinutes` | INTEGER | Current operational delay in minutes |
| `locoNumber` | VARCHAR(64) | Locomotive number & shed (e.g. `WAP-7 #30412`) |

### `Platform`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(32) PRIMARY KEY | Platform ID (e.g. `PF-01`) |
| `number` | VARCHAR(8) | Platform number (1 to 8) |
| `lengthMeters` | INTEGER | Usable platform length (e.g. `640`) |
| `connectedTrackId` | VARCHAR(32) | FK to `Track` |
| `status` | VARCHAR(32) | Available, Occupied, Reserved, Maintenance, Emergency |
| `electrification` | BOOLEAN | 25kV AC overhead catenary live |
| `accessible` | BOOLEAN | Escalator & Divyangjan lift installed |
| `currentTrainId` | VARCHAR(64) | FK to `Train` (current occupant) |

### `Track`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(32) PRIMARY KEY | Track ID (e.g. `T-01` to `T-12`) |
| `number` | VARCHAR(64) | Track section description |
| `direction` | VARCHAR(16) | `UP`, `DOWN`, `BI-DIRECTIONAL` |
| `status` | VARCHAR(32) | Free, Occupied, Reserved, Maintenance, Emergency Block |
| `speedRestrictionKmph` | INTEGER | Current maximum line speed / TSR |
| `assignedSignalId` | VARCHAR(32) | FK to `Signal` |

### `Signal`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(32) PRIMARY KEY | Signal ID (e.g. `S-01`) |
| `trackId` | VARCHAR(32) | FK to `Track` |
| `aspect` | VARCHAR(16) | `RED`, `YELLOW`, `DOUBLE YELLOW`, `GREEN` |
| `type` | VARCHAR(32) | `HOME`, `ROUTING`, `STARTER`, `ADVANCED STARTER`, `DISTANT` |
| `autoMode` | BOOLEAN | Automatic route relay interlocking enabled |

### `MaintenanceWorkOrder`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(32) PRIMARY KEY | Work order ID (e.g. `WO-101`) |
| `trainId` | VARCHAR(64) | FK to `Train` |
| `component` | VARCHAR(32) | Brakes, Engine, Wheels, Electrical, HVAC, Couplers |
| `priority` | VARCHAR(16) | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `assignedEngineer` | VARCHAR(64) | Designated engineer |
| `status` | VARCHAR(16) | `PENDING`, `IN_PROGRESS`, `COMPLETED` |

### `EmergencyIncident`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(32) PRIMARY KEY | Incident ID (e.g. `INC-101`) |
| `type` | VARCHAR(32) | Fire, Track obstruction, Collision risk, Medical, etc. |
| `location` | VARCHAR(128) | Physical location |
| `trackId` | VARCHAR(32) | Affected track ID |
| `status` | VARCHAR(32) | Reported, Responding, Under Control, Resolved, Closed |
