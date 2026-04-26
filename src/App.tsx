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
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(0,82,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,82,255,0.8)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Ambient premium glow blobs */}
      <div className={`absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none opacity-40 ${isDark ? 'bg-autonome-blue/20' : 'bg-autonome-blue/10'}`} />
      <div className={`absolute -left-24 -bottom-24 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none opacity-30 ${isDark ? 'bg-autonome-blue/15' : 'bg-autonome-blue/5'}`} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 sm:px-6">
        {/* ── Minimal Header ── */}
        <header className="flex items-center justify-between py-6">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border shadow-sm ${isDark ? 'border-white/12 bg-black' : 'border-black/10 bg-white'}`}>
              <img src={logo} alt="Autonome" className="h-8 w-8 scale-[1.55] object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold leading-none tracking-tight">Autonome</h1>
              <p className={`mt-0.5 text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-white/45' : 'text-black/45'}`}>
                ROI Calculator
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="flex items-center gap-6">
              {[
                { id: 'chat', label: 'Chat' },
                { id: 'assumptions', label: 'Assumptions' },
                { id: 'roi', label: 'ROI Model' },
                { id: 'export', label: 'Export' },
              ].map((step, i, arr) => {
                const isActive = screen === 'chat' ? step.id === 'chat' || step.id === 'assumptions' : step.id === 'roi' || step.id === 'export';
                const isCurrent = screen === 'chat' ? step.id === 'chat' : step.id === 'roi';
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-autonome-blue' : isDark ? 'bg-white/20' : 'bg-black/10'} ${isCurrent && 'ring-4 ring-autonome-blue/20'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest hidden md:block ${isActive ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/35' : 'text-black/35')}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={`h-4 w-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

            <button
              onClick={toggleTheme}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? 'border-white/12 text-white' : 'border-black/10 text-black'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </motion.div>
        </header>

        <main className="flex flex-1 flex-col justify-center pb-12 sm:pb-20">
          {/* ── Main Workspace ── */}
          <motion.section
            className={`premium-panel flex min-h-[600px] flex-col overflow-hidden rounded-2xl border shadow-2xl ${isDark ? 'border-white/10 bg-roi-charcoal/80' : 'border-black/10 bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="flex flex-1 flex-col">
              {screen === 'chat' && <ChatPanel onComplete={handleChatComplete} />}
              {screen === 'output' && sessionResult && <OutputPanel result={sessionResult} onBack={handleBack} />}
            </div>
          </motion.section>
        </main>
      </div>

      <LogoLoadingOverlay isOpen={showLogoLoading} onComplete={handleLoadingComplete} />
    </div>
  );
}

export default App;
