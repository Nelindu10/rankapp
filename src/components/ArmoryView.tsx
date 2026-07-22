import React, { useState } from 'react';
import { ArmoryItem } from '../types';

interface ArmoryViewProps {
  xp: number;
  armoryItems: ArmoryItem[];
  onUnlockItem: (item: ArmoryItem) => void;
  onEquipItem: (item: ArmoryItem) => void;
}

export const ArmoryView: React.FC<ArmoryViewProps> = ({
  xp,
  armoryItems,
  onUnlockItem,
  onEquipItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Visor', 'Title', 'Audio', 'Theme'];

  const filteredItems =
    selectedCategory === 'All'
      ? armoryItems
      : armoryItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-4xl md:text-5xl text-[#ddb7ff] tracking-wider drop-shadow-[0_0_12px_rgba(221,183,255,0.6)]">
            ARMORY VAULT
          </h2>
          <p className="text-[#bcc9cd] font-body text-base mt-1">
            Unlock elite tactical visors, titles, and audio synthesizers with earned XP.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 min-w-[240px]">
          <span className="material-symbols-outlined text-[#e9c400] text-3xl filled">
            workspace_premium
          </span>
          <div>
            <span className="text-[10px] font-mono-data text-[#bcc9cd] block uppercase tracking-wider">
              AVAILABLE XP CURRENCY
            </span>
            <span className="font-display text-2xl text-[#e9c400]">{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-[#3d494c]/50 pb-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#6f00be] text-[#d6a9ff] shadow-[0_0_12px_rgba(111,0,190,0.6)]'
                : 'text-[#bcc9cd] hover:bg-[#201f21]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Armory Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
              item.equipped
                ? 'border-2 border-[#4cd7f6] shadow-[0_0_20px_rgba(76,215,246,0.3)]'
                : item.unlocked
                ? 'border border-[#ddb7ff]/30 hover:border-[#ddb7ff]'
                : 'border border-[#3d494c]/40 opacity-90'
            }`}
          >
            {/* Equipped Badge */}
            {item.equipped && (
              <div className="absolute top-3 right-3 bg-[#06b6d4] text-[#003640] px-2.5 py-0.5 rounded-full font-mono-data text-[10px] font-bold uppercase tracking-wider">
                EQUIPPED
              </div>
            )}

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#201f21] border border-[#3d494c] flex items-center justify-center text-[#4cd7f6] mb-4 shadow-inner">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>

              <div className="text-[10px] font-mono-data text-[#ddb7ff] uppercase tracking-wider font-bold mb-1">
                {item.category}
              </div>

              <h3 className="font-body font-bold text-lg text-[#e5e1e4] mb-2">{item.name}</h3>

              <p className="text-xs text-[#bcc9cd] leading-relaxed mb-6">{item.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#3d494c]/40 flex items-center justify-between">
              {!item.unlocked ? (
                <button
                  onClick={() => onUnlockItem(item)}
                  disabled={xp < item.costXp}
                  className={`w-full py-2.5 rounded-lg font-display text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    xp >= item.costXp
                      ? 'bg-[#e9c400] text-[#3a3000] font-bold hover:bg-[#ffe16d] shadow-lg shadow-[#e9c400]/20 active:scale-95'
                      : 'bg-[#201f21] text-[#869397] border border-[#3d494c] cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>UNLOCK ({item.costXp} XP)</span>
                </button>
              ) : item.equipped ? (
                <div className="w-full text-center text-xs font-mono-data text-[#4cd7f6] font-bold uppercase py-2">
                  ACTIVE GEAR
                </div>
              ) : (
                <button
                  onClick={() => onEquipItem(item)}
                  className="w-full py-2.5 bg-[#6f00be] hover:bg-[#a855f7] text-[#f0dbff] font-display text-sm uppercase tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer font-bold"
                >
                  EQUIP GEAR
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
