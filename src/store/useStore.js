import { create } from 'zustand';
import { DEFECTS_DATA } from '../data/defectsData';
import { MISSING_INFRA_DATA } from '../data/missingInfraData';
import { INCIDENTS_DATA } from '../data/incidentsData';
import { LIVE_BUSES } from '../data/busesData';
import { CITY_CONFIG } from '../config/cityConfig';

export const useStore = create((set, get) => ({
  // Core Navigation & UI State
  activeTab: (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('tab')) || 'command', // 'command' | 'defects' | 'missing' | 'insights' | 'incidents' | '3d-view'
  themeMode: 'light', // 'light' by default | 'dark'
  searchQuery: '',
  detailDrawerOpen: false,
  sidebarOpen: false, // Collapsible enterprise sidebar
  sidebarPinned: false, // Pin button state
  selectedItem: null, // Selected defect, infra item, or incident
  selectedItemType: null, // 'defect' | 'missing' | 'incident'

  // Map Controls
  mapViewport: { center: CITY_CONFIG.center, zoom: CITY_CONFIG.defaultZoom },
  mapStyle: 'streets', // 'streets' | 'standard' | 'satellite' | 'lightGray'
  mapInstance: null,
  flyToTarget: null, // { lat, lng, zoom, timestamp }
  showLiveBuses: true,
  showHeatmap: false, // OFF by default per enterprise GIS specification
  showClustering: true,
  showCongestionOverlay: true,

  // Traffic Management State
  trafficMapMode: 'density', // 'density' | 'congestion'
  odTimeSlot: 'morning', // 'morning' | 'midday' | 'evening'
  showOdArcs: true,
  setTrafficMapMode: (mode) => set({ trafficMapMode: mode }),
  setOdTimeSlot: (slot) => set({ odTimeSlot: slot }),
  toggleShowOdArcs: () => set((state) => ({ showOdArcs: !state.showOdArcs })),

  // Main Datasets (with mutation capability for status updates)
  defects: DEFECTS_DATA,
  missingInfra: MISSING_INFRA_DATA,
  incidents: INCIDENTS_DATA,
  buses: LIVE_BUSES,

  // Road Defects Filters
  defectFilters: {
    types: ['Pothole', 'Longitudinal crack', 'Transverse crack', 'Alligator crack', 'Rutting/Depression', 'Waterlogging', 'Broken edge', 'Manhole/Debris'],
    severities: ['Low', 'Medium', 'High', 'Critical'],
    statuses: ['New', 'Open', 'Under Repair', 'Resolved', 'Verified Closed'],
    zones: ['North', 'Central', 'South', 'OMR/IT corridor', 'West'],
    dateRange: '7d' // 'Today' | '7d' | '30d'
  },

  // Missing Infrastructure Filters
  infraFilters: {
    category: 'All', // 'All' | category ID
    statuses: ['OK', 'DEGRADED', 'MISSING', 'UNMAPPED'],
    source: 'All', // 'All' | 'OSM Tags' | 'IRC Rule' | 'Fleet Baseline'
    confidenceThreshold: 70
  },

  // Work Orders & Alerts
  workOrders: [],
  notifications: [
    { id: 1, title: 'Critical Defect Detected', message: 'Pothole DEF-2014 on Anna Salai flagged by 4 transit fleet cameras.', time: '2 mins ago', severity: 'Critical' },
    { id: 2, title: 'Missing Zebra Crossing', message: 'Kathipara approach missing crossing in 4 consecutive passes.', time: '14 mins ago', severity: 'High' },
    { id: 3, title: 'Hit and Run Alert', message: 'Vehicle TN 09 AB 1234 flagged at Thousand Lights signal.', time: '35 mins ago', severity: 'Critical' }
  ],
  unreadAlertCount: 3,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab, detailDrawerOpen: false, selectedItem: null }),
  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleThemeMode: () => set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarPinned: () => set((state) => ({ sidebarPinned: !state.sidebarPinned, sidebarOpen: !state.sidebarPinned })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  openDetailDrawer: (item, type) => set({
    selectedItem: item,
    selectedItemType: type,
    detailDrawerOpen: true,
    flyToTarget: { lat: item.lat || item.expectedLat, lng: item.lng || item.expectedLng, zoom: 15, timestamp: Date.now() }
  }),

  closeDetailDrawer: () => set({ detailDrawerOpen: false }),

  flyTo: (lat, lng, zoom = 15) => set({
    flyToTarget: { lat, lng, zoom, timestamp: Date.now() }
  }),

  toggleLiveBuses: () => set((state) => ({ showLiveBuses: !state.showLiveBuses })),
  toggleHeatmap: () => set((state) => ({ showHeatmap: !state.showHeatmap })),
  toggleClustering: () => set((state) => ({ showClustering: !state.showClustering })),
  toggleCongestionOverlay: () => set((state) => ({ showCongestionOverlay: !state.showCongestionOverlay })),
  setMapStyle: (style) => set({ mapStyle: style }),
  setMapInstance: (instance) => set({ mapInstance: instance }),

  // Defect Filter Actions
  setDefectTypes: (types) => set((state) => ({ defectFilters: { ...state.defectFilters, types } })),
  setDefectSeverities: (severities) => set((state) => ({ defectFilters: { ...state.defectFilters, severities } })),
  setDefectStatuses: (statuses) => set((state) => ({ defectFilters: { ...state.defectFilters, statuses } })),
  setDefectZones: (zones) => set((state) => ({ defectFilters: { ...state.defectFilters, zones } })),
  setDefectDateRange: (dateRange) => set((state) => ({ defectFilters: { ...state.defectFilters, dateRange } })),

  // Missing Infra Filter Actions
  setInfraCategory: (category) => set((state) => ({ infraFilters: { ...state.infraFilters, category } })),
  setInfraStatuses: (statuses) => set((state) => ({ infraFilters: { ...state.infraFilters, statuses } })),
  setInfraSource: (source) => set((state) => ({ infraFilters: { ...state.infraFilters, source } })),
  setInfraConfidenceThreshold: (confidenceThreshold) => set((state) => ({ infraFilters: { ...state.infraFilters, confidenceThreshold } })),

  // Status Lifecycle Update
  updateDefectStatus: (defectId, newStatus) => set((state) => {
    const updatedDefects = state.defects.map(d => d.id === defectId ? { ...d, status: newStatus } : d);
    const updatedSelected = state.selectedItem?.id === defectId ? { ...state.selectedItem, status: newStatus } : state.selectedItem;
    return { defects: updatedDefects, selectedItem: updatedSelected };
  }),

  updateInfraStatus: (infraId, newStatus) => set((state) => {
    const updatedInfra = state.missingInfra.map(i => i.id === infraId ? { ...i, status: newStatus } : i);
    const updatedSelected = state.selectedItem?.id === infraId ? { ...state.selectedItem, status: newStatus } : state.selectedItem;
    return { missingInfra: updatedInfra, selectedItem: updatedSelected };
  }),

  // Incident Footage Request action
  requestIncidentFootage: (incidentId, busId) => set((state) => {
    const updatedIncidents = state.incidents.map(inc => {
      if (inc.id === incidentId) {
        const updatedBuses = inc.nearbyBuses.map(b => b.busId === busId ? { ...b, footageRequested: true } : b);
        return { ...inc, nearbyBuses: updatedBuses };
      }
      return inc;
    });
    const updatedSelected = state.selectedItem?.id === incidentId ? updatedIncidents.find(inc => inc.id === incidentId) : state.selectedItem;
    return { incidents: updatedIncidents, selectedItem: updatedSelected };
  }),

  // Work Order action
  addWorkOrder: (item) => set((state) => {
    if (state.workOrders.some(w => w.id === item.id)) return state;
    const newWorkOrder = {
      id: item.id,
      title: item.type || item.category,
      location: item.locationName,
      road: item.roadName,
      createdDate: new Date().toLocaleDateString(),
      status: 'DISPATCHED_TO_ZONE'
    };
    return { workOrders: [...state.workOrders, newWorkOrder] };
  }),

  // Add Live Event Notification
  addLiveNotification: (notif) => set((state) => ({
    notifications: [notif, ...state.notifications],
    unreadAlertCount: state.unreadAlertCount + 1
  })),

  clearNotifications: () => set({ unreadAlertCount: 0 })
}));
