import { useState, useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ROIInputs, ROIInputStrings, SolutionMode, Complexity } from './types/roi';
import { calculateROI, getVMByComplexity, getPercentAutomatedByComplexity, getErrorReductionByComplexity } from './utils/calculations';
import { useTheme } from './contexts/ThemeContext';
import InputWizardPanel from './components/InputWizardPanel';
import LiveResultPanel from './components/LiveResultPanel';
import ModeSelectionModal from './components/ModeSelectionModal';
import LogoLoadingOverlay from './components/LogoLoadingOverlay';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [hasChosenMode, setHasChosenMode] = useState(false);
  const [showLogoLoading, setShowLogoLoading] = useState(false);
  const [inputs, setInputs] = useState<ROIInputs>({
    processName: '',
    tOldMinutes: 0,
    runsPerMonth: 0,
    hourlyRate: 0,
    errorSavings: 0,
    toolSavings: 0,
    revenueGenerated: 0,
    opportunityValue: 0,
    wls: 3,
    platformCost: 0,
    complexity: 'moderate',
    solutionMode: 'automation',
    percentAutomated: 0.25,
    baselineErrorCostMonthly: 0,
    errorReductionPercent: 0,
    velocityMultiplier: 0,
    monthlyRunCost: 0,
  });

  const [inputStrings, setInputStrings] = useState<ROIInputStrings>({
    runsPerMonth: '',
    tOldMinutes: '',
    hourlyRate: '',
    errorSavings: '',
    toolSavings: '',
    revenueGenerated: '',
    opportunityValue: '',
    wls: '3',
    platformCost: '',
    percentAutomated: '25',
    baselineErrorCostMonthly: '',
    errorReductionPercent: '',
    velocityMultiplier: '',
    monthlyRunCost: '',
  });

  const calculations = useMemo(() => calculateROI(inputs), [inputs]);

  const handleInputChange = (field: keyof ROIInputs, value: string | number) => {
    if (field === 'processName') {
      setInputs(prev => ({ ...prev, [field]: value }));
    } else if (field === 'complexity') {
      // When complexity changes, auto-populate VM, percentAutomated, and errorReduction
      const complexityValue = value as Complexity;
      const newVM = getVMByComplexity(complexityValue);
      const newPercentAutomated = getPercentAutomatedByComplexity(complexityValue);
      const newErrorReduction = getErrorReductionByComplexity(complexityValue);

      setInputs(prev => ({
        ...prev,
        complexity: complexityValue,
        velocityMultiplier: newVM,
        percentAutomated: newPercentAutomated,
        errorReductionPercent: newErrorReduction,
      }));

      // Update string values for display
      setInputStrings(prev => ({
        ...prev,
        velocityMultiplier: newVM.toFixed(2),
        percentAutomated: (newPercentAutomated * 100).toFixed(0),
        errorReductionPercent: (newErrorReduction * 100).toFixed(0),
      }));
    } else {
      const stringValue = typeof value === 'string' ? value : value.toString();
      setInputStrings(prev => ({ ...prev, [field]: stringValue }));

      const sanitized = stringValue.replace(/[^0-9.]/g, '');
      let numericValue = parseFloat(sanitized) || 0;

      // Convert percentage fields (0-100) to decimal (0-1)
      if (field === 'percentAutomated' || field === 'errorReductionPercent') {
        numericValue = numericValue / 100;
      }

      setInputs(prev => ({ ...prev, [field]: numericValue }));
    }
  };

  const handleSelectMode = (mode: SolutionMode) => {
    setInputs(prev => ({ ...prev, solutionMode: mode }));
    setShowLogoLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLogoLoading(false);
    setHasChosenMode(true);
  };

  const handleModeChange = (mode: SolutionMode) => {
    setInputs(prev => ({ ...prev, solutionMode: mode }));
  };

  const modeSubtitle =
    inputs.solutionMode === 'agentic'
      ? 'Calculate the ROI of intelligent, agentic systems that scale your operations.'
      : 'Calculate the real business impact of automation.';

  const headerTitle =
    inputs.solutionMode === 'agentic'
      ? 'Intelligent Systems ROI'
      : 'Automation ROI';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-roi-black' : 'bg-roi-light-bg'}`}>
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-premium-gradient' : 'bg-premium-gradient-light'}`}></div>

      <div className={`absolute top-0 right-0 w-[800px] h-[800px] opacity-20 blur-3xl ${theme === 'dark' ? 'bg-orange-glow' : 'bg-orange-glow-light'}`}></div>
      <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] opacity-10 blur-3xl ${theme === 'dark' ? 'bg-orange-glow' : 'bg-orange-glow-light'}`}></div>

      {hasChosenMode && !showLogoLoading && (
        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-10 py-10 md:py-16">
        <header className="mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <h1 className={`text-5xl md:text-6xl font-black tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                {headerTitle}
                <span className="block text-roi-orange mt-2">Calculator</span>
              </h1>
              <p className={`text-lg md:text-xl max-w-2xl leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                {modeSubtitle}
              </p>
              {hasChosenMode && (
                <div className="flex gap-1 bg-gray-100 rounded-full p-1 mt-4 inline-flex">
                  <button
                    onClick={() => handleModeChange('automation')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      inputs.solutionMode === 'automation'
                        ? 'bg-roi-orange text-white shadow-md'
                        : 'text-roi-text-primary hover:bg-gray-200'
                    }`}
                  >
                    Automation
                  </button>
                  <button
                    onClick={() => handleModeChange('agentic')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      inputs.solutionMode === 'agentic'
                        ? 'bg-roi-orange text-white shadow-md'
                        : 'text-roi-text-primary hover:bg-gray-200'
                    }`}
                  >
                    Agentic
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-1 flex items-center gap-0.5 relative transition-all hover:scale-105 group rounded-full backdrop-blur-md overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-white/10 border border-white/20'
                    : 'bg-white/70 border border-black/10'
                }`}
                aria-label="Toggle theme"
              >
                <div className={`absolute left-1 w-7 h-7 bg-roi-orange rounded-full transition-all duration-300 ease-out ${theme === 'dark' ? 'translate-x-0' : 'translate-x-[30px]'}`}></div>
                <div className="relative z-10 w-7 h-7 flex items-center justify-center transition-all duration-300">
                  <Moon size={14} className={`transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`} strokeWidth={2.5} />
                </div>
                <div className="relative z-10 w-7 h-7 flex items-center justify-center transition-all duration-300">
                  <Sun size={14} className={`transition-all duration-300 ${theme === 'light' ? 'text-white' : 'text-gray-500'}`} strokeWidth={2.5} />
                </div>
              </button>
              <div className="glass-card px-6 py-3 inline-flex items-center gap-3 self-start">
                <div className="w-2 h-2 rounded-full bg-roi-orange animate-pulse"></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-roi-text-primary'}`}>Powered by Autonome AI</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="w-full xl:w-[45%] space-y-8 fade-in stagger-1">
            <InputWizardPanel
              inputs={inputs}
              inputStrings={inputStrings}
              calculations={calculations}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full xl:w-[55%] fade-in stagger-2">
            <LiveResultPanel inputs={inputs} calculations={calculations} />
          </div>
        </div>
        </div>
      )}

      {!hasChosenMode && !showLogoLoading && <ModeSelectionModal onSelectMode={handleSelectMode} />}
      <LogoLoadingOverlay isOpen={showLogoLoading} onComplete={handleLoadingComplete} />
    </div>
  );
}

export default App;
