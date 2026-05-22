/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Meeting } from '../types';
import { USER_INFO } from '../data';
import { PlusCircle, Sparkles, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  meetings: Meeting[];
  onSelectMeeting: (meeting: Meeting) => void;
  onNavigateToCapture: () => void;
}

export default function HomeView({ meetings, onSelectMeeting, onNavigateToCapture }: HomeViewProps) {
  // Let's compute some dynamic stats!
  const totalHoursSaved = (meetings.length * 3.12).toFixed(1);
  const totalActionItems = meetings.reduce((acc, m) => acc + m.nextSteps.filter(ns => !ns.completed).length, 0);

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Hero Welcome Banner - Styled as premium Modern Enterprise Deep Navy card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-slate-800 p-6 shadow-md min-h-[160px] flex flex-col justify-center">
        <div className="relative z-10 text-left">
          <div className="text-[10px] text-teal-400 uppercase tracking-[0.25em] font-bold mb-1">
            Enterprise Digest
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight mb-2">Welcome back, {USER_INFO.name}</h2>
          <p className="text-sm text-slate-300 max-w-[280px]">
            You have <span className="text-teal-400 font-semibold">{meetings.filter(m => m.status.includes('Risk')).length} alert reports</span> with critical intelligence takeaways to review.
          </p>
        </div>
        
        {/* Abstract Background Ornaments matching design system */}
        <div className="absolute -right-10 -bottom-10 h-full w-1/3 bg-gradient-to-l from-[#0D9488]/10 to-transparent pointer-events-none"></div>
        <div className="absolute right-6 top-6 opacity-30">
          <Sparkles className="w-12 h-12 text-[#0D9488] animate-pulse" />
        </div>
      </section>

      {/* Primary Action Button - Styled as Vibrant Teal action block */}
      <button
        id="btn-capture-meeting"
        onClick={onNavigateToCapture}
        className="w-full h-16 bg-[#0D9488] hover:bg-[#0b7c72] text-white rounded-2xl flex items-center justify-center gap-3 shadow-md hover:shadow-[0_4px_24px_rgba(13,148,136,0.25)] active:scale-[0.98] transition-all cursor-pointer font-display font-bold text-lg"
      >
        <PlusCircle className="w-5.5 h-5.5" />
        <span>Capture New Meeting Assets</span>
      </button>

      {/* Recent Intel Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight text-left">Recent Intel</h3>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0D9488] hover:text-[#0b7c72] hover:underline cursor-pointer">
            View All
          </span>
        </div>

        <div className="space-y-3">
          {meetings.slice(0, 3).map((meeting) => {
            return (
              <div
                id={`meeting-card-${meeting.id}`}
                key={meeting.id}
                onClick={() => onSelectMeeting(meeting)}
                className="group bg-white p-5 rounded-xl border border-slate-100/80 hover:border-slate-200/60 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex flex-col gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 text-left"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 block mb-1">
                      {meeting.date} • {meeting.time}
                    </span>
                    <h4 className="font-display font-bold text-lg text-slate-800 group-hover:text-[#0D9488] transition-colors truncate">
                      {meeting.title}
                    </h4>
                  </div>

                  {/* Status Badges conforming to guidelines */}
                  {meeting.status === '3 Risks Found' && (
                    <div className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full flex items-center gap-1.5 shrink-0 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-[9px] tracking-wider uppercase font-bold">{meeting.status}</span>
                    </div>
                  )}
                  {meeting.status === '1 Risk Found' && (
                    <div className="px-2.5 py-1 bg-amber-50/70 text-amber-600 border border-amber-200/40 rounded-full flex items-center gap-1.5 shrink-0 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[9px] tracking-wider uppercase font-bold">{meeting.status}</span>
                    </div>
                  )}
                  {meeting.status === 'Summarized' && (
                    <div className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200/60 rounded-full flex items-center gap-1.5 shrink-0 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span className="text-[9px] tracking-wider uppercase font-bold">Summarized</span>
                    </div>
                  )}
                  {meeting.status === 'Success' && (
                    <div className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200/60 rounded-full flex items-center gap-1.5 shrink-0 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span className="text-[9px] tracking-wider uppercase font-bold">Processed</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-2">
                    {meeting.participantAvatars.length > 0 ? (
                      <div className="flex -space-x-1.5">
                        {meeting.participantAvatars.map((url, i) => (
                          <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-100 overflow-hidden shrink-0">
                            <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {meeting.participantsCount > meeting.participantAvatars.length && (
                          <div className="w-6 h-6 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 shrink-0">
                            +{meeting.participantsCount - meeting.participantAvatars.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Internal Sync</span>
                    )}
                    <span className="text-xs text-slate-400 font-medium">
                      {meeting.participantsCount} specialists • {meeting.duration}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section with clean light enterprise detail */}
      <section className="bg-slate-100/60 border border-slate-200/40 p-5 rounded-2xl shadow-inner relative overflow-hidden">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-left mb-4">Efficiency Gains</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/30 text-left shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hours Saved</span>
            <div className="font-display font-black text-3xl text-[#00685f] mt-1">{totalHoursSaved}h</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/30 text-left shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Deliverables</span>
            <div className="font-display font-black text-3xl text-[#00685f] mt-1">{totalActionItems}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
