import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import LogoLoadingOverlay from './components/LogoLoadingOverlay';
import { ChatPanel } from './chat/ChatPanel';
import { OutputPanel } from './output/OutputPanel';
import type { SessionResult } from './types/chat';
import blackLogo from './assets/black_autonome_partners_-_logo_icon_(black).png';
import whiteLogo from './assets/white__autonome_partners_-_logo_icon_(white).png';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [screen, setScreen] = useState<'chat' | 'output'>('chat');
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [showLogoLoading, setShowLogoLoading] = useState(false);

  function handleChatComplete(result: SessionResult) {
    setSessionResult(result);
    setShowLogoLoading(true);
  }

  function handleLoadingComplete() {
    setShowLogoLoading(false);
    setScreen('output');
  }

  function handleBack() {
    setScreen('chat');
  }

  const isDark = theme === 'dark';
  const logo = isDark ? whiteLogo : blackLogo;

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-roi-black text-white' : 'bg-roi-light-bg text-roi-text-primary'}`}>
      {/* ── Layered background ── */}
      <div className={`absolute inset-0 ${isDark ? 'bg-premium-gradient' : 'bg-premium-gradient-light'}`} />
      <div className="absolute inset-0 opacity-[0.032] bg-[linear-gradient(rgba(11,11,11,0.85)_1px,transparent_1px),linear-gradient(90deg,rgba(11,11,11,0.85)_1px,transparent_1px)] bg-[size:44px_44px]" />

      {/* Blob 1 — red, top-right */}
      <div className={`absolute -right-36 -top-48 h-[600px] w-[600px] rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-roi-red/22' : 'bg-roi-red/12'}`} />
      {/* Blob 2 — yellow, bottom-left */}
      <div className={`absolute -bottom-56 -left-44 h-[700px] w-[700px] rounded-full blur-[130px] pointer-events-none ${isDark ? 'bg-roi-yellow/12' : 'bg-roi-yellow/28'}`} />
      {/* Blob 3 — red/accent, center-top (new) */}
      <div className={`absolute top-[30%] left-[45%] h-[400px] w-[400px] -translate-x-1/2 rounded-full blur-[140px] pointer-events-none ${isDark ? 'bg-roi-accent/8' : 'bg-roi-accent/5'}`} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
        {/* ── Sticky glass header ── */}
        <header className={`header-glass sticky top-0 z-20 flex items-center justify-between py-4 border-b ${isDark ? 'border-white/[0.08] bg-roi-black/70' : 'border-black/[0.07] bg-white/60'}`}>
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border ring-1 ring-roi-red/20 shadow-logo-glow ${isDark ? 'border-white/12 bg-black' : 'border-black/10 bg-white'}`}>
              <img src={logo} alt="Autonome" className="h-10 w-10 scale-[1.55] object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black leading-none tracking-tight">Autonome</h1>
              <p className={`mt-0.5 text-xs font-medium ${isDark ? 'text-white/45' : 'text-black/45'}`}>
                Agentic ROI Calculator
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <div className={`hidden items-center gap-2 rounded-lg border px-3 py-2 sm:flex ${isDark ? 'border-white/10 bg-white/[0.06] text-white/65' : 'border-black/10 bg-white/75 text-black/60'}`}>
              {/* live green pulse dot */}
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <ShieldCheck className="h-3.5 w-3.5 text-roi-red" />
              <span className="text-xs font-bold">Secure ROI Workspace</span>
            </div>
            {screen === 'output' && (
              <button
                onClick={handleBack}
                className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-px sm:flex ${isDark ? 'border-white/10 bg-white/[0.06] text-white/70 hover:bg-white/10 hover:border-white/20' : 'border-black/10 bg-white/80 text-black/70 hover:bg-white hover:border-black/20'}`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Chat
              </button>
            )}
            <button
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 hover:-translate-y-px ${isDark ? 'border-white/12 bg-white/[0.07] text-white hover:bg-white/12 hover:border-white/20' : 'border-black/10 bg-white/80 text-black hover:bg-white hover:border-black/20'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </motion.div>
        </header>

        <main className="flex flex-1 flex-col py-5 sm:py-6">
          {/* ── Hero section ── */}
          <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            >
              <div className={`mb-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${isDark ? 'border-white/10 bg-white/[0.06] text-white/55' : 'border-black/10 bg-white/70 text-black/50'}`}>
                <Sparkles className="h-3.5 w-3.5 text-roi-yellow" />
                AI-guided ROI modeling
              </div>
              <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
                Build a focused{' '}
                <span className="shimmer-text">ROI case</span>
                {' '}through chat.
              </h2>
              <p className={`mt-3 max-w-2xl text-sm leading-[1.75] sm:text-base ${isDark ? 'text-white/58' : 'text-black/58'}`}>
                Start with one workflow or a larger system. Autonome will ask the right follow-up questions,
                structure the assumptions, calculate ROI, and prepare export-ready results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.25 }}
              className={`grid grid-cols-3 gap-2 rounded-xl border p-2 ${isDark ? 'border-white/10 bg-white/[0.045]' : 'border-black/10 bg-white/70'}`}
            >
              {[
                ['Mode', 'Chat'],
                ['Output', 'ROI'],
                ['Export', 'Ready'],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className={`relative min-w-[82px] rounded-lg px-3 py-2 ${isDark ? 'bg-black/35' : 'bg-black/[0.03]'}`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/35' : 'text-black/35'}`}>{label}</p>
                  <p className="mt-0.5 text-sm font-black">{value}</p>
                  {/* bottom accent bar */}
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full opacity-60"
                    style={{ background: i === 0 ? 'var(--brand-red)' : i === 1 ? 'var(--brand-yellow)' : '#22c55e' }}
                  />
                </div>
              ))}
            </motion.div>
          </section>

          {/* ── Main chat / output panel ── */}
          <motion.section
            className="premium-panel flex min-h-[560px] flex-1 overflow-hidden sm:min-h-[620px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          >
            {screen === 'chat' && <ChatPanel onComplete={handleChatComplete} />}
            {screen === 'output' && sessionResult && <OutputPanel result={sessionResult} onBack={handleBack} />}
          </motion.section>
        </main>
      </div>

      <LogoLoadingOverlay isOpen={showLogoLoading} onComplete={handleLoadingComplete} />
    </div>
  );
}

export default App;
