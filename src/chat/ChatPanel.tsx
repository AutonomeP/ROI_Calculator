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
      accent: 'autonome-blue',
      message: 'I want to model ROI for a single system or workflow.',
    },
    {
      id: 'platform',
      icon: Layers,
      label: 'Multi-System Platform',
      description: 'Scope a connected platform with multiple systems and get a combined output.',
      accent: 'autonome-yellow',
      message: 'I want to scope ROI for a connected platform with multiple systems working together.',
    },
  ];

  const examplePrompts = [
    'Invoice processing workflow',
    'Support operations agent',
    'Sales outreach automation',
    'Compliance review workflow',
    'Customer lifecycle intelligence layer',
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
              className="flex flex-1 flex-col items-center justify-center py-12"
            >
              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className={`text-3xl font-black mb-10 text-center tracking-tight ${isDark ? 'text-white' : 'text-black'}`}
              >
                Build your <span className="text-autonome-blue">ROI model</span> through chat
              </motion.h2>

              {/* ── Mode selection — the core choice ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-full max-w-lg"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {modeCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <motion.button
                        key={card.id}
                        type="button"
                        onClick={() => sendMessage(card.message)}
                        disabled={isLoading}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.36 + i * 0.08, duration: 0.38 }}
                        whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        className={`group relative flex flex-col items-center gap-4 rounded-2xl border p-6 text-center transition-all duration-300 disabled:opacity-40 ${
                          isDark
                            ? 'border-white/10 bg-white/[0.03] hover:border-autonome-blue/50 hover:bg-white/[0.06]'
                            : 'border-black/10 bg-black/[0.02] hover:border-autonome-blue/40 hover:bg-white hover:shadow-xl'
                        }`}
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-autonome-blue/10 text-autonome-blue transition-colors group-hover:bg-autonome-blue group-hover:text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                            {card.label}
                          </p>
                          <p className={`mt-1 text-xs leading-relaxed opacity-60`}>
                            {card.description}
                          </p>
                        </div>
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
                className="w-full max-w-lg mt-8"
              >
                <div className="flex flex-wrap justify-center gap-2">
                  {examplePrompts.map((prompt, i) => (
                    <motion.button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.06, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 ${
                        isDark 
                          ? 'border-white/5 bg-white/[0.02] text-white/40 hover:border-autonome-blue/30 hover:bg-white/[0.05] hover:text-white/80' 
                          : 'border-black/5 bg-black/[0.01] text-black/40 hover:border-autonome-blue/20 hover:bg-white hover:text-black/70 hover:shadow-md'
                      }`}
                    >
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
              <div className={`flex-shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center mr-3 overflow-hidden ring-1 ring-autonome-blue/15 ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
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
              className="cta-glow w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-autonome-blue to-autonome-blue-deep text-white font-bold text-sm tracking-wide group"
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
