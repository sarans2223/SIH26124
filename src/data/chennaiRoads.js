// Hand-written polyline waypoints for 12 major Chennai MTC transit corridors

export const CHENNAI_CORRIDORS = {
  ANNA_SALAI: {
    id: 'ANNA_SALAI',
    name: 'Anna Salai (Mount Road)',
    waypoints: [
      [13.0827, 80.2707], // Central Station / Parrys
      [13.0694, 80.2642], // Mount Road LIC
      [13.0601, 80.2498], // Thousand Lights
      [13.0489, 80.2421], // Gemini Flyover
      [13.0335, 80.2304], // Saidapet
      [13.0067, 80.2021], // Kathipara Junction
      [12.9815, 80.1634], // Meenambakkam Airport
    ]
  },
  GST_ROAD: {
    id: 'GST_ROAD',
    name: 'GST Road (Grand Southern Trunk)',
    waypoints: [
      [13.0067, 80.2021], // Kathipara Junction
      [12.9815, 80.1634], // Meenambakkam Airport
      [12.9667, 80.1472], // Pallavaram
      [12.9518, 80.1408], // Chromepet
      [12.9249, 80.1275], // Tambaram Sanatorium
      [12.9229, 80.1174], // Tambaram Terminal
    ]
  },
  OMR_IT: {
    id: 'OMR_IT',
    name: 'OMR / Rajiv Gandhi Salai (IT Corridor)',
    waypoints: [
      [13.0073, 80.2526], // Madhya Kailash
      [12.9875, 80.2482], // Taramani / TIDEL Park
      [12.9634, 80.2458], // Perungudi
      [12.9012, 80.2274], // Sholinganallur
      [12.8274, 80.2185], // Navalur / Siruseri
    ]
  },
  ECR: {
    id: 'ECR',
    name: 'East Coast Road (ECR)',
    waypoints: [
      [12.9867, 80.2604], // Thiruvanmiyur
      [12.9612, 80.2598], // Kottivakkam
      [12.9498, 80.2592], // Neelankarai
      [12.9094, 80.2558], // Akkarai
      [12.8423, 80.2489], // Muttukadu
    ]
  },
  POONAMALLEE_HIGH: {
    id: 'POONAMALLEE_HIGH',
    name: 'Poonamallee High Road (EVR Salai)',
    waypoints: [
      [13.0812, 80.2715], // Central Station
      [13.0784, 80.2536], // Dasaprakash / Egmore
      [13.0768, 80.2412], // Kilpauk Medical
      [13.0745, 80.2189], // Aminjikarai
      [13.0712, 80.1945], // Koyambedu Roundtana
      [13.0567, 80.1489], // Maduravoyal
      [13.0489, 80.0912], // Poonamallee
    ]
  },
  INNER_RING: {
    id: 'INNER_RING',
    name: '100 Feet Inner Ring Road (Kathipara - Koyambedu)',
    waypoints: [
      [13.0067, 80.2021], // Kathipara Junction
      [13.0345, 80.2123], // Ashok Pillar
      [13.0512, 80.2112], // Vadapalani
      [13.0712, 80.1945], // Koyambedu Market
      [13.0924, 80.1989], // Padi Flyover
    ]
  },
  VELACHERY_MAIN: {
    id: 'VELACHERY_MAIN',
    name: 'Velachery Main Road',
    waypoints: [
      [13.0112, 80.2215], // Guindy Station
      [12.9915, 80.2198], // Little Mount / Checkpost
      [12.9784, 80.2224], // Velachery Bypass / Phoenix Mall
      [12.9694, 80.2189], // Velachery Railway Station
      [12.9345, 80.1894], // Medavakkam
    ]
  },
  PERAMBUR_NORTH: {
    id: 'PERAMBUR_NORTH',
    name: 'Perambur High Road Corridor',
    waypoints: [
      [13.0827, 80.2707], // Central Station
      [13.0984, 80.2745], // Basin Bridge / Vyasarpadi
      [13.1112, 80.2489], // Perambur Railway Station
      [13.1256, 80.2212], // Kolathur / Retteri
    ]
  },
  AMBATTUR_ROAD: {
    id: 'AMBATTUR_ROAD',
    name: 'Ambattur Estate Road',
    waypoints: [
      [13.0712, 80.1945], // Koyambedu
      [13.0867, 80.1789], // Mogappair East
      [13.1012, 80.1612], // Ambattur Industrial Estate
      [13.1145, 80.1478], // Ambattur OT
    ]
  },
  PORUR_CORRIDOR: {
    id: 'PORUR_CORRIDOR',
    name: 'Mount-Poonamallee Road (Porur Corridor)',
    waypoints: [
      [13.0067, 80.2021], // Kathipara
      [13.0189, 80.1789], // Ramapuram
      [13.0345, 80.1589], // DLF IT Park / Porur Junction
      [13.0456, 80.1345], // Iyyapanthangal MTC Depot
    ]
  },
  TNAGAR_CORRIDOR: {
    id: 'TNAGAR_CORRIDOR',
    name: 'T. Nagar Commercial Corridor',
    waypoints: [
      [13.0489, 80.2234], // Kodambakkam Liberty
      [13.0412, 80.2312], // Panagal Park T.Nagar
      [13.0335, 80.2304], // Saidapet
      [13.0456, 80.2456], // Eldams Road / Alwarpet
    ]
  },
  MARINA_CORRIDOR: {
    id: 'MARINA_CORRIDOR',
    name: 'Kamarajar Salai (Marina Beach Corridor)',
    waypoints: [
      [13.0878, 80.2834], // Fort St. George / Parrys
      [13.0645, 80.2812], // Marina Beach / Vivekanandar Illam
      [13.0423, 80.2789], // Light House / Santhome Cathedral
      [13.0289, 80.2734], // Foreshore Estate Terminal
    ]
  }
};
