import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import { 
  Layers, 
  Flame, 
  Bus, 
  Check, 
  Map as MapIcon, 
  Plus, 
  Minus, 
  Compass, 
  Globe 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { LiveBusesLayer } from './LiveBusesLayer';
import { MAP_CONFIG } from '../config/map';
import { TRAFFIC_ZONES, ROAD_DENSITY_SEGMENTS, getODFlowArcs, TOP_BOTTLENECKS } from '../data/vehicles';


const SEVERITY_COLORS = {
  Critical: '#D93025',
  High: '#E8710A',
  Medium: '#F9AB00',
  Low: '#188038',
  Info: '#1A73E8'
};

// Real Leaflet Heatmap Layer component using L.heatLayer
const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const heatPoints = points.map((p) => [
      p.lat,
      p.lng,
      p.severity === 'Critical' ? 1.0 : p.severity === 'High' ? 0.75 : p.severity === 'Medium' ? 0.5 : 0.25
    ]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 24,
      blur: 18,
      maxZoom: 16,
      minOpacity: 0.25,
      gradient: {
        0.2: '#1A73E8',
        0.4: '#188038',
        0.6: '#F9AB00',
        0.8: '#E8710A',
        1.0: '#D93025'
      }
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

// Map flyTo handler for detail selections
const MapFlyToHandler = () => {
  const map = useMap();
  const flyToTarget = useStore((state) => state.flyToTarget);

  useEffect(() => {
    if (flyToTarget && flyToTarget.lat && flyToTarget.lng) {
      map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom || 15, {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }
  }, [flyToTarget, map]);

  return null;
};

// Scale bar handler (L.control.scale, metric)
const MapScaleControl = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const scaleControl = L.control.scale({
      position: 'bottomleft',
      metric: true,
      imperial: false
    });
    scaleControl.addTo(map);

    return () => {
      scaleControl.remove();
    };
  }, [map]);

  return null;
};

// Capture map instance for decoupled overlay controls
const MapInstanceCapture = () => {
  const map = useMap();
  const setMapInstance = useStore((state) => state.setMapInstance);

  useEffect(() => {
    if (map) {
      setMapInstance(map);
    }
  }, [map, setMapInstance]);

  return null;
};

