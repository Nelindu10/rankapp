import React from 'react';
import { SquadMember, Rank } from '../types';

interface SquadLeaderboardViewProps {
  squadMembers: SquadMember[];
  userXp: number;
  userHours: number;
  userRank: Rank;
  commanderName: string;
  avatarUrl: string;
}

export const SquadLeaderboardView: React.FC<SquadLeaderboardViewProps> = ({
  squadMembers,
  userXp,
  userHours,
  userRank,
  commanderName,
  avatarUrl,
}) => {
  // Combine user into leaderboard
  const allMembers: SquadMember[] = [
    ...squadMembers,
    {
      id: 'user_me',
      name: `${commanderName} (YOU)`,
      rank: userRank.name,
      xp: userXp,
      hours: userHours,
      avatarUrl: avatarUrl,
      status: 'In Battle',
      isUser: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-display text-4xl md:text-5xl text-[#4cd7f6] tracking-wider drop-shadow-[0_0_12px_rgba(76,215,246,0.6)]">
          SQUAD LEADERBOARD
        </h2>
        <p className="text-[#bcc9cd] font-body text-base mt-1">
          Compete against elite study commanders worldwide. Earn XP to climb rankings.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-[#4cd7f6]/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#201f21]/80 border-b border-[#3d494c]/50 text-xs font-mono-data text-[#bcc9cd] uppercase tracking-wider">
                <th className="p-4">Rank #</th>
                <th className="p-4">Commander</th>
                <th className="p-4">Heroic Rank</th>
                <th className="p-4">Focus Hours</th>
                <th className="p-4">Total XP</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d494c]/30 text-sm">
              {allMembers.map((member, index) => {
                const position = index + 1;
                return (
                  <tr
                    key={member.id}
                    className={`transition-colors ${
                      member.isUser
                        ? 'bg-[#06b6d4]/15 border-l-4 border-[#4cd7f6]'
                        : 'hover:bg-[#201f21]/40'
                    }`}
                  >
                    {/* Rank Position */}
                    <td className="p-4 font-display text-lg">
                      {position === 1 ? (
                        <span className="text-[#e9c400] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-xl filled">crown</span>
                          1ST
                        </span>
                      ) : position === 2 ? (
                        <span className="text-slate-300 font-bold">2ND</span>
                      ) : position === 3 ? (
                        <span className="text-amber-600 font-bold">3RD</span>
                      ) : (
                        <span className="text-[#bcc9cd] font-mono-data">#{position}</span>
                      )}
                    </td>

                    {/* Commander Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full border border-[#4cd7f6]/50 object-cover"
                        />
                        <div>
                          <span className="font-bold text-[#e5e1e4] block">{member.name}</span>
                          <span className="text-[10px] font-mono-data text-[#bcc9cd]">
                            ID: {member.id.substring(0, 6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Rank Badge */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#201f21] border border-[#ddb7ff]/30 text-[#ddb7ff]">
                        <span className="material-symbols-outlined text-sm">military_tech</span>
                        {member.rank}
                      </span>
                    </td>

                    {/* Hours */}
                    <td className="p-4 font-mono-data text-[#e5e1e4]">
                      {member.hours.toFixed(1)} hrs
                    </td>

                    {/* XP */}
                    <td className="p-4 font-display text-base text-[#e9c400]">
                      {member.xp} XP
                    </td>

                    {/* Status */}
                    <td className="p-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-mono-data font-bold uppercase ${
                          member.status === 'In Battle'
                            ? 'text-[#4cd7f6]'
                            : member.status === 'Tactical Break'
                            ? 'text-[#ddb7ff]'
                            : 'text-[#869397]'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            member.status === 'In Battle'
                              ? 'bg-[#4cd7f6] animate-ping'
                              : member.status === 'Tactical Break'
                              ? 'bg-[#ddb7ff]'
                              : 'bg-[#869397]'
                          }`}
                        ></span>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
