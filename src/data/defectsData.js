// 120+ realistic road defect events in Greater Chennai along transit corridors

export const DEFECT_TYPES = [
  { id: 'Pothole', label: 'Pothole', icon: 'CircleDot', color: '#EF4444' },
  { id: 'Longitudinal crack', label: 'Longitudinal Crack', icon: 'Split', color: '#F97316' },
  { id: 'Transverse crack', label: 'Transverse Crack', icon: 'MinusHorizontal', color: '#EAB308' },
  { id: 'Alligator crack', label: 'Alligator Crack', icon: 'Grid', color: '#F59E0B' },
  { id: 'Rutting/Depression', label: 'Rutting / Depression', icon: 'MoveDown', color: '#8B5CF6' },
  { id: 'Waterlogging', label: 'Waterlogging', icon: 'Droplets', color: '#06B6D4' },
  { id: 'Broken edge', label: 'Broken Edge', icon: 'Scissors', color: '#EC4899' },
  { id: 'Manhole/Debris', label: 'Manhole / Debris', icon: 'AlertOctagon', color: '#6366F1' }
];

export const ZONES = [
  { id: 'North', name: 'North Chennai', areas: ['Perambur', 'Tondiarpet', 'Vyasarpadi', 'Retteri'] },
  { id: 'Central', name: 'Central Chennai', areas: ['T. Nagar', 'Egmore', 'Thousand Lights', 'Anna Salai', 'Nungambakkam'] },
  { id: 'South', name: 'South Chennai', areas: ['Adyar', 'Velachery', 'Guindy', 'Thiruvanmiyur', 'Saidapet'] },
  { id: 'OMR/IT corridor', name: 'OMR / IT Corridor', areas: ['Sholinganallur', 'Perungudi', 'Taramani', 'Siruseri'] },
  { id: 'West', name: 'West Chennai', areas: ['Porur', 'Koyambedu', 'Ambattur', 'Mogappair', 'Maduravoyal'] }
];

export const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
export const STATUSES = ['New', 'Open', 'Under Repair', 'Resolved', 'Verified Closed'];

// Formula for Priority Score calculation
export function calculatePriorityScore(defect) {
  const severityMap = { 'Low': 0.25, 'Medium': 0.5, 'High': 0.8, 'Critical': 1.0 };
  const trafficMap = { 'Low': 0.3, 'Medium': 0.6, 'High': 0.85, 'Extreme': 1.0 };

  const sWeight = severityMap[defect.severity] || 0.5;
  const dWeight = Math.min(defect.detectionCount || 1, 20) / 20;
  const daysWeight = Math.min(defect.daysUnresolved || 1, 30) / 30;
  const tWeight = trafficMap[defect.trafficVolume] || 0.6;
  const schoolBonus = defect.nearSchool ? 10 : 0;

  const score = (sWeight * 30) + (dWeight * 20) + (daysWeight * 20) + (tWeight * 20) + schoolBonus;
  return Math.min(100, Math.max(12, Math.round(score)));
}

