import React, { useState, useEffect, useRef } from 'react';
import { BackgroundShader } from './components/BackgroundShader';
import { TopHeader } from './components/TopHeader';
import { SideNavBar } from './components/SideNavBar';
import { BottomNavBar } from './components/BottomNavBar';
import { BattleGroundView } from './components/BattleGroundView';
import { FocusStatisticsView } from './components/FocusStatisticsView';
import { ArmoryView } from './components/ArmoryView';
import { SquadLeaderboardView } from './components/SquadLeaderboardView';
import { BarracksView } from './components/BarracksView';
import { LevelUpModal } from './components/LevelUpModal';
import { AITacticalAdvisorModal } from './components/AITacticalAdvisorModal';

import {
  RANKS,
  INITIAL_ARMORY_ITEMS,
  INITIAL_QUESTS,
  INITIAL_SQUAD_MEMBERS,
  INITIAL_FOCUS_LOGS,
  MOTIVATIONAL_QUOTES,
  TASK_CATEGORIES,
} from './constants';
import { Rank, ArmoryItem, QuestItem, LogItem, AppSettings, FocusSessionLog, TabType } from './types';
import {
  playClickSound,
  playTimerCompleteSound,
  playLevelUpSound,
  setAmbientSynth,
} from './utils/soundEffects';

