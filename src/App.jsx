import React, { Suspense, lazy } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { MapView } from './components/MapView';
import { DetailDrawer } from './components/DetailDrawer';
import { LayoutDashboard, AlertTriangle, EyeOff, BarChart3, ShieldAlert, Box, Car } from 'lucide-react';

const CommandCenterPage = lazy(() => import('./pages/CommandCenterPage'));
const RoadDefectsPage = lazy(() => import('./pages/RoadDefectsPage'));
const MissingInfraPage = lazy(() => import('./pages/MissingInfraPage'));
const TrafficPage = lazy(() => import('./pages/TrafficPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const IncidentsPage = lazy(() => import('./pages/IncidentsPage'));
const ThreeDViewPage = lazy(() => import('./pages/ThreeDViewPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full bg-slate-50 dark:bg-slate-900 text-slate-500 text-sm">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span>Loading module...</span>
    </div>
  </div>
);

export function App() {
  const { activeTab, themeMode } = useStore();

  const pageMeta = {
    command: { label: 'Overview', icon: LayoutDashboard },
    defects: { label: 'Road Defects', icon: AlertTriangle },
    missing: { label: 'Missing Infrastructure', icon: EyeOff },
    traffic: { label: 'Traffic Management', icon: Car },
    insights: { label: 'Insights', icon: BarChart3 },
    incidents: { label: 'Incidents', icon: ShieldAlert },
    '3d-view': { label: '3D City View', icon: Box }
  };

  const current = pageMeta[activeTab] || pageMeta.command;
  const CurrentIcon = current.icon;

  return (
    <div className={`w-screen h-screen flex overflow-hidden select-none ${themeMode === 'dark' ? 'dark' : ''}`}>
      {/* ENTERPRISE COLLAPSIBLE SIDEBAR ONLY (NO TOP NAVBAR) */}
      <Sidebar />

      {/* GLOBAL DETAIL DRAWER MODAL */}
      <DetailDrawer />

      {/* MAIN CONTAINER: MAP IS HERO, PANELS FLOAT OVER MAP */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* Leaflet Base Map Layer (Active for all Leaflet 2D pages) */}
        {activeTab !== '3d-view' && <MapView />}

        {/* CURRENT PAGE TITLE AS SMALL WHITE CHIP FLOATING AT TOP-LEFT OF MAP */}
        {activeTab !== 'insights' && activeTab !== '3d-view' && activeTab !== 'traffic' && (
          <div className="absolute top-3 left-[76px] z-30 pointer-events-auto">
            <div className="enterprise-card px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-[#0F172A] dark:text-slate-100 shadow-sm">
              <CurrentIcon className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>{current.label}</span>
            </div>
          </div>
        )}

        {/* ACTIVE TAB OVERLAY PAGES */}
        <Suspense fallback={<PageLoader />}>
          {activeTab === 'command' && <CommandCenterPage />}
          {activeTab === 'defects' && <RoadDefectsPage />}
          {activeTab === 'missing' && <MissingInfraPage />}
          {activeTab === 'traffic' && <TrafficPage />}
          {activeTab === 'insights' && <InsightsPage />}
          {activeTab === 'incidents' && <IncidentsPage />}
          {activeTab === '3d-view' && <ThreeDViewPage />}
        </Suspense>
      </main>
    </div>
  );
}

export default App;


