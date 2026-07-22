import React from 'react';
import { Rank } from '../types';

interface TopHeaderProps {
  activeTab: 'dashboard' | 'armory' | 'squad' | 'barracks';
  setActiveTab: (tab: 'dashboard' | 'armory' | 'squad' | 'barracks') => void;
  currentRank: Rank;
  commanderName: string;
  avatarUrl: string;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenAiAdvisor: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  currentRank,
  commanderName,
  avatarUrl,
  soundEnabled,
  setSoundEnabled,
  onOpenAiAdvisor,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-6 py-3 md:py-4 bg-[#131315]/70 backdrop-blur-xl border-b border-[#4cd7f6]/30 shadow-[0_0_15px_rgba(76,215,246,0.2)]">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#6f00be] p-[2px] shadow-[0_0_10px_rgba(76,215,246,0.5)]">
          <div className="w-full h-full bg-[#0e0e10] rounded-[6px] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#4cd7f6] text-2xl font-bold">military_tech</span>
          </div>
        </div>
        <div>
          <h1 className="font-display text-2xl md:text-3xl tracking-widest text-[#4cd7f6] italic leading-none drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]">
            ELITE FOCUS
          </h1>
          <span className="text-[10px] font-mono-data text-[#bcc9cd] tracking-widest uppercase block -mt-1 hidden sm:block">
            TACTICAL STUDY SYSTEM
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`font-display text-xl tracking-wider transition-all duration-200 active:scale-95 ${
              activeTab === 'dashboard'
                ? 'text-[#4cd7f6] drop-shadow-[0_0_10px_rgba(76,215,246,0.8)] border-b-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:text-[#4cd7f6]'
            }`}
          >
            DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab('armory')}
            className={`font-display text-xl tracking-wider transition-all duration-200 active:scale-95 ${
              activeTab === 'armory'
                ? 'text-[#4cd7f6] drop-shadow-[0_0_10px_rgba(76,215,246,0.8)] border-b-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:text-[#4cd7f6]'
            }`}
          >
            ARMORY
          </button>
          <button
            onClick={() => setActiveTab('squad')}
            className={`font-display text-xl tracking-wider transition-all duration-200 active:scale-95 ${
              activeTab === 'squad'
                ? 'text-[#4cd7f6] drop-shadow-[0_0_10px_rgba(76,215,246,0.8)] border-b-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:text-[#4cd7f6]'
            }`}
          >
            SQUAD
          </button>
          <button
            onClick={() => setActiveTab('barracks')}
            className={`font-display text-xl tracking-wider transition-all duration-200 active:scale-95 ${
              activeTab === 'barracks'
                ? 'text-[#4cd7f6] drop-shadow-[0_0_10px_rgba(76,215,246,0.8)] border-b-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:text-[#4cd7f6]'
            }`}
          >
            BARRACKS
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Tactical AI Advisor button */}
        <button
          onClick={onOpenAiAdvisor}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6f00be]/30 border border-[#ddb7ff]/40 text-[#ddb7ff] hover:bg-[#6f00be]/60 hover:shadow-[0_0_12px_rgba(221,183,255,0.4)] transition-all active:scale-95"
          title="Tactical AI Study Advisor"
        >
          <span className="material-symbols-outlined text-lg animate-pulse">auto_awesome</span>
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">AI Advisor</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border transition-all ${
            soundEnabled
              ? 'border-[#4cd7f6]/40 text-[#4cd7f6] bg-[#06b6d4]/10'
              : 'border-[#869397]/30 text-[#869397] bg-black/20'
          }`}
          title={soundEnabled ? 'Audio Effects Active' : 'Audio Muted'}
        >
          <span className="material-symbols-outlined text-xl">
            {soundEnabled ? 'volume_up' : 'volume_off'}
          </span>
        </button>

        {/* Rank Icon */}
        <div
          className="flex items-center justify-center p-2 rounded-lg bg-[#201f21] border border-[#e9c400]/40 text-[#e9c400] cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setActiveTab('squad')}
          title={`Current Rank: ${currentRank.name}`}
        >
          <span className="material-symbols-outlined text-xl filled">{currentRank.icon}</span>
        </div>

        {/* Profile Avatar */}
        <div
          onClick={() => setActiveTab('barracks')}
          className="w-10 h-10 rounded-full border-2 border-[#4cd7f6]/60 bg-[#201f21] overflow-hidden cursor-pointer hover:border-[#4cd7f6] hover:scale-105 transition-all shadow-[0_0_10px_rgba(76,215,246,0.3)]"
          title={`${commanderName} - View Barracks`}
        >
          <img
            src={avatarUrl}
            alt={commanderName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
