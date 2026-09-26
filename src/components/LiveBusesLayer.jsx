import React, { useEffect, useState, useRef } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { LIVE_BUSES } from '../data/busesData';
import { CHENNAI_CORRIDORS } from '../data/chennaiRoads';

/**
 * Creates flat enterprise GIS marker for transit buses:
 * Small white rounded chip with route number and tiny direction arrow. No glow.
 */
const createBusDivIcon = (bus) => {
  const html = `
    <div class="gis-bus-chip">
      <span style="font-size: 9px; color: #1A73E8; display: inline-block; transform: rotate(45deg);">▲</span>
      <span>${bus.route}</span>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-bus-icon-marker',
    iconSize: [40, 20],
    iconAnchor: [20, 10]
  });
};

/**
 * Animates buses smoothly along corridor waypoints using requestAnimationFrame
 */
export const LiveBusesLayer = () => {
  const [busPositions, setBusPositions] = useState({});
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let startTime = performance.now();

    const animate = (time) => {
      const elapsed = (time - startTime) / 1000;

      const newPositions = {};

      LIVE_BUSES.forEach((bus, index) => {
        const corridor = CHENNAI_CORRIDORS[bus.corridorKey];
        if (!corridor || !corridor.waypoints || corridor.waypoints.length < 2) return;

        const waypoints = corridor.waypoints;
        const segmentCount = waypoints.length - 1;

        const cycleDuration = 45 + (index * 6);
        const rawProgress = ((elapsed + (index * 12)) % cycleDuration) / cycleDuration;
        const pingPongProgress = rawProgress < 0.5 ? rawProgress * 2 : (1 - rawProgress) * 2;
        const scaledProgress = pingPongProgress * segmentCount;
        const currentSegmentIndex = Math.max(0, Math.min(Math.floor(scaledProgress), segmentCount - 1));
        const segmentT = scaledProgress - currentSegmentIndex;

        const p1 = waypoints[currentSegmentIndex];
        const p2 = waypoints[currentSegmentIndex + 1];

        if (!Array.isArray(p1) || !Array.isArray(p2)) return;

        const currentLat = p1[0] + (p2[0] - p1[0]) * segmentT;
        const currentLng = p1[1] + (p2[1] - p1[1]) * segmentT;

        newPositions[bus.id] = [currentLat, currentLng];
      });

      setBusPositions(newPositions);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      {LIVE_BUSES.map((bus) => {
        const pos = busPositions[bus.id];
        if (!pos) return null;

        return (
          <Marker
            key={bus.id}
            position={pos}
            icon={createBusDivIcon(bus)}
          >
            <Tooltip direction="top" offset={[0, -12]} opacity={0.98}>
              <div className="p-2.5 w-48 text-[#0F172A] dark:text-slate-100 font-sans space-y-1.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                  <span className="font-semibold text-xs text-[#1A73E8] dark:text-sky-400">{bus.id}</span>
                  <span className="text-[11px] tabular-nums font-medium text-[#188038] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {bus.speed} km/h
                  </span>
                </div>
                
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{bus.routeName}</div>
                
                <div className="text-[11px] text-[#64748B] dark:text-slate-400">
                  Driver: <span className="text-slate-800 dark:text-slate-200">{bus.driver}</span>
                </div>

                <div className="text-[11px] text-[#64748B] dark:text-slate-400 flex items-center justify-between">
                  <span>Occupancy</span>
                  <span className="tabular-nums font-semibold text-slate-800 dark:text-slate-200">{bus.occupancy}%</span>
                </div>

                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${bus.occupancy > 85 ? 'bg-[#D93025]' : bus.occupancy > 70 ? 'bg-[#E8710A]' : 'bg-[#188038]'}`}
                    style={{ width: `${bus.occupancy}%` }}
                  />
                </div>

                <div className="text-[10px] text-[#64748B] dark:text-slate-400 pt-0.5 flex items-center justify-between">
                  <span>{bus.camStatus}</span>
                  <span className="text-slate-500">30 FPS</span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

export default LiveBusesLayer;
