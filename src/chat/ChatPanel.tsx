import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Building2, Layers, Sparkles, Zap } from 'lucide-react';
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

  const modeCards = [
    {
      id: 'single',
      icon: Building2,
      label: 'Single System',
      description: 'Model ROI for one workflow, agent, or automation.',
      accent: 'roi-red',
      message: 'I want to model ROI for a single system or workflow.',
    },
    {
      id: 'platform',
      icon: Layers,
      label: 'Multi-System Platform',
      description: 'Scope a connected platform with multiple systems and get a combined output.',
      accent: 'roi-yellow',
      message: 'I want to scope ROI for a connected platform with multiple systems working together.',
    },
  ];

  const examplePrompts = [
    'Invoice processing workflow',
    'Support operations agent',
    'Sales outreach automation',
  ];

  return (
    <div className="flex h-full w-full flex-col">
      <SessionBanner
        sessionType={sessionType}
        systemCount={extractedSystems.length}
        isLoading={isLoading}
      />

      <div className="flex-1 overflow-y-auto px-4 sm:px-5 pt-5 pb-2">
        {/* ── Empty / welcome state ── */}
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center py-8 sm:py-10"
            >
              {/* AI kicker badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, duration: 0.35 }}
                className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${isDark ? 'border-white/10 bg-white/[0.08] text-white/60' : 'border-black/10 bg-black/[0.035] text-black/50'}`}
              >
                <Sparkles className="h-3.5 w-3.5 text-roi-yellow" />
                AI-guided model builder
              </motion.div>

              {/* Floating logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative mb-5"
              >
                <div className={`absolute -inset-3 rounded-2xl blur-xl opacity-40 animate-pulse-slow ${isDark ? 'bg-roi-red/20' : 'bg-roi-red/10'}`} />
                <div className={`relative w-18 h-18 w-[72px] h-[72px] rounded-2xl border flex items-center justify-center overflow-hidden animate-float shadow-logo-glow ${isDark ? 'bg-black border-white/12' : 'bg-white border-black/10'}`}>
                  <img src={logo} alt="Autonome" className="h-[66px] w-[66px] object-contain scale-[1.55]" />
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className={`text-2xl font-black mb-2 text-center ${isDark ? 'text-white' : 'text-black'}`}
              >
                Build an <span className="shimmer-text">ROI model</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.4 }}
                className={`text-sm max-w-sm text-center leading-relaxed mb-8 ${isDark ? 'text-white/55' : 'text-black/55'}`}
              >
                First, tell me what you're modeling.
              </motion.p>

              {/* ── Mode selection — the core choice ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-full max-w-xl mb-6"
              >
                <p className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-3 text-center ${isDark ? 'text-white/35' : 'text-black/35'}`}>
                  Choose your session type
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {modeCards.map((card, i) => {
                    const Icon = card.icon;
                    const isRed = card.accent === 'roi-red';
                    return (
                      <motion.button
                        key={card.id}
                        type="button"
                        onClick={() => sendMessage(card.message)}
                        disabled={isLoading}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.36 + i * 0.08, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                          isDark
                            ? isRed
                              ? 'border-roi-red/25 bg-roi-red/[0.07] hover:border-roi-red/50 hover:bg-roi-red/[0.12] hover:shadow-[0_0_30px_rgba(204,0,0,0.15)]'
                              : 'border-roi-yellow/25 bg-roi-yellow/[0.06] hover:border-roi-yellow/45 hover:bg-roi-yellow/[0.10] hover:shadow-[0_0_30px_rgba(253,197,0,0.12)]'
                            : isRed
                              ? 'border-roi-red/20 bg-roi-red/[0.04] hover:border-roi-red/40 hover:bg-roi-red/[0.07] hover:shadow-[0_4px_20px_rgba(204,0,0,0.1)]'
                              : 'border-amber-300/40 bg-amber-50/60 hover:border-amber-400/60 hover:bg-amber-50 hover:shadow-[0_4px_20px_rgba(253,197,0,0.12)]'
                        }`}
                      >
                        {/* Icon circle */}
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${
                          isRed
                            ? 'bg-roi-red/15 text-roi-red'
                            : isDark ? 'bg-roi-yellow/15 text-roi-yellow' : 'bg-amber-100 text-amber-600'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-black mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                            {card.label}
                          </p>
                          <p className={`text-xs leading-relaxed ${isDark ? 'text-white/55' : 'text-black/55'}`}>
                            {card.description}
                          </p>
                        </div>

                        {/* Hover arrow */}
                        <ArrowRight className={`absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 ${isRed ? 'text-roi-red' : isDark ? 'text-roi-yellow' : 'text-amber-500'}`} />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Example prompts (secondary) ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="w-full max-w-xl"
              >
                <p className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-3 text-center ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                  Or start with an example
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {examplePrompts.map((prompt, i) => (
                    <motion.button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.06, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`prompt-card rounded-xl border px-3 py-2.5 text-left text-[11px] font-medium leading-snug disabled:cursor-not-allowed disabled:opacity-40 ${isDark ? 'border-white/10 bg-white/[0.04] text-white/55' : 'border-black/10 bg-black/[0.02] text-black/50'}`}
                    >
                      <Zap className={`h-3 w-3 mb-1.5 ${isDark ? 'text-white/30' : 'text-black/25'}`} />
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Message list ── */}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {/* ── Premium typing indicator ── */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="flex justify-start mb-4"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center mr-3 overflow-hidden ring-1 ring-roi-red/15 ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
                <img src={logo} alt="" className="h-7 w-7 object-contain scale-[1.55]" />
              </div>
              <div className={`border rounded-xl px-4 py-3.5 ${isDark ? 'bg-white/[0.07] border-white/10' : 'bg-white border-black/10 shadow-sm'}`}>
                <span className="flex gap-1.5 items-center">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error state ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/25 text-sm"
            >
              <span className={isDark ? 'text-red-300' : 'text-red-600'}>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── View Results CTA ── */}
      <AnimatePresence>
        {sessionComplete && systemResults.length > 0 && (
          <motion.div
            key="results-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`px-4 py-3.5 border-t ${isDark ? 'border-white/[0.08] bg-white/[0.03]' : 'border-black/[0.07] bg-black/[0.02]'}`}
          >
            <motion.button
              onClick={handleViewResults}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="cta-glow w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-roi-red to-roi-red-deep text-white font-bold text-sm tracking-wide group"
            >
              View Your ROI Results
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
