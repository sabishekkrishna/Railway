/**
 * Indian Railways Station Management System (IR-SMS)
 * Station Master & Operational Control Terminal
 * Designed specifically for station operations management at New Delhi (NDLS)
 */

import React, { useState } from 'react';
import { RailwayProvider, useRailway } from './context/RailwayContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuditBanner } from './components/common/AuditBanner';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// 5 Essential Station Management Modules
import { StationInterlockingView } from './modules/station/StationInterlockingView';
import { PlatformAllocation } from './modules/platforms/PlatformAllocation';
import { StationTimetableView } from './modules/station/StationTimetableView';
import { PassengerDashboard } from './modules/dashboard/PassengerDashboard';
import { StationEmergencyView } from './modules/station/StationEmergencyView';

const MainContent: React.FC = () => {
  const { activeTab } = useRailway();
  const [showNotifications, setShowNotifications] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'station-interlocking':
        return <StationInterlockingView />;
      case 'platforms':
        return <PlatformAllocation />;
      case 'timetable':
        return <StationTimetableView />;
      case 'passenger-pids':
        return <PassengerDashboard />;
      case 'emergency':
        return <StationEmergencyView />;
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
