import { useTheme } from '../contexts/ThemeContext';
import { formatCurrency } from '../utils/formatting';
import type { SystemResult } from '../types/chat';

interface SummaryBarProps {
  systems: SystemResult[];
}

export function SummaryBar({ systems }: SummaryBarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-5">
      {metrics.map((m, index) => (
        <div key={m.label} className={`brand-subtle-card p-4 ${index === 2 ? 'border-autonome-blue/30 bg-autonome-blue/5' : ''}`}>
          <div className={`text-xl font-black ${index === 2 ? 'text-autonome-blue' : isDark ? 'text-white' : 'text-black'}`}>{m.value}</div>
          <div className={`text-xs font-bold mt-2 ${isDark ? 'text-white/75' : 'text-black/70'}`}>{m.label}</div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>{m.sub}</div>
        </div>
      ))}
    </div>
  );
}