// Key curated landmarks & locations along corridors with precise lat/lng
const LANDMARKS = [
  // Anna Salai / Central
  { name: 'Anna Salai near Thousand Lights Mosque', lat: 13.0601, lng: 80.2498, zone: 'Central', road: 'Anna Salai' },
  { name: 'Anna Salai near Gemini Flyover Junction', lat: 13.0489, lng: 80.2421, zone: 'Central', road: 'Anna Salai' },
  { name: 'Anna Salai opposite LIC Building', lat: 13.0694, lng: 80.2642, zone: 'Central', road: 'Anna Salai' },
  { name: 'Anna Salai near Saidapet Signal', lat: 13.0335, lng: 80.2304, zone: 'South', road: 'Anna Salai' },
  { name: 'Kathipara Cloverleaf Underpass', lat: 13.0067, lng: 80.2021, zone: 'South', road: 'GST Road' },
  
  // GST Road
  { name: 'GST Road near Airport Cargo Terminal', lat: 12.9815, lng: 80.1634, zone: 'South', road: 'GST Road' },
  { name: 'GST Road near Pallavaram Signal', lat: 12.9667, lng: 80.1472, zone: 'South', road: 'GST Road' },
  { name: 'GST Road opposite MIT Gate Chromepet', lat: 12.9518, lng: 80.1408, zone: 'South', road: 'GST Road' },
  { name: 'GST Road near Tambaram Sanatorium Station', lat: 12.9249, lng: 80.1275, zone: 'South', road: 'GST Road' },
  { name: 'Tambaram Bus Terminus Exit Road', lat: 12.9229, lng: 80.1174, zone: 'South', road: 'GST Road' },

  // OMR
  { name: 'OMR near Madhya Kailash Junction', lat: 13.0073, lng: 80.2526, zone: 'South', road: 'Rajiv Gandhi Salai' },
  { name: 'OMR opposite TIDEL Park Taramani', lat: 12.9875, lng: 80.2482, zone: 'OMR/IT corridor', road: 'Rajiv Gandhi Salai' },
  { name: 'OMR near Perungudi Toll Plaza', lat: 12.9634, lng: 80.2458, zone: 'OMR/IT corridor', road: 'Rajiv Gandhi Salai' },
  { name: 'OMR near Sholinganallur Junction', lat: 12.9012, lng: 80.2274, zone: 'OMR/IT corridor', road: 'Rajiv Gandhi Salai' },
  { name: 'OMR Navalur SIPCOT Entrance', lat: 12.8274, lng: 80.2185, zone: 'OMR/IT corridor', road: 'Rajiv Gandhi Salai' },

  // ECR
  { name: 'ECR near Thiruvanmiyur RTA Signal', lat: 12.9867, lng: 80.2604, zone: 'South', road: 'East Coast Road' },
  { name: 'ECR opposite Kottivakkam Beach Rd', lat: 12.9612, lng: 80.2598, zone: 'South', road: 'East Coast Road' },
  { name: 'ECR near Neelankarai Police Station', lat: 12.9498, lng: 80.2592, zone: 'South', road: 'East Coast Road' },
  { name: 'ECR Akkarai Junction approach', lat: 12.9094, lng: 80.2558, zone: 'South', road: 'East Coast Road' },

  // Poonamallee High
  { name: 'Poonamallee High Rd near Dasaprakash', lat: 13.0784, lng: 80.2536, zone: 'Central', road: 'Poonamallee High Rd' },
  { name: 'Poonamallee High Rd near Kilpauk Hospital', lat: 13.0768, lng: 80.2412, zone: 'Central', road: 'Poonamallee High Rd' },
  { name: 'Poonamallee High Rd near Aminjikarai Toll', lat: 13.0745, lng: 80.2189, zone: 'West', road: 'Poonamallee High Rd' },
  { name: 'Koyambedu Roundtana Junction', lat: 13.0712, lng: 80.1945, zone: 'West', road: 'Inner Ring Road' },
  { name: 'Poonamallee High Rd Maduravoyal Flyover', lat: 13.0567, lng: 80.1489, zone: 'West', road: 'Poonamallee High Rd' },

  // Inner Ring
  { name: 'Ashok Pillar Junction 100 Feet Rd', lat: 13.0345, lng: 80.2123, zone: 'West', road: '100 Feet Inner Ring Rd' },
  { name: 'Vadapalani Junction near Forum Mall', lat: 13.0512, lng: 80.2112, zone: 'West', road: '100 Feet Inner Ring Rd' },
  { name: 'Koyambedu Market Bus Exit', lat: 13.0725, lng: 80.1962, zone: 'West', road: '100 Feet Inner Ring Rd' },
  { name: 'Padi Flyover North Approach', lat: 13.0924, lng: 80.1989, zone: 'North', road: '100 Feet Inner Ring Rd' },

  // Velachery & South
  { name: 'Guindy Race Course Rd near Station', lat: 13.0112, lng: 80.2215, zone: 'South', road: 'Velachery Main Rd' },
  { name: 'Velachery Main Rd near Phoenix Marketcity', lat: 12.9784, lng: 80.2224, zone: 'South', road: 'Velachery Main Rd' },
  { name: 'Velachery Railway Station Square', lat: 12.9694, lng: 80.2189, zone: 'South', road: 'Velachery Main Rd' },
  { name: 'Medavakkam Koot Road Signal', lat: 12.9345, lng: 80.1894, zone: 'South', road: 'Velachery Main Rd' },

  // North
  { name: 'Basin Bridge Junction Vyasarpadi', lat: 13.0984, lng: 80.2745, zone: 'North', road: 'Perambur High Rd' },
  { name: 'Perambur Church Stop Road', lat: 13.1112, lng: 80.2489, zone: 'North', road: 'Perambur High Rd' },
  { name: 'Retteri Signal Inner Ring North', lat: 13.1256, lng: 80.2212, zone: 'North', road: 'Retteri High Rd' },

  // West & Ambattur
  { name: 'Mogappair East Golden Flats Signal', lat: 13.0867, lng: 80.1789, zone: 'West', road: 'Ambattur Estate Rd' },
  { name: 'Ambattur Industrial Estate Telephone Exchange', lat: 13.1012, lng: 80.1612, zone: 'West', road: 'Ambattur Estate Rd' },
  { name: 'Porur Junction near Ramachandra Hospital', lat: 13.0345, lng: 80.1589, zone: 'West', road: 'Mount-Poonamallee Rd' },

  // T. Nagar & Marina
  { name: 'Usman Road Flyover approach T.Nagar', lat: 13.0412, lng: 80.2312, zone: 'Central', road: 'South Usman Rd' },
  { name: 'Kodambakkam Liberty Junction', lat: 13.0489, lng: 80.2234, zone: 'Central', road: 'Arcot Road' },
  { name: 'Kamarajar Salai near Marina Service Lane', lat: 13.0645, lng: 80.2812, zone: 'Central', road: 'Kamarajar Salai' },
  { name: 'Santhome High Road near Cathedral', lat: 13.0423, lng: 80.2789, zone: 'Central', road: 'Santhome High Rd' }
];

// Generate 125 realistic defect events
export const DEFECTS_DATA = [];

