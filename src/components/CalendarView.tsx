/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sparkles, Calendar, Check, RefreshCw } from 'lucide-react';
import { CalendarProvider, TimelineDetection } from '../types';
import { INITIAL_CALENDAR_PROVIDERS, INITIAL_TIMELINE_DETECTIONS } from '../data';

export default function CalendarView() {
  const [providers, setProviders] = useState<CalendarProvider[]>(INITIAL_CALENDAR_PROVIDERS);
  const [detections, setDetections] = useState<TimelineDetection[]>(INITIAL_TIMELINE_DETECTIONS);
  const [refreshing, setRefreshing] = useState(false);

  const handleToggleConnection = (providerId: 'google' | 'outlook') => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, connected: !p.connected } : p))
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300 text-left">
      {/* Visual Workflow Tag and Title */}
      <section className="space-y-3">
        <div>
          <span className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 font-sans text-xs font-semibold rounded-full mb-2">
            Workflow Automation
          </span>
          <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">Connect Calendar</h2>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            Intelligence proactively requests resumes from candidates immediately after your meetings, ensuring your talent pipeline never stalls.
          </p>
        </div>

        {/* Bento Cover Tablet display card */}
        <div className="relative h-44 rounded-xl overflow-hidden shadow-md border border-slate-200/50 group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmbine5NiIwTJBLkqPKq2aSDG-u8yd-Ho58ipO86w-2CCJRaTmxdDsUaItOUnX6BUogA17HxegRhW7zYBM8x4JgnwVFmNR5k3Frbw-Z3B8AypTAfdZQbOuJdVLFpZZaDJlq5uRmLR5PeXTHTcavlkp0oYJ7nmAoMMWsV2H4fk4CxOD61PALtAhZVpErOPnftCrBohBY_J1DH15jtfzdpUe5kx9dhNfpt5c2qZfyajYfECp2SHMuh31XuMvpmK2nwh-Y5waQnALEF0"
            alt="Calendar interface visual"
            className="w-full h-full object-cover grayscale opacity-85 transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/25 to-transparent"></div>
          <div className="absolute bottom-3 left-4">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
              <span className="text-xs font-sans font-semibold tracking-wide">
                Proactive AI Discovery Enabled
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Connection Providers */}
      <section className="space-y-3">
        <h3 className="font-display font-extrabold text-xl text-slate-800 tracking-tight">Available Providers</h3>
        
        <div className="space-y-3">
          {providers.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-200 hover:bg-slate-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 text-[#00685f] shrink-0">
                  {p.id === 'google' ? (
                    <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.32-2.12 4.52-1.2 1.2-3.04 2.48-5.72 2.48-4.32 0-7.72-3.48-7.72-7.8s3.4-7.8 7.72-7.8c2.32 0 4.12.84 5.56 2.24l2.32-2.32C18.4 3.12 15.72 2 12.48 2 6.64 2 1.92 6.72 1.92 12.54s4.72 10.54 10.56 10.54c3.12 0 5.52-1.04 7.44-3.08 1.96-1.96 2.6-4.76 2.6-7.08 0-.52-.04-1.04-.12-1.52H12.48z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9L17 12l-6 4.5z"></path>
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{p.description}</p>
                </div>
              </div>

              <button
                id={`btn-connect-${p.id}`}
                onClick={() => handleToggleConnection(p.id)}
                className={`px-4 py-1.5 text-xs rounded-full transition-all duration-150 cursor-pointer ${
                  p.connected
                    ? 'bg-teal-50 border border-teal-200 text-teal-700 flex items-center gap-1 font-bold'
                    : 'bg-[#0D9488] text-white hover:bg-[#0b7c72] active:scale-95 font-bold'
                }`}
              >
                {p.connected ? (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Connected</span>
                  </>
                ) : (
                  <span>Connect</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Detection Timeline */}
      <section className="space-y-3">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <h3 className="font-display font-extrabold text-xl text-slate-800 tracking-tight">Upcoming Detection</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Scan result from secure offline assets</p>
          </div>
          <button
            onClick={handleRefresh}
            className={`w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0D9488] hover:border-slate-300 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition-all active:scale-95 cursor-pointer ${
              refreshing ? 'animate-spin text-[#0D9488] border-[#0D9488]/40' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {detections.map((d, index) => (
            <div key={d.id} className="relative pl-6 group text-left">
              {/* Vertical dotted timeline line */}
              {index < detections.length - 1 && (
                <div className="absolute left-[7px] top-6 bottom-0 w-[1.5px] border-l border-dashed border-slate-200"></div>
              )}
              {/* Pulse indicator node matching color guidelines */}
              <div
                className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border border-white shrink-0 ring-1 ${
                  d.type === 'Ready for Intel'
                    ? 'bg-[#0D9488] ring-teal-100'
                    : 'bg-slate-300 ring-transparent'
                }`}
              ></div>
              
              <div className="p-4 bg-white border border-slate-100 hover:border-slate-200 rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-display font-bold text-sm text-slate-800 leading-tight">{d.title}</h4>
                  
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      d.type === 'Ready for Intel'
                        ? 'bg-teal-50 border border-teal-100 text-teal-750'
                        : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                    }`}
                  >
                    {d.type === 'Ready for Intel' && <Check className="w-2.5 h-2.5 text-teal-600 stroke-[3]" />}
                    <span>{d.type}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                  <span className="uppercase text-[9px] tracking-widest text-slate-400 font-bold font-sans">
                    {d.time}
                  </span>
                  {d.candidate && (
                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></span>
                      <span className="text-slate-500 font-semibold italic">{d.candidate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
