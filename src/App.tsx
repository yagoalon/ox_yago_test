/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Meeting } from './types';
import { INITIAL_MEETINGS } from './data';

// Component Imports
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ArchiveView from './components/ArchiveView';
import CaptureView from './components/CaptureView';
import CalendarView from './components/CalendarView';
import DetailView from './components/DetailView';

// Icon Imports
import { Search } from 'lucide-react';

export default function App() {
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'settings' | 'capture'>('home');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Toggle active checkout states dynamically
  const handleToggleStep = (meetingId: string, stepId: string) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((meeting) => {
        if (meeting.id === meetingId) {
          const updatedSteps = meeting.nextSteps.map((step) =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );
          
          return {
            ...meeting,
            nextSteps: updatedSteps
          };
        }
        return meeting;
      })
    );

    // If there is an active selected meeting details screen open, update its local reference as well
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting((prev) => {
        if (!prev) return null;
        const updatedSteps = prev.nextSteps.map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        return {
          ...prev,
          nextSteps: updatedSteps
        };
      });
    }
  };

  // Append generated intelligence document
  const handleAddSynthesizedMeeting = (newMeeting: Meeting) => {
    setMeetings((prev) => [newMeeting, ...prev]);
    // Instantly transition to the newly generated meeting's live dashboard report!
    setSelectedMeeting(newMeeting);
  };

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleBackToMain = () => {
    setSelectedMeeting(null);
  };

  // Core navigation tab changer
  const handleTabChange = (tab: 'home' | 'history' | 'settings') => {
    setSelectedMeeting(null); // Clear active detail screen when shifting tab context
    setActiveTab(tab);
  };

  // Quick navigation helpers
  const handleNavigateToCapture = () => {
    setSelectedMeeting(null);
    setActiveTab('capture');
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-805 min-h-screen font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Dynamic Overlay detailed screen */}
      {selectedMeeting ? (
        <DetailView
          meeting={selectedMeeting}
          onBack={handleBackToMain}
          onToggleStep={handleToggleStep}
        />
      ) : (
        <>
          {/* Top Shared Application Header block */}
          <header className="fixed top-0 left-0 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 z-30 flex justify-between items-center px-5 max-w-2xl mx-auto left-1/2 -translate-x-1/2 shadow-[0_2px_12px_rgba(15,23,42,0.02)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                <img
                  alt="User Profile"
                  className="w-full h-full object-cover opacity-95"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8TvBnB8ZdWrQyQefAlsXOBxPbBiaP_JOoF1LVoeL3FF7K4VoS_iNrn6wzyklORo132YMbIT1CH9PM18J2mwdT7Gx0ZvA-SGpOwD3JM3c32pSGbaRvqgqndIrMwVyDYTPuZZZWzKvvb9LYKEzf2GC0VXKSFwsUzcYuaXS1AC2vwwnkQsRb_ZFaYuQzOVDgpACR1icO8BaAX6idcdL5WyZjmYOuEv8SraB68-83YGild2mnEhK92Z0K6rm2f4diW7us8kF2A4V0jwY"
                />
              </div>
              <h1 className="font-display font-black text-2xl bg-gradient-to-r from-teal-650 via-teal-700 to-slate-900 bg-clip-text text-transparent tracking-tight">Intelligence</h1>
            </div>

            {/* Quick search button redirects instantly to search filters */}
            <button
              onClick={() => handleTabChange('history')}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-slate-350 active:scale-95 transition-all text-slate-605 shadow-xs shrink-0"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </header>

          {/* Core Layout Containers */}
          <main className="pt-20 px-5 max-w-2xl mx-auto min-h-[calc(100vh-5rem)]">
            {activeTab === 'home' && (
              <HomeView
                meetings={meetings}
                onSelectMeeting={handleSelectMeeting}
                onNavigateToCapture={handleNavigateToCapture}
              />
            )}

            {activeTab === 'history' && (
              <ArchiveView
                meetings={meetings}
                onSelectMeeting={handleSelectMeeting}
              />
            )}

            {activeTab === 'settings' && (
              <CalendarView />
            )}

            {activeTab === 'capture' && (
              <CaptureView onAddSynthesizedMeeting={handleAddSynthesizedMeeting} />
            )}
          </main>

          {/* Unified styled Navigation Menu */}
          <BottomNav
            activeTab={activeTab === 'capture' ? 'home' : activeTab}
            onTabChange={handleTabChange}
          />
        </>
      )}
    </div>
  );
}
