import React from 'react';
import { AppSettings } from '../types';

interface BarracksViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  onResetProgress: () => void;
}

export const BarracksView: React.FC<BarracksViewProps> = ({
  settings,
  onUpdateSettings,
  avatarUrl,
  setAvatarUrl,
  onResetProgress,
}) => {
  const avatarOptions = [
    {
      name: 'Cyber Commander (Default)',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQh6Tdpkj8MKbsZIPuy0JLL60qb-2gq9VmgBuFZDVKx3YyLX6LEg3HZJXqL_KiCW1ZlivIWaE2dH6K_G_mz2lXUyGX8N--oP3n6FUkwuoBtG1JOWwIjTZ6HAJUxp05OcZA4cSIcPrSQ7b6kXoarV20I0T_hLntucLr-Wmnkc1eERJP4UWqtxqttE7cOSRIj7YADIrZcUjgv0XCtWz8kU40ijWTVqu17Qkogm_N6e--n2_NwYOJ6IxB6ivMIPIFEVpO-E2VMjji_wg',
    },
    {
      name: 'Neon Tactician',
      url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Quantum Specialist',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Vanguard Operative',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-display text-4xl md:text-5xl text-[#4cd7f6] tracking-wider drop-shadow-[0_0_12px_rgba(76,215,246,0.6)]">
          COMMAND BARRACKS
        </h2>
        <p className="text-[#bcc9cd] font-body text-base mt-1">
          Configure battle timers, audio synthesizers, call-signs, and avatar systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commander Profile Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-[#4cd7f6]/20 space-y-4">
          <h3 className="font-display text-xl text-[#4cd7f6] tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">badge</span>
            <span>COMMANDER PROFILE</span>
          </h3>

          <div>
            <label className="text-xs font-mono-data text-[#bcc9cd] block mb-1">
              COMMANDER CALL-SIGN
            </label>
            <input
              type="text"
              value={settings.commanderName}
              onChange={(e) => onUpdateSettings({ commanderName: e.target.value })}
              className="w-full bg-[#0e0e10] border border-[#3d494c] rounded-lg px-3 py-2 text-sm text-[#e5e1e4] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div>
            <label className="text-xs font-mono-data text-[#bcc9cd] block mb-1">
              TACTICAL TITLE
            </label>
            <input
              type="text"
              value={settings.callSign}
              onChange={(e) => onUpdateSettings({ callSign: e.target.value })}
              className="w-full bg-[#0e0e10] border border-[#3d494c] rounded-lg px-3 py-2 text-sm text-[#e5e1e4] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-mono-data text-[#bcc9cd] block mb-2">
              SELECT AVATAR VISOR
            </label>
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setAvatarUrl(opt.url)}
                  className={`w-14 h-14 rounded-full border-2 overflow-hidden transition-all cursor-pointer ${
                    avatarUrl === opt.url
                      ? 'border-[#4cd7f6] shadow-[0_0_12px_#4cd7f6] scale-105'
                      : 'border-[#3d494c] opacity-60 hover:opacity-100'
                  }`}
                  title={opt.name}
                >
                  <img src={opt.url} alt={opt.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timer Configuration */}
        <div className="glass-panel p-6 rounded-2xl border border-[#ddb7ff]/20 space-y-4">
          <h3 className="font-display text-xl text-[#ddb7ff] tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">timer</span>
            <span>TACTICAL TIMER PROTOCOLS</span>
          </h3>

          <div>
            <label className="text-xs font-mono-data text-[#bcc9cd] block mb-2">
              FOCUS SESSION DURATION
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => onUpdateSettings({ pomodoroMinutes: mins })}
                  className={`py-2 rounded-lg font-mono-data font-bold text-xs transition-all cursor-pointer ${
                    settings.pomodoroMinutes === mins
                      ? 'bg-[#6f00be] text-[#d6a9ff] border border-[#ddb7ff]'
                      : 'bg-[#201f21] text-[#bcc9cd] hover:bg-[#2a2a2c]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono-data text-[#bcc9cd] block mb-2">
              TACTICAL BREAK DURATION
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  onClick={() => onUpdateSettings({ breakMinutes: mins })}
                  className={`py-2 rounded-lg font-mono-data font-bold text-xs transition-all cursor-pointer ${
                    settings.breakMinutes === mins
                      ? 'bg-[#6f00be] text-[#d6a9ff] border border-[#ddb7ff]'
                      : 'bg-[#201f21] text-[#bcc9cd] hover:bg-[#2a2a2c]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Ambient Sound Mode */}
          <div>
            <label className="text-xs font-mono-data text-[#bcc9cd] block mb-2">
              AMBIENT NEURAL SYNTHESIZER
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cyber_synth', label: 'Cyber Pulse' },
                { id: 'rain_hud', label: 'Rain HUD' },
                { id: 'deep_space', label: 'Deep Space' },
                { id: 'off', label: 'Muted' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() =>
                    onUpdateSettings({
                      ambientMode: m.id as AppSettings['ambientMode'],
                    })
                  }
                  className={`py-2 px-3 rounded-lg font-body font-bold text-xs transition-all text-left flex items-center justify-between cursor-pointer ${
                    settings.ambientMode === m.id
                      ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-[0_0_10px_#4cd7f6]'
                      : 'bg-[#201f21] text-[#bcc9cd] hover:bg-[#2a2a2c]'
                  }`}
                >
                  <span>{m.label}</span>
                  {settings.ambientMode === m.id && (
                    <span className="material-symbols-outlined text-sm">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-panel p-6 rounded-2xl border border-[#ffb4ab]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-body font-bold text-[#ffb4ab] text-sm">RESET BARRACKS DATA</h4>
          <p className="text-xs text-[#bcc9cd] mt-0.5">
            Wipe local storage state including XP, rank progress, hours, and armory unlocks.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all profile progress and XP?')) {
              onResetProgress();
            }
          }}
          className="px-4 py-2 bg-[#ffb4ab]/20 border border-[#ffb4ab] text-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#690005] rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 shrink-0"
        >
          RESET DATA
        </button>
      </div>
    </div>
  );
};
