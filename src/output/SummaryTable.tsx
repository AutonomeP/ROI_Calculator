import { useTheme } from '../contexts/ThemeContext';
import { formatCurrency } from '../utils/formatting';
import type { SystemResult } from '../types/chat';

interface SummaryTableProps {
  systems: SystemResult[];
}

export function SummaryTable({ systems }: SummaryTableProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="mt-6">
      <h3 className={`text-sm font-semibold uppercase tracking-[0.16em] mb-3 ${isDark ? 'text-white/70' : 'text-black/65'}`}>Platform Summary</h3>
      <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-xs uppercase tracking-[0.12em] ${isDark ? 'bg-white/[0.045] text-white/50' : 'bg-black/[0.035] text-black/48'}`}>
              <th className="text-left px-4 py-3">System</th>
              <th className="text-right px-4 py-3">Monthly Value</th>
              <th className="text-right px-4 py-3">Service Price</th>
              <th className="text-right px-4 py-3">Payback</th>
              <th className="text-right px-4 py-3">WLS</th>
              <th className="text-right px-4 py-3">Mode</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((s, i) => (
              <tr key={i} className={`border-t transition-colors ${isDark ? 'border-white/5 hover:bg-white/[0.04]' : 'border-black/5 hover:bg-black/[0.025]'}`}>
                <td className={`px-4 py-3 font-medium ${isDark ? 'text-white' : 'text-black'}`}>{s.inputs.systemName}</td>
                <td className="px-4 py-3 text-right text-roi-red font-semibold">{formatCurrency(s.roiResult.monthly_leveraged_value)}</td>
                <td className={`px-4 py-3 text-right ${isDark ? 'text-white' : 'text-black'}`}>{formatCurrency(s.servicePrice)}</td>
                <td className={`px-4 py-3 text-right ${isDark ? 'text-white/70' : 'text-black/65'}`}>{s.roiResult.payback_months.toFixed(1)}mo</td>
                <td className={`px-4 py-3 text-right ${isDark ? 'text-white/70' : 'text-black/65'}`}>{s.roiResult.wls_score}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                    s.inputs.solutionMode === 'agentic_intelligent_ai'
                      ? 'bg-roi-yellow/20 text-black'
                      : 'bg-roi-red/10 text-roi-red'
                  }`}>
                    {s.inputs.solutionMode === 'agentic_intelligent_ai' ? 'Agentic' : 'Automation'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={`border-t font-semibold ${isDark ? 'border-white/20 bg-white/[0.045]' : 'border-black/15 bg-black/[0.035]'}`}>
              <td className={`px-4 py-3 text-xs uppercase ${isDark ? 'text-white/70' : 'text-black/65'}`}>Total</td>
              <td className="px-4 py-3 text-right text-roi-red">{formatCurrency(systems.reduce((s, r) => s + r.roiResult.monthly_leveraged_value, 0))}</td>
              <td className={`px-4 py-3 text-right ${isDark ? 'text-white' : 'text-black'}`}>{formatCurrency(systems.reduce((s, r) => s + r.servicePrice, 0))}</td>
              <td className={`px-4 py-3 text-right ${isDark ? 'text-white/50' : 'text-black/45'}`}>-</td>
              <td className={`px-4 py-3 text-right ${isDark ? 'text-white/50' : 'text-black/45'}`}>-</td>
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
