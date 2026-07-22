import React, { useState } from 'react';
import { FocusSessionLog } from '../types';

interface FocusStatisticsViewProps {
  sessionLogs: FocusSessionLog[];
  onDeleteLog?: (id: string) => void;
  onClearLogs?: () => void;
  onAddLog?: (log: Omit<FocusSessionLog, 'id'>) => void;
}

type PeriodFilter = 'day' | 'week' | 'month' | 'all';

// Category color palette matching dark futuristic gaming HUD
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; hex: string }> = {
  'Coding': { bg: 'bg-[#4cd7f6]/20', border: 'border-[#4cd7f6]', text: 'text-[#4cd7f6]', hex: '#4cd7f6' },
  'Deep Work': { bg: 'bg-[#a855f7]/20', border: 'border-[#a855f7]', text: 'text-[#c084fc]', hex: '#a855f7' },
  'Reading': { bg: 'bg-[#10b981]/20', border: 'border-[#10b981]', text: 'text-[#34d399]', hex: '#10b981' },
  'Clean room': { bg: 'bg-[#f59e0b]/20', border: 'border-[#f59e0b]', text: 'text-[#fbbf24]', hex: '#f59e0b' },
  'Mathematics': { bg: 'bg-[#f43f5e]/20', border: 'border-[#f43f5e]', text: 'text-[#fb7185]', hex: '#f43f5e' },
  'General Focus': { bg: 'bg-[#06b6d4]/20', border: 'border-[#06b6d4]', text: 'text-[#22d3ee]', hex: '#06b6d4' },
  'Unclassified': { bg: 'bg-[#94a3b8]/20', border: 'border-[#94a3b8]', text: 'text-[#cbd5e1]', hex: '#94a3b8' },
};

const DEFAULT_COLOR = { bg: 'bg-[#a855f7]/20', border: 'border-[#a855f7]', text: 'text-[#c084fc]', hex: '#a855f7' };

