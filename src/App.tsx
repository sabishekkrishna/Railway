/**
 * Indian Railways Operations Control & Station Management System (IR-OCC)
 * Academic & Engineering Simulation System
 */

import React, { useState } from 'react';
import { RailwayProvider, useRailway } from './context/RailwayContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuditBanner } from './components/common/AuditBanner';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// Module Components
import { ControlRoomDashboard } from './modules/dashboard/ControlRoomDashboard';
import { StationMasterDashboard } from './modules/dashboard/StationMasterDashboard';
import { AdminDashboard } from './modules/dashboard/AdminDashboard';
import { PassengerDashboard } from './modules/dashboard/PassengerDashboard';
import { StationMapVisualizer } from './modules/stationMap/StationMapVisualizer';
import { TrainManagement } from './modules/trains/TrainManagement';
import { TrainScheduling } from './modules/schedules/TrainScheduling';
import { PlatformAllocation } from './modules/platforms/PlatformAllocation';
import { TrackManagement } from './modules/tracks/TrackManagement';
import { SignalSimulation } from './modules/signals/SignalSimulation';
import { TrainMovement } from './modules/movement/TrainMovement';
import { CollisionPrevention } from './modules/collision/CollisionPrevention';
import { TrainMaintenance } from './modules/maintenance/TrainMaintenance';
import { TrainHealthSensors } from './modules/sensors/TrainHealthSensors';
import { EmergencyManagement } from './modules/emergency/EmergencyManagement';
import { ScenarioSimulator } from './modules/simulation/ScenarioSimulator';
import { DelayManagement } from './modules/delays/DelayManagement';
import { StaffManagement } from './modules/staff/StaffManagement';
import { StationResources } from './modules/resources/StationResources';
import { ReportsAnalytics } from './modules/reports/ReportsAnalytics';
import { AuditLogViewer } from './modules/audit/AuditLogViewer';
import { AIDecisionSupport } from './modules/aiDecision/AIDecisionSupport';

const MainContent: React.FC = () => {
  const { activeTab } = useRailway();
  const [showNotifications, setShowNotifications] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'control-room':
        return <ControlRoomDashboard />;
      case 'station-master':
        return <StationMasterDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'passenger-pids':
        return <PassengerDashboard />;
      case 'station-map':
        return <StationMapVisualizer />;
      case 'trains':
        return <TrainManagement />;
      case 'schedules':
        return <TrainScheduling />;
      case 'platforms':
        return <PlatformAllocation />;
      case 'tracks':
        return <TrackManagement />;
      case 'signals':
        return <SignalSimulation />;
      case 'movement':
        return <TrainMovement />;
      case 'collision':
        return <CollisionPrevention />;
      case 'maintenance':
        return <TrainMaintenance />;
      case 'sensors':
        return <TrainHealthSensors />;
      case 'emergency':
        return <EmergencyManagement />;
      case 'scenarios':
        return <ScenarioSimulator />;
      case 'delays':
        return <DelayManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'resources':
        return <StationResources />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'audit':
        return <AuditLogViewer />;
      case 'ai-decision':
        return <AIDecisionSupport />;
      default:
        return <ControlRoomDashboard />;
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
