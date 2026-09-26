import React, { useEffect, useState } from 'react';
import { 
  Bus, 
  Activity, 
  AlertTriangle, 
  Gauge, 
  Users, 
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Radio
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useStore } from '../store/useStore';

const CATEGORY_DATA = [
  { name: 'Pothole', value: 45, color: '#D93025' },
  { name: 'Cracks', value: 32, color: '#E8710A' },
  { name: 'Missing Infra', value: 24, color: '#F9AB00' },
  { name: 'Safety Hazards', value: 18, color: '#1A73E8' }
];

const SPEED_PROFILE_DATA = [
  { time: '06:00', speed: 42 },
  { time: '08:00', speed: 18 },
  { time: '10:00', speed: 28 },
  { time: '12:00', speed: 36 },
  { time: '14:00', speed: 38 },
  { time: '16:00', speed: 24 },
  { time: '18:00', speed: 15 },
  { time: '20:00', speed: 30 }
];

export const CommandCenterPage = () => {
  const { defects, openDetailDrawer, addLiveNotification, flyTo } = useStore();
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'summary'

  const [liveFeed, setLiveFeed] = useState(() => {
    return defects.slice(0, 8).map((d, idx) => ({
      ...d,
      title: `${d.type} Detected`,
      road: d.locationName,
      time: idx === 0 ? 'Just now' : idx === 1 ? '3 min ago' : idx === 2 ? '7 min ago' : `${(idx + 1) * 5} min ago`
    }));
  });

  // Periodic simulated live events from real dataset items
  useEffect(() => {
    const interval = setInterval(() => {
      if (!defects || defects.length === 0) return;
      const randomDefect = defects[Math.floor(Math.random() * defects.length)];
      const newEvent = {
        ...randomDefect,
        id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `${randomDefect.type} Detected`,
        road: randomDefect.locationName,
        time: 'Just now',
        lastDetected: `2026-09-26 ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      };

      setLiveFeed((prev) => [newEvent, ...prev.slice(0, 7)]);

      if (randomDefect.severity === 'Critical') {
        addLiveNotification({
          id: Date.now(),
          title: `Critical Alert: ${randomDefect.type}`,
          message: `${randomDefect.locationName} flagged by fleet camera.`,
          time: 'Just now',
          severity: 'Critical'
        });
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [defects, addLiveNotification]);

  const kpis = [
    {
      id: 'buses',
      label: 'Buses online',
      value: '12 / 12',
      delta: '100% active on routes',
      icon: Bus,
      tooltip: 'Real-time telemetry from all connected municipal transit vehicles'
    },
    {
      id: 'events',
      label: 'Events today',
      value: '142',
      delta: '+18 in last hour',
      icon: Activity,
      tooltip: 'Total infrastructure defects and traffic events detected today'
    },
    {
      id: 'critical',
      label: 'Critical open',
      value: '14',
      delta: 'Action required',
      isCritical: true,
      icon: AlertTriangle,
      tooltip: 'Severe road defects and incidents awaiting municipal work orders'
    },
    {
      id: 'speed',
      label: 'Avg corridor speed',
      value: '22.4',
      unit: 'km/h',
      delta: '-2.1 km/h vs baseline',
      icon: Gauge,
      tooltip: 'Aggregated vehicle speed across all monitored transit routes'
    },
    {
      id: 'occupancy',
      label: 'Fleet occupancy',
      value: '78%',
      delta: '+4% peak hour surge',
      icon: Users,
      tooltip: 'Average passenger capacity utilization across city network'
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 pl-[76px]">
      {/* 5 CLEAN KPI CARDS IN A SINGLE ROW (NO OVERLAP WITH SIDEBAR OR TITLE CHIP) */}
      <div className="pointer-events-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full pt-9">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={kpi.id}
              title={kpi.tooltip}
              className="enterprise-card p-3.5 flex flex-col justify-between transition hover:shadow-md cursor-default bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  {kpi.label}
                </span>
                <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>

              <div className="my-1.5 flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-slate-900 dark:text-white tabular-nums leading-none">
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {kpi.unit}
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                {kpi.isCritical && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D93025] pulse-critical shrink-0" />
                )}
                <span className={kpi.isCritical ? 'text-[#D93025] font-semibold' : ''}>
                  {kpi.delta}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT COLUMN: ONE PANEL WITH TABS "Live events | Summary" */}
      <div className="pointer-events-auto self-end w-full sm:w-[350px] enterprise-card bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col shadow-md mt-auto mr-16">
        {/* Panel Header with Tabs */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 px-3 pt-2 pb-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('live')}
              className={`pb-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'live'
                  ? 'border-[#1A73E8] text-[#1A73E8] dark:text-sky-400'
                  : 'border-transparent text-slate-700 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Live events
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'summary'
                  ? 'border-[#1A73E8] text-[#1A73E8] dark:text-sky-400'
                  : 'border-transparent text-slate-700 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Summary
            </button>
          </div>

          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium pb-2">
            {activeTab === 'live' ? 'Auto-refresh' : 'Last 24h'}
          </div>
        </div>

        {/* TAB 1: LIVE EVENTS */}
        {activeTab === 'live' && (
          <div className="p-2 space-y-1 max-h-[310px] overflow-y-auto bg-white dark:bg-[#1E293B]">
            {liveFeed.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-600 dark:text-slate-400">
                No recent live events recorded.
              </div>
            ) : (
              liveFeed.map((item) => {
                const sevColor = item.severity === 'Critical' ? '#D93025' :
                                 item.severity === 'High' ? '#E8710A' :
                                 item.severity === 'Medium' ? '#F9AB00' : '#188038';
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.lat && item.lng) {
                        flyTo(item.lat, item.lng, 16);
                      }
                      openDetailDrawer(item, 'defect');
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span 
                        className={`w-2 h-2 rounded-full shrink-0 ${item.severity === 'Critical' ? 'pulse-critical' : ''}`}
                        style={{ backgroundColor: sevColor }} 
                      />
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          {item.road}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium shrink-0 ml-2 tabular-nums">
                      {item.time}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: SUMMARY (Flat charts, 2-3 colors max, light gridlines, readable axis labels) */}
        {activeTab === 'summary' && (
          <div className="p-3.5 space-y-3.5 max-h-[310px] overflow-y-auto">
            {/* Category Breakdown */}
            <div>
              <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 mb-1 flex items-center justify-between">
                <span>Defects by category</span>
                <span className="text-[10px] text-[#64748B] tabular-nums">142 total</span>
              </div>
              <div className="h-24 w-full flex items-center">
                <ResponsiveContainer width="45%" height="100%">
                  <PieChart>
                    <Pie data={CATEGORY_DATA} dataKey="value" innerRadius={20} outerRadius={36} paddingAngle={2}>
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-[55%] space-y-1 text-[10px]">
                  {CATEGORY_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[#475569] dark:text-slate-300 truncate">{item.name}</span>
                      </div>
                      <span className="text-[#64748B] dark:text-slate-400 tabular-nums font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Corridor Speed Profile */}
            <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-700">
              <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 mb-1 flex items-center justify-between">
                <span>Corridor speed profile (km/h)</span>
                <span className="text-[10px] text-[#188038] tabular-nums">Min 15 km/h</span>
              </div>
              <div className="h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SPEED_PROFILE_DATA}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="2 2" vertical={false} />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} tickLine={false} />
                    <YAxis hide domain={[0, 50]} />
                    <Area type="monotone" dataKey="speed" stroke="#1A73E8" strokeWidth={1.5} fill="#E8F0FE" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandCenterPage;