// Small flat marker: 14px circle, solid severity colour, 2px white border, soft shadow. On hover grow to 18px.
const createDefectDivIcon = (defect, isSelected) => {
  const color = SEVERITY_COLORS[defect.severity] || '#1A73E8';
  const isCritical = defect.severity === 'Critical';

  const html = `
    <div class="gis-defect-marker" style="${isSelected ? 'transform: scale(1.3); z-index: 999;' : ''}">
      <div class="gis-defect-marker-dot ${isCritical ? 'pulse-critical' : ''}" style="background-color: ${color};"></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-defect-marker-icon',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

// Custom DivIcon for Missing Infra Items
const createInfraDivIcon = (infra, isExpected, isSelected) => {
  let color = '#D93025';
  if (infra.status === 'DEGRADED') color = '#E8710A';
  else if (infra.status === 'UNMAPPED') color = '#1A73E8';
  else if (infra.status === 'OK') color = '#188038';

  if (isExpected) {
    const html = `
      <div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px dashed ${color};
        background: #FFFFFF;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        ${isSelected ? 'transform: scale(1.3);' : ''}
      ">
        <div style="width: 4px; height: 4px; border-radius: 50%; background: ${color};"></div>
      </div>
    `;
    return L.divIcon({ html, className: 'custom-infra-expected', iconSize: [16, 16], iconAnchor: [8, 8] });
  } else {
    const html = `
      <div style="
        width: 12px;
        height: 12px;
        border-radius: ${infra.status === 'UNMAPPED' ? '2px' : '50%'};
        background: ${color};
        border: 2px solid #FFFFFF;
        box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        transform: ${infra.status === 'UNMAPPED' ? 'rotate(45deg)' : 'none'};
      "></div>
    `;
    return L.divIcon({ html, className: 'custom-infra-detected', iconSize: [12, 12], iconAnchor: [6, 6] });
  }
};

// Marker Clustering: clusters show a single neutral circle with count number and worst severity border
const DefectsClusteredLayer = ({ defects, onSelectDefect, selectedId }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !defects) return;

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const childMarkers = cluster.getAllChildMarkers();
        let worstSeverity = 'Low';

        for (const marker of childMarkers) {
          const sev = marker.options.severity;
          if (sev === 'Critical') {
            worstSeverity = 'Critical';
            break;
          } else if (sev === 'High' && worstSeverity !== 'Critical') {
            worstSeverity = 'High';
          } else if (sev === 'Medium' && worstSeverity === 'Low') {
            worstSeverity = 'Medium';
          }
        }

        const borderColor = SEVERITY_COLORS[worstSeverity] || '#1A73E8';
        const count = cluster.getChildCount();

        return L.divIcon({
          html: `<div class="gis-cluster-circle" style="
            width: 32px;
            height: 32px;
            border: 2.5px solid ${borderColor};
          ">${count}</div>`,
          className: 'custom-cluster-wrapper',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
      }
    });

    defects.forEach((defect) => {
      const isSelected = selectedId === defect.id;
      const marker = L.marker([defect.lat, defect.lng], {
        icon: createDefectDivIcon(defect, isSelected),
        severity: defect.severity
      });

      marker.on('click', () => {
        onSelectDefect(defect);
      });

      // Bind clean enterprise popup
      const popupContent = `
        <div style="padding: 8px; font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4; color: #0F172A; max-width: 220px;">
          ${defect.image ? `<img src="${defect.image}" loading="lazy" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 6px; border: 1px solid #E2E8F0;" />` : ''}
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
            <strong style="color: #1A73E8;">${defect.id}</strong>
            <span style="font-size: 10px; font-weight: 600; padding: 2px 5px; border-radius: 4px; background: #F1F5F9; color: ${SEVERITY_COLORS[defect.severity]};">
              ${defect.severity}
            </span>
          </div>
          <div style="font-weight: 600; color: #0F172A;">${defect.type}</div>
          <div style="color: #64748B; font-size: 11px;">${defect.locationName}</div>
          <div style="margin-top: 6px; font-size: 11px; display: flex; justify-content: space-between; color: #475569;">
            <span>Priority Score:</span>
            <strong style="font-variant-numeric: tabular-nums;">${defect.priorityScore}/100</strong>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, defects, onSelectDefect, selectedId]);

  return null;
};

