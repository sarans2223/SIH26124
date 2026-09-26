// src/pages/TrafficPage.jsx
import React, { useState } from 'react';
import { 
  Car, 
  Bike, 
  Truck, 
  Bus, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Info, 
  MapPin, 
  Activity, 
  Navigation,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useStore } from '../store/useStore';
import { 
  TODAY_VEHICLE_KPIS, 
  ZONE_CLASS_COMPOSITION, 
  CITYWIDE_DONUT_DATA, 
  OD_TIME_SLOTS, 
  OD_MATRICES, 
  TRAFFIC_ZONES, 
  TOP_BOTTLENECKS, 
  ROUTE_DELAYS 
} from '../data/vehicles';

export const TrafficPage = () => {
  const { 
    trafficMapMode, 
    setTrafficMapMode, 
    odTimeSlot, 
    setOdTimeSlot, 
    showOdArcs, 
    toggleShowOdArcs, 
    flyTo,
    themeMode 
  } = useStore();

  const [selectedZone, setSelectedZone] = useState('all');
  const currentMatrix = OD_MATRICES[odTimeSlot] || OD_MATRICES.morning;

  // Max flow for scaling matrix heatmap intensity
  const maxFlow = 10000;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex flex-col justify-between p-3 pl-[76px]">
      
      {/* TOP FLOATING STRIP: CONTROLS & LIVE CLASSIFICATION KPIS */}
      <div className="pointer-events-auto space-y-2">
        {/* Top Action & Mode Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 enterprise-card p-2 px-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-[#0F172A] dark:text-white leading-none flex items-center gap-1.5">
                <span>Traffic Management & OD Analysis</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-950 text-[#1A73E8] dark:text-blue-400 font-semibold">
                  Live Vision Counts
                </span>
              </h1>
              <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-0.5">
                Citywide vehicle classification, density mapping & origin-destination flow inference
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Overlay Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTrafficMapMode('density')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  trafficMapMode === 'density'
                    ? 'bg-white dark:bg-slate-700 text-[#1A73E8] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Vehicle Density
              </button>
              <button
                onClick={() => setTrafficMapMode('congestion')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  trafficMapMode === 'congestion'
                    ? 'bg-white dark:bg-slate-700 text-[#1A73E8] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Congestion Speed
              </button>
            </div>

            {/* OD Flow Arcs Toggle */}
            <button
              onClick={toggleShowOdArcs}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition ${
                showOdArcs
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 text-[#1A73E8] dark:text-blue-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>OD Flow Arcs {showOdArcs ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Cards Strip for Major Classes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TODAY_VEHICLE_KPIS.map((kpi) => {
            const trendData = kpi.hourlyTrend.map((val, idx) => ({ idx, val }));

            return (
              <div key={kpi.id} className="enterprise-card p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 truncate">
                    {kpi.name}
                  </span>
                  <span className={`text-[10px] font-bold px-1 rounded flex items-center gap-0.5 ${
                    kpi.isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' : 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                  }`}>
                    {kpi.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    <span>{kpi.change}</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <div className="text-base font-bold text-[#0F172A] dark:text-white tabular-nums tracking-tight">
                      {kpi.count.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-slate-400">
                      Share: <span className="font-semibold text-slate-700 dark:text-slate-300">{kpi.share}</span>
                    </div>
                  </div>

                  {/* Sparkline chart */}
                  <div className="w-14 h-7 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <Area 
                          type="monotone" 
                          dataKey="val" 
                          stroke={kpi.isPositive ? '#188038' : '#D93025'} 
                          fill={kpi.isPositive ? '#188038' : '#D93025'} 
                          fillOpacity={0.2}
                          strokeWidth={1.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA: LEFT & RIGHT FLOATING PANELS OVER MAP */}
      <div className="flex-1 flex justify-between gap-3 mt-2 overflow-hidden pointer-events-none">
        
        {/* LEFT PANEL: VEHICLE CLASSIFICATION BREAKDOWN & CHARTS (340px) */}
        <div className="pointer-events-auto w-[340px] h-full flex flex-col gap-2 overflow-y-auto pr-1">
          {/* Donut Chart: Citywide Vehicle Split */}
          <div className="enterprise-card p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Citywide Vehicle Classification</span>
              </h2>
              <span className="text-[10px] text-slate-400 tabular-nums">1.24M Total</span>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CITYWIDE_DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CITYWIDE_DONUT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(val, name) => [`${val.toLocaleString()} passes (${CITYWIDE_DONUT_DATA.find(d => d.name === name)?.percentage}%)`, name]}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', padding: '6px 10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-medium">Top Class</span>
                <span className="text-xs font-bold text-[#0369A1] tabular-nums">44% 2W</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
              {CITYWIDE_DONUT_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-semibold tabular-nums ml-1">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stacked Bar Chart: Class Composition per Zone */}
          <div className="enterprise-card p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-[#0F172A] dark:text-white flex items-center justify-between">
                <span>Class Composition by Zone</span>
                <span className="text-[10px] font-normal text-slate-400">OMR vs Central Skew</span>
              </h2>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ZONE_CLASS_COMPOSITION} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeMode === 'dark' ? '#334155' : '#F1F5F9'} />
                  <XAxis dataKey="shortName" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                  />
                  <Bar dataKey="car" stackId="a" fill="#1A73E8" name="Cars" />
                  <Bar dataKey="two_wheeler" stackId="a" fill="#0369A1" name="Two-Wheelers" />
                  <Bar dataKey="auto_rickshaw" stackId="a" fill="#E8710A" name="Autos" />
                  <Bar dataKey="bus" stackId="a" fill="#188038" name="Buses" />
                  <Bar dataKey="truck" stackId="a" fill="#D93025" name="Trucks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800 leading-tight">
              📌 <strong>Key Observation:</strong> OMR skews heavily car-heavy (IT commute), whereas Central District skews two-wheeler and auto-heavy.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: ORIGIN-DESTINATION MATRIX, BOTTLENECKS & ROUTE DELAYS (410px) */}
        <div className="pointer-events-auto w-[410px] h-full flex flex-col gap-2 overflow-y-auto pr-1">
          
          {/* ORIGIN-DESTINATION MATRIX SECTION */}
          <div className="enterprise-card p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#1A73E8]" />
                <h2 className="text-xs font-bold text-[#0F172A] dark:text-white">Origin-Destination (OD) Matrix</h2>
              </div>
            </div>

            {/* Time-of-Day Selector Buttons */}
            <div className="grid grid-cols-3 gap-1 mb-2.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {OD_TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setOdTimeSlot(slot.id)}
                  className={`py-1 px-1.5 text-[10px] font-semibold rounded-md transition text-center truncate ${
                    odTimeSlot === slot.id
                      ? 'bg-white dark:bg-slate-700 text-[#1A73E8] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title={slot.description}
                >
                  {slot.label.split(' ')[0]} {slot.label.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* 5x5 OD Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-center border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                    <th className="p-1 text-left font-bold text-slate-700 dark:text-slate-300">Origin \ Dest</th>
                    {TRAFFIC_ZONES.map(z => (
                      <th key={z.id} className="p-1 w-12 truncate" title={z.name}>{z.name.split(' ')[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRAFFIC_ZONES.map((origin, rIdx) => (
                    <tr key={origin.id} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="p-1 text-left font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">
                        {origin.name.split(' ')[0]}
                      </td>
                      {TRAFFIC_ZONES.map((dest, cIdx) => {
                        const val = currentMatrix[rIdx][cIdx];
                        const isDiagonal = rIdx === cIdx;
                        const intensity = isDiagonal ? 0 : Math.min(0.85, 0.12 + (val / maxFlow) * 0.75);

                        return (
                          <td
                            key={dest.id}
                            style={{
                              backgroundColor: isDiagonal 
                                ? undefined 
                                : themeMode === 'dark' 
                                  ? `rgba(56, 189, 248, ${intensity})` 
                                  : `rgba(26, 115, 232, ${intensity})`,
                              color: !isDiagonal && val > 4500 ? '#FFFFFF' : undefined
                            }}

                            className={`p-1 font-semibold tabular-nums ${
                              isDiagonal ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400' : 'text-slate-800 dark:text-slate-100'
                            }`}
                            title={`${origin.name} → ${dest.name}: ${val.toLocaleString()} vehicles`}
                          >
                            {isDiagonal ? '—' : (val / 1000).toFixed(1) + 'k'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Plain-Language Methodology Note (Requirement 6e) */}
            <div className="mt-2.5 p-2 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-lg text-[10px] text-blue-900 dark:text-blue-200 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#1A73E8] shrink-0 mt-0.5" />
              <p className="leading-tight">
                <strong>Methodology Note:</strong> Flow estimated from time-lagged correlation between zone vehicle density drops and rises (bus-camera counts), not individual vehicle tracking.
              </p>
            </div>
          </div>

          {/* TOP CONGESTION BOTTLENECKS (Requirement 8) */}
          <div className="enterprise-card p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D93025]" />
                <h2 className="text-xs font-bold text-[#0F172A] dark:text-white">Top Congestion Bottlenecks</h2>
              </div>
              <span className="text-[10px] text-slate-400">Click to locate</span>
            </div>

            <div className="space-y-1.5">
              {TOP_BOTTLENECKS.map((bot) => (
                <div
                  key={bot.id}
                  onClick={() => flyTo(bot.lat, bot.lng, 16)}
                  className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-400 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-[#D93025] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      #{bot.rank}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">{bot.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{bot.zone} • {bot.peakHours}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <div className="text-[11px] font-bold text-[#D93025] tabular-nums">
                      -{bot.speedDropPercent}% Speed
                    </div>
                    <div className="text-[10px] text-slate-500 tabular-nums">
                      {bot.densityVph.toLocaleString()} vph
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MTC TRANSIT ROUTE DELAYS (Requirement 7) */}
          <div className="enterprise-card p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-[#188038]" />
                <h2 className="text-xs font-bold text-[#0F172A] dark:text-white">Transit Route Travel Delays</h2>
              </div>
              <span className="text-[10px] text-slate-400">Scheduled vs Actual</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {ROUTE_DELAYS.map((rt) => (
                <div key={rt.routeId} className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#1A73E8]">{rt.routeId}</span>
                      <span className="text-[10px] text-slate-500 truncate">{rt.corridor}</span>
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {rt.routeName}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums inline-block ${
                      rt.severity === 'Critical' ? 'bg-red-100 text-[#D93025] dark:bg-red-950 dark:text-red-300' :
                      rt.severity === 'High' ? 'bg-amber-100 text-[#E8710A] dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      +{rt.delayMin} min delay
                    </span>
                    <div className="text-[9px] text-slate-400 mt-0.5">{rt.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrafficPage;
