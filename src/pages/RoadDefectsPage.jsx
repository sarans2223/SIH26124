import React from 'react';
import { 
  SlidersHorizontal,
  ChevronRight,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DEFECT_TYPES, ZONES, SEVERITIES } from '../data/defectsData';
import { DetailDrawer } from '../components/DetailDrawer';

const SEVERITY_COLORS = {
  Critical: '#D93025',
  High: '#E8710A',
  Medium: '#F9AB00',
  Low: '#188038'
};

export const RoadDefectsPage = () => {
  const { 
    defects, 
    defectFilters, 
    setDefectTypes, 
    setDefectSeverities, 
    setDefectStatuses, 
    setDefectZones, 
    setDefectDateRange,
    openDetailDrawer,
    flyTo
  } = useStore();

  // Summary counts
  const totalOpen = defects.filter(d => d.status === 'Open' || d.status === 'New').length;
  const totalCritical = defects.filter(d => d.severity === 'Critical').length;
  const newToday = defects.filter(d => d.status === 'New').length;
  const resolved = defects.filter(d => d.status === 'Resolved' || d.status === 'Verified Closed').length;

  // Filtered defects for ranked right list
  const filteredList = defects.filter(d => {
    if (!defectFilters.types.includes(d.type)) return false;
    if (!defectFilters.severities.includes(d.severity)) return false;
    if (!defectFilters.statuses.includes(d.status)) return false;
    if (!defectFilters.zones.includes(d.zone)) return false;
    return true;
  });

  const allTypeIds = DEFECT_TYPES.map(t => t.id);

  const toggleType = (tId) => {
    const isSingleSelected = defectFilters.types.length === 1 && defectFilters.types[0] === tId;
    if (isSingleSelected) {
      setDefectTypes(allTypeIds);
    } else {
      setDefectTypes([tId]);
      const topDefect = defects.find(d => d.type === tId);
      if (topDefect && topDefect.lat && topDefect.lng) {
        flyTo(topDefect.lat, topDefect.lng, 15);
      }
    }
  };

  const toggleSeverity = (sev) => {
    if (defectFilters.severities.includes(sev)) {
      setDefectSeverities(defectFilters.severities.filter(s => s !== sev));
    } else {
      setDefectSeverities([...defectFilters.severities, sev]);
    }
  };

  const toggleZone = (zId) => {
    if (defectFilters.zones.includes(zId)) {
      setDefectZones(defectFilters.zones.filter(z => z !== zId));
    } else {
      setDefectZones([...defectFilters.zones, zId]);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex justify-between p-4 pl-[76px] overflow-hidden">
      {/* LEFT FLOATING FILTER PANEL (310px) - PANEL 1 */}
      <div className="pointer-events-auto w-full sm:w-[310px] h-[calc(100%-36px)] mt-9 flex flex-col enterprise-card overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-[#E2E8F0] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span className="font-semibold text-xs text-[#0F172A] dark:text-slate-100">Filter road defects</span>
          </div>
          <span className="text-[11px] text-[#64748B] dark:text-slate-400 tabular-nums">
            {filteredList.length} shown
          </span>
        </div>

        <div className="p-3 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {/* Summary Chips */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700">
              <div className="text-[11px] text-[#64748B] dark:text-slate-400">Total open</div>
              <div className="text-base font-semibold text-[#0F172A] dark:text-slate-100 tabular-nums">{totalOpen}</div>
            </div>
            <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700">
              <div className="text-[11px] text-[#D93025]">Critical</div>
              <div className="text-base font-semibold text-[#D93025] tabular-nums">{totalCritical}</div>
            </div>
            <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700">
              <div className="text-[11px] text-[#E8710A]">New today</div>
              <div className="text-base font-semibold text-[#E8710A] tabular-nums">{newToday}</div>
            </div>
            <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700">
              <div className="text-[11px] text-[#188038]">Resolved</div>
              <div className="text-base font-semibold text-[#188038] tabular-nums">{resolved}</div>
            </div>
          </div>

          {/* Date Range Selector */}
          <div>
            <label className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1 block">Date range</label>
            <div className="grid grid-cols-3 gap-1 bg-[#F8FAFC] dark:bg-slate-800/60 p-1 rounded-lg border border-[#E2E8F0] dark:border-slate-700">
              {['Today', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDefectDateRange(range)}
                  className={`py-1 rounded text-xs transition ${
                    defectFilters.dateRange === range 
                      ? 'bg-white dark:bg-slate-700 text-[#1A73E8] dark:text-sky-300 font-semibold shadow-xs' 
                      : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Defect Type Isolation Toggles */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Defect type</label>
              {defectFilters.types.length < allTypeIds.length && (
                <button
                  onClick={() => setDefectTypes(allTypeIds)}
                  className="text-[10px] text-[#1A73E8] hover:underline font-semibold"
                >
                  Reset (Show All)
                </button>
              )}
            </div>
            <div className="space-y-1">
              {DEFECT_TYPES.map((t) => {
                const count = defects.filter(d => d.type === t.id).length;
                const isSelected = defectFilters.types.length === 1 && defectFilters.types[0] === t.id;
                const isIncluded = defectFilters.types.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleType(t.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition ${
                      isSelected 
                        ? 'bg-[#E8F0FE] dark:bg-blue-950/80 border-[#1A73E8] text-[#1A73E8] dark:text-sky-300 font-bold shadow-xs ring-1 ring-[#1A73E8]/30' 
                        : isIncluded && defectFilters.types.length < allTypeIds.length
                        ? 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-medium'
                        : 'bg-white dark:bg-slate-900/40 border-[#E2E8F0] dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                      <span className="text-xs">{t.label}</span>
                    </div>
                    <span className={`text-[11px] tabular-nums font-semibold px-1.5 py-0.2 rounded ${isSelected ? 'bg-[#1A73E8] text-white' : 'text-slate-700 dark:text-slate-300'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity Segments */}
          <div>
            <label className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1 block">Severity</label>
            <div className="grid grid-cols-2 gap-1.5">
              {SEVERITIES.map((sev) => {
                const isSelected = defectFilters.severities.includes(sev);
                return (
                  <button
                    key={sev}
                    onClick={() => toggleSeverity(sev)}
                    className={`py-1.5 px-2 rounded-lg border text-xs flex items-center justify-between transition ${
                      isSelected 
                        ? 'bg-slate-50 dark:bg-slate-800 border-[#CBD5E1] dark:border-slate-600 text-[#0F172A] dark:text-slate-100 font-medium' 
                        : 'bg-white dark:bg-slate-900/40 border-[#E2E8F0] dark:border-slate-800 text-[#94A3B8]'
                    }`}
                  >
                    <span>{sev}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[sev] }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone Filter */}
          <div>
            <label className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1 block">Corridor / Zone</label>
            <div className="space-y-1">
              {ZONES.map((z) => {
                const isSelected = defectFilters.zones.includes(z.id);
                return (
                  <button
                    key={z.id}
                    onClick={() => toggleZone(z.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs transition flex justify-between items-center ${
                      isSelected 
                        ? 'bg-[#E8F0FE] dark:bg-slate-800 border-[#1A73E8]/40 text-[#1A73E8] dark:text-sky-300 font-medium' 
                        : 'bg-white dark:bg-slate-900/40 border-[#E2E8F0] dark:border-slate-800 text-[#64748B]'
                    }`}
                  >
                    <span>{z.name}</span>
                    <span className="text-[10px] text-[#94A3B8] tabular-nums">
                      {defects.filter(d => d.zone === z.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FLOATING RANKED REPAIRS LIST (340px) - PANEL 2 */}
      <div className="pointer-events-auto w-full sm:w-[340px] h-[calc(100%-36px)] mt-9 mr-16 flex flex-col enterprise-card overflow-hidden">
        <div className="p-3 border-b border-[#E2E8F0] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <div>
            <div className="font-semibold text-xs text-[#0F172A] dark:text-slate-100">Prioritized repairs</div>
            <div className="text-[10px] text-[#64748B] dark:text-slate-400">Ranked by risk and transit frequency</div>
          </div>
          <span className="text-xs text-[#1A73E8] font-semibold tabular-nums">
            {filteredList.length} items
          </span>
        </div>

        <div className="p-2 space-y-1.5 overflow-y-auto flex-1">
          {filteredList.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-[#94A3B8]" />
              No defects match the selected filters.
            </div>
          ) : (
            filteredList.map((item, idx) => {
              const sevColor = SEVERITY_COLORS[item.severity] || '#1A73E8';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    flyTo(item.lat, item.lng);
                    openDetailDrawer(item, 'defect');
                  }}
                  className="p-2.5 rounded-lg border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-2 truncate flex-1">
                    <span className="text-[11px] font-semibold text-[#94A3B8] w-3.5 shrink-0 tabular-nums pt-0.5">
                      {idx + 1}
                    </span>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.type}
                        loading="lazy"
                        className="w-12 h-9 rounded object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <div className="truncate">
                      <div className="flex items-center gap-1 font-medium text-[#0F172A] dark:text-slate-200">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sevColor }} />
                        <span className="truncate">{item.type}</span>
                      </div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate mt-0.5">
                        {item.locationName}
                      </div>
                      <div className="text-[9px] text-[#94A3B8] tabular-nums mt-0.5">
                        {item.daysUnresolved}d open • {item.detectionCount}x passes
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[9px] text-[#64748B]">Score</div>
                    <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-100 tabular-nums">
                      {item.priorityScore}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <DetailDrawer />
    </div>
  );
};

export default RoadDefectsPage;
