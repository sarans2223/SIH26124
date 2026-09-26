import React, { useRef, useState, useCallback } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Box, 
  RotateCcw, 
  Compass, 
  Layers, 
  AlertTriangle 
} from 'lucide-react';
import { useStore } from '../store/useStore';

const SEVERITY_COLORS = {
  Critical: '#D93025',
  High: '#E8710A',
  Medium: '#F9AB00',
  Low: '#188038',
  Info: '#1A73E8'
};

// MapLibre Styles (Raster Esri & Vector OpenFreeMap - No API Key required)
const STYLES = {
  openfreemap: {
    id: 'openfreemap',
    name: 'OpenFreeMap (Vector)',
    url: 'https://tiles.openfreemap.org/styles/bright'
  },
  esriSatellite: {
    id: 'esriSatellite',
    name: 'Esri Satellite (Raster 3D)',
    url: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri'
        }
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  },
  esriStreets: {
    id: 'esriStreets',
    name: 'Esri Streets (Raster 3D)',
    url: {
      version: 8,
      sources: {
        'esri-streets': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri'
        }
      },
      layers: [
        {
          id: 'esri-streets-layer',
          type: 'raster',
          source: 'esri-streets',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  }
};

export const ThreeDViewPage = () => {
  const mapRef = useRef(null);
  const { defects, openDetailDrawer } = useStore();
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [styleKey, setStyleKey] = useState('openfreemap');

  // Initial view state per specification:
  // Center on Chennai [80.2707, 13.0827] (lng, lat order)
  // Pitch: 60 degrees, Bearing: -20 degrees for angled 3D flight perspective
  const [viewState, setViewState] = useState({
    longitude: 80.2707,
    latitude: 13.0827,
    zoom: 13,
    pitch: 60,
    bearing: -20
  });

  const is3D = viewState.pitch > 5;

  const handleReset2D = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 800
      });
    } else {
      setViewState(prev => ({ ...prev, pitch: 0, bearing: 0 }));
    }
  }, []);

  const handleRestore3D = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        pitch: 60,
        bearing: -20,
        duration: 800
      });
    } else {
      setViewState(prev => ({ ...prev, pitch: 60, bearing: -20 }));
    }
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] z-10">
      {/* 3D MAPVIEW CONTAINER */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapLibre={maplibregl}
          mapStyle={STYLES[styleKey]?.url || STYLES.openfreemap.url}
          style={{ width: '100%', height: '100%' }}
          pitchWithRotate={true}
          dragRotate={true}
          touchPitch={true}
          maxPitch={85}
        >
          <NavigationControl position="bottom-right" showCompass={true} showZoom={true} />

          {/* Plot defect markers with severity color matching existing pages */}
          {defects.map((defect) => {
            const color = SEVERITY_COLORS[defect.severity] || '#1A73E8';
            const isCritical = defect.severity === 'Critical';

            return (
              <Marker
                key={defect.id}
                longitude={defect.lng}
                latitude={defect.lat}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedDefect(defect);
                }}
              >
                <div 
                  className="group cursor-pointer relative"
                  title={`${defect.id}: ${defect.type} (${defect.severity})`}
                >
                  <div 
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform transform group-hover:scale-125 flex items-center justify-center ${isCritical ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: color }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
                  </div>
                </div>
              </Marker>
            );
          })}

          {/* Defect Popup */}
          {selectedDefect && (
            <Popup
              longitude={selectedDefect.lng}
              latitude={selectedDefect.lat}
              anchor="bottom"
              onClose={() => setSelectedDefect(null)}
              closeOnClick={false}
              className="z-50"
            >
              <div className="p-2 text-xs font-sans text-[#0F172A] min-w-[180px]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1">
                  <strong className="text-[#1A73E8]">{selectedDefect.id}</strong>
                  <span 
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: SEVERITY_COLORS[selectedDefect.severity] }}
                  >
                    {selectedDefect.severity}
                  </span>
                </div>
                <div className="font-semibold text-slate-800">{selectedDefect.type}</div>
                <div className="text-[11px] text-slate-500 truncate">{selectedDefect.locationName}</div>
                <button
                  onClick={() => openDetailDrawer(selectedDefect, 'defect')}
                  className="mt-2 w-full px-2 py-1 bg-[#1A73E8] text-white rounded text-[11px] font-medium hover:bg-blue-600 transition cursor-pointer"
                >
                  Inspect Defect
                </button>
              </div>
            </Popup>
          )}
        </Map>

        {/* TOP-LEFT FLOATING PILL TOGGLE & LABEL (#6) */}
        <div className="absolute top-3 left-[76px] z-30 flex items-center gap-2 pointer-events-auto">
          <div className="enterprise-card px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-[#0F172A] dark:text-slate-100 shadow-sm rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur">
            <Box className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>3D Preview: Chennai</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-[#1A73E8] dark:text-sky-300 font-mono">
              Pitch: {Math.round(viewState.pitch)}° | Bearing: {Math.round(viewState.bearing)}°
            </span>
          </div>

          {is3D ? (
            <button
              onClick={handleReset2D}
              title="Reset view to top-down 2D"
              className="enterprise-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm rounded-full transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset to 2D</span>
            </button>
          ) : (
            <button
              onClick={handleRestore3D}
              title="Tilt map to 3D perspective view (60° pitch)"
              className="enterprise-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 shadow-sm rounded-full transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-white" />
              <span>Enable 3D Pitch (60°)</span>
            </button>
          )}
        </div>

        {/* TOP-RIGHT STYLE SWITCHER */}
        <div className="absolute top-3 right-3 z-30 pointer-events-auto">
          <div className="enterprise-card p-1 flex items-center gap-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            {Object.values(STYLES).map(s => (
              <button
                key={s.id}
                onClick={() => setStyleKey(s.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  styleKey === s.id
                    ? 'bg-[#1A73E8] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ONE-LINE CAPTION BELOW MAP (#7) */}
      <div className="shrink-0 py-2 px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
        Roadmap: full 3D corridor inspection view for field verification teams.
      </div>
    </div>
  );
};

export default ThreeDViewPage;
