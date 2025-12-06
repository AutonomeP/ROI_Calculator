import { SolutionMode } from '../types/roi';
import { useTheme } from '../contexts/ThemeContext';

interface ModeSelectionModalProps {
  onSelectMode: (mode: SolutionMode) => void;
}

export default function ModeSelectionModal({ onSelectMode }: ModeSelectionModalProps) {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-md"></div>

      <div className={`relative z-10 max-w-5xl w-full p-10 md:p-12 rounded-3xl ${theme === 'dark' ? 'bg-roi-black/98 border border-white/20' : 'bg-white border border-black/10'} shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}>
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-black mb-5 leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
            How are you building value today?
          </h2>
          <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
            Pick the type of solution you're modeling so we can price and project ROI appropriately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col ${theme === 'dark' ? 'bg-black/60 border-white/10 hover:border-white/30 hover:bg-black/70' : 'bg-white border-black/10 hover:border-black/20 hover:shadow-2xl'}`}>
            <div className="flex-1 mb-8">
              <h3 className={`text-2xl font-black mb-4 leading-tight min-h-[3.5rem] ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                Automation Workflows
              </h3>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                Single-purpose or linear workflows that automate repetitive tasks and save time and errors.
              </p>
            </div>
            <button
              onClick={() => onSelectMode('automation')}
              className="w-full px-8 py-4 bg-roi-orange text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-roi-orange/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
            >
              Use Automation Calculator
            </button>
          </div>

          <div className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col ${theme === 'dark' ? 'bg-black/60 border-white/10 hover:border-white/30 hover:bg-black/70' : 'bg-white border-black/10 hover:border-black/20 hover:shadow-2xl'}`}>
            <div className="flex-1 mb-8">
              <h3 className={`text-2xl font-black mb-4 leading-tight min-h-[3.5rem] ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                Agentic Workflows | Intelligent Systems
              </h3>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                Multi-step, decision-making systems that coordinate tools and data to act on your behalf.
              </p>
            </div>
            <button
              onClick={() => onSelectMode('agentic')}
              className="w-full px-8 py-4 bg-roi-orange text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-roi-orange/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
            >
              Use Agentic Calculator
            </button>
          </div>
        </div>

        <p className={`text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          You can switch modes later from the header.
        </p>
      </div>
    </div>
  );
}
