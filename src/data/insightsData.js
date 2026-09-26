// Insights & analytics dataset for Chennai MTC Intelligence Network

export const ROUTE_CONGESTION_TRENDS = [
  { time: '06:00', AnnaSalai: 18, OMR: 22, GST: 25, Poonamallee: 20, InnerRing: 19 },
  { time: '07:00', AnnaSalai: 35, OMR: 42, GST: 48, Poonamallee: 38, InnerRing: 40 },
  { time: '08:00', AnnaSalai: 84, OMR: 92, GST: 89, Poonamallee: 76, InnerRing: 82 },
  { time: '09:00', AnnaSalai: 95, OMR: 98, GST: 94, Poonamallee: 88, InnerRing: 91 },
  { time: '10:00', AnnaSalai: 72, OMR: 85, GST: 78, Poonamallee: 69, InnerRing: 74 },
  { time: '11:00', AnnaSalai: 55, OMR: 62, GST: 60, Poonamallee: 52, InnerRing: 58 },
  { time: '12:00', AnnaSalai: 48, OMR: 54, GST: 52, Poonamallee: 45, InnerRing: 50 },
  { time: '13:00', AnnaSalai: 50, OMR: 56, GST: 54, Poonamallee: 49, InnerRing: 52 },
  { time: '14:00', AnnaSalai: 45, OMR: 50, GST: 48, Poonamallee: 42, InnerRing: 46 },
  { time: '15:00', AnnaSalai: 52, OMR: 60, GST: 58, Poonamallee: 50, InnerRing: 55 },
  { time: '16:00', AnnaSalai: 68, OMR: 76, GST: 72, Poonamallee: 65, InnerRing: 70 },
  { time: '17:00', AnnaSalai: 88, OMR: 94, GST: 90, Poonamallee: 82, InnerRing: 86 },
  { time: '18:00', AnnaSalai: 98, OMR: 99, GST: 96, Poonamallee: 92, InnerRing: 95 },
  { time: '19:00', AnnaSalai: 92, OMR: 96, GST: 91, Poonamallee: 85, InnerRing: 88 },
  { time: '20:00', AnnaSalai: 64, OMR: 72, GST: 68, Poonamallee: 60, InnerRing: 65 },
  { time: '21:00', AnnaSalai: 40, OMR: 45, GST: 42, Poonamallee: 35, InnerRing: 38 },
  { time: '22:00', AnnaSalai: 22, OMR: 25, GST: 24, Poonamallee: 20, InnerRing: 21 }
];

export const OCCUPANCY_HEATMAP = [
  { route: '21G', name: 'Broadway ↔ Tambaram', hours: [40, 65, 115, 120, 85, 60, 55, 50, 52, 60, 80, 110, 125, 115, 75, 45, 30] },
  { route: '570', name: 'Koyambedu ↔ Kelambakkam', hours: [35, 55, 105, 125, 95, 70, 60, 55, 58, 65, 88, 118, 130, 120, 85, 50, 32] },
  { route: '29C', name: 'Perambur ↔ Besant Nagar', hours: [30, 50, 85, 95, 70, 55, 48, 45, 46, 52, 68, 90, 100, 92, 60, 40, 25] },
  { route: '45B', name: 'Anna Square ↔ Guindy Ind.', hours: [45, 70, 110, 118, 90, 65, 58, 52, 54, 62, 82, 108, 122, 110, 70, 42, 28] },
  { route: 'M70', name: 'Velachery ↔ CMBT', hours: [38, 60, 100, 115, 88, 62, 52, 48, 50, 58, 76, 105, 118, 108, 68, 42, 26] },
  { route: '18D', name: 'Broadway ↔ Kilkattalai', hours: [25, 45, 78, 88, 65, 50, 42, 40, 42, 48, 60, 82, 94, 86, 55, 35, 20] },
  { route: '70', name: 'Avadi ↔ Tambaram', hours: [32, 52, 92, 108, 80, 58, 50, 46, 48, 54, 72, 98, 110, 102, 64, 38, 24] },
  { route: 'D70', name: 'Ambattur OT ↔ Velachery', hours: [36, 58, 98, 112, 84, 60, 51, 47, 49, 56, 74, 102, 114, 105, 66, 40, 25] }
];

export const AI_RECOMMENDATIONS = [
  {
    id: 'REC-101',
    route: '21G',
    timeSlot: '8:00 AM - 9:30 AM',
    peakOccupancy: '120%',
    status: 'CRITICAL OVERLOAD',
    action: 'Add 3 extra trips from Broadway to Guindy',
    impact: 'Estimated to reduce crowding by 28% and cut commuter wait times by 6 mins.',
    color: '#EF4444'
  },
  {
    id: 'REC-102',
    route: '570',
    timeSlot: '5:30 PM - 7:30 PM',
    peakOccupancy: '130%',
    status: 'SEVERE OVERLOAD',
    action: 'Deploy 2 Express Electric MTC Buses on OMR IT Corridor',
    impact: 'Will absorb evening tech-park rush from TIDEL Park & Perungudi.',
    color: '#F97316'
  },
  {
    id: 'REC-103',
    route: '45B',
    timeSlot: '8:30 AM - 9:30 AM',
    peakOccupancy: '118%',
    status: 'HIGH LOAD',
    action: 'Short-loop 2 buses between Saidapet and Anna Square',
    impact: 'Improves frequency on congested T. Nagar - Mount Road leg.',
    color: '#EAB308'
  },
  {
    id: 'REC-104',
    route: 'M70',
    timeSlot: '6:00 PM - 7:30 PM',
    peakOccupancy: '118%',
    status: 'HIGH LOAD',
    action: 'Adjust headway from 12 mins to 7 mins on Inner Ring Rd',
    impact: 'Prevents platform overcrowding at Vadapalani & Koyambedu terminals.',
    color: '#3B82F6'
  }
];

// Zone Centroids & Inter-zone Origin Destination arcs
export const ZONE_CENTROIDS = {
  'North': { lat: 13.1112, lng: 80.2489, name: 'North Zone (Perambur)' },
  'Central': { lat: 13.0601, lng: 80.2498, name: 'Central Zone (T. Nagar / Anna Salai)' },
  'South': { lat: 12.9867, lng: 80.2215, name: 'South Zone (Adyar / Guindy)' },
  'OMR/IT corridor': { lat: 12.9345, lng: 80.2365, name: 'OMR Zone (Sholinganallur)' },
  'West': { lat: 13.0512, lng: 80.1945, name: 'West Zone (Koyambedu / Porur)' }
};

export const ZONE_OD_FLOWS = [
  { from: 'North', to: 'Central', tripsPerDay: 48500, label: 'North ➔ Central (48.5K trips/day)' },
  { from: 'Central', to: 'South', tripsPerDay: 62000, label: 'Central ➔ South (62.0K trips/day)' },
  { from: 'South', to: 'OMR/IT corridor', tripsPerDay: 74200, label: 'South ➔ OMR IT (74.2K trips/day)' },
  { from: 'West', to: 'Central', tripsPerDay: 53100, label: 'West ➔ Central (53.1K trips/day)' },
  { from: 'West', to: 'South', tripsPerDay: 41800, label: 'West ➔ South (41.8K trips/day)' },
  { from: 'North', to: 'West', tripsPerDay: 32400, label: 'North ➔ West (32.4K trips/day)' }
];
