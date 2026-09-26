// src/data/vehicles.js
// Enterprise Origin-Destination (OD) and Vehicle Classification dataset for Chennai

export const TRAFFIC_ZONES = [
  { id: 'north', name: 'North Zone', area: 'Perambur / Tondiarpet', lat: 13.1150, lng: 80.2550, color: '#1A73E8' },
  { id: 'central', name: 'Central District', area: 'T. Nagar / Egmore', lat: 13.0420, lng: 80.2350, color: '#E8710A' },
  { id: 'south', name: 'South Zone', area: 'Adyar / Velachery / Guindy', lat: 12.9950, lng: 80.2150, color: '#188038' },
  { id: 'omr', name: 'OMR IT Corridor', area: 'Sholinganallur / Perungudi', lat: 12.9100, lng: 80.2280, color: '#7C3AED' },
  { id: 'west', name: 'West Zone', area: 'Porur / Koyambedu / Ambattur', lat: 13.0650, lng: 80.1900, color: '#0369A1' }
];

export const VEHICLE_CLASSES = [
  { id: 'car', label: 'Cars & SUVs', color: '#1A73E8' },
  { id: 'two_wheeler', label: 'Two-Wheelers', color: '#0369A1' },
  { id: 'auto_rickshaw', label: 'Auto Rickshaws', color: '#E8710A' },
  { id: 'bus', label: 'Buses (MTC/Private)', color: '#188038' },
  { id: 'truck', label: 'Commercial Trucks', color: '#D93025' },
  { id: 'bicycle', label: 'Bicycles', color: '#7C3AED' },
  { id: 'pedestrian', label: 'Pedestrians', color: '#64748B' }
];

// Today's Citywide Aggregated Classification Totals (KPIs)
export const TODAY_VEHICLE_KPIS = [
  {
    id: 'car',
    name: 'Cars & SUVs',
    count: 384200,
    share: '31.0%',
    change: '+4.2%',
    isPositive: true,
    hourlyTrend: [8200, 14500, 31200, 38500, 26400, 21100, 20400, 23200, 27800, 36900, 39800, 31200, 22100, 15400, 9300, 5200]
  },
  {
    id: 'two_wheeler',
    name: 'Two-Wheelers',
    count: 545600,
    share: '44.0%',
    change: '+2.8%',
    isPositive: true,
    hourlyTrend: [12400, 22100, 44800, 51200, 38900, 32100, 31400, 34200, 39100, 49800, 53200, 42100, 31200, 21400, 14100, 8600]
  },
  {
    id: 'auto_rickshaw',
    name: 'Auto Rickshaws',
    count: 136400,
    share: '11.0%',
    change: '-1.1%',
    isPositive: false,
    hourlyTrend: [2400, 5100, 10200, 12800, 11400, 10800, 10200, 10900, 11600, 12900, 13100, 11400, 8900, 6200, 4500, 2400]
  },
  {
    id: 'bus',
    name: 'Buses (MTC)',
    count: 74400,
    share: '6.0%',
    change: '+0.5%',
    isPositive: true,
    hourlyTrend: [1800, 3400, 6200, 7100, 5800, 5100, 4900, 5200, 5600, 6900, 7200, 5900, 4200, 2900, 1800, 1000]
  },
  {
    id: 'truck',
    name: 'Commercial Trucks',
    count: 49600,
    share: '4.0%',
    change: '-3.4%',
    isPositive: false,
    hourlyTrend: [4100, 4800, 3200, 2100, 2800, 3400, 3800, 3900, 3600, 2900, 2400, 3100, 3800, 4200, 4100, 3200]
  }
];