export const MapView = () => {
  const { 
    activeTab, 
    mapStyle,
    setMapStyle,
    mapInstance,
    defects, 
    defectFilters, 
    missingInfra, 
    infraFilters,
    incidents,
    showLiveBuses,
    toggleLiveBuses,
    showHeatmap,
    toggleHeatmap,
    showClustering,
    toggleClustering,
    trafficMapMode,
    odTimeSlot,
    showOdArcs,
    selectedItem,
    openDetailDrawer,
    searchQuery
  } = useStore();


  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);

  // Active Tile Layer Configuration from Centralised MAP_CONFIG
  const currentTileConfig = MAP_CONFIG.styles[mapStyle] || MAP_CONFIG.styles[MAP_CONFIG.defaultStyleId];

  // Filtered defects based on user toggles & search query
  const filteredDefects = defects.filter(d => {
    if (!defectFilters.types.includes(d.type)) return false;
    if (!defectFilters.severities.includes(d.severity)) return false;
    if (!defectFilters.statuses.includes(d.status)) return false;
    if (!defectFilters.zones.includes(d.zone)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.locationName.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.roadName.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered missing infra based on user toggles & search query
  const filteredInfra = missingInfra.filter(i => {
    if (infraFilters.category !== 'All' && i.category !== infraFilters.category) return false;
    if (!infraFilters.statuses.includes(i.status)) return false;
    if (infraFilters.source !== 'All' && i.expectedSource !== infraFilters.source) return false;
    if (i.confidence < infraFilters.confidenceThreshold) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return i.locationName.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.roadName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={MAP_CONFIG.initialCenter}
        zoom={MAP_CONFIG.initialZoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        maxBounds={MAP_CONFIG.maxBounds}
        zoomControl={false} // Handled by bottom-right controls per specification
        className="w-full h-full"
      >
        {/* Dynamic Basemap TileLayer without watermarks */}
        <TileLayer
          key={currentTileConfig.id}
          url={currentTileConfig.url}
          attribution={currentTileConfig.attribution}
          maxZoom={currentTileConfig.maxZoom}
        />

        <MapFlyToHandler />
        <MapScaleControl />
        <MapInstanceCapture />

        {/* Heatmap Layer Overlay (OFF by default) */}
        {showHeatmap && <HeatmapLayer points={filteredDefects} />}

        {/* Live Transit Buses Layer */}
        {showLiveBuses && <LiveBusesLayer />}

        {/* TAB 2 / OVERVIEW: Road Defects Markers */}
        {(activeTab === 'defects' || activeTab === 'command') && (
          showClustering ? (
            <DefectsClusteredLayer
              defects={filteredDefects}
              selectedId={selectedItem?.id}
              onSelectDefect={(defect) => openDetailDrawer(defect, 'defect')}
            />
          ) : (
            filteredDefects.map((defect) => {
              const isSelected = selectedItem?.id === defect.id;
              return (
                <Marker
                  key={defect.id}
                  position={[defect.lat, defect.lng]}
                  icon={createDefectDivIcon(defect, isSelected)}
                  eventHandlers={{
                    click: () => openDetailDrawer(defect, 'defect')
                  }}
                >
                  <Popup>
                    <div className="p-2 text-xs text-[#0F172A] font-sans max-w-[200px]">
                      {defect.image && (
                        <img 
                          src={defect.image} 
                          alt={defect.type} 
                          loading="lazy" 
                          className="w-full h-24 object-cover rounded-md mb-1.5 border border-slate-200"
                        />
                      )}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1">
                        <strong className="text-[#1A73E8]">{defect.id}</strong>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {defect.severity}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800">{defect.type}</div>
                      <div className="text-[11px] text-slate-500 truncate">{defect.locationName}</div>
                      <div className="text-[11px] mt-1 flex justify-between text-slate-600">
                        <span>Priority Score:</span>
                        <strong className="tabular-nums">{defect.priorityScore}/100</strong>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          )
        )}

        {/* TAB 3: Missing Infrastructure Expected vs Detected Markers */}
        {(activeTab === 'missing' || activeTab === 'command') && filteredInfra.map((infra) => {
          const isSelected = selectedItem?.id === infra.id;
          const hasDetectedPoint = infra.detectedLat && infra.detectedLng;

          return (
            <React.Fragment key={infra.id}>
              {/* Expected Location Ring Marker */}
              <Marker
                position={[infra.expectedLat, infra.expectedLng]}
                icon={createInfraDivIcon(infra, true, isSelected)}
                eventHandlers={{
                  click: () => openDetailDrawer(infra, 'missing')
                }}
              />

              {/* 20m Match Radius Buffer Circle on Selection */}
              {isSelected && (
                <Circle
                  center={[infra.expectedLat, infra.expectedLng]}
                  radius={20}
                  pathOptions={{
                    color: '#1A73E8',
                    fillColor: '#1A73E8',
                    fillOpacity: 0.1,
                    dashArray: '3, 3',
                    weight: 1.5
                  }}
                />
              )}

              {/* School Zone indicator */}
              {infra.nearSchool && (
                <Circle
                  center={[infra.expectedLat, infra.expectedLng]}
                  radius={100}
                  pathOptions={{
                    color: '#E8710A',
                    fillColor: '#E8710A',
                    fillOpacity: 0.05,
                    weight: 1
                  }}
                />
              )}

              {/* Detected Camera Point Marker & Connecting Line */}
              {hasDetectedPoint && (
                <>
                  <Marker
                    position={[infra.detectedLat, infra.detectedLng]}
                    icon={createInfraDivIcon(infra, false, isSelected)}
                    eventHandlers={{
                      click: () => openDetailDrawer(infra, 'missing')
                    }}
                  />

                  <Polyline
                    positions={[
                      [infra.expectedLat, infra.expectedLng],
                      [infra.detectedLat, infra.detectedLng]
                    ]}
                    pathOptions={{
                      color: infra.status === 'OK' ? '#188038' : '#E8710A',
                      dashArray: '3, 4',
                      weight: 1.5
                    }}
                  />
                </>
              )}
            </React.Fragment>
          );
        })}

        {/* TAB 5: Incident Markers */}
        {activeTab === 'incidents' && incidents.map((inc) => (
          <Marker
            key={inc.id}
            position={[inc.lat, inc.lng]}
            icon={L.divIcon({
              html: `
                <div style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
                  <div class="pulse-critical" style="
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #D93025;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                  ">!</div>
                </div>
              `,
              className: 'custom-incident-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
            eventHandlers={{
              click: () => openDetailDrawer(inc, 'incident')
            }}
          />
        ))}

        {/* TAB TRAFFIC: Vehicle Density / Congestion Overlay & OD Flow Arcs */}
        {activeTab === 'traffic' && (
          <>
            {/* Road Density / Congestion Polylines */}
            {ROAD_DENSITY_SEGMENTS.map((seg) => {
              const isDensityMode = trafficMapMode === 'density';
              const color = isDensityMode ? seg.color : (seg.speedKmph < 18 ? '#D93025' : seg.speedKmph < 30 ? '#E8710A' : '#188038');
              const weight = isDensityMode ? Math.min(9, Math.max(4, seg.densityVph / 600)) : 5;

              return (
                <Polyline
                  key={seg.id}
                  positions={seg.path}
                  pathOptions={{
                    color,
                    weight,
                    opacity: 0.85,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                >
                  <Tooltip sticky>
                    <div className="text-xs font-sans p-1">
                      <div className="font-semibold text-slate-900">{seg.name}</div>
                      <div className="text-[11px] text-slate-600 flex justify-between gap-3 mt-0.5">
                        <span>Density: <strong className="text-blue-600">{seg.densityVph.toLocaleString()} vph</strong></span>
                        <span>Speed: <strong className="text-amber-600">{seg.speedKmph} km/h</strong></span>
                      </div>
                    </div>
                  </Tooltip>
                </Polyline>
              );
            })}

            {/* OD Flow Curved Arcs */}
            {showOdArcs && getODFlowArcs(odTimeSlot).map((arc) => {
              const color = arc.volume > 7000 ? '#4338CA' : arc.volume > 4500 ? '#1A73E8' : '#0284C7';
              const weight = Math.min(7, Math.max(2.5, arc.volume / 1300));

              return (
                <Polyline
                  key={arc.id}
                  positions={arc.points}
                  pathOptions={{
                    color,
                    weight,
                    opacity: 0.75,
                    dashArray: '7, 5'
                  }}
                >
                  <Tooltip sticky>
                    <div className="p-1 font-sans text-xs">
                      <div className="font-semibold text-slate-900">{arc.fromZone} → {arc.toZone}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Estimated Flow: <strong className="text-blue-600">~{arc.volume.toLocaleString()} vehicles</strong> ({arc.timeLabel})
                      </div>
                      <div className="text-[10px] text-slate-400 italic mt-0.5">
                        Time-lagged density correlation (Bus cameras)
                      </div>
                    </div>
                  </Tooltip>
                </Polyline>
              );
            })}

            {/* Zone Centroid Markers */}
            {TRAFFIC_ZONES.map((zone) => (
              <Marker
                key={zone.id}
                position={[zone.lat, zone.lng]}
                icon={L.divIcon({
                  html: `
                    <div style="
                      background: #FFFFFF;
                      border: 2px solid ${zone.color};
                      border-radius: 20px;
                      padding: 2px 8px;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.18);
                      font-family: Inter, sans-serif;
                      font-size: 11px;
                      font-weight: 700;
                      color: #0F172A;
                      white-space: nowrap;
                      display: flex;
                      align-items: center;
                      gap: 4px;
                    ">
                      <span style="width: 8px; height: 8px; border-radius: 50%; background: ${zone.color}; inline-block;"></span>
                      <span>${zone.name}</span>
                    </div>
                  `,
                  className: 'traffic-zone-centroid',
                  iconSize: [110, 26],
                  iconAnchor: [55, 13]
                })}
              >
                <Popup>
                  <div className="p-2 text-xs font-sans">
                    <div className="font-bold text-slate-900">{zone.name}</div>
                    <div className="text-slate-500 text-[11px]">{zone.area}</div>
                    <div className="mt-1 text-[11px] text-slate-700">Centroid: {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Bottleneck Location Markers */}
            {TOP_BOTTLENECKS.map((bot) => (
              <Marker
                key={bot.id}
                position={[bot.lat, bot.lng]}
                icon={L.divIcon({
                  html: `
                    <div style="
                      width: 22px;
                      height: 22px;
                      border-radius: 50%;
                      background: #D93025;
                      border: 2px solid #FFFFFF;
                      box-shadow: 0 2px 6px rgba(217, 48, 37, 0.4);
                      color: white;
                      font-family: Inter, sans-serif;
                      font-size: 11px;
                      font-weight: 800;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      ${bot.rank}
                    </div>
                  `,
                  className: 'bottleneck-rank-marker',
                  iconSize: [22, 22],
                  iconAnchor: [11, 11]
                })}
              >
                <Tooltip sticky>
                  <div className="p-1 font-sans text-xs">
                    <div className="font-bold text-[#D93025]">#{bot.rank} Bottleneck: {bot.name}</div>
                    <div className="text-[11px] text-slate-600">Speed Drop: <strong>-{bot.speedDropPercent}%</strong> ({bot.densityVph.toLocaleString()} vph)</div>
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>


      {/* FLOATING GIS LAYERS CONTROL (Top-right) */}
      <div className="absolute top-3 right-3 z-[1000] pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setLayersMenuOpen(!layersMenuOpen)}
            className="enterprise-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-[#0F172A] hover:bg-slate-50 transition cursor-pointer shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Layers</span>
          </button>

          {layersMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 enterprise-card p-2.5 z-30 space-y-2 shadow-md">
              <div className="text-[11px] font-semibold text-[#64748B] pb-1 border-b border-slate-100">
                Overlay Layers
              </div>

              <div className="space-y-1 text-xs">
                {/* Heatmap Toggle (OFF by default) */}
                <button
                  onClick={toggleHeatmap}
                  className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-50 transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-[#E8710A]" />
                    <span className="text-[#0F172A]">Heatmap</span>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border text-[9px] ${
                    showHeatmap ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : 'border-slate-300'
                  }`}>
                    {showHeatmap && <Check className="w-3 h-3" />}
                  </span>
                </button>

                {/* Live Buses Toggle */}
                <button
                  onClick={toggleLiveBuses}
                  className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-50 transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Bus className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span className="text-[#0F172A]">Transit Fleet</span>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border text-[9px] ${
                    showLiveBuses ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : 'border-slate-300'
                  }`}>
                    {showLiveBuses && <Check className="w-3 h-3" />}
                  </span>
                </button>

                {/* Marker Clustering Toggle */}
                <button
                  onClick={toggleClustering}
                  className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-50 transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[#0F172A]">Marker Clustering</span>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border text-[9px] ${
                    showClustering ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : 'border-slate-300'
                  }`}>
                    {showClustering && <Check className="w-3 h-3" />}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING BOTTOM-RIGHT CONTROLS: Style Switcher, Reset/Locate, Zoom Controls */}
      <div className="absolute bottom-6 right-3 z-[1000] flex flex-col items-end gap-2 pointer-events-auto">
        {/* Map Style Switcher Popover */}
        <div className="relative">
          {styleMenuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-56 enterprise-card p-2 shadow-lg border border-slate-200 bg-white rounded-md">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 border-b border-slate-100 mb-1">
                Map Basemap
              </div>
              <div className="space-y-0.5">
                {Object.values(MAP_CONFIG.styles).map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setMapStyle(style.id);
                      setStyleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-left transition ${
                      mapStyle === style.id
                        ? 'bg-blue-50 text-[#1A73E8] font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div>
                      <div>{style.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal leading-tight">{style.description}</div>
                    </div>
                    {mapStyle === style.id && <Check className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setStyleMenuOpen(!styleMenuOpen)}
            title="Switch Map Basemap Style"
            className="enterprise-card px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-md transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>{MAP_CONFIG.styles[mapStyle]?.name || 'Streets'}</span>
          </button>
        </div>

        {/* Locate / Reset to Center Button */}
        <button
          onClick={() => {
            if (mapInstance) {
              mapInstance.flyTo(MAP_CONFIG.initialCenter, MAP_CONFIG.initialZoom, { duration: 1.0 });
            }
          }}
          title="Reset View to Chennai Center"
          className="enterprise-card w-8 h-8 flex items-center justify-center text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-md transition cursor-pointer"
        >
          <Compass className="w-4 h-4 text-slate-600 hover:text-[#1A73E8]" />
        </button>

        {/* Zoom In / Zoom Out Controls */}
        <div className="enterprise-card flex flex-col bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden">
          <button
            onClick={() => {
              if (mapInstance) {
                mapInstance.zoomIn();
              }
            }}
            title="Zoom In"
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition border-b border-slate-100 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (mapInstance) {
                mapInstance.zoomOut();
              }
            }}
            title="Zoom Out"
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
