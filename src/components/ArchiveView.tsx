/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Meeting } from '../types';
import { Search, Clock, Calendar, CheckCircle, Paperclip, AlertOctagon } from 'lucide-react';

interface ArchiveViewProps {
  meetings: Meeting[];
  onSelectMeeting: (meeting: Meeting) => void;
}

export default function ArchiveView({ meetings, onSelectMeeting }: ArchiveViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Let's filter meetings based on search input!
  const filteredMeetings = meetings.filter((meeting) => {
    const query = searchQuery.toLowerCase();
    return (
      meeting.title.toLowerCase().includes(query) ||
      meeting.summary.toLowerCase().includes(query) ||
      meeting.category.toLowerCase().includes(query)
    );
  });

  // Grouping matches mockup categories: Today, Yesterday, Last Week
  const todayMeetings = filteredMeetings.filter((m) => m.id === 'm1');
  const yesterdayMeetings = filteredMeetings.filter((m) => m.id === 'm2' || m.id === 'm3');
  const lastWeekMeetings = filteredMeetings.filter((m) => m.id === 'm4');

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300 text-left">
      {/* Page Header */}
      <section className="space-y-2">
        <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">Archive Repository</h2>
        <p className="text-slate-500 text-sm">
          Review, query, and manage past synthesized intelligence logs.
        </p>
      </section>

      {/* Modern Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] focus:shadow-[0_0_12px_rgba(13,148,136,0.15)] outline-none transition-all placeholder-slate-400 font-sans text-sm text-slate-800 shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
          placeholder="Search by title, keyword, or attendee..."
        />
      </div>

      {searchQuery && filteredMeetings.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm italic">
          No past meetings matches your terms. Please try another query.
        </div>
      )}

      {/* Date Group Today */}
      {todayMeetings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Today</span>
            <div className="h-[1px] flex-1 bg-slate-200/60"></div>
          </div>
          <div className="space-y-3">
            {todayMeetings.map((meeting) => (
              <div
                id={`archive-item-${meeting.id}`}
                key={meeting.id}
                onClick={() => onSelectMeeting(meeting)}
                className="group relative bg-white p-5 rounded-xl border border-slate-100 hover:border-slate-200/60 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 cursor-pointer flex flex-col gap-3"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex flex-col">
                    <h3 className="font-display font-bold text-lg text-slate-800 group-hover:text-[#0D9488] transition-colors">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      <span>{meeting.time} • {meeting.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-100 text-teal-700 rounded-full text-[10px] uppercase font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                    <span>Success</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-1.5">
                    {meeting.participantAvatars.slice(0, 2).map((url, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-100 overflow-hidden shrink-0">
                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-sans font-medium">
                    Sarah, Mark +{meeting.participantsCount - 2}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Date Group Yesterday */}
      {yesterdayMeetings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Yesterday</span>
            <div className="h-[1px] flex-1 bg-slate-200/60"></div>
          </div>
          <div className="space-y-3">
            {yesterdayMeetings.map((meeting) => (
              <div
                id={`archive-item-${meeting.id}`}
                key={meeting.id}
                onClick={() => onSelectMeeting(meeting)}
                className="group relative bg-white p-5 rounded-xl border border-slate-100 hover:border-slate-200/60 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 cursor-pointer flex flex-col gap-3"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex flex-col">
                    <h3 className="font-display font-bold text-lg text-slate-800 group-hover:text-[#0D9488] transition-colors">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      <span>{meeting.time} • {meeting.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-[#ECEEF0] text-[#191C1E]">
                    {meeting.status.includes('Risk') ? (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-[10px] uppercase font-bold">
                        <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Altered</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-full text-[10px] uppercase font-bold">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                        <span>Success</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {meeting.attachments.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Paperclip className="w-4 h-4 text-slate-300 shrink-0" />
                      <span className="truncate max-w-[280px]">
                        {meeting.attachments.join(', ')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="px-3 py-0.5 bg-slate-100 rounded-full text-[9px] uppercase tracking-wider font-bold text-slate-500">
                        #Budget
                      </span>
                      <span className="px-3 py-0.5 bg-slate-100 rounded-full text-[9px] uppercase tracking-wider font-bold text-slate-500">
                        #Q4Planning
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Date Group Older / Last Week */}
      {lastWeekMeetings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Last Week</span>
            <div className="h-[1px] flex-1 bg-slate-200/60"></div>
          </div>
          <div className="space-y-3">
            {lastWeekMeetings.map((meeting) => (
              <div
                id={`archive-item-${meeting.id}`}
                key={meeting.id}
                onClick={() => onSelectMeeting(meeting)}
                className="group relative bg-white/80 p-5 rounded-xl border border-slate-100 hover:border-slate-200/60 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 cursor-pointer flex flex-col gap-3 opacity-90"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex flex-col">
                    <h3 className="font-display font-bold text-lg text-slate-800 group-hover:text-[#0D9488] transition-colors">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-xs font-sans font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      <span>{meeting.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-100 text-teal-700 rounded-full text-[10px] uppercase font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                    <span>Success</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