// Zone Vehicle Class Composition Data for Stacked Bar Chart
export const ZONE_CLASS_COMPOSITION = [
  {
    zoneId: 'north',
    zoneName: 'North Zone',
    shortName: 'North',
    car: 42000,
    two_wheeler: 115000,
    auto_rickshaw: 28000,
    bus: 14000,
    truck: 34000,
    bicycle: 8000,
    pedestrian: 4000
  },
  {
    zoneId: 'central',
    zoneName: 'Central District',
    shortName: 'Central',
    car: 64000,
    two_wheeler: 168000,
    auto_rickshaw: 58000,
    bus: 22000,
    truck: 9000,
    bicycle: 9000,
    pedestrian: 6000
  },
  {
    zoneId: 'south',
    zoneName: 'South Zone',
    shortName: 'South',
    car: 98000,
    two_wheeler: 114000,
    auto_rickshaw: 22000,
    bus: 16000,
    truck: 7000,
    bicycle: 5000,
    pedestrian: 3000
  },
  {
    zoneId: 'omr',
    zoneName: 'OMR IT Corridor',
    shortName: 'OMR Corridor',
    car: 112000,
    two_wheeler: 94000,
    auto_rickshaw: 12000,
    bus: 12000,
    truck: 5000,
    bicycle: 3000,
    pedestrian: 2000
  },
  {
    zoneId: 'west',
    zoneName: 'West Zone',
    shortName: 'West',
    car: 68200,
    two_wheeler: 134600,
    auto_rickshaw: 28400,
    bus: 18400,
    truck: 14600,
    bicycle: 7200,
    pedestrian: 4600
  }
];

// Donut Chart Citywide Split (7 classes)
export const CITYWIDE_DONUT_DATA = [
  { name: 'Two-Wheelers', value: 545600, percentage: 44.0, color: '#0369A1' },
  { name: 'Cars & SUVs', value: 384200, percentage: 31.0, color: '#1A73E8' },
  { name: 'Auto Rickshaws', value: 136400, percentage: 11.0, color: '#E8710A' },
  { name: 'Buses (MTC)', value: 74400, percentage: 6.0, color: '#188038' },
  { name: 'Trucks & LCVs', value: 49600, percentage: 4.0, color: '#D93025' },
  { name: 'Bicycles', value: 32200, percentage: 2.5, color: '#7C3AED' },
  { name: 'Pedestrians', value: 19600, percentage: 1.5, color: '#64748B' }
];

// Origin-Destination (OD) Matrix Data for 3 Time Slots
export const OD_TIME_SLOTS = [
  { id: 'morning', label: 'Morning Peak (7-10 AM)', description: 'Heavy commute towards OMR IT Corridor & South employment hubs' },
  { id: 'midday', label: 'Midday Off-Peak (11 AM-3 PM)', description: 'Balanced intra-city commercial, logistics, and retail traffic' },
  { id: 'evening', label: 'Evening Peak (5-8 PM)', description: 'Reverse commute from employment hubs back to residential zones' }
];

// 5x5 Matrix values per time slot (Origins = rows, Destinations = cols)
// Zones order: ['north', 'central', 'south', 'omr', 'west']
export const OD_MATRICES = {
  morning: [
    [0,     4200,  3100,  6800,  2100], // North -> [North, Central, South, OMR, West]
    [2400,  0,     5600,  8900,  3400], // Central -> ...
    [1900,  4100,  0,     7400,  2800], // South -> ...
    [1200,  2100,  3200,  0,     1500], // OMR -> ...
    [3100,  6200,  5400,  9200,  0]    // West -> ...
  ],
  midday: [
    [0,     3400,  2200,  2800,  2900],
    [3200,  0,     4800,  3900,  4200],
    [2100,  4500,  0,     3800,  3100],
    [1800,  3200,  3600,  0,     2100],
    [2800,  4100,  3200,  2900,  0]
  ],
  evening: [
    [0,     2800,  2100,  1400,  3200], // North
    [4800,  0,     4200,  2200,  6500], // Central
    [3800,  5900,  0,     3100,  5200], // South
    [7200,  9400,  7800,  0,     8900], // OMR -> Reverse massive commute home
    [2400,  3900,  2900,  1800,  0]     // West
  ]
};

