import { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useROIResults } from '../hooks/useROIResults';
import { useTheme } from '../contexts/ThemeContext';
import { SessionBanner } from './SessionBanner';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { SessionResult } from '../types/chat';
import blackLogo from '../assets/black_autonome_partners_-_logo_icon_(black).png';
import whiteLogo from '../assets/white__autonome_partners_-_logo_icon_(white).png';

interface ChatPanelProps {
  onComplete: (result: SessionResult) => void;
}

export function ChatPanel({ onComplete }: ChatPanelProps) {
  const { theme } = useTheme();
  const { messages, sendMessage, extractedSystems, sessionType, sessionComplete, isLoading, error } = useChat();
  const systemResults = useROIResults(extractedSystems);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';
  const logo = isDark ? whiteLogo : blackLogo;

  useEffect(() => {
    if (messages.length === 0 && !isLoading) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function handleViewResults() {
    onComplete({
      sessionType,
      systems: systemResults,
      clientName: 'Client',
    });
  }

  const starterPrompts = [
    'Model ROI for an invoice processing workflow',
    'Compare several automation opportunities',
    'Estimate payback for a support operations agent',
  ];

  return (
    <div className="flex h-full w-full flex-col">
      <SessionBanner
        sessionType={sessionType}
        systemCount={extractedSystems.length}
        isLoading={isLoading}
      />

      <div className="flex-1 overflow-y-auto px-4 sm:px-5 pt-5 pb-2">
        {messages.length === 0 && (
          <div className="flex min-h-[380px] flex-col items-center justify-center text-center py-10 sm:min-h-[460px] sm:py-12">
            <div className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${isDark ? 'border-white/10 bg-white/[0.08] text-white/60' : 'border-black/10 bg-black/[0.035] text-black/50'}`}>
              <Sparkles className="h-3.5 w-3.5 text-roi-yellow" />
              AI-guided model builder
            </div>
            <div className={`w-16 h-16 rounded-lg border flex items-center justify-center mb-5 overflow-hidden shadow-[0_20px_48px_rgba(0,0,0,0.16)] ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
              <img src={logo} alt="Autonome" className="h-14 w-14 object-contain scale-[1.55]" />
            </div>
            <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Build an ROI model</h2>
            <p className={`text-sm max-w-xl leading-6 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Start with a workflow, team, or automation idea. The assistant will structure the assumptions and turn them into an ROI case.
            </p>
            <div className="mt-7 grid w-full max-w-2xl gap-2 sm:grid-cols-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className={`rounded-lg border px-3 py-3 text-left text-xs font-bold leading-5 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'border-white/10 bg-white/[0.055] text-white/70 hover:border-roi-red/60 hover:bg-white/10' : 'border-black/10 bg-white text-black/70 hover:border-roi-red/40 hover:bg-roi-red/5'}`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center mr-3 overflow-hidden ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
              <img src={logo} alt="" className="h-7 w-7 object-contain scale-[1.55]" />
            </div>
            <div className={`border rounded-lg px-4 py-3 ${isDark ? 'bg-white/[0.07] border-white/10' : 'bg-white border-black/10'}`}>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-roi-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-roi-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-roi-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-4 mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {sessionComplete && systemResults.length > 0 && (
        <div className={`px-4 py-3 border-t ${isDark ? 'border-white/10 bg-white/[0.035]' : 'border-black/10 bg-black/[0.025]'}`}>
          <button
            onClick={handleViewResults}
            className="brand-button w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm"
          >
            View Results
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
