import React, { useState } from 'react';
import { Rank, LogItem, QuestItem } from '../types';

interface BattleGroundViewProps {
  currentRank: Rank;
  nextRank: Rank | null;
  xp: number;
  hours: number;
  streakDays: number;
  mode: 'pomodoro' | 'break' | 'stopwatch';
  setMode: (mode: 'pomodoro' | 'break' | 'stopwatch') => void;
  timeLeft: number;
  stopwatchTime: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onAddMinutes: (mins: number) => void;
  activeObjective: string;
  setActiveObjective: (obj: string) => void;
  taskCategory: string;
  setTaskCategory: (cat: string) => void;
  categories: string[];
  onAddCategory: (newCategory: string) => void;
  onEditCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (categoryToDelete: string) => void;
  onLogStopwatchSession?: () => void;
  logs: LogItem[];
  quests: QuestItem[];
  currentQuote: string;
}

export const BattleGroundView: React.FC<BattleGroundViewProps> = ({
  currentRank,
  nextRank,
  xp,
  hours,
  streakDays,
  mode,
  setMode,
  timeLeft,
  stopwatchTime,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onAddMinutes,
  activeObjective,
  setActiveObjective,
  taskCategory,
  setTaskCategory,
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onLogStopwatchSession,
  logs,
  quests,
  currentQuote,
}) => {
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [tempObjective, setTempObjective] = useState(activeObjective);

  // Category Manager Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCatInput, setEditCatInput] = useState('');
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickAddInput, setQuickAddInput] = useState('');

  // Formatting times
  const formatTime = () => {
    if (mode === 'stopwatch') {
      const h = Math.floor(stopwatchTime / 3600);
      const m = Math.floor((stopwatchTime % 3600) / 60);
      const s = stopwatchTime % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // XP Progress Calculation
  const minXp = currentRank.minXp;
  const maxXp = nextRank ? nextRank.minXp : minXp + 500;
  const progressPercent = nextRank
    ? Math.min(100, Math.max(0, ((xp - minXp) / (maxXp - minXp)) * 100))
    : 100;

  const modeLabelText =
    mode === 'pomodoro'
      ? 'POMODORO FOCUS'
      : mode === 'break'
      ? 'TACTICAL BREAK'
      : 'ENDLESS GRIND';

  const handleObjectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveObjective(tempObjective.trim() || 'General Tactical Study');
    setIsEditingObjective(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-glow-primary mb-2 tracking-wider text-[#4cd7f6]">
              BATTLE PREP
            </h2>
            <p className="text-[#bcc9cd] font-body text-base">
              Elite study sessions earn higher rank. Focus, Commander.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-6 min-w-[320px]">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-mono-data mb-2 text-[#e5e1e4]">
                <span className="text-[#bcc9cd] uppercase tracking-wider">CURRENT XP</span>
                <span className="font-bold text-[#4cd7f6]">{xp}</span>
              </div>
              <div className="h-2.5 w-full bg-[#353437] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-[#6f00be] to-[#ddb7ff] transition-all duration-500 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 shimmer-bg"></div>
                </div>
              </div>
              <div className="mt-1 text-[10px] text-[#bcc9cd] font-mono-data text-right">
                {nextRank ? `Next Rank at ${nextRank.minXp} XP` : 'MAX RANK REACHED'}
              </div>
            </div>

            <div className="flex flex-col items-center pl-2 border-l border-[#3d494c]/40">
              <span
                className="material-symbols-outlined text-[#e9c400] text-4xl filled animate-pulse"
              >
                {currentRank.icon}
              </span>
              <span className="text-[10px] font-bold text-[#e9c400] uppercase tracking-wider mt-1">
                {currentRank.name}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Objective & Category Selector Banner */}
      <div className="glass-panel p-5 rounded-2xl space-y-3 border-l-4 border-[#4cd7f6]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-2xl shrink-0">target</span>
            <div className="flex-1">
              <span className="text-[10px] font-mono-data uppercase text-[#bcc9cd] tracking-wider block">
                ACTIVE FOCUS TASK / OBJECTIVE
              </span>
              {isEditingObjective ? (
                <form onSubmit={handleObjectiveSubmit} className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={tempObjective}
                    onChange={(e) => setTempObjective(e.target.value)}
                    placeholder="Type Task Name e.g. Clean room, Coding..."
                    className="bg-[#0e0e10] border border-[#4cd7f6] rounded-lg px-3 py-1.5 text-sm text-[#e5e1e4] focus:outline-none w-full max-w-md"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#06b6d4] text-black font-bold text-xs rounded-lg hover:bg-[#4cd7f6] shrink-0"
                  >
                    SAVE
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="font-bold text-[#e5e1e4] text-base md:text-lg">
                    {activeObjective || 'General Focus'}
                  </span>
                  <button
                    onClick={() => {
                      setTempObjective(activeObjective);
                      setIsEditingObjective(true);
                    }}
                    className="text-xs font-mono-data text-[#4cd7f6] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>EDIT</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stopwatch Log Session Button */}
          {mode === 'stopwatch' && stopwatchTime >= 10 && onLogStopwatchSession && (
            <button
              onClick={onLogStopwatchSession}
              className="px-4 py-2 bg-[#e9c400] text-[#3a3000] font-mono-data text-xs font-bold rounded-xl shadow-[0_0_12px_rgba(233,196,0,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>LOG SESSION ({Math.round(stopwatchTime / 60)}m)</span>
            </button>
          )}
        </div>

        {/* Quick Category Chips / Pills & Management */}
        <div className="pt-2 border-t border-[#3d494c]/40 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono-data uppercase text-[#bcc9cd] tracking-wider shrink-0 mr-1">
            Category:
          </span>

          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setTaskCategory(cat);
                  if (!activeObjective || activeObjective === 'General Tactical Study' || activeObjective === 'General Focus') {
                    setActiveObjective(`${cat} Session`);
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono-data transition-all cursor-pointer shrink-0 ${
                  taskCategory === cat
                    ? 'bg-[#06b6d4] text-black font-extrabold shadow-[0_0_10px_rgba(76,215,246,0.6)]'
                    : 'bg-[#201f21] text-[#bcc9cd] border border-[#3d494c]/60 hover:text-white hover:border-[#4cd7f6]/50'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Inline Quick Add Category Button / Form */}
            {isQuickAdding ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (quickAddInput.trim()) {
                    onAddCategory(quickAddInput.trim());
                    setQuickAddInput('');
                  }
                  setIsQuickAdding(false);
                }}
                className="flex items-center gap-1 shrink-0"
              >
                <input
                  type="text"
                  value={quickAddInput}
                  onChange={(e) => setQuickAddInput(e.target.value)}
                  placeholder="New category..."
                  className="bg-[#0e0e10] border border-[#4cd7f6] rounded-lg px-2.5 py-0.5 text-xs text-[#e5e1e4] focus:outline-none w-28"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 text-[#4cd7f6] hover:text-white bg-[#06b6d4]/20 rounded cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsQuickAdding(false)}
                  className="p-1 text-[#bcc9cd] hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsQuickAdding(true)}
                className="px-2.5 py-1 bg-[#201f21] hover:bg-[#3d494c]/50 text-[#4cd7f6] border border-[#4cd7f6]/40 rounded-lg text-xs font-mono-data flex items-center gap-1 shrink-0 cursor-pointer transition-all"
                title="Quick Add Category"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>ADD</span>
              </button>
            )}

            {/* Manage Categories Modal Button */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-2.5 py-1 bg-[#4cd7f6]/10 hover:bg-[#4cd7f6]/20 border border-[#4cd7f6]/40 text-[#4cd7f6] rounded-lg text-xs font-mono-data font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              title="Manage Categories"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              <span>MANAGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Central Timer (Large Card) */}
        <div className="md:col-span-8 glass-panel rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden group min-h-[460px]">
          {/* Card Header Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#4cd7f6]/50 shadow-[0_0_10px_rgba(76,215,246,0.5)]"></div>

          {/* Mode Selector Badges */}
          <div className="flex items-center gap-2 mb-6 bg-[#0e0e10]/80 p-1.5 rounded-full border border-[#3d494c]/60">
            <button
              onClick={() => setMode('pomodoro')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                mode === 'pomodoro'
                  ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_10px_rgba(76,215,246,0.5)]'
                  : 'text-[#bcc9cd] hover:text-white'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => setMode('break')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                mode === 'break'
                  ? 'bg-[#ddb7ff] text-[#490080] shadow-[0_0_10px_rgba(221,183,255,0.5)]'
                  : 'text-[#bcc9cd] hover:text-white'
              }`}
            >
              5m Break
            </button>
            <button
              onClick={() => setMode('stopwatch')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                mode === 'stopwatch'
                  ? 'bg-[#e9c400] text-[#3a3000] shadow-[0_0_10px_rgba(233,196,0,0.5)]'
                  : 'text-[#bcc9cd] hover:text-white'
              }`}
            >
              Endless Grind
            </button>
          </div>

          {/* Timer Display */}
          <div className="relative z-10 text-center my-2">
            <div className="font-mono-data text-[#4cd7f6] tracking-[0.3em] mb-2 text-xs md:text-sm font-bold uppercase">
              {modeLabelText}
            </div>

            <div className="font-display text-7xl sm:text-8xl md:text-9xl tracking-tight text-[#e5e1e4] select-none my-4 drop-shadow-[0_0_20px_rgba(76,215,246,0.3)]">
              {formatTime()}
            </div>

            {/* Quick Time Add Buttons */}
            {mode === 'pomodoro' && (
              <div className="flex justify-center gap-2 mb-6">
                <button
                  onClick={() => onAddMinutes(5)}
                  className="px-3 py-1 rounded-lg bg-[#201f21] border border-[#4cd7f6]/30 text-xs text-[#4cd7f6] hover:bg-[#06b6d4]/20 transition-all active:scale-95 cursor-pointer font-mono-data"
                >
                  +5 MIN
                </button>
                <button
                  onClick={() => onAddMinutes(10)}
                  className="px-3 py-1 rounded-lg bg-[#201f21] border border-[#4cd7f6]/30 text-xs text-[#4cd7f6] hover:bg-[#06b6d4]/20 transition-all active:scale-95 cursor-pointer font-mono-data"
                >
                  +10 MIN
                </button>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button
                onClick={onResetTimer}
                className="p-4 rounded-full border border-[#4cd7f6]/30 text-[#4cd7f6] hover:bg-[#4cd7f6]/10 transition-all active:scale-90 cursor-pointer"
                title="Reset Session"
              >
                <span className="material-symbols-outlined text-3xl">replay</span>
              </button>

              <button
                onClick={onToggleTimer}
                className={`w-20 h-20 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-[#ffb4ab] text-[#690005] shadow-[0_0_25px_rgba(255,180,171,0.6)]'
                    : 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_25px_rgba(76,215,246,0.6)] hover:scale-110'
                }`}
                title={isRunning ? 'Pause Battle' : 'Start Battle'}
              >
                <span className="material-symbols-outlined text-4xl filled">
                  {isRunning ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => {
                  const modes: ('pomodoro' | 'break' | 'stopwatch')[] = ['pomodoro', 'break', 'stopwatch'];
                  const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
                  setMode(modes[nextIndex]);
                }}
                className="p-4 rounded-full border border-[#4cd7f6]/30 text-[#4cd7f6] hover:bg-[#4cd7f6]/10 transition-all active:scale-90 cursor-pointer"
                title="Switch Mode"
              >
                <span className="material-symbols-outlined text-3xl">swap_horiz</span>
              </button>
            </div>
          </div>

          {/* Pulse Ring when running */}
          {isRunning && (
            <div className="absolute w-[360px] h-[360px] md:w-[420px] md:h-[420px] border border-[#4cd7f6]/20 rounded-full animate-ping pointer-events-none opacity-40"></div>
          )}
        </div>

        {/* Right Stats & Mission Log */}
        <div className="md:col-span-4 grid grid-rows-2 gap-6">
          {/* Session History / Log */}
          <div className="glass-panel rounded-2xl p-6 relative flex flex-col h-full min-h-[220px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#6f00be]/50 shadow-[0_0_10px_rgba(111,0,190,0.5)]"></div>
            <h3 className="font-display text-xl mb-4 text-[#ddb7ff] tracking-wide flex items-center justify-between">
              <span>MISSION LOG</span>
              <span className="text-[10px] font-mono-data text-[#bcc9cd]">LIVE FEED</span>
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[160px] pr-1 flex-1">
              {logs.length === 0 ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#201f21]/50 text-xs text-[#bcc9cd]">
                  <span className="material-symbols-outlined text-[#bcc9cd]">info</span>
                  <span>Ready for deployment, Commander. Start the timer to earn XP.</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs leading-snug border-l-2 ${
                      log.type === 'success'
                        ? 'bg-[#06b6d4]/10 border-[#4cd7f6] text-[#4cd7f6]'
                        : log.type === 'level_up'
                        ? 'bg-[#e9c400]/10 border-[#e9c400] text-[#e9c400]'
                        : 'bg-[#201f21]/60 border-[#3d494c] text-[#e5e1e4]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base mt-0.5 shrink-0">
                      {log.type === 'success'
                        ? 'check_circle'
                        : log.type === 'level_up'
                        ? 'military_tech'
                        : 'info'}
                    </span>
                    <div className="flex-1">
                      <p>{log.message}</p>
                      <span className="text-[9px] font-mono-data text-[#bcc9cd] block mt-0.5">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Career Stats */}
          <div className="glass-panel rounded-2xl p-6 relative flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#e9c400]/50 shadow-[0_0_10px_rgba(233,196,0,0.5)]"></div>
            <h3 className="font-display text-xl mb-4 text-[#e9c400] tracking-wide">
              CAREER STATS
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#201f21]/60 rounded-lg border border-[#3d494c]/30">
                <p className="text-[10px] text-[#bcc9cd] font-bold uppercase tracking-wider">
                  Total Hours
                </p>
                <p className="font-display text-2xl text-[#e9c400] mt-1">{hours.toFixed(1)}</p>
              </div>

              <div className="p-3 bg-[#201f21]/60 rounded-lg border border-[#3d494c]/30">
                <p className="text-[10px] text-[#bcc9cd] font-bold uppercase tracking-wider">
                  Total XP
                </p>
                <p className="font-display text-2xl text-[#e9c400] mt-1">{xp}</p>
              </div>

              <div className="p-3 bg-[#201f21]/60 rounded-lg border border-[#3d494c]/30 col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] text-[#bcc9cd] font-bold uppercase tracking-wider">
                    Focus Streak
                  </p>
                  <span className="text-xs font-mono-data text-[#e9c400] font-bold">
                    {streakDays} Days
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5].map((day) => (
                    <div
                      key={day}
                      className={`h-1.5 w-full rounded-full ${
                        day <= streakDays ? 'bg-[#e9c400] shadow-[0_0_6px_#e9c400]' : 'bg-[#353437]'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quests Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 glass-panel rounded-2xl p-6 border-t-2 border-[#ddb7ff]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-[#ddb7ff] tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">assignment</span>
              <span>DAILY FOCUS QUESTS</span>
            </h3>
            <span className="text-xs font-mono-data text-[#bcc9cd]">AUTO-RENEWING</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quests.map((q) => {
              const qProgress = Math.min(100, Math.round((q.currentMinutes / q.targetMinutes) * 100));
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    q.completed
                      ? 'bg-[#06b6d4]/10 border-[#4cd7f6]/50'
                      : 'bg-[#201f21]/50 border-[#3d494c]/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-body font-bold text-sm text-[#e5e1e4]">{q.title}</h4>
                    <span className="text-xs font-mono-data text-[#e9c400] font-bold shrink-0 ml-2">
                      +{q.xpReward} XP
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#353437] rounded-full overflow-hidden my-2">
                    <div
                      className="h-full bg-[#4cd7f6] transition-all duration-300"
                      style={{ width: `${qProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono-data text-[#bcc9cd]">
                    <span>
                      {q.currentMinutes} / {q.targetMinutes} Mins
                    </span>
                    <span className={q.completed ? 'text-[#4cd7f6] font-bold' : ''}>
                      {q.completed ? 'COMPLETED' : `${qProgress}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="glass-panel rounded-xl p-4 flex items-center gap-4 flex-wrap justify-between border-t border-[#3d494c]/40">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-[#4cd7f6] rounded-full animate-pulse shadow-[0_0_10px_#4cd7f6]"></span>
          <span className="text-xs font-mono-data font-bold text-[#bcc9cd] tracking-wider">
            ONLINE STATUS: ACTIVE
          </span>
        </div>
        <p className="text-xs text-[#bcc9cd] italic max-w-xl text-center md:text-left">
          "{currentQuote}"
        </p>
      </div>

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-[#4cd7f6]/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-[#3d494c]/40 pb-3">
              <h3 className="font-display text-xl text-[#4cd7f6] flex items-center gap-2">
                <span className="material-symbols-outlined">category</span>
                MANAGE CATEGORIES
              </h3>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-[#bcc9cd] hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Add New Category Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newCatInput.trim()) {
                  onAddCategory(newCatInput.trim());
                  setNewCatInput('');
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                placeholder="Enter new category name (e.g. Fitness, Assignment)..."
                className="flex-1 bg-[#0e0e10] border border-[#3d494c] focus:border-[#4cd7f6] rounded-lg px-3 py-2 text-sm text-[#e5e1e4] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#06b6d4] text-black font-bold text-xs rounded-lg hover:bg-[#4cd7f6] transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>ADD</span>
              </button>
            </form>

            {/* Category List */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono-data text-[#bcc9cd] uppercase tracking-wider block">
                Existing Category Tags ({categories.length})
              </span>

              {categories.map((cat) => {
                const isEditing = editingCategory === cat;

                return (
                  <div
                    key={cat}
                    className="p-3 bg-[#0e0e10]/80 rounded-xl border border-[#3d494c]/50 flex items-center justify-between gap-3"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editCatInput}
                          onChange={(e) => setEditCatInput(e.target.value)}
                          className="flex-1 bg-[#201f21] border border-[#4cd7f6] rounded px-2.5 py-1 text-xs text-[#e5e1e4] focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (editCatInput.trim()) {
                              onEditCategory(cat, editCatInput.trim());
                            }
                            setEditingCategory(null);
                          }}
                          className="px-2.5 py-1 bg-[#06b6d4] text-black font-bold text-xs rounded hover:bg-[#4cd7f6] cursor-pointer"
                        >
                          SAVE
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="px-2.5 py-1 bg-[#201f21] text-[#bcc9cd] text-xs rounded hover:text-white cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-sm text-[#e5e1e4] truncate">{cat}</span>
                          {taskCategory === cat && (
                            <span className="text-[9px] font-mono-data bg-[#06b6d4]/20 border border-[#4cd7f6] text-[#4cd7f6] px-2 py-0.5 rounded">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setEditCatInput(cat);
                            }}
                            className="p-1.5 text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors cursor-pointer"
                            title="Edit Category Name"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() => onDeleteCategory(cat)}
                            disabled={categories.length <= 1}
                            className={`p-1.5 transition-colors cursor-pointer ${
                              categories.length <= 1
                                ? 'text-[#3d494c] cursor-not-allowed'
                                : 'text-[#bcc9cd] hover:text-[#ffb4ab]'
                            }`}
                            title={categories.length <= 1 ? 'Cannot delete sole category' : 'Delete Category'}
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#3d494c]/40">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-[#201f21] text-[#e5e1e4] border border-[#3d494c] rounded-lg text-xs font-bold hover:bg-[#3d494c]/50 cursor-pointer"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
