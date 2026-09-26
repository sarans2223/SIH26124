// 10 High-priority safety incidents captured by MTC fleet AI cameras

export const INCIDENTS_DATA = [
  {
    id: 'INC-9012',
    type: 'Hit and Run',
    severity: 'Critical',
    licensePlate: 'TN 09 AB 1234',
    vehicleModel: 'White Hyundai Creta SUV',
    confidence: 96.4,
    timestamp: '2026-09-23 18:42:10',
    lat: 13.0601,
    lng: 80.2498,
    locationName: 'Anna Salai near Thousand Lights Signal',
    zone: 'Central',
    policeStation: 'E-1 Thousand Lights Police Station (320m away)',
    policePhone: '+91 44 2829 0100',
    nearbyBuses: [
      { busId: 'MTC-21G-04', route: '21G', distMeters: 140, status: 'Stopped at signal', footageRequested: false },
      { busId: 'MTC-45B-07', route: '45B', distMeters: 380, status: 'Approaching northbound', footageRequested: false }
    ],
    rerouteGuidance: 'Advise MTC buses 21G & 45B to divert via Greams Road to avoid traffic bottleneck.',
    auditTimeline: [
      { time: '18:42:10', event: 'MTC-21G-04 Dual AI camera detected vehicle collision & abrupt escape.' },
      { time: '18:42:12', event: 'YOLO v8 license plate recognition confirmed TN 09 AB 1234 with 96.4% confidence.' },
      { time: '18:42:15', event: 'Automated high-priority alert dispatched to Chennai Traffic Control Room & E-1 Station.' }
    ]
  },
  {
    id: 'INC-9013',
    type: 'Rash Driving & Overspeeding',
    severity: 'High',
    licensePlate: 'TN 01 AK 9812',
    vehicleModel: 'Black Mahindra Thar',
    confidence: 93.8,
    timestamp: '2026-09-23 18:35:44',
    lat: 12.9875,
    lng: 80.2482,
    locationName: 'OMR opposite TIDEL Park Taramani',
    zone: 'OMR/IT corridor',
    policeStation: 'J-13 Taramani Police Station (410m away)',
    policePhone: '+91 44 2254 0200',
    nearbyBuses: [
      { busId: 'MTC-570-19', route: '570', distMeters: 210, status: 'In motion 42 km/h', footageRequested: false }
    ],
    rerouteGuidance: 'Service lane open; maintain normal speed but stay in middle lane.',
    auditTimeline: [
      { time: '18:35:44', event: 'MTC-570-19 camera flagged extreme speed violation (112 km/h in 60 km/h zone).' },
      { time: '18:35:46', event: 'License plate TN 01 AK 9812 verified by twin angle camera.' }
    ]
  },
  {
    id: 'INC-9014',
    type: 'Near Collision / Pedestrian Risk',
    severity: 'High',
    licensePlate: 'TN 07 CA 5543',
    vehicleModel: 'Red Commercial Auto-Rickshaw',
    confidence: 91.2,
    timestamp: '2026-09-23 18:20:15',
    lat: 13.0067,
    lng: 80.2021,
    locationName: 'Kathipara Cloverleaf Flyover Entry',
    zone: 'South',
    policeStation: 'R-4 Guindy Police Station (280m away)',
    policePhone: '+91 44 2234 0500',
    nearbyBuses: [
      { busId: 'MTC-18D-09', route: '18D', distMeters: 90, status: 'Holding position', footageRequested: false },
      { busId: 'MTC-M70-03', route: 'M70', distMeters: 410, status: 'Underpass exit', footageRequested: false }
    ],
    rerouteGuidance: 'Use right lane slip road for Kathipara loop; left lane blocked by police patrol.',
    auditTimeline: [
      { time: '18:20:15', event: 'Sudden braking event triggered on MTC-18D-09 telematics.' },
      { time: '18:20:17', event: 'Auto-Rickshaw cut sharply across bus front bumper.' }
    ]
  },
  {
    id: 'INC-9015',
    type: 'Signal Jumping & Intersection Block',
    severity: 'Medium',
    licensePlate: 'TN 22 BZ 7781',
    vehicleModel: 'Grey Maruti Swift Dzire',
    confidence: 89.5,
    timestamp: '2026-09-23 18:05:02',
    lat: 13.0512,
    lng: 80.2112,
    locationName: 'Vadapalani Signal near Forum Mall',
    zone: 'West',
    policeStation: 'R-8 Vadapalani Police Station (190m away)',
    policePhone: '+91 44 2480 0100',
    nearbyBuses: [
      { busId: 'MTC-11G-08', route: '11G', distMeters: 160, status: 'At bus stop', footageRequested: false }
    ],
    rerouteGuidance: 'No reroute required; signal cleared.',
    auditTimeline: [
      { time: '18:05:02', event: 'Red light violation recorded by MTC-11G-08 front camera feed.' }
    ]
  },
  {
    id: 'INC-9016',
    type: 'Hit and Run (Cyclist Injury)',
    severity: 'Critical',
    licensePlate: 'TN 10 AX 4410',
    vehicleModel: 'Silver Toyota Innova Crysta',
    confidence: 97.1,
    timestamp: '2026-09-23 17:48:30',
    lat: 13.0712,
    lng: 80.1945,
    locationName: 'Koyambedu Roundtana Junction',
    zone: 'West',
    policeStation: 'K-10 Koyambedu Traffic Station (250m away)',
    policePhone: '+91 44 2479 0300',
    nearbyBuses: [
      { busId: 'MTC-70-15', route: '70', distMeters: 310, status: 'In traffic queue', footageRequested: false },
      { busId: 'MTC-D70-02', route: 'D70', distMeters: 450, status: 'Koyambedu exit', footageRequested: false }
    ],
    rerouteGuidance: 'Reroute incoming MTC buses via 100 Feet Service Lane.',
    auditTimeline: [
      { time: '17:48:30', event: 'Emergency impact sound & visual cue detected.' },
      { time: '17:48:33', event: 'Alert escalated directly to 108 Ambulance service & Koyambedu Traffic HQ.' }
    ]
  },
  {
    id: 'INC-9017',
    type: 'Illegal Median Crossing',
    severity: 'Medium',
    licensePlate: 'TN 02 CE 3311',
    vehicleModel: 'Yellow Pickup Truck',
    confidence: 88.0,
    timestamp: '2026-09-23 17:30:12',
    lat: 12.9667,
    lng: 80.1472,
    locationName: 'GST Road near Pallavaram Signal',
    zone: 'South',
    policeStation: 'S-5 Pallavaram Police Station (500m away)',
    policePhone: '+91 44 2264 0100',
    nearbyBuses: [
      { busId: 'MTC-18D-09', route: '18D', distMeters: 290, status: 'Cruising 38 km/h', footageRequested: false }
    ],
    rerouteGuidance: 'Clear corridor ahead.',
    auditTimeline: [
      { time: '17:30:12', event: 'Illegal U-turn across damaged central median captured.' }
    ]
  },
  {
    id: 'INC-9018',
    type: 'Dangerous Lane Swerving',
    severity: 'High',
    licensePlate: 'TN 04 AD 6120',
    vehicleModel: 'Blue Yamaha R15 Motorcycle',
    confidence: 94.6,
    timestamp: '2026-09-23 17:12:45',
    lat: 12.9867,
    lng: 80.2604,
    locationName: 'ECR near Thiruvanmiyur Signal',
    zone: 'South',
    policeStation: 'J-6 Thiruvanmiyur Police Station (330m away)',
    policePhone: '+91 44 2441 0200',
    nearbyBuses: [
      { busId: 'MTC-23C-05', route: '23C', distMeters: 180, status: 'In motion 40 km/h', footageRequested: false }
    ],
    rerouteGuidance: 'Reduce speed to 25 km/h near signal approach.',
    auditTimeline: [
      { time: '17:12:45', event: 'High-speed stunt riding & swerving captured by MTC-23C-05.' }
    ]
  },
  {
    id: 'INC-9019',
    type: 'Vehicle Breakdown Blocking Bus Lane',
    severity: 'Medium',
    licensePlate: 'TN 05 AG 8801',
    vehicleModel: 'Tata Ace Mini Lorry',
    confidence: 95.0,
    timestamp: '2026-09-23 16:55:00',
    lat: 13.0827,
    lng: 80.2707,
    locationName: 'Central Railway Station Bus Bay',
    zone: 'Central',
    policeStation: 'B-1 Central Police Station (150m away)',
    policePhone: '+91 44 2535 0100',
    nearbyBuses: [
      { busId: 'MTC-A1-01', route: 'A1', distMeters: 70, status: 'Boarding passengers', footageRequested: false }
    ],
    rerouteGuidance: 'Use Lane 2 for passenger drop-off at Central gate.',
    auditTimeline: [
      { time: '16:55:00', event: 'Stationary vehicle detected in bus-only bay for >15 mins.' }
    ]
  },
  {
    id: 'INC-9020',
    type: 'Commercial Bus Door Safety Hazard',
    severity: 'Low',
    licensePlate: 'TN 14 U 9920',
    vehicleModel: 'Private Omnibus',
    confidence: 86.7,
    timestamp: '2026-09-23 16:20:18',
    lat: 12.9249,
    lng: 80.1275,
    locationName: 'GST Road near Tambaram Sanatorium',
    zone: 'South',
    policeStation: 'S-11 Tambaram Traffic Station (400m away)',
    policePhone: '+91 44 2226 0400',
    nearbyBuses: [
      { busId: 'MTC-21G-04', route: '21G', distMeters: 480, status: 'In transit', footageRequested: false }
    ],
    rerouteGuidance: 'Corridor operational.',
    auditTimeline: [
      { time: '16:20:18', event: 'Footboard travel violation & open door hazard recorded.' }
    ]
  },
  {
    id: 'INC-9021',
    type: 'Unsafe Construction Material Spill',
    severity: 'High',
    licensePlate: 'TN 09 BK 4040',
    vehicleModel: 'Heavy Tipper Truck',
    confidence: 92.3,
    timestamp: '2026-09-23 15:40:50',
    lat: 13.0867,
    lng: 80.1789,
    locationName: 'Mogappair East Golden Flats Signal',
    zone: 'West',
    policeStation: 'V-7 Nolambur Police Station (380m away)',
    policePhone: '+91 44 2656 0200',
    nearbyBuses: [
      { busId: 'MTC-D70-02', route: 'D70', distMeters: 220, status: 'Slowing down', footageRequested: false }
    ],
    rerouteGuidance: 'Avoid left lane due to gravel debris on road surface.',
    auditTimeline: [
      { time: '15:40:50', event: 'Gravel & sand spill detected on asphalt layer.' }
    ]
  }
];
