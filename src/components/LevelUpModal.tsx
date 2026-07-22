import React from 'react';
import { Rank } from '../types';

interface LevelUpModalProps {
  isOpen: boolean;
  rank: Rank;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, rank, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="glass-panel p-8 md:p-12 rounded-3xl text-center max-w-sm w-full level-up-anim border-[#e9c400] border-2 shadow-[0_0_30px_rgba(233,196,0,0.5)]">
        <div className="mb-6 relative inline-block">
          <span className="material-symbols-outlined text-[#e9c400] text-8xl filled animate-bounce">
            {rank.icon}
          </span>
          <div className="absolute -top-2 -right-2 bg-[#e9c400] text-[#3a3000] rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-lg">
            !
          </div>
        </div>

        <h2 className="font-display text-4xl text-[#e9c400] mb-2 tracking-wider drop-shadow-[0_0_10px_rgba(233,196,0,0.8)]">
          PROMOTED!
        </h2>
        <p className="font-body text-[#e5e1e4] mb-2 text-sm leading-relaxed">
          Commander, you have ascended to{' '}
          <span className="font-bold text-[#e9c400] uppercase tracking-wider">{rank.name}</span> rank!
        </p>
        <p className="text-xs text-[#bcc9cd] font-mono-data mb-6">
          Title Unlocked: <span className="text-[#4cd7f6]">{rank.title}</span>
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 bg-[#e9c400] text-[#3a3000] font-display text-lg tracking-wider rounded-xl shadow-xl shadow-[#e9c400]/20 active:scale-95 transition-transform hover:bg-[#ffe16d] cursor-pointer font-bold"
        >
          CONTINUE MISSION
        </button>
      </div>
    </div>
  );
};
