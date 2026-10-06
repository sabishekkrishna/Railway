# System Architecture & Technical Specifications

## 1. Architectural Philosophy

The **IR-OCC** system is built on a modular, event-driven architecture designed to emulate a centralized Railway Operations Control Centre (OCC). Operational components remain decoupled while communicating through shared data contracts, standardized REST APIs, and a central reactive store.

```
+-----------------------------------------------------------------------------------+
|                           INDIAN RAILWAYS OCC SYSTEM                              |
+-----------------------------------------------------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                                                   |
+-------v-------+                                                   +-------v-------+
|  CLIENT (SPA) |                                                   | BACKEND (API) |
+---------------+                                                   +---------------+
| React 19 UI   | <------- REST API & Simulation Sync (1s tick) --->| Express Server|
| State Context |                                                   | Store Engine  |
| Interlocking  |                                                   | Interlocking  |
| Audio Synth   |                                                   | Conflict Det. |
+---------------+                                                   +---------------+
        |                                                                   |
        +---------------------------------+---------------------------------+
                                          |
                      +-------------------v-------------------+
                      |   CENTRAL RELATIONAL DATA SCHEMAS     |
                      | Trains, Platforms, Tracks, Signals,   |
                      | Schedules, Work Orders, Emergencies   |
                      +---------------------------------------+
```

---

## 2. Main Operational Pipeline

The system enforces a strict operational workflow:

```
TRAIN SCHEDULE
      ↓
PLATFORM ALLOCATION (Intelligent Scoring)
      ↓
TRACK ALLOCATION (Interlocking Check)
      ↓
SIGNAL SIMULATION (MACLS Aspect Automation)
      ↓
TRAIN MOVEMENT (Throttle, GPS, Approach)
      ↓
REAL-TIME MONITORING (Track Circuits & Sensors)
      ↓
CONFLICT DETECTION (Spatial Scanning & Risk Scoring)
      ↓
ALERT / INCIDENT RESPONSE (Automated Holds & ART Dispatch)
      ↓
ARRIVAL / DEPARTURE (Platform Clearing & Turnaround)
      ↓
MAINTENANCE / REPORTING (C&W Work Orders & Punctuality KPIs)
```

---

## 3. Module Breakdown

### 1. Interlocking & Signalling Engine
- Operates under Indian Railways Multi-Aspect Colour Light Signalling (MACLS) rules.
- **Fail-Safe Principle**: Any track circuit occupation, point detection loss, or manual emergency block immediately drops entry signals to Danger (RED).
- Starters, Home, Routing, and Distant signals dynamically reflect block section reservations.

### 2. Platform Allocation Algorithm
Evaluates candidate platforms through weighted criteria:
$$\text{Score} = \text{Base} + S_{\text{length}} + S_{\text{status}} + S_{\text{track}} + S_{\text{traction}} + S_{\text{prestige}} - P_{\text{conflict}}$$
- Rake length $\le$ Platform length: $+25$ (failure: $-50$ and blocks allocation)
- Platform Free: $+30$
- Interlocking clear: $+15$
- 25kV OHE live: $+10$
- Schedule overlap: $-25$

### 3. Collision Prevention Engine
Performs continuous scans over:
1. $T_{\text{occupancy}}$: Detecting simultaneous occupation by $> 1$ rake.
2. $T_{\text{headway}}$: Approaching trains on intersecting crossover switch paths.
3. $T_{\text{opposing}}$: UP and DOWN trains registered on the same section (Head-on risk).
4. $T_{\text{block}}$: Entry into active Emergency Block sections.

Generates risk classifications: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` with calculated minutes-to-conflict and actionable mitigation actions.

### 4. Emergency Response Architecture
- Incident lifecycle: `Reported` $\to$ `Acknowledged` $\to$ `Response Team Assigned` $\to$ `Responding` $\to$ `Under Control` $\to$ `Resolved` $\to$ `Closed`.
- Automatic interlocking action: Immediately locks affected track, turns upstream signals to RED, and alerts nearest available unit (MRV, ART, Fire Brigade, RPF).

---

## 4. Audio Synthesis Subsystem
To ensure zero external asset latency and maximum reliability, the station chime is synthesized client-side via the browser's `AudioContext`:
- Chime notes: $G_4$ ($392.0\text{ Hz}$), $B_4$ ($493.88\text{ Hz}$), $D_5$ ($587.33\text{ Hz}$), $G_5$ ($783.99\text{ Hz}$).
- Alarm cues: Sawtooth and triangle modulated waves for conflict warnings and evacuation sirens.
