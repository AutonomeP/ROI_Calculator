import { formatCurrency } from '../utils/formatting';
import type { SystemResult } from '../types/chat';

interface SummaryTableProps {
  systems: SystemResult[];
}

export function SummaryTable({ systems }: SummaryTableProps) {
  return (
    <div className="mt-6">
      <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Platform Summary</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
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
              <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white font-medium">{s.inputs.systemName}</td>
                <td className="px-4 py-3 text-right text-orange-300">{formatCurrency(s.roiResult.monthly_leveraged_value)}</td>
                <td className="px-4 py-3 text-right text-white">{formatCurrency(s.servicePrice)}</td>
                <td className="px-4 py-3 text-right text-white/70">{s.roiResult.payback_months.toFixed(1)}mo</td>
                <td className="px-4 py-3 text-right text-white/70">{s.roiResult.wls_score}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    s.inputs.solutionMode === 'agentic_intelligent_ai'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {s.inputs.solutionMode === 'agentic_intelligent_ai' ? 'Agentic' : 'Automation'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/20 bg-white/5 font-semibold">
              <td className="px-4 py-3 text-white/70 text-xs uppercase">Total</td>
              <td className="px-4 py-3 text-right text-orange-300">{formatCurrency(systems.reduce((s, r) => s + r.roiResult.monthly_leveraged_value, 0))}</td>
              <td className="px-4 py-3 text-right text-white">{formatCurrency(systems.reduce((s, r) => s + r.servicePrice, 0))}</td>
              <td className="px-4 py-3 text-right text-white/50">—</td>
              <td className="px-4 py-3 text-right text-white/50">—</td>
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
