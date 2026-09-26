/**
 * Centralised Map and Tile Configuration
 * 
 * Supports swapping for keyed providers (MapTiler / Stadia / Google)
 * via the VITE_MAP_TILE_URL environment variable without touching components.
 */

export const MAP_CONFIG = {
  initialCenter: [13.0827, 80.2707],
  initialZoom: 12,
  minZoom: 10,
  maxZoom: 19,
  maxBounds: [
    [12.75, 79.95],
    [13.35, 80.40]
  ],
  defaultStyleId: 'streets',
  styles: {
    streets: {
      id: 'streets',
      name: 'Streets',
      description: 'Esri World Street Map (Google-Maps-like detail)',
      url: import.meta.env.VITE_MAP_TILE_URL || 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom',
      maxZoom: 19
    },
    standard: {
      id: 'standard',
      name: 'Standard',
      description: 'OpenStreetMap (Street & locality names)',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    },
    satellite: {
      id: 'satellite',
      name: 'Satellite',
      description: 'Esri World Imagery',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, GIS User Community',
      maxZoom: 19
    },
    lightGray: {
      id: 'lightGray',
      name: 'Light grey',
      description: 'Esri World Light Gray Base (Data overlay focus)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 19
    }
  }
};

export default MAP_CONFIG;