for (let i = 1; i <= 125; i++) {
  const landmark = LANDMARKS[(i - 1) % LANDMARKS.length];
  // Add slight random jitter (0-200 meters) so pins don't overlap exactly
  const latOffset = (Math.sin(i * 1.7) * 0.0035);
  const lngOffset = (Math.cos(i * 1.3) * 0.0035);

  const defectType = DEFECT_TYPES[i % DEFECT_TYPES.length].id;
  
  let severity = 'Medium';
  if (i % 7 === 0) severity = 'Critical';
  else if (i % 3 === 0) severity = 'High';
  else if (i % 5 === 0) severity = 'Low';

  let status = 'Open';
  if (i % 8 === 0) status = 'New';
  else if (i % 6 === 0) status = 'Under Repair';
  else if (i % 11 === 0) status = 'Resolved';
  else if (i % 15 === 0) status = 'Verified Closed';

  const detectionCount = 3 + (i * 7) % 38; // 3 to 40 detections
  const daysUnresolved = 1 + (i * 3) % 24; // 1 to 24 days
  const nearSchool = (i % 4 === 0);
  const trafficVolume = (i % 2 === 0) ? 'High' : (i % 5 === 0 ? 'Extreme' : 'Medium');

  const busOptions = ['BUS-21G-04', 'BUS-570-19', 'BUS-29C-12', 'BUS-45B-07', 'BUS-M70-03', 'BUS-18D-09'];
  const busIds = [busOptions[i % busOptions.length], busOptions[(i + 2) % busOptions.length]];

  let defectLat = Number((landmark.lat + latOffset).toFixed(6));
  let defectLng = Number((landmark.lng + lngOffset).toFixed(6));

  // Snap to road and clamp coordinates so none fall in the Bay of Bengal
  if (defectLat >= 13.04 && defectLng > 80.280) defectLng = 80.278;
  if (defectLat >= 12.95 && defectLat < 13.04 && defectLng > 80.264) defectLng = 80.259;
  if (defectLat < 12.95 && defectLng > 80.254) defectLng = 80.250;

  const tempDefect = {
    id: `DEF-20${100 + i}`,
    type: defectType,
    severity: severity,
    status: status,
    lat: defectLat,
    lng: defectLng,
    locationName: `${landmark.name} ${i % 2 === 0 ? '(Northbound)' : '(Southbound)'}`,
    roadName: landmark.road,
    zone: landmark.zone,
    image: (function() {
      const potholeImages = ['/evidence/pothole_1.jpg', '/evidence/pothole_2.jpg', '/evidence/pothole_3.jpg', '/evidence/pothole_4.jpg', '/evidence/pothole_5.jpg', '/evidence/pothole_6.jpg'];
      const longCrackImages = ['/evidence/crack_longitudinal_1.jpg', '/evidence/crack_longitudinal_2.jpg', '/evidence/crack_longitudinal_4.jpg'];
      const gatorCrackImages = ['/evidence/crack_alligator_1.jpg', '/evidence/crack_alligator_2.jpg', '/evidence/crack_alligator_3.jpg'];
      const ruttingImages = ['/evidence/rutting_1.jpg', '/evidence/rutting_2.jpg', '/evidence/rutting_3.jpg'];
      const waterloggingImages = ['/evidence/waterlogging_1.jpg', '/evidence/waterlogging_2.jpg', '/evidence/waterlogging_3.jpg', '/evidence/waterlogging_4.jpg', '/evidence/waterlogging_5.jpg'];
      const signImages = ['/evidence/sign_damaged_1.jpg', '/evidence/sign_damaged_2.jpg', '/evidence/sign_damaged_3.jpg'];

      if (defectType === 'Pothole') return '/evidence/pothole.jpg';
      if (defectType === 'Longitudinal crack' || defectType === 'Transverse crack') return longCrackImages[(i - 1) % longCrackImages.length];
      if (defectType === 'Alligator crack') return gatorCrackImages[(i - 1) % gatorCrackImages.length];
      if (defectType === 'Rutting/Depression' || defectType === 'Broken edge') return ruttingImages[(i - 1) % ruttingImages.length];
      if (defectType === 'Waterlogging') return waterloggingImages[(i - 1) % waterloggingImages.length];
      return signImages[(i - 1) % signImages.length];
    })(),
    confidence: Number((85 + (i % 14) + Math.random() * 0.9).toFixed(1)),
    firstDetected: `2026-09-${String(Math.max(1, 23 - Math.floor(daysUnresolved))).padStart(2, '0')}`,
    lastDetected: `2026-09-23 18:${String((i * 4) % 60).padStart(2, '0')}`,
    detectionCount: detectionCount,
    busIds: busIds,
    daysUnresolved: daysUnresolved,
    nearSchool: nearSchool,
    trafficVolume: trafficVolume,
    engineerAssigned: status === 'Under Repair' ? 'Er. S. Ramanathan (Zone Exec)' : null
  };

  tempDefect.priorityScore = calculatePriorityScore(tempDefect);
  DEFECTS_DATA.push(tempDefect);
}

// Sort initial list by priority score descending
DEFECTS_DATA.sort((a, b) => b.priorityScore - a.priorityScore);
