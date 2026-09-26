import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  Sparkles, 
  ArrowUpRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useStore } from '../store/useStore';
import { ROUTE_CONGESTION_TRENDS, OCCUPANCY_HEATMAP, AI_RECOMMENDATIONS } from '../data/insightsData';

export const InsightsPage = () => {
  const { defects } = useStore();
  const [sortField, setSortField] = useState('priorityScore');

  // Sorted list for ranked table
  const sortedDefects = [...defects].sort((a, b) => {
    if (sortField === 'priorityScore') return b.priorityScore - a.priorityScore;
    if (sortField === 'detectionCount') return b.detectionCount - a.detectionCount;
    if (sortField === 'daysUnresolved') return b.daysUnresolved - a.daysUnresolved;
    return 0;
  }).slice(0, 15);

  return (
    <div className="absolute inset-0 pointer-events-auto z-20 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto p-6 pl-[88px] space-y-6 text-[#0F172A] dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
        <div>
          <h1 className="text-lg font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1A73E8]" />
            <span>Transit fleet predictive insights & analytics</span>
          </h1>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
            Corridor congestion patterns, capacity optimization, and prioritized infrastructure repair scheduling
          </p>
        </div>
        <div className="text-xs text-[#64748B] dark:text-slate-400 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 rounded-md">
          Continuous telemetry analytics
        </div>
      </div>

      {/* SECTION 1: CAPACITY OPTIMIZATION RECOMMENDATIONS */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#0F172A] dark:text-slate-200">
          Capacity optimization recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {AI_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              className="enterprise-card p-3.5 space-y-2 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A73E8]">
                  Route {rec.route}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {rec.status}
                </span>
              </div>
              
              <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-100 leading-snug">
                {rec.action}
              </div>

              <div className="text-[11px] text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#94A3B8]" />
                <span>{rec.timeSlot}</span>
                <span className="font-medium text-[#0F172A] dark:text-slate-200 tabular-nums">({rec.peakOccupancy})</span>
              </div>

              <div className="text-[11px] text-[#64748B] dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                {rec.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: CORRIDOR CONGESTION INDEX (6AM - 10PM) */}
      <div className="enterprise-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A] dark:text-slate-200">
              Corridor congestion index (06:00 – 22:00)
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Hourly traffic density observed by transit cameras along major arterial routes
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8]" /> Anna Salai
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8710A]" /> OMR IT Corridor
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#188038]" /> GST Road
            </span>
          </div>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ROUTE_CONGESTION_TRENDS}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#E2E8F0', 
                  borderRadius: '8px', 
                  fontSize: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                }} 
              />
              <Line type="monotone" dataKey="AnnaSalai" stroke="#1A73E8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="OMR" stroke="#E8710A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="GST" stroke="#188038" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 3: PASSENGER OCCUPANCY HEAT-GRID MATRIX */}
      <div className="enterprise-card p-4 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-[#0F172A] dark:text-slate-200">
            Route passenger occupancy heat-grid
          </h2>
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            Transit routes vs. hour of day (% vehicle capacity)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-slate-700 text-[11px] text-[#64748B]">
                <th className="p-2 min-w-[120px] font-medium">Route</th>
                {['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'].map((h) => (
                  <th key={h} className="p-1.5 text-center font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OCCUPANCY_HEATMAP.map((row) => (
                <tr key={row.route} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2 font-medium">
                    <div className="text-[#1A73E8] font-semibold">{row.route}</div>
                    <div className="text-[10px] text-[#64748B] truncate max-w-[120px]">{row.name}</div>
                  </td>
                  {row.hours.map((val, idx) => {
                    const bgColor = val > 115 ? 'bg-red-100 text-[#D93025] font-semibold' :
                                    val > 90 ? 'bg-amber-100 text-[#E8710A] font-semibold' :
                                    val > 70 ? 'bg-blue-50 text-[#1A73E8]' :
                                    'bg-slate-50 text-[#64748B]';
                    return (
                      <td key={idx} className="p-1 text-center">
                        <div className={`py-1 rounded text-[10px] tabular-nums ${bgColor}`}>
                          {val}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: RANKED REPAIR PRIORITY TABLE */}
      <div className="enterprise-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A] dark:text-slate-200">
              Ranked repair priority master matrix
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Prioritized algorithm rankings across detected corridor road defects
            </p>
          </div>
          
          {/* Sort Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#64748B]">Sort:</span>
            {['priorityScore', 'detectionCount', 'daysUnresolved'].map((field) => (
              <button
                key={field}
                onClick={() => setSortField(field)}
                className={`px-2.5 py-1 rounded border text-xs transition ${
                  sortField === field 
                    ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#1A73E8]/30 font-semibold' 
                    : 'bg-white dark:bg-slate-800 text-[#64748B] border-[#E2E8F0] dark:border-slate-700'
                }`}
              >
                {field === 'priorityScore' ? 'Priority score' : field === 'detectionCount' ? 'Detections' : 'Days open'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-slate-700 text-[#64748B] text-[11px]">
                <th className="p-2.5 font-medium">Rank</th>
                <th className="p-2.5 font-medium">ID</th>
                <th className="p-2.5 font-medium">Defect type</th>
                <th className="p-2.5 font-medium">Location</th>
                <th className="p-2.5 font-medium">Severity</th>
                <th className="p-2.5 text-center font-medium">Fleet passes</th>
                <th className="p-2.5 text-center font-medium">Days open</th>
                <th className="p-2.5 text-center font-medium">Score</th>
                <th className="p-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedDefects.map((d, index) => (
                <tr key={d.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-2.5 text-[#94A3B8] tabular-nums">#{index + 1}</td>
                  <td className="p-2.5 font-semibold text-[#1A73E8]">{d.id}</td>
                  <td className="p-2.5 font-medium text-[#0F172A] dark:text-slate-200">{d.type}</td>
                  <td className="p-2.5 text-[#64748B]">
                    <div>{d.locationName}</div>
                    <div className="text-[10px] text-[#94A3B8]">{d.zone}</div>
                  </td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      d.severity === 'Critical' ? 'bg-red-50 text-[#D93025]' :
                      d.severity === 'High' ? 'bg-orange-50 text-[#E8710A]' :
                      d.severity === 'Medium' ? 'bg-amber-50 text-[#F9AB00]' :
                      'bg-green-50 text-[#188038]'
                    }`}>
                      {d.severity}
                    </span>
                  </td>
                  <td className="p-2.5 text-center tabular-nums text-[#64748B]">{d.detectionCount}x</td>
                  <td className="p-2.5 text-center tabular-nums text-[#64748B]">{d.daysUnresolved}d</td>
                  <td className="p-2.5 text-center">
                    <span className="font-semibold text-xs tabular-nums text-[#0F172A] dark:text-slate-100">
                      {d.priorityScore}
                    </span>
                  </td>
                  <td className="p-2.5 text-right text-[11px] text-[#64748B]">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
