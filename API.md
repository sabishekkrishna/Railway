# REST API Documentation & Endpoints

All endpoints are hosted under `/api`. Standard JSON payloads and HTTP status codes are returned.

---

## 1. Station & High-Level Telemetry
- `GET /api/status`
  - Returns overall station operational health, active trains count, platforms count, delayed trains count, active conflicts, and simulated time.

---

## 2. Train Management
- `GET /api/trains`
  - Returns list of all trains.
- `GET /api/trains/:id`
  - Returns specific train details.
- `POST /api/trains`
  - Register new train. Requires `number`, `name`, `type`, `sourceStation`, `destinationStation`.
- `PUT /api/trains/:id`
  - Update train details.
- `POST /api/trains/:id/status`
  - Update train status (e.g. `Approaching`, `At Platform`, `Departing`, `Delayed`).
- `DELETE /api/trains/:id`
  - Deactivate train rake.

---

## 3. Platform Allocation
- `GET /api/platforms`
  - Returns list of all 8 platforms and their occupancy.
- `GET /api/platforms/recommend/:trainId`
  - Evaluates all platforms against train parameters using the explainable multi-factor scoring algorithm. Returns optimal platform and score breakdown.
- `POST /api/platforms/allocate`
  - Body: `{ trainId: string, platformId: string }`
  - Allocates platform to train with conflict and rake length validation.

---

## 4. Track Management
- `GET /api/tracks`
  - Returns all 12 track circuits, directions, speed limits, and statuses.
- `POST /api/tracks/:id/status`
  - Body: `{ status: string, speedRestrictionKmph?: number }`
  - Changes track state (e.g. `Free`, `Reserved`, `Under Maintenance`, `Emergency Block`).

---

## 5. Collision Prevention
- `GET /api/conflicts`
  - Runs collision detection algorithm and returns active conflict alerts.
- `POST /api/conflicts/:id/execute-action`
  - Automatically holds train, adjusts signals, and executes recommended anti-collision action.

---

## 6. Signals
- `GET /api/signals`
  - Returns list of all signals with their current aspect and interlocking mode.
- `POST /api/signals/:id/aspect`
  - Body: `{ aspect: "RED" | "YELLOW" | "DOUBLE YELLOW" | "GREEN", autoMode?: boolean }`
  - Manual override signal aspect.

---

## 7. Maintenance & Telemetry
- `GET /api/maintenance/work-orders`
  - Returns all active and completed C&W work orders.
- `POST /api/maintenance/work-orders`
  - Create new maintenance work order.
- `GET /api/sensors/telemetry`
  - Real-time IoT sensor telemetry readings for all locomotives and rakes.

---

## 8. Emergency Management
- `GET /api/emergencies`
  - Returns active and historic emergency incidents.
- `POST /api/emergencies`
  - Report new emergency incident.
- `GET /api/emergencies/teams`
  - Returns all 7 emergency response units and availability.
- `POST /api/emergencies/scenarios/trigger`
  - Body: `{ scenarioId: string }`
  - Injects one of the 8 preset disaster/failure scenarios.

---

## 9. Simulation Controls
- `GET /api/simulation`
  - Returns running status, speed multiplier (1x, 2x, 5x, 10x), and simulated time.
- `POST /api/simulation/control`
  - Body: `{ running?: boolean, speed?: number, reset?: boolean }`
  - Play, pause, adjust speed, or reset to baseline 14:30 IST state.
