import React from 'react';
import { Rank } from '../types';

interface SideNavBarProps {
  activeTab: 'dashboard' | 'armory' | 'squad' | 'barracks';
  setActiveTab: (tab: 'dashboard' | 'armory' | 'squad' | 'barracks') => void;
  currentRank: Rank;
  nextRank: Rank | null;
  xp: number;
  onResetData: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  setActiveTab,
  currentRank,
  nextRank,
  xp,
  onResetData,
}) => {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 z-40 bg-[#0e0e10]/85 backdrop-blur-2xl border-r border-[#ddb7ff]/20 shadow-2xl shadow-black pt-24 pb-8 select-none">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-[#ddb7ff] text-2xl filled">shield</span>
          <span className="font-display text-[#4cd7f6] text-2xl tracking-wider">
            {currentRank.name.toUpperCase()}
          </span>
        </div>
        <p className="font-body text-xs font-bold uppercase text-[#ddb7ff] tracking-widest">
          HEROIC RANK
        </p>
        <p className="text-xs font-mono-data text-[#bcc9cd] mt-1">
          XP: {xp} / {nextRank ? nextRank.minXp : 'MAX'}
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full text-left p-4 flex items-center gap-4 transition-all duration-200 ease-in-out font-body font-bold uppercase text-sm tracking-wide ${
            activeTab === 'dashboard'
              ? 'bg-[#6f00be]/80 text-[#d6a9ff] rounded-r-full border-l-4 border-[#ddb7ff] shadow-[0_0_15px_rgba(111,0,190,0.5)]'
              : 'text-[#bcc9cd] hover:bg-[#2a2a2c]/60 hover:text-[#ddb7ff]'
          }`}
        >
          <span className="material-symbols-outlined">timer</span>
          <span>Battle Ground</span>
        </button>

        <button
          onClick={() => setActiveTab('armory')}
          className={`w-full text-left p-4 flex items-center gap-4 transition-all duration-200 ease-in-out font-body font-bold uppercase text-sm tracking-wide ${
            activeTab === 'armory'
              ? 'bg-[#6f00be]/80 text-[#d6a9ff] rounded-r-full border-l-4 border-[#ddb7ff] shadow-[0_0_15px_rgba(111,0,190,0.5)]'
              : 'text-[#bcc9cd] hover:bg-[#2a2a2c]/60 hover:text-[#ddb7ff]'
          }`}
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span>Armory</span>
        </button>

        <button
          onClick={() => setActiveTab('squad')}
          className={`w-full text-left p-4 flex items-center gap-4 transition-all duration-200 ease-in-out font-body font-bold uppercase text-sm tracking-wide ${
            activeTab === 'squad'
              ? 'bg-[#6f00be]/80 text-[#d6a9ff] rounded-r-full border-l-4 border-[#ddb7ff] shadow-[0_0_15px_rgba(111,0,190,0.5)]'
              : 'text-[#bcc9cd] hover:bg-[#2a2a2c]/60 hover:text-[#ddb7ff]'
          }`}
        >
          <span className="material-symbols-outlined">leaderboard</span>
          <span>Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('barracks')}
          className={`w-full text-left p-4 flex items-center gap-4 transition-all duration-200 ease-in-out font-body font-bold uppercase text-sm tracking-wide ${
            activeTab === 'barracks'
              ? 'bg-[#6f00be]/80 text-[#d6a9ff] rounded-r-full border-l-4 border-[#ddb7ff] shadow-[0_0_15px_rgba(111,0,190,0.5)]'
              : 'text-[#bcc9cd] hover:bg-[#2a2a2c]/60 hover:text-[#ddb7ff]'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Barracks</span>
        </button>
      </nav>

      <div className="px-6 space-y-4">
        <button
          onClick={() => setActiveTab('armory')}
          className="w-full py-3 bg-[#ddb7ff] text-[#490080] font-display text-base tracking-wider rounded shadow-lg shadow-[#ddb7ff]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
        >
          UPGRADE GEAR
        </button>

        <div className="pt-4 border-t border-[#ddb7ff]/20">
          <button
            onClick={onResetData}
            className="w-full text-[#bcc9cd] flex items-center gap-4 hover:text-[#ffb4ab] transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">restart_alt</span>
            <span>Reset Progress</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
