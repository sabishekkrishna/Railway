/**
 * Indian Railways Operations Control & Station Management System (IR-OCC & IR-SMS)
 * Station Master & Operational Control Terminal
 * Complete integrated suite supporting station operations at NDLS and section control.
 */

import React, { useState } from 'react';
import { RailwayProvider, useRailway } from './context/RailwayContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuditBanner } from './components/common/AuditBanner';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// Station Master Modules
import { StationInterlockingView } from './modules/station/StationInterlockingView';
import { PlatformAllocation } from './modules/platforms/PlatformAllocation';
import { StationTimetableView } from './modules/station/StationTimetableView';
import { PassengerDashboard } from './modules/dashboard/PassengerDashboard';
import { StationEmergencyView } from './modules/station/StationEmergencyView';

// OCC Desks & Operational Modules
import { ControlRoomDashboard } from './modules/dashboard/ControlRoomDashboard';
import { StationMasterDashboard } from './modules/dashboard/StationMasterDashboard';
import { AdminDashboard } from './modules/dashboard/AdminDashboard';
import { StationMapVisualizer } from './modules/stationMap/StationMapVisualizer';
import { TrainManagement } from './modules/trains/TrainManagement';
import { TrainScheduling } from './modules/schedules/TrainScheduling';
import { TrackManagement } from './modules/tracks/TrackManagement';
import { SignalSimulation } from './modules/signals/SignalSimulation';
import { TrainMovement } from './modules/movement/TrainMovement';
import { CollisionPrevention } from './modules/collision/CollisionPrevention';
import { EmergencyManagement } from './modules/emergency/EmergencyManagement';
import { ScenarioSimulator } from './modules/simulation/ScenarioSimulator';
import { TrainMaintenance } from './modules/maintenance/TrainMaintenance';
import { TrainHealthSensors } from './modules/sensors/TrainHealthSensors';
import { StationResources } from './modules/resources/StationResources';
import { DelayManagement } from './modules/delays/DelayManagement';
import { StaffManagement } from './modules/staff/StaffManagement';
import { AIDecisionSupport } from './modules/aiDecision/AIDecisionSupport';
import { ReportsAnalytics } from './modules/reports/ReportsAnalytics';
import { AuditLogViewer } from './modules/audit/AuditLogViewer';

const MainContent: React.FC = () => {
  const { activeTab } = useRailway();
  const [showNotifications, setShowNotifications] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      // Station Master Operations
      case 'station-interlocking':
        return <StationInterlockingView />;
      case 'platforms':
        return <PlatformAllocation />;
      case 'timetable':
        return <StationTimetableView />;
      case 'passenger-pids':
        return <PassengerDashboard />;
      case 'emergency':
      case 'station-emergency':
        return <StationEmergencyView />;

      // Operational Desks
      case 'control-room':
        return <ControlRoomDashboard />;
      case 'station-master':
        return <StationMasterDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;

      // Traffic & Interlocking
      case 'station-map':
        return <StationMapVisualizer />;
      case 'trains':
        return <TrainManagement />;
      case 'schedules':
        return <TrainScheduling />;
      case 'tracks':
        return <TrackManagement />;
      case 'signals':
        return <SignalSimulation />;
      case 'movement':
        return <TrainMovement />;

      // Safety & Emergency
      case 'collision':
        return <CollisionPrevention />;
      case 'emergency-ops':
        return <EmergencyManagement />;
      case 'scenarios':
        return <ScenarioSimulator />;

      // Rolling Stock & Assets
      case 'maintenance':
        return <TrainMaintenance />;
      case 'sensors':
        return <TrainHealthSensors />;
      case 'resources':
        return <StationResources />;

      // Coordination & Intelligence
      case 'delays':
        return <DelayManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'ai-decision':
        return <AIDecisionSupport />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'audit':
        return <AuditLogViewer />;

      default:
        return <StationInterlockingView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Navbar */}
      <Navbar
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        showNotifications={showNotifications}
      />

      {/* Safety & Academic Disclaimer Banner */}
      <AuditBanner />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />

        <main className="flex-1 overflow-hidden relative bg-slate-950">
          {renderActiveModule()}
        </main>

        <NotificationDrawer
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <RailwayProvider>
      <MainContent />
    </RailwayProvider>
  );
}
