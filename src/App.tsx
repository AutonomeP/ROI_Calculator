import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import LogoLoadingOverlay from './components/LogoLoadingOverlay';
import { ChatPanel } from './chat/ChatPanel';
import { OutputPanel } from './output/OutputPanel';
import type { SessionResult } from './types/chat';

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

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-roi-black' : 'bg-roi-light-bg'}`}>
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-premium-gradient' : 'bg-premium-gradient-light'}`} />
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] opacity-20 blur-3xl ${theme === 'dark' ? 'bg-orange-glow' : 'bg-orange-glow-light'}`} />
      <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] opacity-10 blur-3xl ${theme === 'dark' ? 'bg-orange-glow' : 'bg-orange-glow-light'}`} />

      <div className="relative z-10 flex flex-col min-h-screen max-w-4xl mx-auto px-4">
        <header className="flex items-center justify-between py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <span className="text-white text-sm font-black">A</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-none">Autonome AI</h1>
              <p className="text-white/50 text-xs">ROI Calculator</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-white/60 text-xs font-medium">Powered by Claude</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1 flex items-center gap-0.5 relative transition-all hover:scale-105 rounded-full backdrop-blur-md overflow-hidden bg-white/10 border border-white/20"
              aria-label="Toggle theme"
            >
              <div className={`absolute left-1 w-7 h-7 bg-roi-orange rounded-full transition-all duration-300 ease-out ${theme === 'dark' ? 'translate-x-0' : 'translate-x-[30px]'}`} />
              <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                <Moon size={14} className={theme === 'dark' ? 'text-white' : 'text-gray-500'} strokeWidth={2.5} />
              </div>
              <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                <Sun size={14} className={theme === 'light' ? 'text-white' : 'text-gray-500'} strokeWidth={2.5} />
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          {screen === 'chat' && (
            <ChatPanel onComplete={handleChatComplete} />
          )}
          {screen === 'output' && sessionResult && (
            <OutputPanel result={sessionResult} onBack={handleBack} />
          )}
        </main>
      </div>

      <LogoLoadingOverlay isOpen={showLogoLoading} onComplete={handleLoadingComplete} />
    </div>
  );
}

export default App;
