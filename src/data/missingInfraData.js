// 60+ Expected vs Detected Missing Infrastructure items across Chennai corridors

export const INFRA_CATEGORIES = [
  { id: 'Zebra Crossings', label: 'Zebra Crossings', icon: 'Footprints', description: 'Pedestrian markings & IRC safety standard crossings' },
  { id: 'Road Dividers', label: 'Road Dividers', icon: 'Columns', description: 'Median barriers, reflector studs & concrete segregation' },
  { id: 'Traffic Signs', label: 'Traffic Signs', icon: 'Octagon', description: 'Mandatory, warning, & speed limit signage (IRC:67)' },
  { id: 'Lane Markings', label: 'Lane Markings', icon: 'Maximize2', description: 'Solid/dashed lane boundary lines (IRC:35)' },
  { id: 'School-Zone Safety', label: 'School-Zone Safety', icon: 'GraduationCap', description: 'School warning zone signs, speed breakers & yellow lines' }
];

export const INFRA_STATUSES = [
  { id: 'OK', label: 'OK / Verified Present', color: '#22C55E', bg: 'bg-emerald-500/20 text-emerald-400' },
  { id: 'DEGRADED', label: 'Degraded / Faded', color: '#F59E0B', bg: 'bg-amber-500/20 text-amber-400' },
  { id: 'MISSING', label: 'Missing / Non-Existent', color: '#EF4444', bg: 'bg-red-500/20 text-red-400' },
  { id: 'UNMAPPED', label: 'Unmapped / Detected Candidate', color: '#3B82F6', bg: 'bg-blue-500/20 text-blue-400' }
];

export const SOURCES = ['OSM Tags', 'IRC Rule', 'Fleet Baseline'];

// Real locations along Chennai corridors for infra mapping
const INFRA_LOCATIONS = [
  { name: 'Kathipara Junction Approach (Airport Side)', lat: 13.0072, lng: 80.2018, zone: 'South', road: 'GST Road' },
  { name: 'OMR Perungudi Toll Plaza Approach', lat: 12.9638, lng: 80.2452, zone: 'OMR/IT corridor', road: 'Rajiv Gandhi Salai' },
  { name: 'Anna Salai near Thousand Lights Metro Station', lat: 13.0598, lng: 80.2492, zone: 'Central', road: 'Anna Salai' },
  { name: 'Anna Salai near Gemini Flyover Pedestrian Ramp', lat: 13.0485, lng: 80.2418, zone: 'Central', road: 'Anna Salai' },
  { name: 'Velachery Bypass near Phoenix Marketcity Gate', lat: 12.9789, lng: 80.2228, zone: 'South', road: 'Velachery Main Rd' },
  { name: 'Guindy Railway Station Bus Stop Ramp', lat: 13.0115, lng: 80.2212, zone: 'South', road: 'Velachery Main Rd' },
  { name: 'Koyambedu Roundtana West Approach', lat: 13.0715, lng: 80.1942, zone: 'West', road: 'Poonamallee High Rd' },
  { name: '100 Feet Rd Vadapalani Forum Mall Crossing', lat: 13.0515, lng: 80.2108, zone: 'West', road: '100 Feet Inner Ring Rd' },
  { name: 'OMR Sholinganallur Junction Pedestrian Path', lat: 12.9015, lng: 80.2278, zone: 'OMR/IT corridor', road: 'Rajiv Gandhi Salai' },
  { name: 'GST Road opposite MIT Chromepet', lat: 12.9521, lng: 80.1405, zone: 'South', road: 'GST Road' },
  { name: 'Poonamallee High Rd near Kilpauk Medical College', lat: 13.0772, lng: 80.2408, zone: 'Central', road: 'Poonamallee High Rd' },
  { name: 'Perambur Railway High Rd School Zone', lat: 13.1115, lng: 80.2485, zone: 'North', road: 'Perambur High Rd' },
  { name: 'ECR Thiruvanmiyur Signal Turn', lat: 12.9870, lng: 80.2608, zone: 'South', road: 'East Coast Road' },
  { name: 'Porur Junction near Ramachandra Hospital Gate', lat: 13.0348, lng: 80.1585, zone: 'West', road: 'Mount-Poonamallee Rd' },
  { name: 'T. Nagar South Usman Rd Pedestrian Zone', lat: 13.0415, lng: 80.2315, zone: 'Central', road: 'South Usman Rd' }
];

export const MISSING_INFRA_DATA = [];