export default function App() {
  // Local state persistence helpers
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('study_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [hours, setHours] = useState<number>(() => {
    const saved = localStorage.getItem('study_hours');
    return saved ? parseFloat(saved) : 0.0;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('study_streak');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('study_settings');
    return saved
      ? JSON.parse(saved)
      : {
          pomodoroMinutes: 25,
          breakMinutes: 5,
          soundEnabled: true,
          ambientMode: 'cyber_synth',
          commanderName: 'Commander Alex',
          callSign: 'Overdrive Operator',
        };
  });

  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return (
      localStorage.getItem('study_avatar') ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQh6Tdpkj8MKbsZIPuy0JLL60qb-2gq9VmgBuFZDVKx3YyLX6LEg3HZJXqL_KiCW1ZlivIWaE2dH6K_G_mz2lXUyGX8N--oP3n6FUkwuoBtG1JOWwIjTZ6HAJUxp05OcZA4cSIcPrSQ7b6kXoarV20I0T_hLntucLr-Wmnkc1eERJP4UWqtxqttE7cOSRIj7YADIrZcUjgv0XCtWz8kU40ijWTVqu17Qkogm_N6e--n2_NwYOJ6IxB6ivMIPIFEVpO-E2VMjji_wg'
    );
  });

  const [armoryItems, setArmoryItems] = useState<ArmoryItem[]>(() => {
    const saved = localStorage.getItem('study_armory');
    return saved ? JSON.parse(saved) : INITIAL_ARMORY_ITEMS;
  });

  const [quests, setQuests] = useState<QuestItem[]>(() => {
    const saved = localStorage.getItem('study_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [logs, setLogs] = useState<LogItem[]>(() => {
    const saved = localStorage.getItem('study_logs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'l1',
            message: 'Ready for deployment, Commander. Start the timer to earn XP.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'info',
          },
        ];
  });

  // Focus Session History State
  const [sessionLogs, setSessionLogs] = useState<FocusSessionLog[]>(() => {
    const saved = localStorage.getItem('study_focus_history');
    if (!saved) return [];
    try {
      const parsed: FocusSessionLog[] = JSON.parse(saved);
      // Clean out any previously saved mock data
      return parsed.filter((l) => !['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].includes(l.id));
    } catch {
      return [];
    }
  });

  // Custom Categories State
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('study_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return TASK_CATEGORIES;
  });

  const [taskCategory, setTaskCategory] = useState<string>(() => {
    return localStorage.getItem('study_task_category') || 'Deep Work';
  });

  // Timer State
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'break' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(settings.pomodoroMinutes * 60);
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeObjective, setActiveObjective] = useState<string>('General Focus');

  // Modals & Sound
  const [levelUpModal, setLevelUpModal] = useState<{ isOpen: boolean; rank: Rank | null }>({
    isOpen: false,
    rank: null,
  });
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('study_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('study_hours', hours.toString());
  }, [hours]);

  useEffect(() => {
    localStorage.setItem('study_streak', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('study_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('study_avatar', avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    localStorage.setItem('study_armory', JSON.stringify(armoryItems));
  }, [armoryItems]);

  useEffect(() => {
    localStorage.setItem('study_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('study_logs', JSON.stringify(logs.slice(0, 15)));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('study_focus_history', JSON.stringify(sessionLogs));
  }, [sessionLogs]);

  useEffect(() => {
    localStorage.setItem('study_task_category', taskCategory);
  }, [taskCategory]);

  useEffect(() => {
    localStorage.setItem('study_categories', JSON.stringify(categories));
  }, [categories]);

  // Category mutation handlers
  const handleAddCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return;
    setCategories((prev) => [...prev, trimmed]);
    setTaskCategory(trimmed);
    addLog(`Added new focus category: ${trimmed}`, 'info');
  };

  const handleEditCategory = (oldCat: string, newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || oldCat === trimmed) return;
    setCategories((prev) => prev.map((c) => (c === oldCat ? trimmed : c)));
    if (taskCategory === oldCat) {
      setTaskCategory(trimmed);
    }
    addLog(`Renamed category "${oldCat}" to "${trimmed}"`, 'info');
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) return;
    setCategories((prev) => {
      const next = prev.filter((c) => c !== catToDelete);
      if (taskCategory === catToDelete) {
        setTaskCategory(next[0] || 'General Focus');
      }
      return next;
    });
    addLog(`Removed category "${catToDelete}"`, 'info');
  };

  // Ambient sound management
  useEffect(() => {
    setAmbientSynth(settings.soundEnabled && isRunning, settings.ambientMode);
  }, [isRunning, settings.soundEnabled, settings.ambientMode]);

  // Determine current and next rank
  const getCurrentRank = (currentXp: number): Rank => {
    let rank = RANKS[0];
    for (let i = 0; i < RANKS.length; i++) {
      if (currentXp >= RANKS[i].minXp) {
        rank = RANKS[i];
      }
    }
    return rank;
  };

  const currentRank = getCurrentRank(xp);
  const currentRankIndex = RANKS.findIndex((r) => r.name === currentRank.name);
  const nextRank = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;

  // Add Log Helper
  const addLog = (message: string, type: 'info' | 'success' | 'level_up' | 'gear_unlock' = 'info') => {
    const newLog: LogItem = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Check level up
  const checkLevelUp = (oldXp: number, newXp: number) => {
    const oldRankIndex = RANKS.findIndex(
      (r, i) => oldXp >= r.minXp && (!RANKS[i + 1] || oldXp < RANKS[i + 1].minXp)
    );
    const newRankIndex = RANKS.findIndex(
      (r, i) => newXp >= r.minXp && (!RANKS[i + 1] || newXp < RANKS[i + 1].minXp)
    );

    if (newRankIndex > oldRankIndex) {
      const promotedRank = RANKS[newRankIndex];
      setLevelUpModal({ isOpen: true, rank: promotedRank });
      addLog(`PROMOTED! You reached ${promotedRank.name} Rank (${promotedRank.title}).`, 'level_up');
      if (settings.soundEnabled) {
        playLevelUpSound();
      }
    }
  };

  // Award XP function
  const awardXp = (amount: number, reason: string) => {
    setXp((prevXp) => {
      const nextXp = prevXp + amount;
      checkLevelUp(prevXp, nextXp);
      return nextXp;
    });
    if (reason) {
      addLog(`+${amount} XP: ${reason}`, 'success');
    }
  };

  // Log completed focus session helper
  const logCompletedSession = (durationSecs: number, mode: 'pomodoro' | 'stopwatch', xpEarned: number) => {
    if (durationSecs < 10) return;
    const mins = Math.max(1, Math.round(durationSecs / 60));
    const start = sessionStartTimeRef.current || (Date.now() - durationSecs * 1000);
    const newLog: FocusSessionLog = {
      id: Date.now().toString(),
      taskName: activeObjective || 'General Focus',
      category: taskCategory || 'General Focus',
      startTime: start,
      endTime: Date.now(),
      durationMinutes: mins,
      durationSeconds: durationSecs,
      earnedXp: xpEarned,
      mode,
    };
    setSessionLogs((prev) => [newLog, ...prev]);
  };

  // Mobile Background / Screen Sleep Safe Timestamp Timer Refs
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const lastTickTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isRunning) {
      lastTickTimeRef.current = Date.now();
      sessionStartTimeRef.current = Date.now();
    }
  }, [isRunning]);

  // Process Timer Tick Helper (handles time gaps gracefully)
  const processTimerTick = (elapsedSeconds: number) => {
    if (elapsedSeconds <= 0) return;

    if (timerMode === 'stopwatch') {
      setStopwatchTime((prev) => {
        const next = prev + elapsedSeconds;
        const prevMins = Math.floor(prev / 60);
        const nextMins = Math.floor(next / 60);
        const diffMins = nextMins - prevMins;

        if (diffMins > 0) {
          setHours((h) => h + diffMins / 60);
          awardXp(diffMins * 1, `${diffMins} Focus Minute(s) Completed`);
          updateQuestsProgress(diffMins);
        }
        return next;
      });
    } else {
      setTimeLeft((prev) => {
        if (prev > elapsedSeconds) {
          const next = prev - elapsedSeconds;
          const targetSecs = (timerMode === 'pomodoro' ? settings.pomodoroMinutes : settings.breakMinutes) * 60;
          const elapsedFromStart = targetSecs - next;
          const prevElapsedFromStart = targetSecs - prev;

          const diffMins = Math.floor(elapsedFromStart / 60) - Math.floor(prevElapsedFromStart / 60);
          if (timerMode === 'pomodoro' && diffMins > 0) {
            setHours((h) => h + diffMins / 60);
            awardXp(diffMins * 1, `${diffMins} Focus Minute(s) Completed`);
            updateQuestsProgress(diffMins);
          }
          return next;
        } else {
          // Timer Finished
          setIsRunning(false);

          if (settings.soundEnabled) {
            playTimerCompleteSound();
          }

          if (timerMode === 'pomodoro') {
            const sessionSecs = settings.pomodoroMinutes * 60;
            awardXp(10, 'Completed Pomodoro Battle Session!');
            addLog('Focus Session Complete! Commencing Break.', 'success');
            logCompletedSession(sessionSecs, 'pomodoro', settings.pomodoroMinutes + 10);
            setTimerMode('break');
            return settings.breakMinutes * 60;
          } else {
            addLog('Break Over. Deployment Required.', 'info');
            setTimerMode('pomodoro');
            return settings.pomodoroMinutes * 60;
          }
        }
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      lastTickTimeRef.current = Date.now();
      interval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (elapsedSeconds >= 1) {
          lastTickTimeRef.current += elapsedSeconds * 1000;
          processTimerTick(elapsedSeconds);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode, settings.pomodoroMinutes, settings.breakMinutes, settings.soundEnabled]);

  // Listener for mobile screen wake / tab focus
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && isRunningRef.current) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (elapsedSeconds >= 1) {
          lastTickTimeRef.current += elapsedSeconds * 1000;
          processTimerTick(elapsedSeconds);
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [timerMode, settings.pomodoroMinutes, settings.breakMinutes]);

  // Quests progress helper
  const updateQuestsProgress = (minutesAdded: number) => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (q.completed) return q;
        const newCurrent = q.currentMinutes + minutesAdded;
        const isNowCompleted = newCurrent >= q.targetMinutes;
        if (isNowCompleted) {
          awardXp(q.xpReward, `Completed Quest: ${q.title}`);
        }
        return {
          ...q,
          currentMinutes: newCurrent,
          completed: isNowCompleted,
        };
      })
    );
  };

  // Change Timer Mode handler
  const handleSetTimerMode = (newMode: 'pomodoro' | 'break' | 'stopwatch') => {
    if (settings.soundEnabled) playClickSound();
    setIsRunning(false);
    setTimerMode(newMode);
    if (newMode === 'pomodoro') {
      setTimeLeft(settings.pomodoroMinutes * 60);
    } else if (newMode === 'break') {
      setTimeLeft(settings.breakMinutes * 60);
    } else {
      setStopwatchTime(0);
    }
  };

  // Reset Timer
  const handleResetTimer = () => {
    if (settings.soundEnabled) playClickSound();
    setIsRunning(false);
    if (timerMode === 'stopwatch') {
      setStopwatchTime(0);
    } else if (timerMode === 'pomodoro') {
      setTimeLeft(settings.pomodoroMinutes * 60);
    } else {
      setTimeLeft(settings.breakMinutes * 60);
    }
  };

  // Add minutes
  const handleAddMinutes = (mins: number) => {
    if (settings.soundEnabled) playClickSound();
    setTimeLeft((prev) => prev + mins * 60);
    addLog(`+${mins} Minutes added to battle session.`, 'info');
  };

  // Toggle Timer
  const handleToggleTimer = () => {
    if (settings.soundEnabled) playClickSound();
    setIsRunning(!isRunning);
  };

  // Manual Log Stopwatch session
  const handleLogStopwatchSession = () => {
    if (stopwatchTime < 10) return;
    const mins = Math.max(1, Math.round(stopwatchTime / 60));
    logCompletedSession(stopwatchTime, 'stopwatch', mins * 2);
    addLog(`Logged Stopwatch Session: ${mins}m for ${activeObjective}`, 'success');
    setStopwatchTime(0);
    setIsRunning(false);
  };

  // Log handlers for FocusStatisticsView
  const handleDeleteLog = (id: string) => {
    setSessionLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClearLogs = () => {
    setSessionLogs([]);
  };

  const handleAddLog = (newLog: Omit<FocusSessionLog, 'id'>) => {
    const logWithId: FocusSessionLog = { ...newLog, id: Date.now().toString() };
    setSessionLogs((prev) => [logWithId, ...prev]);
    addLog(`Manually logged session: ${newLog.taskName} (${newLog.durationMinutes}m)`, 'success');
  };

  // Unlock Armory Item
  const handleUnlockItem = (item: ArmoryItem) => {
    if (xp < item.costXp) return;
    if (settings.soundEnabled) playClickSound();

    setXp((prev) => prev - item.costXp);
    setArmoryItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, unlocked: true, equipped: true } : i))
    );

    addLog(`Unlocked Gear: ${item.name}`, 'gear_unlock');
  };

  // Equip Armory Item
  const handleEquipItem = (item: ArmoryItem) => {
    if (settings.soundEnabled) playClickSound();
    setArmoryItems((prev) =>
      prev.map((i) => {
        if (i.category === item.category) {
          return { ...i, equipped: i.id === item.id };
        }
        return i;
      })
    );
    addLog(`Equipped ${item.category}: ${item.name}`, 'info');
  };

  // Reset All Data
  const handleResetProgress = () => {
    localStorage.clear();
    setXp(0);
    setHours(0);
    setStreakDays(1);
    setArmoryItems(INITIAL_ARMORY_ITEMS);
    setQuests(INITIAL_QUESTS);
    setSessionLogs(INITIAL_FOCUS_LOGS);
    setCategories(TASK_CATEGORIES);
    setTaskCategory('Deep Work');
    setLogs([
      {
        id: Date.now().toString(),
        message: 'Barracks reset complete. Fresh deployment initialized.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'info',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] font-body relative overflow-x-hidden selection:bg-[#06b6d4] selection:text-black">
      {/* WebGL Drifting Nebula Canvas */}
      <BackgroundShader />

      {/* Top Header */}
      <TopHeader
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (settings.soundEnabled) playClickSound();
          setActiveTab(tab);
        }}
        currentRank={currentRank}
        commanderName={settings.commanderName}
        avatarUrl={avatarUrl}
        soundEnabled={settings.soundEnabled}
        setSoundEnabled={(enabled) =>
          setSettings((prev) => ({ ...prev, soundEnabled: enabled }))
        }
        onOpenAiAdvisor={() => {
          if (settings.soundEnabled) playClickSound();
          setIsAiAdvisorOpen(true);
        }}
      />

      {/* Desktop Side Navigation */}
      <SideNavBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (settings.soundEnabled) playClickSound();
          setActiveTab(tab);
        }}
        currentRank={currentRank}
        nextRank={nextRank}
        xp={xp}
        onResetData={handleResetProgress}
      />

      {/* Main View Area */}
      <main className="lg:ml-64 pt-24 pb-28 lg:pb-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <BattleGroundView
            currentRank={currentRank}
            nextRank={nextRank}
            xp={xp}
            hours={hours}
            streakDays={streakDays}
            mode={timerMode}
            setMode={handleSetTimerMode}
            timeLeft={timeLeft}
            stopwatchTime={stopwatchTime}
            isRunning={isRunning}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onAddMinutes={handleAddMinutes}
            activeObjective={activeObjective}
            setActiveObjective={setActiveObjective}
            taskCategory={taskCategory}
            setTaskCategory={setTaskCategory}
            categories={categories}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onLogStopwatchSession={handleLogStopwatchSession}
            logs={logs}
            quests={quests}
            currentQuote={MOTIVATIONAL_QUOTES[quoteIndex]}
          />
        )}

        {activeTab === 'analytics' && (
          <FocusStatisticsView
            sessionLogs={sessionLogs}
            categories={categories}
            onDeleteLog={handleDeleteLog}
            onClearLogs={handleClearLogs}
            onAddLog={handleAddLog}
          />
        )}

        {activeTab === 'armory' && (
          <ArmoryView
            xp={xp}
            armoryItems={armoryItems}
            onUnlockItem={handleUnlockItem}
            onEquipItem={handleEquipItem}
          />
        )}

        {activeTab === 'squad' && (
          <SquadLeaderboardView
            squadMembers={INITIAL_SQUAD_MEMBERS}
            userXp={xp}
            userHours={hours}
            userRank={currentRank}
            commanderName={settings.commanderName}
            avatarUrl={avatarUrl}
          />
        )}

        {activeTab === 'barracks' && (
          <BarracksView
            settings={settings}
            onUpdateSettings={(newStgs) => setSettings((prev) => ({ ...prev, ...newStgs }))}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (settings.soundEnabled) playClickSound();
          setActiveTab(tab);
        }}
      />

      {/* Level Up Promotion Modal */}
      {levelUpModal.rank && (
        <LevelUpModal
          isOpen={levelUpModal.isOpen}
          rank={levelUpModal.rank}
          onClose={() => setLevelUpModal({ isOpen: false, rank: null })}
        />
      )}

      {/* AI Tactical Advisor Modal */}
      <AITacticalAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        activeObjective={activeObjective}
      />
    </div>
  );
}
