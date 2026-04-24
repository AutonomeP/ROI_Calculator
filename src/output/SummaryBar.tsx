import { formatCurrency } from '../utils/formatting';
import type { SystemResult } from '../types/chat';

interface SummaryBarProps {
  systems: SystemResult[];
}

export function SummaryBar({ systems }: SummaryBarProps) {
  const totalServicePrice = systems.reduce((sum, s) => sum + s.servicePrice, 0);
  const totalMonthlyValue = systems.reduce((sum, s) => sum + s.roiResult.monthly_leveraged_value, 0);
  const totalYear1Net = systems.reduce((sum, s) => sum + s.roiResult.year1_net, 0);
  const avgPayback =
    systems.length > 0
      ? systems.reduce((sum, s) => sum + s.roiResult.payback_months, 0) / systems.length
      : 0;

  const metrics = [
    { label: 'Total Investment', value: formatCurrency(totalServicePrice), sub: 'platform total' },
    { label: 'Monthly Value', value: formatCurrency(totalMonthlyValue), sub: 'leveraged' },
    { label: 'Year 1 Net ROI', value: formatCurrency(totalYear1Net), sub: 'after costs' },
    { label: 'Avg Payback', value: `${avgPayback.toFixed(1)}mo`, sub: 'to break even' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-xl font-black text-orange-400">{m.value}</div>
          <div className="text-white/80 text-xs font-semibold mt-1">{m.label}</div>
          <div className="text-white/40 text-xs">{m.sub}</div>
        </div>
      ))}
    </div>
  );
}