for (let i = 1; i <= 64; i++) {
  const loc = INFRA_LOCATIONS[(i - 1) % INFRA_LOCATIONS.length];
  const latOffset = (Math.cos(i * 2.1) * 0.0028);
  const lngOffset = (Math.sin(i * 1.9) * 0.0028);

  const category = INFRA_CATEGORIES[(i - 1) % INFRA_CATEGORIES.length].id;
  
  let status = 'MISSING';
  if (i % 5 === 0) status = 'OK';
  else if (i % 3 === 0) status = 'DEGRADED';
  else if (i % 7 === 0) status = 'UNMAPPED';

  const source = SOURCES[i % SOURCES.length];
  const ruleBadge = category === 'Traffic Signs' ? 'IRC:67-2012' : 
                    category === 'Lane Markings' ? 'IRC:35-2015' : 
                    category === 'School-Zone Safety' ? 'IRC:99-1988' : 'OSM: highway=crossing';

  let expectedLat = Number((loc.lat + latOffset).toFixed(6));
  let expectedLng = Number((loc.lng + lngOffset).toFixed(6));

  // Snap to road and clamp coordinates so none fall in the Bay of Bengal
  if (expectedLat >= 13.04 && expectedLng > 80.280) expectedLng = 80.278;
  if (expectedLat >= 12.95 && expectedLat < 13.04 && expectedLng > 80.264) expectedLng = 80.259;
  if (expectedLat < 12.95 && expectedLng > 80.254) expectedLng = 80.250;

  // If status is MISSING, detected point is null or distant
  // If DEGRADED / OK / UNMAPPED, detected point is nearby (e.g. 5m - 18m offset)
  const isDetected = status !== 'MISSING';
  const offsetDistMeters = isDetected ? Number((4 + (i * 3) % 15).toFixed(1)) : 0;
  
  const detectedLat = isDetected ? Number((expectedLat + 0.00012).toFixed(6)) : null;
  const detectedLng = isDetected ? Number((expectedLng + 0.00014).toFixed(6)) : null;

  MISSING_INFRA_DATA.push({
    id: `INF-${1000 + i}`,
    category: category,
    status: status,
    locationName: `${loc.name}`,
    roadName: loc.road,
    zone: loc.zone,
    image: (function() {
      if (category === 'Road Dividers') {
        if (status === 'MISSING' || status === 'UNMAPPED') return i % 2 === 0 ? '/evidence/divider_missing_1.jpg' : '/evidence/divider_missing_5.jpg';
        if (status === 'DEGRADED') return '/evidence/divider_missing_2.jpg';
        return i % 2 === 0 ? '/evidence/divider_missing_3.jpg' : '/evidence/divider_missing_4.jpg'; // OK status: divider present
      }
      if (category === 'Zebra Crossings' || category === 'School-Zone Safety') {
        const zebraImages = ['/evidence/zebra_faded_1.jpg', '/evidence/zebra_faded_2.jpg', '/evidence/zebra_faded_3.jpg', '/evidence/zebra_faded_4.jpg'];
        return zebraImages[(i - 1) % zebraImages.length];
      }
      if (category === 'Traffic Signs') {
        const signImages = ['/evidence/sign_damaged_1.jpg', '/evidence/sign_damaged_2.jpg', '/evidence/sign_damaged_3.jpg'];
        return signImages[(i - 1) % signImages.length];
      }
      const trafficImages = ['/evidence/vehicle_traffic_1.jpg', '/evidence/vehicle_traffic_2.jpg', '/evidence/vehicle_traffic_3.jpg', '/evidence/vehicle_traffic_4.jpg'];
      return trafficImages[(i - 1) % trafficImages.length];
    })(),
    expectedSource: source,
    ruleBadge: ruleBadge,
    expectedLat: expectedLat,
    expectedLng: expectedLng,
    detectedLat: detectedLat,
    detectedLng: detectedLng,
    distanceOffsetMeters: offsetDistMeters,
    confidence: Number((82 + (i % 16) + Math.random() * 0.8).toFixed(1)),
    passesChecked: `${Math.min(6, 3 + (i % 4))} of ${Math.min(6, 3 + (i % 4))} fleet passes`,
    lastCameraPass: `2026-09-23 17:${String((i * 7) % 60).padStart(2, '0')}`,
    busesWitnessed: ['BUS-21G-04', 'BUS-570-19', 'BUS-29C-12'].slice(0, 1 + (i % 3)),
    nearSchool: category === 'School-Zone Safety' || i % 4 === 0,
    schoolName: (category === 'School-Zone Safety' || i % 4 === 0) ? 'St. Michael Higher Secondary & Hospital' : null,
    explanation: status === 'MISSING' 
      ? `Expected ${category} mandated by ${ruleBadge} missing across all ${Math.min(6, 3 + (i % 4))} camera runs in past 7 days.` 
      : status === 'DEGRADED' 
      ? `Faded ${category} detected with only 42% retroreflectivity. Requires repaint/restoration.`
      : status === 'UNMAPPED'
      ? `Camera AI detected high-volume zebra crossing not currently tagged in municipal GIS database.`
      : `Verified compliant and clearly visible by fleet cameras.`,
    suggestedAction: status === 'MISSING'
      ? `Issue Work Order to Zone Road Maintenance for immediate ${category} installation.`
      : status === 'DEGRADED'
      ? `Schedule night-shift thermoplastic painting crew.`
      : status === 'UNMAPPED'
      ? `Approve addition of newly identified infrastructure to municipal GIS map.`
      : `No action required. Monitor weekly.`
  });
}

// Zone compliance calculation helper
export function getZoneComplianceScores(items) {
  const zones = ['North', 'Central', 'South', 'OMR/IT corridor', 'West'];
  return zones.map(z => {
    const zoneItems = items.filter(item => item.zone === z);
    if (zoneItems.length === 0) return { zone: z, score: 100, ok: 0, total: 0 };
    const okCount = zoneItems.filter(item => item.status === 'OK').length;
    const degradedCount = zoneItems.filter(item => item.status === 'DEGRADED').length;
    const total = zoneItems.length;
    // Score weighted
    const score = Math.round(((okCount + (degradedCount * 0.5)) / total) * 100);
    return { zone: z, score, ok: okCount, total };
  });
}
