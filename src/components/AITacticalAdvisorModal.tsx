import React, { useState } from 'react';

interface AITacticalAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeObjective: string;
}

export const AITacticalAdvisorModal: React.FC<AITacticalAdvisorModalProps> = ({
  isOpen,
  onClose,
  activeObjective,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    `Create a 3-step focus plan for "${activeObjective || 'Calculus Exam Preparation'}".`,
    `Give me 3 tactical techniques to eliminate study fatigue in my next 25-minute battle.`,
    `Explain the Feynman technique in tactical gaming terms for fast learning.`,
  ];

  const handleConsult = async (selectedPrompt?: string) => {
    const query = selectedPrompt || prompt;
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, objective: activeObjective }),
      });

      if (!res.ok) {
        throw new Error('Failed to consult tactical advisor');
      }

      const data = await res.json();
      setResponse(data.advice || 'Command received: Maintain target lock and execute 25-minute study intervals.');
    } catch (err) {
      console.error(err);
      // Fallback response for offline or dev mode
      setResponse(
        `TACTICAL ADVISOR BRIEFING:\n\n1. Target Breakdown: Divide "${activeObjective || 'Study Target'}" into 25-minute high-yield operational sprints.\n2. Zero Distractions: Mute external communications, prepare hydration, and maintain focus lock.\n3. Active Recall Protocol: After every 15 minutes, test your memory without looking at notes.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="glass-panel p-6 md:p-8 rounded-2xl max-w-lg w-full border-[#ddb7ff]/40 shadow-[0_0_30px_rgba(111,0,190,0.4)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#bcc9cd] hover:text-white p-2 rounded-lg"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[#6f00be]/30 border border-[#ddb7ff]/30 text-[#ddb7ff]">
            <span className="material-symbols-outlined text-2xl animate-pulse">auto_awesome</span>
          </div>
          <div>
            <h3 className="font-display text-2xl text-[#ddb7ff] tracking-wide">
              TACTICAL AI ADVISOR
            </h3>
            <p className="text-xs text-[#bcc9cd]">
              Gemini Intelligence Unit • Strategic Study Optimization
            </p>
          </div>
        </div>

        {activeObjective && (
          <div className="mb-4 p-3 rounded-lg bg-[#201f21] border border-[#4cd7f6]/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-sm">target</span>
            <span className="text-xs text-[#bcc9cd]">
              Target Lock: <span className="text-[#4cd7f6] font-bold">{activeObjective}</span>
            </span>
          </div>
        )}

        {/* Quick Prompts */}
        <div className="mb-4 space-y-2">
          <p className="text-[10px] font-mono-data text-[#bcc9cd] uppercase tracking-wider">
            RECOMMENDED BRIEFINGS
          </p>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                handleConsult(p);
              }}
              className="w-full text-left p-2.5 rounded-lg bg-[#1c1b1d] border border-[#3d494c]/50 text-xs text-[#e5e1e4] hover:border-[#ddb7ff] hover:bg-[#201f21] transition-all flex items-center justify-between"
            >
              <span className="line-clamp-1">{p}</span>
              <span className="material-symbols-outlined text-sm text-[#ddb7ff]">send</span>
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask for custom study strategy, memory tips..."
              className="flex-1 bg-[#0e0e10] border border-[#3d494c] rounded-lg px-3 py-2 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#ddb7ff]"
              onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
            />
            <button
              onClick={() => handleConsult()}
              disabled={loading}
              className="px-4 py-2 bg-[#6f00be] hover:bg-[#a855f7] text-[#f0dbff] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </div>

        {/* Response display */}
        {response && (
          <div className="p-4 rounded-xl bg-[#0e0e10] border border-[#ddb7ff]/30 text-xs text-[#e5e1e4] max-h-48 overflow-y-auto space-y-2 leading-relaxed">
            <div className="flex items-center justify-between text-[#ddb7ff] font-bold mb-1">
              <span>ADVISOR ANALYSIS</span>
              <span className="text-[10px] text-[#bcc9cd] font-mono-data">STATUS: OPTIMAL</span>
            </div>
            <div className="whitespace-pre-wrap font-mono-data text-[#bcc9cd]">{response}</div>
          </div>
        )}
      </div>
    </div>
  );
};
