import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  EyeOff, 
  BarChart3, 
  ShieldAlert, 
  Box,
  Car,
  Search,
  Pin,
  PinOff,
  Bell,
  Sun,
  Moon,
  User,
  Sliders,
  Flame,
  Layers,
  Bus,
  CheckCircle2,
  X
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { CITY_CONFIG } from '../config/cityConfig';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarPinned, 
    toggleSidebarPinned,
    searchQuery,
    setSearchQuery,
    themeMode,
    toggleThemeMode,
    defects,
    missingInfra,
    incidents,
    notifications,
    unreadAlertCount,
    clearNotifications
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isExpanded = sidebarPinned || isHovered;

  const navItems = [
    { id: 'command', label: 'Overview', icon: LayoutDashboard, count: null },
    { id: 'defects', label: 'Road Defects', icon: AlertTriangle, count: defects.length },
    { id: 'missing', label: 'Missing Infrastructure', icon: EyeOff, count: missingInfra.length },
    { id: 'traffic', label: 'Traffic Management', icon: Car, count: 6 },
    { id: 'insights', label: 'Insights', icon: BarChart3, count: null },
    { id: 'incidents', label: 'Incidents', icon: ShieldAlert, count: incidents.length },
    { id: '3d-view', label: '3D City View', icon: Box, count: null }
  ];


  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowNotifications(false);
      }}
      style={{ width: isExpanded ? 240 : 64 }}
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col justify-between transition-all duration-200 ease-in-out border-r select-none ${
        themeMode === 'dark' 
          ? 'bg-[#0F172A] border-[#334155] text-slate-100' 
          : 'bg-white border-[#E2E8F0] text-[#0F172A]'
      } shadow-[1px_0_3px_rgba(0,0,0,0.05)]`}
    >
      {/* TOP: BRAND & SEARCH */}
      <div className="flex flex-col shrink-0">
        {/* Header / Brand */}
        <div className={`h-14 flex items-center px-3 border-b ${themeMode === 'dark' ? 'border-[#334155]' : 'border-[#E2E8F0]'} ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Neutral Product Logo */}
            <div className="w-8 h-8 rounded-lg bg-[#1A73E8] flex items-center justify-center shrink-0 text-white shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </div>

            {isExpanded && (
              <div className="truncate">
                <div className="text-xs font-bold tracking-tight text-[#0F172A] dark:text-white truncate">
                  Urban Fleet Intelligence
                </div>
                <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">
                  Municipal Command
                </div>
              </div>
            )}
          </div>

          {isExpanded && (
            <button
              onClick={toggleSidebarPinned}
              title={sidebarPinned ? "Unpin sidebar" : "Pin sidebar open"}
              className="p-1 rounded text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {sidebarPinned ? (
                <PinOff className="w-3.5 h-3.5 text-[#1A73E8]" />
              ) : (
                <Pin className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Search Field */}
        <div className={`p-2.5 border-b ${themeMode === 'dark' ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
          {isExpanded ? (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search defects, roads..."
                className={`w-full text-xs pl-8 pr-7 py-1.5 rounded-lg border outline-none transition ${
                  themeMode === 'dark'
                    ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-blue-500'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:border-[#1A73E8] focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsHovered(true)}
              title="Search"
              className="w-full flex items-center justify-center p-2 rounded-lg text-[#64748B] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* NAVIGATION ITEMS IN ORDER: Overview, Road Defects, Missing Infrastructure, Insights, Incidents */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={!isExpanded ? item.label : undefined}
                className={`w-full flex items-center h-10 px-2.5 rounded-lg text-xs transition relative group ${
                  isActive
                    ? themeMode === 'dark'
                      ? 'bg-[#1E293B] text-[#38BDF8] border-l-[3px] border-[#38BDF8] font-semibold'
                      : 'bg-[#E8F0FE] text-[#1A73E8] border-l-[3px] border-[#1A73E8] font-semibold'
                    : 'border-l-[3px] border-transparent text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1A73E8] dark:text-[#38BDF8]' : 'text-slate-600 dark:text-slate-400'}`} />

                {isExpanded && (
                  <div className="ml-2.5 flex-1 flex items-center justify-between truncate text-left">
                    <span className="truncate">{item.label}</span>
                    {item.count !== null && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[11px] tabular-nums font-semibold ${
                        isActive
                          ? themeMode === 'dark'
                            ? 'bg-[#0369A1] text-white'
                            : 'bg-[#D2E3FC] text-[#1A73E8]'
                          : 'bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                )}

                {/* Collapsed Badge Pill */}
                {!isExpanded && item.count !== null && (
                  <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#1A73E8] text-white text-[9px] font-bold tabular-nums flex items-center justify-center">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION: ALERTS, THEME, PROFILE & DEMO DATA FOOTER */}
      <div className={`p-2 border-t ${themeMode === 'dark' ? 'border-[#334155]' : 'border-[#E2E8F0]'} space-y-1 relative`}>
        {/* Notifications Flyout */}
        {showNotifications && (
          <div className={`absolute bottom-full left-2 mb-2 w-72 rounded-xl border p-3 shadow-lg z-50 ${
            themeMode === 'dark' ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">Live Alerts</span>
              <span className="text-[10px] text-slate-500 tabular-nums">{notifications.length} alerts</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="p-2 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px]">
                  <div className="flex items-center justify-between font-medium">
                    <span className={n.severity === 'Critical' ? 'text-[#D93025]' : 'text-[#E8710A]'}>{n.title}</span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5 leading-snug">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Button */}
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications) clearNotifications();
          }}
          title="Notifications"
          className="w-full flex items-center h-9 px-2.5 rounded-lg text-xs text-[#64748B] hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800/60 transition"
        >
          <div className="relative shrink-0">
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D93025]" />
            )}
          </div>
          {isExpanded && (
            <div className="ml-2.5 flex-1 flex items-center justify-between">
              <span>Notifications</span>
              {unreadAlertCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-semibold tabular-nums">
                  {unreadAlertCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleThemeMode}
          title={themeMode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          className="w-full flex items-center h-9 px-2.5 rounded-lg text-xs text-[#64748B] hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800/60 transition"
        >
          {themeMode === 'light' ? (
            <Moon className="w-4 h-4 shrink-0" />
          ) : (
            <Sun className="w-4 h-4 shrink-0 text-amber-400" />
          )}
          {isExpanded && (
            <span className="ml-2.5">
              {themeMode === 'light' ? 'Dark theme' : 'Light theme'}
            </span>
          )}
        </button>

        {/* User Profile ("Control Room") */}
        <div className="flex items-center h-10 px-2 rounded-lg text-xs text-[#64748B] dark:text-slate-300">
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          {isExpanded && (
            <div className="ml-2.5 truncate">
              <div className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">
                Control Room
              </div>
              <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">
                GIS Operator
              </div>
            </div>
          )}
        </div>

        {/* Tiny demo data label in footer */}
        {isExpanded ? (
          <div className="px-2 pt-1 text-[10px] text-[#94A3B8] dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
            {CITY_CONFIG.dataModeLabel} • {CITY_CONFIG.city}
          </div>
        ) : (
          <div className="text-center text-[8px] text-[#94A3B8] dark:text-slate-500 pt-0.5">
            Demo
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
