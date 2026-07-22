export interface Rank {
  name: string;
  minXp: number;
  icon: string;
  color: string;
  title: string;
}

export type TimerMode = 'pomodoro' | 'break' | 'stopwatch';
export type TabType = 'dashboard' | 'analytics' | 'armory' | 'squad' | 'barracks';

export interface FocusSessionLog {
  id: string;
  taskName: string;
  category: string;
  startTime: number; // timestamp in ms
  endTime: number; // timestamp in ms
  durationMinutes: number;
  durationSeconds: number;
  earnedXp: number;
  mode: 'pomodoro' | 'stopwatch';
}

export interface LogItem {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'level_up' | 'gear_unlock';
}

export interface ArmoryItem {
  id: string;
  name: string;
  category: 'Visor' | 'Title' | 'Theme' | 'Audio';
  costXp: number;
  icon: string;
  description: string;
  unlocked: boolean;
  equipped: boolean;
}

export interface QuestItem {
  id: string;
  title: string;
  targetMinutes: number;
  currentMinutes: number;
  xpReward: number;
  completed: boolean;
}

export interface SquadMember {
  id: string;
  name: string;
  rank: string;
  xp: number;
  hours: number;
  avatarUrl: string;
  status: 'In Battle' | 'Tactical Break' | 'Offline';
  isUser?: boolean;
}

export interface AppSettings {
  pomodoroMinutes: number;
  breakMinutes: number;
  soundEnabled: boolean;
  ambientMode: 'cyber_synth' | 'rain_hud' | 'deep_space' | 'off';
  commanderName: string;
  callSign: string;
}