export const FocusStatisticsView: React.FC<FocusStatisticsViewProps> = ({
  sessionLogs,
  onDeleteLog,
  onClearLogs,
  onAddLog,
}) => {
  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Manual Log Form State
  const [newCustomTask, setNewCustomTask] = useState('');
  const [newCategory, setNewCategory] = useState('Deep Work');
  const [newDurationMins, setNewDurationMins] = useState(25);

  // Filter logs by selected period
  const now = Date.now();
  const filteredLogs = sessionLogs.filter((log) => {
    if (period === 'day') {
      return log.startTime >= now - 24 * 60 * 60 * 1000;
    }
    if (period === 'week') {
      return log.startTime >= now - 7 * 24 * 60 * 60 * 1000;
    }
    if (period === 'month') {
      return log.startTime >= now - 30 * 24 * 60 * 60 * 1000;
    }
    return true; // 'all'
  });

  // Calculate Overview Metrics
  const totalMinutes = filteredLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const totalSessions = filteredLogs.length;
  const totalXpEarned = filteredLogs.reduce((acc, log) => acc + log.earnedXp, 0);
  const avgSessionMins = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Format Duration string
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (hours > 0) {
      return `${hours}h ${m}m`;
    }
    return `${m}m`;
  };

  // Group by Task Name / Category for Donut Chart & Task Ranking List
  const taskMap: Record<string, { name: string; category: string; duration: number; count: number; xp: number }> = {};
  filteredLogs.forEach((log) => {
    const key = log.taskName || log.category || 'Unclassified';
    if (!taskMap[key]) {
      taskMap[key] = {
        name: key,
        category: log.category || 'General Focus',
        duration: 0,
        count: 0,
        xp: 0,
      };
    }
    taskMap[key].duration += log.durationMinutes;
    taskMap[key].count += 1;
    taskMap[key].xp += log.earnedXp;
  });

  const taskList = Object.values(taskMap).sort((a, b) => b.duration - a.duration);

  // Generate SVG Donut Chart Segments
  let cumulativePercent = 0;
  const radius = 65;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  const donutSegments = taskList.map((task) => {
    const percentage = totalMinutes > 0 ? (task.duration / totalMinutes) * 100 : 0;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += percentage;

    const color = CATEGORY_COLORS[task.category] || CATEGORY_COLORS[task.name] || DEFAULT_COLOR;

    return {
      ...task,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      color,
    };
  });

  // Trends Graph Data (Last 7 Days or Last 30 Days or Hours)
  const getTrendData = () => {
    const daysCount = period === 'day' ? 7 : period === 'week' ? 7 : period === 'month' ? 30 : 14;
    const result = [];
    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const dayLogs = filteredLogs.filter((l) => l.startTime >= dayStart && l.startTime < dayEnd);
      const dayMins = dayLogs.reduce((acc, l) => acc + l.durationMinutes, 0);

      const dayLabel = daysCount <= 7 
        ? d.toLocaleDateString([], { weekday: 'short' }) 
        : `${d.getMonth() + 1}/${d.getDate()}`;

      result.push({
        dateStr: dayLabel,
        fullDate: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        minutes: dayMins,
        sessionsCount: dayLogs.length,
      });
    }
    return result;
  };

  const trendData = getTrendData();
  const maxTrendMins = Math.max(...trendData.map((t) => t.minutes), 30);

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddLog) return;
    const taskName = newCustomTask.trim() || `${newCategory} Session`;
    const duration = Math.max(1, newDurationMins);
    const end = Date.now();
    const start = end - duration * 60 * 1000;

    onAddLog({
      taskName,
      category: newCategory,
      startTime: start,
      endTime: end,
      durationMinutes: duration,
      durationSeconds: duration * 60,
      earnedXp: Math.round(duration * 1.2),
      mode: 'pomodoro',
    });

    setNewCustomTask('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Period Filters */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-[#4cd7f6] text-3xl">insights</span>
            <h2 className="font-display text-3xl md:text-5xl text-glow-primary tracking-wider text-[#4cd7f6]">
              FOCUS ANALYTICS
            </h2>
          </div>
          <p className="text-[#bcc9cd] font-body text-sm md:text-base">
            Tactical breakdown of focus hours, task distributions, and productivity trends.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-[#0e0e10]/90 p-1.5 rounded-xl border border-[#3d494c]/60 backdrop-blur-md">
          {(['day', 'week', 'month', 'all'] as PeriodFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-mono-data uppercase transition-all cursor-pointer ${
                period === p
                  ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_12px_rgba(76,215,246,0.6)] font-extrabold'
                  : 'text-[#bcc9cd] hover:text-white'
              }`}
            >
              {p === 'day' ? '24 Hours' : p === 'week' ? '7 Days' : p === 'month' ? '30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </section>

      {/* Overview Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-[#4cd7f6] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#bcc9cd]">
              TOTAL FOCUS TIME
            </span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-xl">timer</span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl md:text-4xl text-[#4cd7f6] drop-shadow-[0_0_10px_rgba(76,215,246,0.4)]">
              {formatDuration(totalMinutes)}
            </span>
            <p className="text-[11px] font-mono-data text-[#869397] mt-1">
              {totalMinutes} total minutes logged
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-[#ddb7ff] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#bcc9cd]">
              SESSIONS LOGGED
            </span>
            <span className="material-symbols-outlined text-[#ddb7ff] text-xl">task_alt</span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl md:text-4xl text-[#ddb7ff] drop-shadow-[0_0_10px_rgba(221,183,255,0.4)]">
              {totalSessions}
            </span>
            <p className="text-[11px] font-mono-data text-[#869397] mt-1">
              Completed study deployments
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-[#e9c400] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#bcc9cd]">
              EARNED XP
            </span>
            <span className="material-symbols-outlined text-[#e9c400] text-xl">military_tech</span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl md:text-4xl text-[#e9c400] drop-shadow-[0_0_10px_rgba(233,196,0,0.4)]">
              +{totalXpEarned}
            </span>
            <p className="text-[11px] font-mono-data text-[#869397] mt-1">
              Battle experience accrued
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-[#10b981] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#bcc9cd]">
              AVG SESSION
            </span>
            <span className="material-symbols-outlined text-[#10b981] text-xl">avg_pace</span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl md:text-4xl text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
              {avgSessionMins}m
            </span>
            <p className="text-[11px] font-mono-data text-[#869397] mt-1">
              Per deployment session
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Donut Chart (Task Distribution) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xl text-[#e5e1e4] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6]">donut_large</span>
              TASK DISTRIBUTION
            </h3>
            <span className="text-[10px] font-mono-data text-[#bcc9cd] uppercase tracking-wider">
              Categorical Breakdown
            </span>
          </div>

          {totalMinutes === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-[#3d494c] mb-2">donut_large</span>
              <p className="text-sm text-[#869397]">No focus sessions recorded in this period.</p>
              <p className="text-xs text-[#bcc9cd] mt-1">Start the timer to log tactical data!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center my-2">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#201f21"
                    strokeWidth={strokeWidth}
                  />
                  {donutSegments.map((seg, i) => (
                    <circle
                      key={i}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color.hex}
                      strokeWidth={strokeWidth}
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      className="transition-all duration-500 cursor-pointer hover:opacity-80"
                      onMouseEnter={() => setHoveredTask(seg.name)}
                      onMouseLeave={() => setHoveredTask(null)}
                    />
                  ))}
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] font-mono-data uppercase text-[#bcc9cd]">
                    {hoveredTask || 'TOTAL FOCUS'}
                  </span>
                  <span className="font-display text-2xl font-bold text-[#e5e1e4]">
                    {hoveredTask
                      ? formatDuration(taskMap[hoveredTask]?.duration || 0)
                      : formatDuration(totalMinutes)}
                  </span>
                  {hoveredTask && (
                    <span className="text-[10px] font-mono-data text-[#4cd7f6]">
                      {((taskMap[hoveredTask]?.duration / totalMinutes) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Chart Legend */}
              <div className="w-full mt-6 space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {donutSegments.map((seg, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredTask(seg.name)}
                    onMouseLeave={() => setHoveredTask(null)}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-xs ${
                      hoveredTask === seg.name ? 'bg-[#2a2a2c]' : 'hover:bg-[#201f21]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px]"
                        style={{ backgroundColor: seg.color.hex, boxShadow: `0 0 8px ${seg.color.hex}` }}
                      ></span>
                      <span className="font-bold text-[#e5e1e4] truncate">{seg.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-mono-data">
                      <span className="text-[#bcc9cd]">{formatDuration(seg.duration)}</span>
                      <span className="text-[#4cd7f6] font-bold w-12 text-right">
                        {seg.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Focus Ranking (Task Breakdown List) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xl text-[#e5e1e4] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ddb7ff]">leaderboard</span>
              TASK RANKINGS & BREAKDOWN
            </h3>
            <span className="text-[10px] font-mono-data text-[#bcc9cd] uppercase tracking-wider">
              Ranked by Duration
            </span>
          </div>

          {taskList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-[#869397]">No tasks recorded for this period.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {taskList.map((task, index) => {
                const pct = totalMinutes > 0 ? (task.duration / totalMinutes) * 100 : 0;
                const styleColor = CATEGORY_COLORS[task.category] || CATEGORY_COLORS[task.name] || DEFAULT_COLOR;

                return (
                  <div
                    key={task.name}
                    className="p-3.5 bg-[#0e0e10]/80 rounded-xl border border-[#3d494c]/40 hover:border-[#4cd7f6]/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-[#201f21] border border-[#3d494c] flex items-center justify-center text-xs font-mono-data font-bold text-[#e5e1e4] shrink-0">
                          #{index + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-[#e5e1e4] truncate">{task.name}</h4>
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded font-mono-data border ${styleColor.bg} ${styleColor.border} ${styleColor.text} mt-0.5`}
                          >
                            {task.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-display text-lg font-bold text-[#4cd7f6] block leading-none">
                          {formatDuration(task.duration)}
                        </span>
                        <span className="text-[11px] font-mono-data text-[#bcc9cd]">
                          {pct.toFixed(2)}% of total focus
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[#201f21] rounded-full overflow-hidden relative">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: styleColor.hex,
                          boxShadow: `0 0 10px ${styleColor.hex}`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Trends Graph (Visual Bar Chart) */}
      <div className="glass-panel rounded-2xl p-6 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h3 className="font-display text-xl text-[#e5e1e4] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e9c400]">show_chart</span>
              STUDY & FOCUS TRENDS
            </h3>
            <p className="text-xs text-[#bcc9cd] font-mono-data">
              Daily focus volume over the selected filter timeline
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#4cd7f6] bg-[#06b6d4]/10 border border-[#4cd7f6]/30 px-3 py-1 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            <span>Peak Day Target: 120m</span>
          </div>
        </div>

        {/* Bar Chart Canvas */}
        <div className="h-56 w-full flex items-end gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-[#3d494c]/50 relative">
          {trendData.map((d, idx) => {
            const heightPct = maxTrendMins > 0 ? (d.minutes / maxTrendMins) * 100 : 0;
            const isHovered = hoveredBarIndex === idx;

            return (
              <div
                key={idx}
                className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {/* Hover Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-[#0e0e10] border border-[#4cd7f6] px-2.5 py-1 rounded shadow-xl text-center whitespace-nowrap pointer-events-none">
                    <p className="text-[10px] font-mono-data text-[#bcc9cd]">{d.fullDate}</p>
                    <p className="text-xs font-bold font-mono-data text-[#4cd7f6]">
                      {formatDuration(d.minutes)} ({d.sessionsCount} sessions)
                    </p>
                  </div>
                )}

                {/* Bar */}
                <div
                  className="w-full max-w-[36px] bg-gradient-to-t from-[#6f00be] to-[#4cd7f6] rounded-t-md transition-all duration-300 relative group-hover:brightness-125"
                  style={{ height: `${Math.max(4, heightPct)}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#4cd7f6] rounded-t shadow-[0_0_8px_#4cd7f6]"></div>
                </div>

                {/* Date Label */}
                <span className="text-[10px] font-mono-data text-[#bcc9cd] mt-2 group-hover:text-[#4cd7f6]">
                  {d.dateStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus History Session Logs Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#3d494c]/40 pb-4">
          <div>
            <h3 className="font-display text-xl text-[#e5e1e4] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#10b981]">history</span>
              SESSION DEPLOYMENT LOGS
            </h3>
            <p className="text-xs text-[#bcc9cd]">Persistent local record of all completed focus sessions</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-[#06b6d4]/20 border border-[#4cd7f6]/50 text-[#4cd7f6] hover:bg-[#06b6d4]/40 font-mono-data text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>LOG SESSION</span>
            </button>

            {onClearLogs && filteredLogs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="px-3 py-1.5 text-xs text-[#bcc9cd] hover:text-[#ffb4ab] font-mono-data border border-[#3d494c] hover:border-[#ffb4ab]/40 rounded-lg transition-colors cursor-pointer"
              >
                CLEAR LOGS
              </button>
            )}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-center py-8 text-sm text-[#869397]">
            No session history recorded yet. Complete a study timer or stopwatch session to build your logs!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-[#3d494c]/60 text-[#bcc9cd] font-mono-data uppercase text-[10px]">
                  <th className="py-3 px-3">TASK / CATEGORY</th>
                  <th className="py-3 px-3">DATE & TIME</th>
                  <th className="py-3 px-3">DURATION</th>
                  <th className="py-3 px-3">XP EARNED</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d494c]/30">
                {filteredLogs.map((log) => {
                  const styleColor = CATEGORY_COLORS[log.category] || DEFAULT_COLOR;
                  const startDate = new Date(log.startTime);
                  const endDate = new Date(log.endTime || log.startTime + log.durationMinutes * 60 * 1000);

                  return (
                    <tr key={log.id} className="hover:bg-[#201f21]/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#e5e1e4]">{log.taskName}</div>
                        <span
                          className={`inline-block text-[9px] px-1.5 py-0.5 rounded font-mono-data border ${styleColor.bg} ${styleColor.border} ${styleColor.text} mt-0.5`}
                        >
                          {log.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono-data text-[#bcc9cd]">
                        <div>{startDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-[11px] text-[#869397]">
                          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-bold text-[#4cd7f6] font-mono-data">
                        {formatDuration(log.durationMinutes)}
                      </td>

                      <td className="py-3 px-3 font-bold text-[#e9c400] font-mono-data">
                        +{log.earnedXp} XP
                      </td>

                      <td className="py-3 px-3 text-right">
                        {onDeleteLog && (
                          <button
                            onClick={() => onDeleteLog(log.id)}
                            className="p-1 text-[#bcc9cd] hover:text-[#ffb4ab] transition-colors"
                            title="Delete Log"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-[#4cd7f6]/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#3d494c]/40 pb-3">
              <h3 className="font-display text-xl text-[#4cd7f6] flex items-center gap-2">
                <span className="material-symbols-outlined">edit_note</span>
                LOG PAST FOCUS SESSION
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#bcc9cd] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-data text-[#bcc9cd] uppercase mb-1">
                  Task Name / Description
                </label>
                <input
                  type="text"
                  value={newCustomTask}
                  onChange={(e) => setNewCustomTask(e.target.value)}
                  placeholder="e.g. Quantum Physics Problem Set"
                  className="w-full bg-[#0e0e10] border border-[#3d494c] focus:border-[#4cd7f6] rounded-lg px-3 py-2 text-sm text-[#e5e1e4] focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-[#bcc9cd] uppercase mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#0e0e10] border border-[#3d494c] focus:border-[#4cd7f6] rounded-lg px-3 py-2 text-sm text-[#e5e1e4] focus:outline-none"
                >
                  <option value="Deep Work">Deep Work</option>
                  <option value="Coding">Coding</option>
                  <option value="Reading">Reading</option>
                  <option value="Clean room">Clean room</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="General Focus">General Focus</option>
                  <option value="Unclassified">Unclassified</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-data text-[#bcc9cd] uppercase mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={newDurationMins}
                  onChange={(e) => setNewDurationMins(parseInt(e.target.value) || 25)}
                  className="w-full bg-[#0e0e10] border border-[#3d494c] focus:border-[#4cd7f6] rounded-lg px-3 py-2 text-sm text-[#e5e1e4] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#3d494c] text-[#bcc9cd] rounded-lg text-xs font-bold hover:bg-[#201f21]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#06b6d4] text-black font-bold rounded-lg text-xs hover:bg-[#4cd7f6]"
                >
                  SAVE SESSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
