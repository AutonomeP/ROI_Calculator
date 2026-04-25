import { useState } from 'react';
import { ArrowLeft, BrainCircuit, Moon, ShieldCheck, Sparkles, Sun } from 'lucide-react';
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
      <div className={`absolute inset-0 ${isDark ? 'bg-premium-gradient' : 'bg-premium-gradient-light'}`} />
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(11,11,11,0.75)_1px,transparent_1px),linear-gradient(90deg,rgba(11,11,11,0.75)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className={`absolute -right-36 -top-48 h-[560px] w-[560px] rounded-full blur-3xl ${isDark ? 'bg-roi-red/18' : 'bg-roi-red/10'}`} />
      <div className={`absolute -bottom-56 -left-44 h-[660px] w-[660px] rounded-full blur-3xl ${isDark ? 'bg-roi-yellow/10' : 'bg-roi-yellow/24'}`} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
        <header className={`flex items-center justify-between py-5 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border ${isDark ? 'border-white/12 bg-black' : 'border-black/10 bg-white'}`}>
              <img src={logo} alt="Autonome" className="h-10 w-10 scale-[1.55] object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black leading-none">Autonome</h1>
              <p className={`${isDark ? 'text-white/50' : 'text-black/50'} mt-1 text-xs`}>
                Agentic ROI Calculator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`hidden items-center gap-2 rounded-lg border px-3 py-2 sm:flex ${isDark ? 'border-white/10 bg-white/[0.06] text-white/65' : 'border-black/10 bg-white/75 text-black/60'}`}>
              <ShieldCheck className="h-3.5 w-3.5 text-roi-red" />
              <span className="text-xs font-bold">Secure ROI Workspace</span>
            </div>
            {screen === 'output' && (
              <button
                onClick={handleBack}
                className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors sm:flex ${isDark ? 'border-white/10 bg-white/[0.06] text-white/70 hover:bg-white/10' : 'border-black/10 bg-white/80 text-black/70 hover:bg-white'}`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Chat
              </button>
            )}
            <button
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${isDark ? 'border-white/12 bg-white/[0.07] text-white hover:bg-white/12' : 'border-black/10 bg-white/80 text-black hover:bg-white'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col py-5 sm:py-6">
          <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className={`mb-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${isDark ? 'border-white/10 bg-white/[0.06] text-white/55' : 'border-black/10 bg-white/70 text-black/50'}`}>
                <Sparkles className="h-3.5 w-3.5 text-roi-yellow" />
                AI-guided ROI modeling
              </div>
              <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
                Build a focused ROI case through chat.
              </h2>
              <p className={`mt-3 max-w-2xl text-sm leading-6 sm:text-base ${isDark ? 'text-white/58' : 'text-black/58'}`}>
                Start with one workflow or a larger system. Autonome will ask the right follow-up questions, structure the assumptions, calculate ROI, and prepare export-ready results.
              </p>
            </div>

            <div className={`grid grid-cols-3 gap-2 rounded-lg border p-2 ${isDark ? 'border-white/10 bg-white/[0.045]' : 'border-black/10 bg-white/70'}`}>
              {[
                ['Mode', 'Chat'],
                ['Output', 'ROI'],
                ['Export', 'Ready'],
              ].map(([label, value]) => (
                <div key={label} className={`min-w-[82px] rounded-md px-3 py-2 ${isDark ? 'bg-black/30' : 'bg-black/[0.035]'}`}>
                  <p className={`${isDark ? 'text-white/38' : 'text-black/38'} text-[11px] font-bold`}>{label}</p>
                  <p className="mt-0.5 text-sm font-black">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="premium-panel flex min-h-[560px] flex-1 overflow-hidden sm:min-h-[620px]">
            {screen === 'chat' && <ChatPanel onComplete={handleChatComplete} />}
            {screen === 'output' && sessionResult && <OutputPanel result={sessionResult} onBack={handleBack} />}
          </section>
        </main>
      </div>

      <LogoLoadingOverlay isOpen={showLogoLoading} onComplete={handleLoadingComplete} />
    </div>
  );
}

export default App;
