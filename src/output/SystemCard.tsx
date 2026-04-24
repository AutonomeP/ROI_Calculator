import { useState } from 'react';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';
import { formatCurrency } from '../utils/formatting';
import type { SystemResult } from '../types/chat';

interface SystemCardProps {
  system: SystemResult;
  index: number;
}

const SCENARIOS = [
  { label: 'Conservative', factor: 0.6, color: 'bg-blue-500' },
  { label: 'Expected', factor: 0.8, color: 'bg-orange-500' },
  { label: 'Optimistic', factor: 1.0, color: 'bg-green-500' },
];

export function SystemCard({ system, index }: SystemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const { inputs, roiResult, servicePrice } = system;

  const maxScenarioValue = roiResult.monthly_leveraged_value * 1.0;

  const calcTrace = `Runs/yr: ${roiResult.runs_per_year.toLocaleString()}  ·  Hours saved: ${roiResult.hours_saved_per_year.toFixed(0)}h
Time value: ${formatCurrency(roiResult.time_value)}
Direct savings: ${formatCurrency(roiResult.direct_savings)}  ·  Growth value: ${formatCurrency(roiResult.growth_value)}
WLS ${roiResult.wls_score} × ${roiResult.wls_multiplier}  ·  VM × ${roiResult.velocity_multiplier.toFixed(2)}
Compounded annual: ${formatCurrency(roiResult.compounded_value)}
Monthly leveraged value: ${formatCurrency(roiResult.monthly_leveraged_value)}
Service price: ${formatCurrency(servicePrice)}`;

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 hover:bg-white/[0.07] transition-colors">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-300 text-sm font-bold">
            {index + 1}
          </div>
          <div>
            <div className="text-white font-semibold">{inputs.systemName}</div>
            <div className="text-white/40 text-xs mt-0.5">{inputs.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-orange-400 font-black text-lg">{formatCurrency(servicePrice)}</div>
            <div className="text-white/40 text-xs">service price</div>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/10 pt-4">
          <div className="sm:hidden mb-4">
            <div className="text-orange-400 font-black text-2xl">{formatCurrency(servicePrice)}</div>
            <div className="text-white/40 text-xs">service price</div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Monthly Value', value: formatCurrency(roiResult.monthly_leveraged_value) },
              { label: 'Operating Cost', value: formatCurrency(roiResult.run_cost_annual / 12) + '/mo' },
              { label: 'Payback', value: `${roiResult.payback_months.toFixed(1)}mo` },
              { label: 'Gross Annual', value: formatCurrency(roiResult.compounded_value) },
            ].map((m) => (
              <div key={m.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-white font-bold text-base">{m.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Scenario bars */}
          <div className="mb-5">
            <h4 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Scenarios (Monthly Value)</h4>
            <div className="space-y-2.5">
              {SCENARIOS.map(({ label, factor, color }) => {
                const value = roiResult.monthly_leveraged_value * factor;
                const pct = maxScenarioValue > 0 ? (value / maxScenarioValue) * 100 : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-24 text-white/50 text-xs text-right flex-shrink-0">{label}</div>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-24 text-white/80 text-xs font-medium">{formatCurrency(value)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calculation trace */}
          <button
            onClick={() => setTraceOpen((v) => !v)}
            className="flex items-center gap-2 text-white/40 hover:text-white/60 text-xs font-medium transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            {traceOpen ? 'Hide' : 'Show'} calculation trace
          </button>
          {traceOpen && (
            <pre className="mt-3 p-3 bg-black/30 border border-white/10 rounded-lg text-white/60 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {calcTrace}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
