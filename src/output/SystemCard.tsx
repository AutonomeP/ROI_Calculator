import { useState } from 'react';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { formatCurrency } from '../utils/formatting';
import type { SystemResult } from '../types/chat';

interface SystemCardProps {
  system: SystemResult;
  index: number;
}

const SCENARIOS = [
  { label: 'Conservative', factor: 0.6, color: 'bg-black/35 dark:bg-white/35' },
  { label: 'Expected', factor: 0.8, color: 'bg-roi-red' },
  { label: 'Optimistic', factor: 1.0, color: 'bg-roi-yellow' },
];

export function SystemCard({ system, index }: SystemCardProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const { inputs, roiResult, servicePrice } = system;
  const isDark = theme === 'dark';

  const maxScenarioValue = roiResult.monthly_leveraged_value * 1.0;

  const calcTrace = `Runs/yr: ${roiResult.runs_per_year.toLocaleString()} - Hours saved: ${roiResult.hours_saved_per_year.toFixed(0)}h
Time value: ${formatCurrency(roiResult.time_value)}
Direct savings: ${formatCurrency(roiResult.direct_savings)} - Growth value: ${formatCurrency(roiResult.growth_value)}
WLS ${roiResult.wls_score} x ${roiResult.wls_multiplier} - VM x ${roiResult.velocity_multiplier.toFixed(2)}
Compounded annual: ${formatCurrency(roiResult.compounded_value)}
Monthly leveraged value: ${formatCurrency(roiResult.monthly_leveraged_value)}
Service price: ${formatCurrency(servicePrice)}`;

  return (
    <div className={`rounded-lg overflow-hidden border transition-colors ${isDark ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.065]' : 'border-black/10 bg-white hover:bg-black/[0.018]'}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-roi-red/10 border border-roi-red/20 flex items-center justify-center text-roi-red text-sm font-black flex-shrink-0">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className={`font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{inputs.systemName}</div>
            <div className={`text-xs mt-0.5 truncate ${isDark ? 'text-white/42' : 'text-black/45'}`}>{inputs.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-roi-red font-black text-lg">{formatCurrency(servicePrice)}</div>
            <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>service price</div>
          </div>
          {expanded ? (
            <ChevronUp className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
          )}
        </div>
      </button>

      {expanded && (
        <div className={`px-5 pb-5 border-t pt-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <div className="sm:hidden mb-4">
            <div className="text-roi-red font-black text-2xl">{formatCurrency(servicePrice)}</div>
            <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>service price</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Monthly Value', value: formatCurrency(roiResult.monthly_leveraged_value) },
              { label: 'Operating Cost', value: formatCurrency(roiResult.run_cost_annual / 12) + '/mo' },
              { label: 'Payback', value: `${roiResult.payback_months.toFixed(1)}mo` },
              { label: 'Gross Annual', value: formatCurrency(roiResult.compounded_value) },
            ].map((m) => (
              <div key={m.label} className={`rounded-lg border p-3 ${isDark ? 'bg-black/20 border-white/10' : 'bg-black/[0.025] border-black/10'}`}>
                <div className={`font-bold text-base ${isDark ? 'text-white' : 'text-black'}`}>{m.value}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-white/42' : 'text-black/45'}`}>{m.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <h4 className={`text-xs font-semibold uppercase tracking-[0.16em] mb-3 ${isDark ? 'text-white/45' : 'text-black/45'}`}>Scenarios (Monthly Value)</h4>
            <div className="space-y-2.5">
              {SCENARIOS.map(({ label, factor, color }) => {
                const value = roiResult.monthly_leveraged_value * factor;
                const pct = maxScenarioValue > 0 ? (value / maxScenarioValue) * 100 : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-24 text-xs text-right flex-shrink-0 ${isDark ? 'text-white/50' : 'text-black/50'}`}>{label}</div>
                    <div className={`flex-1 rounded-full h-2 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                      <div
                        className={`${color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className={`w-24 text-xs font-semibold ${isDark ? 'text-white/80' : 'text-black/72'}`}>{formatCurrency(value)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setTraceOpen((v) => !v)}
            className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDark ? 'text-white/40 hover:text-white/65' : 'text-black/40 hover:text-black/65'}`}
          >
            <Code className="w-3.5 h-3.5" />
            {traceOpen ? 'Hide' : 'Show'} calculation trace
          </button>
          {traceOpen && (
            <pre className={`mt-3 p-3 border rounded-lg text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-black/30 border-white/10 text-white/60' : 'bg-black/[0.035] border-black/10 text-black/62'}`}>
              {calcTrace}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
