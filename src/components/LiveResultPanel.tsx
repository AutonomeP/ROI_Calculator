import { useState, useEffect } from 'react';
import { Download, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { ROIInputs, ROICalculations } from '../types/roi';
import { formatCurrency, formatNumber, formatPercent, formatTimeToRoi } from '../utils/formatting';
import { downloadROIReport, copyROIReportToClipboard } from '../utils/export';
import { useTheme } from '../contexts/ThemeContext';
import MetricCard from './MetricCard';
import GlassCard from './GlassCard';

type RoiView = 'quarter' | 'sixMonths' | 'oneYear';

interface LiveResultPanelProps {
  inputs: ROIInputs;
  calculations: ROICalculations;
}

export default function LiveResultPanel({ inputs, calculations }: LiveResultPanelProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [roiView, setRoiView] = useState<RoiView>('quarter');
  const [roiBeforeCostCollapsed, setRoiBeforeCostCollapsed] = useState(true);
  const [scenarioCollapsed, setScenarioCollapsed] = useState(false);

  useEffect(() => {
    // Keep Quarter as default, but suggest different tabs based on mode
    // User can still change tabs manually
    setRoiView('quarter');
  }, [inputs.solutionMode]);

  const handleDownload = () => {
    downloadROIReport(inputs, calculations);
  };

  const handleCopy = async () => {
    try {
      await copyROIReportToClipboard(inputs, calculations);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  let displayedRoiValue: number;
  let displayedRoiLabel: string;
  let displayedRoiCaption: string;
  let displayedRoiPercent: number;
  let displayedRoiPercentCaption: string;

  switch (roiView) {
    case 'quarter':
      displayedRoiValue = calculations.roiQuarterNet;
      displayedRoiLabel = 'Total ROI (Quarter)';
      displayedRoiCaption = 'Projected ROI over 3 months (after one-time build cost and monthly OPEX)';
      displayedRoiPercent = calculations.roiQuarterPercent;
      displayedRoiPercentCaption = 'Return in first quarter vs one-time build cost';
      break;
    case 'sixMonths':
      displayedRoiValue = calculations.roi6mNet;
      displayedRoiLabel = 'Total ROI (6 months)';
      displayedRoiCaption = 'Projected ROI over 6 months (after one-time build cost and monthly OPEX)';
      displayedRoiPercent = calculations.roi6mPercent;
      displayedRoiPercentCaption = 'Return over 6 months vs one-time build cost';
      break;
    case 'oneYear':
    default:
      displayedRoiValue = calculations.roi1yNet;
      displayedRoiLabel = 'Total ROI (12 months)';
      displayedRoiCaption = 'Projected ROI over 12 months (after one-time build cost and monthly OPEX)';
      displayedRoiPercent = calculations.roi1yPercent;
      displayedRoiPercentCaption = 'Return over 12 months vs one-time build cost';
      break;
  }

  const vmLabel = `${calculations.vm.toFixed(1)}×`;

  return (
    <div className="space-y-8">
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleCopy}
          className={`glass-card px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-roi-text-primary hover:bg-black/5'}`}
        >
          {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy Report'}
        </button>
        <button
          onClick={handleDownload}
          className="glass-card px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-roi-orange hover:bg-roi-orange/10 transition-colors"
        >
          <Download size={18} />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className={`text-[10px] uppercase tracking-[0.15em] font-bold block mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-roi-text-secondary/60'}`}>
                  TOTAL ROI
                </span>
                <span className={`text-[9px] uppercase tracking-widest font-medium inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${
                  inputs.solutionMode === 'agentic'
                    ? 'bg-roi-orange/10 border border-roi-orange/30 text-roi-orange'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {inputs.solutionMode === 'agentic' ? 'AGENTIC MODE' : 'AUTOMATION MODE'}
                </span>
              </div>
            </div>

            <div className="flex gap-1 bg-gray-100/80 rounded-lg p-1 mb-6 w-full">
              <button
                onClick={() => setRoiView('quarter')}
                className={`flex-1 px-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap min-w-0 ${
                  roiView === 'quarter'
                    ? 'bg-roi-orange text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                Quarter
              </button>
              <button
                onClick={() => setRoiView('sixMonths')}
                className={`flex-1 px-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap min-w-0 ${
                  roiView === 'sixMonths'
                    ? 'bg-roi-orange text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                6 Months
              </button>
              <button
                onClick={() => setRoiView('oneYear')}
                className={`flex-1 px-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap min-w-0 ${
                  roiView === 'oneYear'
                    ? 'bg-roi-orange text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                1 Year
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center py-6">
              <div className="text-7xl font-black text-roi-orange mb-6 leading-none tracking-tight">
                {formatCurrency(displayedRoiValue)}
              </div>
              <p className={`text-sm leading-snug mb-2 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                {displayedRoiCaption}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                At current velocity of {vmLabel}
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="flex flex-col gap-6">
          <GlassCard>
            <div className="flex flex-col h-full">
              <span className={`text-[10px] uppercase tracking-[0.15em] font-bold mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-roi-text-secondary/60'}`}>
                ROI (%)
              </span>
              <div className="mt-auto">
                <div className={`text-6xl font-black mb-4 leading-none tracking-tight ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                  {formatPercent(displayedRoiPercent)}
                </div>
                <p className={`text-sm font-medium leading-snug pt-4 border-t ${theme === 'dark' ? 'text-gray-400 border-white/10' : 'text-roi-text-secondary border-black/10'}`}>
                  {displayedRoiPercentCaption}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex flex-col h-full">
              <span className={`text-[10px] uppercase tracking-[0.15em] font-bold mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-roi-text-secondary/60'}`}>
                VELOCITY
              </span>
              <div className="mt-auto">
                <div className={`text-6xl font-black mb-4 leading-none tracking-tight ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                  {calculations.vm.toFixed(1)}×
                </div>
                <p className={`text-sm font-medium leading-snug pt-4 border-t ${theme === 'dark' ? 'text-gray-400 border-white/10' : 'text-roi-text-secondary border-black/10'}`}>
                  Old: {calculations.tOld.toFixed(1)} min • New: {calculations.tNew.toFixed(1)} min
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-roi-orange rounded-full"></div>
            <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>Direct Savings</h4>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}>Time saved:</span>
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatNumber(calculations.totalHoursSaved, 1)} hrs/month</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}>Money saved from time:</span>
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.msFromTS)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}>Error + tool savings:</span>
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.msOther)}</span>
            </div>
            <div className={`border-t pt-4 mt-2 flex justify-between items-center ${theme === 'dark' ? 'border-white/20' : 'border-black/20'}`}>
              <span className="text-roi-orange font-bold text-base">Total direct savings:</span>
              <span className="text-roi-orange font-bold text-xl">{formatCurrency(calculations.directSavings)}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-roi-orange rounded-full"></div>
            <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>Growth (Velocity-Adjusted)</h4>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}>Base opportunity value (OC):</span>
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.oc)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}>Base revenue generated (RG):</span>
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.rg)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}>Velocity multiplier (VM):</span>
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{calculations.vm.toFixed(2)}×</span>
            </div>
            <div className={`border-t pt-4 mt-2 flex justify-between items-center ${theme === 'dark' ? 'border-white/20' : 'border-black/20'}`}>
              <span className="text-roi-orange font-bold text-base">Growth value:</span>
              <span className="text-roi-orange font-bold text-xl">{formatCurrency(calculations.growthValue)}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-roi-orange rounded-full"></div>
          <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>Leverage & Cost</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className={`text-xs uppercase tracking-wider block mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>Weighted leverage score (WLS)</span>
            <span className={`font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatNumber(inputs.wls, 1)}</span>
          </div>
          <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className={`text-xs uppercase tracking-wider block mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>One-time cost</span>
            <span className={`font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.platformAnnual)}</span>
            <span className={`text-xs block mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-roi-text-secondary'}`}>({formatCurrency(calculations.platformMonthly, 2)}/mo)</span>
          </div>
          <div
            className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-black/20 border-white/10 hover:border-white/20' : 'bg-white/40 border-black/10 hover:border-black/20'}`}
            onClick={() => setRoiBeforeCostCollapsed(!roiBeforeCostCollapsed)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>Quarterly ROI before cost</span>
              {roiBeforeCostCollapsed ? (
                <ChevronDown className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`} />
              ) : (
                <ChevronUp className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`} />
              )}
            </div>
            {!roiBeforeCostCollapsed && (
              <span className={`font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.grossQuarter)}</span>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-roi-orange/20 to-transparent p-6 rounded-xl border border-roi-orange/30">
          <div className="flex justify-between items-center mb-3">
            <span className="text-roi-orange font-bold text-xl">Final ROI after cost:</span>
            <span className="text-roi-orange font-bold text-3xl">{formatCurrency(calculations.roiQuarterNet)}</span>
          </div>
          <div className={`text-right text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            In first quarter: <span className="text-roi-orange font-semibold">{formatCurrency(calculations.roiQuarterNet)}</span> • In 6 months: <span className="text-roi-orange font-semibold">{formatCurrency(calculations.roi6mNet)}</span> • In 12 months: <span className="text-roi-orange font-semibold">{formatCurrency(calculations.roi1yNet)}</span>
          </div>
        </div>
        <div className={`p-6 rounded-xl border-2 mt-6 shadow-lg ${
          calculations.monthsToRoi > 3
            ? `bg-gradient-to-r ${theme === 'dark' ? 'from-amber-500/20 to-amber-500/10 border-amber-500/40' : 'from-amber-500/15 to-amber-500/5 border-amber-500/30'}`
            : 'bg-gradient-to-r from-roi-orange/10 to-roi-orange/5 border-roi-orange/30'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-col">
              <span className={`text-xs uppercase tracking-wider font-bold mb-1 ${
                calculations.monthsToRoi > 3
                  ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-600')
                  : (theme === 'dark' ? 'text-roi-orange/80' : 'text-roi-orange')
              }`}>
                Time to Value
              </span>
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-300' : 'text-roi-text-primary'}`}>
                {calculations.quartersToRoi.toFixed(1)} quarters
              </span>
            </div>
            <span className={`font-bold text-3xl sm:text-4xl ${
              calculations.monthsToRoi > 3
                ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-600')
                : (theme === 'dark' ? 'text-white' : 'text-roi-text-primary')
            }`}>
              {formatTimeToRoi(calculations.monthsToRoi)}
            </span>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-roi-orange rounded-full"></div>
          <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>ROI Model</h4>
        </div>
        <div className={`p-6 rounded-xl mb-6 border ${theme === 'dark' ? 'bg-black/30 border-white/10' : 'bg-white/50 border-black/10'}`}>
          <div className={`font-mono text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
            ROI = ( <span className="text-roi-orange font-bold">MS</span> + (<span className="text-roi-orange font-bold">OC</span> + <span className="text-roi-orange font-bold">RG</span>) × <span className="text-roi-orange font-bold">VM</span> ) × <span className="text-roi-orange font-bold">WLS</span> – <span className="text-roi-orange font-bold">Platform Cost</span> – <span className="text-roi-orange font-bold">Run Cost</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className="text-roi-orange font-bold text-sm block mb-1">MS:</span>
            <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.msTotal)}</span>
          </div>
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className="text-roi-orange font-bold text-sm block mb-1">OC:</span>
            <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.oc)}</span>
          </div>
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className="text-roi-orange font-bold text-sm block mb-1">RG:</span>
            <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.rg)}</span>
          </div>
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className="text-roi-orange font-bold text-sm block mb-1">VM:</span>
            <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{calculations.vm.toFixed(2)}×</span>
          </div>
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className="text-roi-orange font-bold text-sm block mb-1">WLS:</span>
            <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{Math.round(inputs.wls)} → {calculations.wlsMultiplier.toFixed(1)}×</span>
          </div>
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className="text-roi-orange font-bold text-sm block mb-1">Monthly Leveraged:</span>
            <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.monthlyLeveragedValue)}</span>
          </div>
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <span className="text-roi-orange font-bold text-sm block mb-1">One-Time Cost:</span>
            <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.platformAnnual)}</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setScenarioCollapsed(!scenarioCollapsed)}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-roi-orange rounded-full"></div>
            <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>Scenario Analysis</h4>
          </div>
          {scenarioCollapsed ? (
            <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`} />
          ) : (
            <ChevronUp className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`} />
          )}
        </div>
        {!scenarioCollapsed && (
          <>
            <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
              Conservative, base, and optimistic ROI projections based on realization factors
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="scenario-card scenario-card-low p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-roi-orange animate-pulse"></div>
                  <span className="text-xs uppercase tracking-[0.15em] font-bold text-roi-orange">Low Case (60%)</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>Quarter</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.lowCaseQuarterlyROI)}</span>
                  </div>
                  <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}></div>
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>6 Months</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.lowCase6mROI)}</span>
                  </div>
                  <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}></div>
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>12 Months</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.lowCase1yROI)}</span>
                  </div>
                </div>
              </div>

              <div className="scenario-card scenario-card-base p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'}`}></div>
                  <span className={`text-xs uppercase tracking-[0.15em] font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Base Case (80%)</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>Quarter</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.baseCaseQuarterlyROI)}</span>
                  </div>
                  <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}></div>
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>6 Months</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.baseCase6mROI)}</span>
                  </div>
                  <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}></div>
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>12 Months</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.baseCase1yROI)}</span>
                  </div>
                </div>
              </div>

              <div className="scenario-card scenario-card-high p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-roi-orange animate-pulse"></div>
                  <span className="text-xs uppercase tracking-[0.15em] font-bold text-roi-orange">High Case (100%)</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>Quarter</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.highCaseQuarterlyROI)}</span>
                  </div>
                  <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}></div>
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>6 Months</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.highCase6mROI)}</span>
                  </div>
                  <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}></div>
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs uppercase tracking-wider font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>12 Months</span>
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{formatCurrency(calculations.highCase1yROI)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