// Generates OD Flow Arc objects for Map Rendering based on selected time slot
export const getODFlowArcs = (timeSlotKey) => {
  const matrix = OD_MATRICES[timeSlotKey] || OD_MATRICES.morning;
  const arcs = [];
  const timeLabel = OD_TIME_SLOTS.find(t => t.id === timeSlotKey)?.label || 'Peak Hours';

  TRAFFIC_ZONES.forEach((origin, rIdx) => {
    TRAFFIC_ZONES.forEach((dest, cIdx) => {
      if (rIdx === cIdx) return; // Skip intra-zone
      const volume = matrix[rIdx][cIdx];
      if (volume < 2000) return; // Only render significant flows to keep map clean

      // Determine curved control point
      const midLat = (origin.lat + dest.lat) / 2;
      const midLng = (origin.lng + dest.lng) / 2;
      const dLat = dest.lat - origin.lat;
      const dLng = dest.lng - origin.lng;

      // Curve clockwise slightly
      const curvature = 0.22;
      const controlLat = midLat - dLng * curvature;
      const controlLng = midLng + dLat * curvature;

      // Generate 20 interpolation points for smooth quadratic Bezier curve
      const points = [];
      const steps = 20;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = (1 - t) * (1 - t) * origin.lat + 2 * (1 - t) * t * controlLat + t * t * dest.lat;
        const lng = (1 - t) * (1 - t) * origin.lng + 2 * (1 - t) * t * controlLng + t * t * dest.lng;
        points.push([lat, lng]);
      }

      arcs.push({
        id: `${origin.id}_to_${dest.id}`,
        fromZone: origin.name,
        toZone: dest.name,
        fromArea: origin.area,
        toArea: dest.area,
        fromCoord: [origin.lat, origin.lng],
        toCoord: [dest.lat, dest.lng],
        points,
        volume,
        timeLabel,
        arrowPos: points[Math.floor(steps * 0.75)]
      });
    });
  });

  return arcs;
};

// Road Segments for Vehicle Density & Congestion Overlay
export const ROAD_DENSITY_SEGMENTS = [
  {
    id: 'seg-omr-1',
    name: 'OMR IT Corridor (Tidal Park to Sholinganallur)',
    zone: 'OMR IT Corridor',
    densityVph: 4850,
    speedKmph: 14,
    status: 'High Density',
    color: '#D93025',
    path: [
      [12.9892, 80.2481],
      [12.9642, 80.2441],
      [12.9321, 80.2361],
      [12.9012, 80.2278]
    ]
  },
  {
    id: 'seg-anna-salai',
    name: 'Anna Salai (Gemini Flyover to Guindy Kathipara)',
    zone: 'Central District',
    densityVph: 4320,
    speedKmph: 18,
    status: 'High Density',
    color: '#D93025',
    path: [
      [13.0526, 80.2514],
      [13.0345, 80.2389],
      [13.0189, 80.2221],
      [13.0067, 80.2021]
    ]
  },
  {
    id: 'seg-inner-ring',
    name: '100ft Inner Ring Road (Koyambedu to Kathipara)',
    zone: 'West Zone',
    densityVph: 4100,
    speedKmph: 21,
    status: 'High Density',
    color: '#E8710A',
    path: [
      [13.0694, 80.1948],
      [13.0505, 80.2121],
      [13.0289, 80.2089],
      [13.0067, 80.2021]
    ]
  },
  {
    id: 'seg-ph-road',
    name: 'Poonamallee High Road (Aminjikarai to Dasaprakash)',
    zone: 'West Zone',
    densityVph: 3650,
    speedKmph: 24,
    status: 'Medium Density',
    color: '#E8710A',
    path: [
      [13.0768, 80.2189],
      [13.0789, 80.2412],
      [13.0812, 80.2589]
    ]
  },
  {
    id: 'seg-velachery-mr',
    name: 'Velachery Main Road (Guindy to Tambaram Bypass)',
    zone: 'South Zone',
    densityVph: 3800,
    speedKmph: 19,
    status: 'High Density',
    color: '#E8710A',
    path: [
      [13.0067, 80.2021],
      [12.9812, 80.2189],
      [12.9645, 80.2156]
    ]
  },
  {
    id: 'seg-gnt-road',
    name: 'GNT Road (Vyasarpadi to Padi Flyover)',
    zone: 'North Zone',
    densityVph: 3100,
    speedKmph: 28,
    status: 'Moderate Density',
    color: '#F9AB00',
    path: [
      [13.1118, 80.2612],
      [13.1045, 80.2312],
      [13.0912, 80.1989]
    ]
  },
  {
    id: 'seg-ecr',
    name: 'East Coast Road (Thiruvanmiyur to Akkarai)',
    zone: 'South Zone',
    densityVph: 2150,
    speedKmph: 42,
    status: 'Low Density',
    color: '#188038',
    path: [
      [12.9812, 80.2589],
      [12.9412, 80.2581],
      [12.8912, 80.2498]
    ]
  }
];

