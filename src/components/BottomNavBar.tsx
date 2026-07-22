import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-5 pt-2 bg-[#201f21]/80 backdrop-blur-xl border-t border-[#4cd7f6]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-150 active:scale-90 ${
          activeTab === 'dashboard'
            ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_15px_#4cd7f6]'
            : 'text-[#bcc9cd] opacity-75 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined">schedule</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Timer</span>
      </button>

      <button
        onClick={() => setActiveTab('analytics')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-150 active:scale-90 ${
          activeTab === 'analytics'
            ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_15px_#4cd7f6]'
            : 'text-[#bcc9cd] opacity-75 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined">insights</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Stats</span>
      </button>

      <button
        onClick={() => setActiveTab('armory')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-150 active:scale-90 ${
          activeTab === 'armory'
            ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_15px_#4cd7f6]'
            : 'text-[#bcc9cd] opacity-75 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined">workspace_premium</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Vault</span>
      </button>

      <button
        onClick={() => setActiveTab('squad')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-150 active:scale-90 ${
          activeTab === 'squad'
            ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_15px_#4cd7f6]'
            : 'text-[#bcc9cd] opacity-75 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined">military_tech</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Rank</span>
      </button>

      <button
        onClick={() => setActiveTab('barracks')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-150 active:scale-90 ${
          activeTab === 'barracks'
            ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_15px_#4cd7f6]'
            : 'text-[#bcc9cd] opacity-75 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
      </button>
    </nav>
  );
};
