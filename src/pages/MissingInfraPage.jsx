import React from 'react';
import { 
  Sliders, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  MapPin
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { INFRA_CATEGORIES, INFRA_STATUSES, SOURCES, getZoneComplianceScores } from '../data/missingInfraData';
import { DetailDrawer } from '../components/DetailDrawer';

export const MissingInfraPage = () => {
  const { 
    missingInfra, 
    infraFilters, 
    setInfraCategory, 
    setInfraStatuses, 
    setInfraSource, 
    setInfraConfidenceThreshold,
    openDetailDrawer,
    flyTo,
    addWorkOrder
  } = useStore();

  const zoneCompliance = getZoneComplianceScores(missingInfra);

  const filteredItems = missingInfra.filter(i => {
    if (infraFilters.category !== 'All' && i.category !== infraFilters.category) return false;
    if (!infraFilters.statuses.includes(i.status)) return false;
    if (infraFilters.source !== 'All' && i.expectedSource !== infraFilters.source) return false;
    if (i.confidence < infraFilters.confidenceThreshold) return false;
    return true;
  });

  const toggleStatus = (stId) => {
    if (infraFilters.statuses.includes(stId)) {
      setInfraStatuses(infraFilters.statuses.filter(id => id !== stId));
    } else {
      setInfraStatuses([...infraFilters.statuses, stId]);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex justify-between p-4 pl-[76px] overflow-hidden">
      {/* LEFT FLOATING CATEGORY & FILTER PANEL (310px) - PANEL 1 */}
      <div className="pointer-events-auto w-full sm:w-[310px] h-[calc(100%-36px)] mt-9 flex flex-col enterprise-card overflow-hidden">
        <div className="p-3 border-b border-[#E2E8F0] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <div>
            <div className="font-semibold text-xs text-[#0F172A] dark:text-slate-100">Missing infrastructure</div>
            <div className="text-[10px] text-[#64748B] dark:text-slate-400">Baseline vs. camera detection</div>
          </div>
          <span className="text-xs text-[#1A73E8] font-semibold tabular-nums">
            {filteredItems.length} items
          </span>
        </div>

        <div className="p-3 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {/* Category Cards */}
          <div>
            <label className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1 block">Category</label>
            <div className="space-y-1">
              <button
                onClick={() => setInfraCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg border flex items-center justify-between transition ${
                  infraFilters.category === 'All' 
                    ? 'bg-[#E8F0FE] dark:bg-slate-800 border-[#1A73E8]/40 text-[#1A73E8] dark:text-sky-300 font-semibold' 
                    : 'bg-white dark:bg-slate-900/40 border-[#E2E8F0] dark:border-slate-800 text-[#64748B]'
                }`}
              >
                <span>All categories</span>
                <span className="tabular-nums text-xs">{missingInfra.length}</span>
              </button>

              {INFRA_CATEGORIES.map((cat) => {
                const count = missingInfra.filter(i => i.category === cat.id).length;
                const isSelected = infraFilters.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setInfraCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg border transition flex items-center justify-between ${
                      isSelected 
                        ? 'bg-[#E8F0FE] dark:bg-slate-800 border-[#1A73E8]/40 text-[#1A73E8] dark:text-sky-300 font-semibold' 
                        : 'bg-white dark:bg-slate-900/40 border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{cat.label}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[180px]">{cat.description}</div>
                    </div>
                    <span className="tabular-nums text-xs text-slate-700 dark:text-slate-300 font-medium">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1 block">Status</label>
            <div className="grid grid-cols-2 gap-1.5">
              {INFRA_STATUSES.map((st) => {
                const isChecked = infraFilters.statuses.includes(st.id);
                return (
                  <button
                    key={st.id}
                    onClick={() => toggleStatus(st.id)}
                    className={`py-1.5 px-2 rounded-lg border text-xs transition flex items-center justify-between ${
                      isChecked 
                        ? 'bg-slate-50 dark:bg-slate-800 border-[#CBD5E1] dark:border-slate-600 text-[#0F172A] dark:text-slate-100 font-medium' 
                        : 'bg-white dark:bg-slate-900/40 border-[#E2E8F0] dark:border-slate-800 text-[#94A3B8]'
                    }`}
                  >
                    <span>{st.id}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expected Source Filter */}
          <div>
            <label className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1 block">Source</label>
            <div className="grid grid-cols-3 gap-1 bg-[#F8FAFC] dark:bg-slate-800/60 p-1 rounded-lg border border-[#E2E8F0] dark:border-slate-700">
              {['All', ...SOURCES].map((src) => (
                <button
                  key={src}
                  onClick={() => setInfraSource(src)}
                  className={`py-1 rounded text-[11px] transition truncate px-1 ${
                    infraFilters.source === src 
                      ? 'bg-white dark:bg-slate-700 text-[#1A73E8] dark:text-sky-300 font-semibold shadow-xs' 
                      : 'text-[#64748B]'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1">
              <span>Confidence threshold</span>
              <span className="tabular-nums font-semibold text-[#1A73E8]">{infraFilters.confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={infraFilters.confidenceThreshold}
              onChange={(e) => setInfraConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-[#1A73E8] h-1.5 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-700"
            />
          </div>
        </div>
      </div>

      {/* RIGHT FLOATING COMPLIANCE & ACTION LIST (340px) - PANEL 2 */}
      <div className="pointer-events-auto w-full sm:w-[340px] h-[calc(100%-36px)] mt-9 mr-16 flex flex-col enterprise-card overflow-hidden">
        {/* Compliance Summary */}
        <div className="p-3 border-b border-[#E2E8F0] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 shrink-0 space-y-2">
          <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-100">Corridor compliance rating</div>
          <div className="space-y-1.5 text-[11px]">
            {zoneCompliance.map((zc) => (
              <div key={zc.zone}>
                <div className="flex justify-between text-[#64748B] dark:text-slate-300 mb-0.5">
                  <span>{zc.zone}</span>
                  <span className="tabular-nums font-medium text-[#0F172A] dark:text-slate-100">{zc.score}% compliant</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${zc.score > 70 ? 'bg-[#188038]' : zc.score > 40 ? 'bg-[#F9AB00]' : 'bg-[#D93025]'}`}
                    style={{ width: `${zc.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Missing Items List */}
        <div className="p-2 space-y-2 overflow-y-auto flex-1">
          <div className="text-[11px] font-medium text-[#64748B] px-1">Audited items</div>
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No infrastructure items meet the filter criteria.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  flyTo(item.expectedLat, item.expectedLng);
                  openDetailDrawer(item, 'missing');
                }}
                className="p-2.5 rounded-lg border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#0F172A] dark:text-slate-200">{item.category}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    item.status === 'MISSING' ? 'bg-red-50 text-[#D93025] dark:bg-red-950/60' :
                    item.status === 'DEGRADED' ? 'bg-amber-50 text-[#E8710A] dark:bg-amber-950/60' :
                    'bg-blue-50 text-[#1A73E8] dark:bg-blue-950/60'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#64748B] dark:text-slate-400">
                  {item.locationName}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>{item.ruleBadge}</span>
                  <span className="tabular-nums">{item.passesChecked}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addWorkOrder(item);
                    alert(`Dispatched work order for ${item.id}`);
                  }}
                  className="w-full py-1 px-2 rounded bg-slate-100 dark:bg-slate-700 hover:bg-[#1A73E8] hover:text-white text-[#1A73E8] dark:text-sky-300 font-medium text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Dispatch work order</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <DetailDrawer />
    </div>
  );
};

export default MissingInfraPage;