// Top Congestion Bottlenecks (Requirement 8)
export const TOP_BOTTLENECKS = [
  {
    id: 'bot-1',
    rank: 1,
    name: 'Kathipara Junction Flyover',
    zone: 'South Zone',
    speedDropPercent: 68,
    peakHours: '08:00 - 10:30 & 17:30 - 20:30',
    densityVph: 4850,
    lat: 13.0067,
    lng: 80.2021,
    severity: 'Critical'
  },
  {
    id: 'bot-2',
    rank: 2,
    name: 'Tidal Park Junction (OMR)',
    zone: 'OMR IT Corridor',
    speedDropPercent: 62,
    peakHours: '08:30 - 10:30 & 17:00 - 19:30',
    densityVph: 4320,
    lat: 12.9892,
    lng: 80.2481,
    severity: 'Critical'
  },
  {
    id: 'bot-3',
    rank: 3,
    name: 'Koyambedu Roundtana (CMBT)',
    zone: 'West Zone',
    speedDropPercent: 58,
    peakHours: '07:30 - 10:00 & 17:00 - 21:00',
    densityVph: 4100,
    lat: 13.0694,
    lng: 80.1948,
    severity: 'High'
  },
  {
    id: 'bot-4',
    rank: 4,
    name: 'Anna Flyover (Gemini Circle)',
    zone: 'Central District',
    speedDropPercent: 54,
    peakHours: '08:30 - 10:30 & 18:00 - 20:00',
    densityVph: 3950,
    lat: 13.0526,
    lng: 80.2514,
    severity: 'High'
  },
  {
    id: 'bot-5',
    rank: 5,
    name: 'Vadapalani Signal (Arcot Road)',
    zone: 'West Zone',
    speedDropPercent: 51,
    peakHours: '09:00 - 11:00 & 17:30 - 19:30',
    densityVph: 3600,
    lat: 13.0505,
    lng: 80.2121,
    severity: 'Medium'
  },
  {
    id: 'bot-6',
    rank: 6,
    name: 'Vyasarpadi Flyover',
    zone: 'North Zone',
    speedDropPercent: 47,
    peakHours: '08:00 - 10:00 & 17:30 - 19:30',
    densityVph: 3250,
    lat: 13.1118,
    lng: 80.2612,
    severity: 'Medium'
  }
];

// Transit Route Travel Delays (Requirement 7)
export const ROUTE_DELAYS = [
  {
    routeId: 'Route 570',
    routeName: 'CMBT (Koyambedu) ↔ OMR Kelambakkam',
    corridor: 'OMR IT Corridor',
    scheduledMin: 62,
    actualMin: 84,
    delayMin: 22,
    trend: 'Worsening (+5m)',
    trendType: 'negative',
    severity: 'Critical',
    impactedSegments: ['Tidal Park Jct', 'Sholinganallur']
  },
  {
    routeId: 'Route 21G',
    routeName: 'Broadway ↔ Tambaram (via Anna Salai)',
    corridor: 'Central District',
    scheduledMin: 55,
    actualMin: 71,
    delayMin: 16,
    trend: 'Worsening (+3m)',
    trendType: 'negative',
    severity: 'High',
    impactedSegments: ['Gemini Flyover', 'Saidapet']
  },
  {
    routeId: 'Route 70',
    routeName: 'Avadi ↔ Velachery (via Inner Ring Road)',
    corridor: 'West -> South',
    scheduledMin: 70,
    actualMin: 92,
    delayMin: 22,
    trend: 'Worsening (+7m)',
    trendType: 'negative',
    severity: 'Critical',
    impactedSegments: ['Koyambedu', 'Kathipara']
  },
  {
    routeId: 'Route 19B',
    routeName: 'Saidapet ↔ Siruseri IT Park',
    corridor: 'OMR IT Corridor',
    scheduledMin: 50,
    actualMin: 68,
    delayMin: 18,
    trend: 'Stable',
    trendType: 'neutral',
    severity: 'High',
    impactedSegments: ['Perungudi', 'SIPCOT']
  },
  {
    routeId: 'Route 47A',
    routeName: 'ICF (Perambur) ↔ Besant Nagar',
    corridor: 'North -> South',
    scheduledMin: 48,
    actualMin: 58,
    delayMin: 10,
    trend: 'Stable',
    trendType: 'neutral',
    severity: 'Medium',
    impactedSegments: ['Kilpauk', 'Adyar Signal']
  },
  {
    routeId: 'Route 5B',
    routeName: 'T. Nagar ↔ Mylapore',
    corridor: 'Central District',
    scheduledMin: 25,
    actualMin: 31,
    delayMin: 6,
    trend: 'Improving (-2m)',
    trendType: 'positive',
    severity: 'Low',
    impactedSegments: ['Luz Corner']
  }
];
