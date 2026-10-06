# Indian Railways Operations Control & Station Management System (IR-OCC)

> **ACADEMIC & SOFTWARE ENGINEERING SIMULATION PROJECT**  
> *Notice: This application simulates Indian Railways (IR) station interlocking, platform scheduling, route clearance, collision prevention, and emergency response workflows for academic, research, and training purposes. It is **NOT** suitable, certified, or intended for controlling real-world railway signalling, interlocking, or safety-critical infrastructure.*

---

## 1. Project Overview

The **Indian Railways Operations Control & Station Management System (IR-OCC)** is an enterprise-grade full-stack simulation platform modeling operations at **New Delhi Central Junction (NDLS)**, Northern Railway (Delhi Division).

The system integrates 20 independent operational modules sharing unified state, relational data structures, and role-based access control (RBAC). It provides real-time situational awareness for station masters, section controllers, traction engineers, RPF security commanders, and passenger public address operators.

---

## 2. Key Features

- **Route Relay Interlocking (RRI) & MACLS**: Multi-aspect colour light signalling (Red, Yellow, Double Yellow, Green) driven by track circuit occupancy and point detection.
- **Interactive Interlocking Station Diagram**: Interactive SVG map of 8 platforms, 12 track circuits (Up/Down main lines, loop lines, coaching yard, freight bypass), and crossover switches.
- **Intelligent Platform Allocation**: Rule-based algorithm calculating multi-factor scores (rake length, platform clearance, catenary feed, schedule buffer, VIP concourse access) with explainable reasoning.
- **Continuous Collision & Conflict Prevention**: Continuous safety scanning detecting dual track occupancy, opposing head-on movements, rear-end headway closures, and unauthorized entry into emergency blocks.
- **Train Movement Simulation**: Throttle and position simulation across approach, platform halt, passenger boarding, and section clearance, with simulated GPS coordinates.
- **Emergency Management & Disaster Simulation Lab**: 8 preset failure scenarios (train collision risk, platform fire, track obstruction, signal interlocking failure, WAP-7 traction failure, monsoon waterlogging, cardiac medical emergency, 25kV OHE power blackout) with automated SOP workflows.
- **Rolling Stock Maintenance & IoT Telemetry**: Carriage & Wagon (C&W) work order issuance alongside real-time sensor streams (traction motor temperature, brake pipe 5.0 bar, feed pipe 6.0 bar, bogie hunting stability, hot-axle box bearings).
- **Passenger Information Display System (PIDS)**: Split-flap/LED station departure board with bilingual (Hindi & English) toggle, coach composition guides (LOCO-EOG-H1-A1-B1-S1-SLR), and synthesized Indian Railways 4-tone station chime.
- **Cascading Delay Propagation Analyzer**: Predicts downstream delay ripples across shared platform slots and turnaround rakes.
- **12 Operational User Roles (RBAC)**: Switch between Super Admin, Station Master, Train Controller, Maintenance Engineer, Emergency Officer, Loco Pilot, and System Auditor.
- **Tamper-Proof Audit Trail**: Cryptographically structured event logging for every operational action.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Web Audio API
- **Backend**: Node.js, Express, tsx
- **Development & Build**: Vite, Vite Middlewares (Full-stack dev server on Port 3000)
- **AI / Decision Support**: Google GenAI TypeScript SDK (`@google/genai`) and rule-based heuristic optimization

---

## 4. Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd railway-station-management

# Install dependencies
npm install
```

### Environment Variables
Configure `.env` using `.env.example`:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm start
```

---

## 5. User Roles & Access Control

| Role | Key Capabilities |
| :--- | :--- |
| **Super Administrator (DRM)** | Full system configuration, macro divisional KPIs, policy overrides |
| **Railway Control Room Operator** | Mainline panel monitoring, emergency track blocks, signal clearance |
| **Station Master** | Platform berthing, passenger announcements, local caution orders |
| **Train Controller** | Block section headway, speed throttling, train arrival scheduling |
| **Platform / Operations Manager** | Platform inspections, passenger crowd flow, escalator & lift monitoring |
| **Maintenance Engineer (Sr. DME)** | C&W work order issuance, pit line scheduling, wheel lathe inspection |
| **Maintenance Technician** | Brake pipe leakage tests, pantograph carbon strip inspection |
| **Emergency Response Officer (DSO)** | Accident Relief Train (ART) dispatch, disaster protocol command |
| **Railway Security Officer (RPF)** | Concourse CCTV surveillance, anti-sabotage track inspections |
| **Ticket / Passenger Service Staff** | Solari PIDS departure boards, enquiry desks, Divyangjan assistance |
| **Train Driver (Loco Pilot)** | Locomotive throttle, regenerative braking, aspect compliance |
| **System Auditor** | Inspection of SPAD (Signal Passed At Danger) and interlocking logs |

---

## 6. Simulation Instructions

1. **Simulation Ticker**: Use the top navigation controls to Pause/Play and adjust simulation speed (`1x`, `2x`, `5x`, `10x`).
2. **Injecting Failures**: Navigate to **Safety & Emergency > Scenario Simulator** and click *Inject Scenario* on any of the 8 presets.
3. **Resolving Conflicts**: View active alerts on the Control Room or Collision Prevention dashboard; click *Execute Recommended Action* to automatically hold or divert trains.
4. **Auto-Allocating Platforms**: Under **Interlocking & Movement > Platform Allocation**, select an incoming train and click *Auto Allocate Platform* to see the algorithmic score and rationale.
5. **Station Announcements**: Open the **Station Master Desk** or **Passenger Display (PIDS)** and click the broadcast button to hear the 4-tone gong with bilingual speech synthesis.

---

## 7. Testing Instructions

Run TypeScript compilation and static verification:
```bash
npm run lint
npm run build
```
Verification scenarios tested:
- Concurrent dual-occupancy on track circuits triggers CRITICAL conflict alert.
- Exceeding platform rake length (> 600m) blocks allocation with descriptive error.
- Emergency track block immediately turns associated entry signals to Danger (RED).
- Delayed train cascades ripple delay warnings to following services.
