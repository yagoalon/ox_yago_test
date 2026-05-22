/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, History, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'history' | 'settings';
  onTabChange: (tab: 'home' | 'history' | 'settings') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl z-40 flex justify-around items-center px-6 pb-safe h-20 bg-white border-t border-slate-100 shadow-[0_-8px_32px_rgba(15,23,42,0.06)] rounded-t-2xl transition-all">
      <button
        id="nav-home"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-90 flex-1 relative group ${
          activeTab === 'home'
            ? 'text-[#00685f] font-bold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className="w-5.5 h-5.5 mb-1" strokeWidth={activeTab === 'home' ? 2 : 1.5} />
        <span className="text-[9px] font-sans font-bold uppercase tracking-widest">Home</span>
        {activeTab === 'home' && (
          <div className="absolute top-1.5 right-[30%] w-1.5 h-1.5 rounded-full bg-[#0D9488]"></div>
        )}
      </button>

      <button
        id="nav-history"
        onClick={() => onTabChange('history')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-90 flex-1 relative group ${
          activeTab === 'history'
            ? 'text-[#00685f] font-bold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <History className="w-5.5 h-5.5 mb-1" strokeWidth={activeTab === 'history' ? 2 : 1.5} />
        <span className="text-[9px] font-sans font-bold uppercase tracking-widest">History</span>
        {activeTab === 'history' && (
          <div className="absolute top-1.5 right-[30%] w-1.5 h-1.5 rounded-full bg-[#0D9488]"></div>
        )}
      </button>

      <button
        id="nav-settings"
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-90 flex-1 relative group ${
          activeTab === 'settings'
            ? 'text-[#00685f] font-bold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Settings className="w-5.5 h-5.5 mb-1" strokeWidth={activeTab === 'settings' ? 2 : 1.5} />
        <span className="text-[9px] font-sans font-bold uppercase tracking-widest">Settings</span>
        {activeTab === 'settings' && (
          <div className="absolute top-1.5 right-[30%] w-1.5 h-1.5 rounded-full bg-[#0D9488]"></div>
        )}
      </button>
    </nav>
  );
}
