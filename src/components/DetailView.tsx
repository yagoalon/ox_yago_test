/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Meeting } from '../types';
import { generatePDFReport } from '../utils/pdfGenerator';
import {
  ArrowLeft,
  Share2,
  FileCheck,
  TrendingUp,
  Smartphone,
  AlertOctagon,
  MessageSquare,
  ClipboardList,
  Copy,
  Check,
  Printer,
  Download,
  FileText
} from 'lucide-react';

interface DetailViewProps {
  meeting: Meeting;
  onBack: () => void;
  onToggleStep: (meetingId: string, stepId: string) => void;
}

export default function DetailView({ meeting, onBack, onToggleStep }: DetailViewProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'transcripts'>('summary');
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const pendingCount = meeting.nextSteps.filter((step) => !step.completed).length;

  const handleCopyTranscript = () => {
    if (meeting.fullTranscript) {
      navigator.clipboard.writeText(meeting.fullTranscript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handlePrint = () => {
    generatePDFReport(meeting);
  };

  return (
    <div className="absolute inset-0 bg-[#F8FAFC] z-10 overflow-y-auto pb-32 animate-in slide-in-from-right duration-300 print:relative print:inset-auto print:overflow-visible print:h-auto print:pb-0 print:bg-white print:animate-none">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 left-0 w-full z-20 flex justify-between items-center px-4 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.02)] print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-slate-50 active:scale-90 transition-all text-slate-600 border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-display font-black text-xl bg-gradient-to-r from-teal-600 to-slate-900 bg-clip-text text-transparent tracking-tight">Intelligence Hub</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            title="Print PDF Report"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80 active:scale-95 transition-all shadow-xs"
          >
            <Printer className="w-5 h-5" />
          </button>

          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0D9488] text-white hover:bg-[#0b7c72] active:scale-95 transition-all shadow-sm"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="px-5 mt-4 space-y-5 max-w-2xl mx-auto">
        {/* Cover Strategic Alignment Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-[16/7] bg-slate-100 border border-slate-200/50">
          <img
            src={meeting.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600'}
            alt="Report Cover"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold bg-[#0D9488] text-white px-2.5 py-0.5 rounded-full inline-block mb-1">
              {meeting.category}
            </span>
            <h2 className="text-white font-display font-black text-2.5xl leading-tight tracking-tight">
              {meeting.title}
            </h2>
          </div>
        </div>

        {/* Dual Tab Control for Segmented View Organization */}
        <div className="flex p-1 bg-slate-100/80 border border-slate-250/30 rounded-xl print:hidden">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 text-xs rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-white text-[#0D9488] border border-slate-200/30 shadow-xs font-sans font-extrabold'
                : 'text-slate-550 hover:text-slate-800 font-sans font-bold'
            }`}
          >
            Report Summary
          </button>
          <button
            onClick={() => setActiveTab('transcripts')}
            className={`flex-1 py-2 text-xs rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'transcripts'
                ? 'bg-white text-[#0D9488] border border-slate-200/30 shadow-xs font-sans font-extrabold'
                : 'text-slate-550 hover:text-slate-800 font-sans font-bold'
            }`}
          >
            Full Transcripts
          </button>
        </div>

        {activeTab === 'summary' ? (
          <div className="space-y-4">
            {/* 1. Executive Summary Card */}
            <section className="bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-5 rounded-xl text-left">
              <div className="flex items-center gap-2.5 mb-3 text-[#0D9488]">
                <FileCheck className="w-5 h-5" />
                <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-800">Executive Summary</h3>
              </div>
              <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-line font-sans font-medium">
                {meeting.summary}
              </p>
            </section>

            {/* 2. Strategic Insights Section */}
            <section className="bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-5 rounded-xl text-left">
              <div className="flex items-center gap-2.5 mb-3 text-[#0D9488]">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-800">Strategic Insights</h3>
              </div>
              <div className="grid grid-cols-1 select-none gap-3">
                {meeting.insights.map((insight, index) => {
                  const parts = insight.split(':');
                  const headerTitle = parts[0] || 'Insight';
                  const mainText = parts[1] || insight;

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-slate-50 text-slate-650 p-3.5 rounded-xl border border-slate-100/85"
                    >
                      {index % 2 === 0 ? (
                        <Smartphone className="w-5 h-5 text-[#0D9488] mt-0.5 shrink-0" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-[#0D9488] mt-0.5 shrink-0" />
                      )}
                      <div>
                        <h4 className="text-xs font-bold leading-tight text-slate-800 mb-1">
                          {headerTitle}
                        </h4>
                        <span className="text-xs text-slate-400 leading-normal block font-medium">
                          {mainText.trim()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Critical Risks warning container */}
            {meeting.risks.length > 0 && (
              <section className="bg-rose-50/75 border border-rose-100/60 p-5 rounded-xl text-left">
                <div className="flex items-center gap-2.5 mb-3 text-rose-700">
                  <AlertOctagon className="w-5 h-5 animate-pulse text-rose-600" />
                  <h3 className="text-xs uppercase tracking-widest font-extrabold font-sans">Critical Roadblocks & Risks</h3>
                </div>
                <div className="space-y-2">
                  {meeting.risks.map((risk, index) => (
                    <div key={index} className="flex items-center gap-2.5 text-xs text-rose-600 font-sans font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-450 shrink-0" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Key Talking Points Section */}
            {meeting.talkingPoints.length > 0 && (
              <section className="bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-5 rounded-xl text-left">
                <div className="flex items-center gap-2.5 mb-3 text-[#0D9488]">
                  <MessageSquare className="w-5 h-5" />
                  <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-800">Key Meeting Dialogues</h3>
                </div>
                <div className="space-y-2">
                  {meeting.talkingPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="w-5 h-5 rounded bg-teal-50 text-teal-750 border border-teal-100 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-xs text-slate-650 font-medium leading-relaxed font-sans">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Next Steps Checklist UI elements */}
            <section className="bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-5 rounded-xl text-left">
              <div className="flex items-center justify-between mb-3 font-sans">
                <div className="flex items-center gap-2.5 text-[#0D9488]">
                  <ClipboardList className="w-5 h-5" />
                  <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-800">Actionable Deliverables</h3>
                </div>
                <span className="bg-teal-50 border border-teal-100 text-teal-700 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  {pendingCount === 0 ? 'All Completed' : `${pendingCount} Pending`}
                </span>
              </div>
              <div className="space-y-1 font-sans">
                {meeting.nextSteps.map((step) => (
                  <label
                    key={step.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50/80 transition-all cursor-pointer group select-none ${
                      step.completed ? 'opacity-55' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => onToggleStep(meeting.id, step.id)}
                      className="w-4.5 h-4.5 rounded border-slate-300 bg-white text-[#0D9488] focus:ring-[#0D9488] cursor-pointer transition-all shrink-0"
                    />
                    <span
                      className={`text-xs text-slate-650 group-active:text-slate-800 font-medium transition-all ${
                        step.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {step.text}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* Transcripts Content with specialized narrative list views */
          <div className="bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-5 rounded-xl text-left space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 font-sans">
                Meeting Transcripts Log
              </h3>
              {meeting.fullTranscript && (
                <button
                  onClick={handleCopyTranscript}
                  className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 hover:bg-teal-100/80 border border-teal-100 transition-colors text-xs font-bold rounded-lg text-[#00685f] print:hidden"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Log</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {meeting.fullTranscript ? (
              <div className="space-y-4 text-xs leading-relaxed max-h-[500px] overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-slate-200">
                {meeting.fullTranscript.split('\n\n').map((paragraph, index) => {
                  const hasSpeaker = paragraph.includes(':');
                  if (hasSpeaker) {
                    const separatorIndex = paragraph.indexOf(':');
                    const speaker = paragraph.substring(0, separatorIndex);
                    const speech = paragraph.substring(separatorIndex + 1);

                    return (
                      <div key={index} className="space-y-1 text-left">
                        <span className="font-bold text-[#00685f] block">{speaker}:</span>
                        <p className="text-slate-650 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {speech.trim()}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="text-slate-400 font-semibold italic py-1 text-left">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8 italic">
                No detailed transcript loaded for this recording sync.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Share Button */}
      <button
        onClick={handleShare}
        className="fixed bottom-24 right-5 w-12 h-12 bg-[#0D9488] text-white rounded-full shadow-[0_8px_24px_rgba(13,148,136,0.3)] flex items-center justify-center active:scale-90 transition-transform cursor-pointer z-30 group print:hidden"
      >
        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Share Notification Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100/80 p-6 rounded-2xl w-full max-w-sm shadow-[0_20px_40px_rgba(15,23,42,0.08)] text-center space-y-4 animate-in zoom-in-95 duration-200">
            <h4 className="font-display font-extrabold text-xl text-slate-800">Intelligence Report Shared</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              A private enterprise sharing link has been generated and ready for your steering panel stakeholders.
            </p>
            <div className="bg-slate-550/5 text-[#0D9488] font-bold p-3 rounded-lg text-xs font-mono border border-slate-100 select-all cursor-pointer">
              https://intelligence.com/report/{meeting.id}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-2.5 text-xs font-sans font-bold bg-teal-50 border border-teal-200 text-teal-700 rounded-xl hover:bg-teal-100 active:scale-95 transition-all cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
