import React from 'react';
import { 
  ShieldAlert, 
  Car, 
  MapPin, 
  Clock, 
  Building2, 
  Bus, 
  Video, 
  CheckCircle2, 
  Navigation,
  FileText
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DetailDrawer } from '../components/DetailDrawer';

export const IncidentsPage = () => {
  const { 
    incidents, 
    selectedItem, 
    openDetailDrawer, 
    flyTo, 
    requestIncidentFootage 
  } = useStore();

  const activeIncident = selectedItem?.id ? incidents.find(i => i.id === selectedItem.id) || incidents[0] : incidents[0];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex justify-between p-4 pl-[76px] overflow-hidden">
      {/* LEFT FLOATING INCIDENTS FEED PANEL (320px) - PANEL 1 */}
      <div className="pointer-events-auto w-full sm:w-[320px] h-[calc(100%-36px)] mt-9 flex flex-col enterprise-card overflow-hidden">
        <div className="p-3 border-b border-[#E2E8F0] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#D93025]" />
            <div>
              <div className="font-semibold text-xs text-[#0F172A] dark:text-slate-100">Traffic incidents</div>
              <div className="text-[10px] text-[#64748B] dark:text-slate-400">Captured by transit fleet cameras</div>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#D93025] tabular-nums">
            {incidents.length} active
          </span>
        </div>

        <div className="p-2 space-y-1.5 overflow-y-auto flex-1">
          {incidents.map((inc) => {
            const isSelected = activeIncident.id === inc.id;
            return (
              <div
                key={inc.id}
                onClick={() => {
                  flyTo(inc.lat, inc.lng);
                  openDetailDrawer(inc, 'incident');
                }}
                className={`p-2.5 rounded-lg border transition cursor-pointer space-y-1.5 text-xs ${
                  isSelected 
                    ? 'bg-[#E8F0FE] dark:bg-slate-800 border-[#1A73E8]/40' 
                    : 'bg-white dark:bg-slate-900/40 border-[#E2E8F0] dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#D93025] text-xs">
                    {inc.id}
                  </span>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                    {inc.licensePlate}
                  </span>
                </div>

                <div>
                  <div className="font-medium text-[#0F172A] dark:text-slate-200 text-xs">{inc.type}</div>
                  <div className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">{inc.locationName}</div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[#1A73E8] font-medium">{inc.confidence}% match</span>
                  <span className="tabular-nums">{inc.timestamp.split(' ')[1]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT FLOATING INCIDENT DETAIL PANEL (360px) - PANEL 2 */}
      <div className="pointer-events-auto w-full sm:w-[360px] h-[calc(100%-36px)] mt-9 mr-16 flex flex-col enterprise-card overflow-hidden text-xs">
        {/* Header */}
        <div className="p-3 border-b border-[#E2E8F0] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-semibold text-xs text-[#1A73E8]">{activeIncident.id}</span>
            <span className="px-2 py-0.5 rounded font-medium text-[11px] bg-red-50 text-[#D93025] dark:bg-red-950/60">
              {activeIncident.severity}
            </span>
          </div>
          <div className="font-semibold text-sm text-[#0F172A] dark:text-slate-100">{activeIncident.type}</div>
          <div className="text-[#64748B] dark:text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#1A73E8] shrink-0" />
            <span className="truncate">{activeIncident.locationName}</span>
          </div>
        </div>

        <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1">
          {/* Target Vehicle Spec */}
          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-2.5 rounded-lg border border-[#E2E8F0] dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-[#64748B] dark:text-slate-400">Target vehicle identification</div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#0F172A] dark:text-white bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-[#E2E8F0] dark:border-slate-600">
                {activeIncident.licensePlate}
              </span>
              <span className="text-xs text-[#64748B] dark:text-slate-300">{activeIncident.vehicleModel}</span>
            </div>
          </div>

          {/* Nearest Police Dispatch */}
          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-2.5 rounded-lg border border-[#E2E8F0] dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-[#64748B] dark:text-slate-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#1A73E8]" />
              <span>Nearest dispatch station</span>
            </div>
            <div className="font-medium text-slate-800 dark:text-slate-200">{activeIncident.policeStation}</div>
            <div className="text-[11px] text-[#1A73E8] tabular-nums">{activeIncident.policePhone}</div>
          </div>

          {/* Nearby Transit Buses & Footage Request */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 flex items-center justify-between">
              <span>Nearby transit buses (&lt;500m)</span>
              <span className="text-[11px] text-[#64748B] tabular-nums">{activeIncident.nearbyBuses.length} in range</span>
            </div>

            <div className="space-y-1">
              {activeIncident.nearbyBuses.map((bus) => (
                <div key={bus.busId} className="p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Bus className="w-3 h-3 text-[#1A73E8]" />
                      <span>{bus.busId} (Route {bus.route})</span>
                    </div>
                    <div className="text-[10px] text-[#64748B] tabular-nums">{bus.distMeters}m away • {bus.status}</div>
                  </div>

                  <button
                    onClick={() => requestIncidentFootage(activeIncident.id, bus.busId)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition flex items-center gap-1 ${
                      bus.footageRequested 
                        ? 'bg-emerald-50 text-[#188038] border border-emerald-200 dark:bg-emerald-950/60' 
                        : 'bg-[#1A73E8] hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    <span>{bus.footageRequested ? 'Requested ✓' : 'Request footage'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reroute Guidance */}
          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-2.5 rounded-lg border border-[#E2E8F0] dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-[#64748B] dark:text-slate-400 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-[#188038]" />
              <span>Corridor re-routing advisory</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeIncident.rerouteGuidance}
            </p>
          </div>

          {/* Timestamped Audit Trail Timeline */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-200">Incident audit trail</div>
            <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-3 text-xs">
              {activeIncident.auditTimeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[17px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                  <div className="text-slate-800 dark:text-slate-200 font-medium tabular-nums">{item.time}</div>
                  <div className="text-[11px] text-[#64748B]">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DetailDrawer />
    </div>
  );
};

export default IncidentsPage;
