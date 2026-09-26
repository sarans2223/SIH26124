import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Bus, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Wrench, 
  ShieldCheck, 
  School,
  Building
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { EvidenceCanvas } from './EvidenceCanvas';

export const DetailDrawer = () => {
  const { 
    detailDrawerOpen, 
    closeDetailDrawer, 
    selectedItem, 
    selectedItemType,
    updateDefectStatus,
    updateInfraStatus,
    addWorkOrder
  } = useStore();

  if (!detailDrawerOpen || !selectedItem) return null;

  const isDefect = selectedItemType === 'defect';
  const isInfra = selectedItemType === 'missing';
  const isIncident = selectedItemType === 'incident';

  const statusList = isDefect 
    ? ['New', 'Open', 'Under Repair', 'Resolved', 'Verified Closed']
    : ['MISSING', 'DEGRADED', 'UNMAPPED', 'OK'];

  const currentStatusIndex = isDefect ? statusList.indexOf(selectedItem.status) : 0;

  const handleStatusChange = (newStatus) => {
    if (isDefect) {
      updateDefectStatus(selectedItem.id, newStatus);
    } else if (isInfra) {
      updateInfraStatus(selectedItem.id, newStatus);
    }
  };

  const handleCreateWorkOrder = () => {
    addWorkOrder(selectedItem);
    alert(`Work order dispatched to municipal zone engineer for ${selectedItem.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop for click-to-close */}
      <div 
        onClick={closeDetailDrawer}
        className="absolute inset-0 bg-black/20 pointer-events-auto"
      />

      {/* Solid Enterprise Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[440px] bg-white dark:bg-[#1E293B] border-l border-[#E2E8F0] dark:border-slate-700 shadow-xl pointer-events-auto flex flex-col text-[#0F172A] dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-3.5 border-b border-[#E2E8F0] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-[#1A73E8] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              {selectedItem.id}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              selectedItem.severity === 'Critical' ? 'bg-red-50 text-[#D93025]' :
              selectedItem.severity === 'High' ? 'bg-orange-50 text-[#E8710A]' :
              selectedItem.status === 'MISSING' ? 'bg-red-50 text-[#D93025]' :
              'bg-amber-50 text-[#F9AB00]'
            }`}>
              {selectedItem.severity || selectedItem.status}
            </span>
          </div>

          <button
            onClick={closeDetailDrawer}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Title & Location */}
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 leading-snug">
              {selectedItem.type || selectedItem.category}
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-[#64748B] dark:text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
              <span>{selectedItem.locationName} ({selectedItem.zone})</span>
            </div>
          </div>

          {/* Real Camera Evidence Photo */}
          <div>
            <div className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Camera visual evidence</span>
              <span className="tabular-nums font-semibold text-[#1A73E8]">{selectedItem.confidence}% match confidence</span>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#E2E8F0] dark:border-slate-700 bg-slate-100 dark:bg-slate-800 relative shadow-inner">
              <img
                src={selectedItem.image || '/evidence/pothole_1.jpg'}
                alt={selectedItem.type || selectedItem.category}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Camera evidence photo</span>
              <span>Pass ID: PASS-{(selectedItem.id || '8492').replace(/\D/g, '') || '8492'}</span>
            </div>
          </div>

          {/* Lifecycle Status Stepper (for Defects) */}
          {isDefect && (
            <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-3 rounded-lg border border-[#E2E8F0] dark:border-slate-700">
              <div className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-2">Repair lifecycle status</div>
              <div className="flex items-center justify-between">
                {statusList.map((st, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={st} className="flex flex-col items-center flex-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold tabular-nums transition ${
                        isCurrent ? 'bg-[#1A73E8] text-white ring-2 ring-blue-100 dark:ring-blue-900' :
                        isDone ? 'bg-emerald-100 text-[#188038] border border-emerald-300' :
                        'bg-slate-100 text-[#94A3B8] border border-slate-200 dark:bg-slate-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[9px] mt-1 text-center font-medium ${isCurrent ? 'text-[#1A73E8] font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Priority Score Breakdown (for Defects) */}
          {isDefect && (
            <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-3 rounded-lg border border-[#E2E8F0] dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#64748B] dark:text-slate-400">Priority score breakdown</span>
                <span className="font-semibold text-xs text-[#0F172A] dark:text-slate-100 tabular-nums">
                  {selectedItem.priorityScore} / 100
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium mb-0.5">
                    <span>Severity weighting</span>
                    <span className="font-semibold text-[#0F172A] dark:text-slate-100">{selectedItem.severity}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D93025] rounded-full" style={{ width: `${selectedItem.severity === 'Critical' ? 100 : selectedItem.severity === 'High' ? 75 : 45}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium mb-0.5">
                    <span>Transit fleet detections</span>
                    <span className="tabular-nums font-semibold text-[#0F172A] dark:text-slate-100">{selectedItem.detectionCount} passes</span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: `${Math.min(100, (selectedItem.detectionCount / 30) * 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium mb-0.5">
                    <span>Days unresolved</span>
                    <span className="tabular-nums font-semibold text-[#0F172A] dark:text-slate-100">{selectedItem.daysUnresolved} days</span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E8710A] rounded-full" style={{ width: `${Math.min(100, (selectedItem.daysUnresolved / 25) * 100)}%` }} />
                  </div>
                </div>

                {selectedItem.nearSchool && (
                  <div className="flex items-center gap-1.5 text-[#E8710A] pt-1 font-medium">
                    <School className="w-3.5 h-3.5" />
                    <span>School / hospital zone factor applied</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Explanation / Rule (for Missing Infra) */}
          {isInfra && (
            <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-3 rounded-lg border border-[#E2E8F0] dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#64748B]">Municipal IRC standard</span>
                <span className="text-[10px] font-semibold text-[#E8710A] bg-amber-50 px-1.5 py-0.5 rounded">
                  {selectedItem.ruleBadge}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedItem.explanation}
              </p>
              <div className="text-[11px] text-[#1A73E8] font-medium pt-0.5">
                Suggested action: {selectedItem.suggestedAction}
              </div>
            </div>
          )}

          {/* Detected By Fleet Buses */}
          <div className="space-y-1">
            <div className="text-[11px] font-medium text-[#64748B]">Witnessed by transit fleet</div>
            <div className="flex flex-wrap gap-1.5">
              {(selectedItem.busIds || selectedItem.busesWitnessed || ['BUS-21G-04']).map((bId) => (
                <div key={bId} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <Bus className="w-3 h-3 text-[#1A73E8]" />
                  <span>{bId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Re-detection Timeline */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-[#64748B]">Detection timeline</div>
            <div className="space-y-1.5 text-xs border-l-2 border-slate-200 dark:border-slate-700 pl-3">
              <div className="relative">
                <div className="absolute -left-[17px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                <div className="text-[#0F172A] dark:text-slate-200 font-medium">Last pass: {selectedItem.lastDetected || selectedItem.lastCameraPass}</div>
                <div className="text-[11px] text-[#64748B]">Transit camera feed inspection</div>
              </div>
              <div className="relative pt-1">
                <div className="absolute -left-[17px] top-2.5 w-1.5 h-1.5 rounded-full bg-slate-400" />
                <div className="text-[#64748B]">First recorded: {selectedItem.firstDetected || '2026-09-16'}</div>
                <div className="text-[11px] text-[#94A3B8]">Initial telemetry flag</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Triggers */}
        <div className="p-3 border-t border-[#E2E8F0] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 shrink-0 space-y-1.5">
          {isDefect && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleStatusChange('Under Repair')}
                className="w-full py-1.5 px-3 rounded-md bg-[#1A73E8] hover:bg-blue-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Mark under repair</span>
              </button>
              <button
                onClick={() => handleStatusChange('Verified Closed')}
                className="w-full py-1.5 px-3 rounded-md bg-[#188038] hover:bg-green-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify closed</span>
              </button>
            </div>
          )}

          <button
            onClick={handleCreateWorkOrder}
            className="w-full py-1.5 px-3 rounded-md border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Assign to zone maintenance engineer</span>
          </button>

          <div className="text-[10px] text-[#94A3B8] dark:text-slate-500 text-center pt-1 border-t border-slate-100 dark:border-slate-800">
            Sample imagery from Wikimedia Commons — see <a href="/evidence/CREDITS.md" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1A73E8]">CREDITS.md</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
