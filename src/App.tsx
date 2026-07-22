import React, { useState, useEffect, useRef } from 'react';
import { BackgroundShader } from './components/BackgroundShader';
import { TopHeader } from './components/TopHeader';
import { SideNavBar } from './components/SideNavBar';
import { BottomNavBar } from './components/BottomNavBar';
import { BattleGroundView } from './components/BattleGroundView';
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
  MOTIVATIONAL_QUOTES,
} from './constants';
import { Rank, ArmoryItem, QuestItem, LogItem, AppSettings } from './types';
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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'armory' | 'squad' | 'barracks'>('dashboard');

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

  // Timer State
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'break' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(settings.pomodoroMinutes * 60);
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeObjective, setActiveObjective] = useState<string>('Quantum Physics & Algorithmic Analysis');

  // Modals & Sound
  const [levelUpModal, setLevelUpModal] = useState<{ isOpen: boolean; rank: Rank | null }>({
    isOpen: false,
    rank: null,
  });
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Sync to local storage
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

  // Timer Tick Interval
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === 'stopwatch') {
          setStopwatchTime((prev) => {
            const next = prev + 1;
            // 1 minute focused in stopwatch = +1 XP & +1/60 hours
            if (next % 60 === 0) {
              setHours((h) => h + 1 / 60);
              awardXp(1, 'Continuous Grind Minute');
              updateQuestsProgress(1);
            }
            return next;
          });
        } else {
          setTimeLeft((prev) => {
            if (prev > 1) {
              const next = prev - 1;
              // 1 minute in pomodoro = +1 XP
              if (timerMode === 'pomodoro' && (settings.pomodoroMinutes * 60 - next) % 60 === 0) {
                setHours((h) => h + 1 / 60);
                awardXp(1, 'Focus Minute Completed');
                updateQuestsProgress(1);
              }
              return next;
            } else {
              // Timer Finished
              setIsRunning(false);

              if (settings.soundEnabled) {
                playTimerCompleteSound();
              }

              if (timerMode === 'pomodoro') {
                awardXp(10, 'Completed Pomodoro Battle Session!');
                addLog('Focus Session Complete! Commencing Break.', 'success');
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
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode, settings.pomodoroMinutes, settings.breakMinutes, settings.soundEnabled]);

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
            logs={logs}
            quests={quests}
            currentQuote={MOTIVATIONAL_QUOTES[quoteIndex]}
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
