import { useTheme } from '../contexts/ThemeContext';

interface MetricCardProps {
  label: string;
  value: string;
  caption?: string;
  variant?: 'white' | 'orange';
}

export default function MetricCard({ label, value, caption, variant = 'white' }: MetricCardProps) {
  const { theme } = useTheme();
  const numberClass = variant === 'orange' ? 'debossed-number-orange' : 'debossed-number';
  const cardClass = variant === 'orange' ? 'metric-card metric-card-orange' : 'metric-card';

  return (
    <div className={`${cardClass} p-8`}>
      <div className={`text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
        {variant === 'orange' && (
          <div className="w-2 h-2 rounded-full bg-autonome-blue animate-pulse" />
        )}
        {label}
      </div>
      <div className={`text-6xl ${numberClass} mb-3 leading-none`}>{value}</div>
      {caption && (
        <div className={`text-sm leading-relaxed border-t pt-3 mt-2 ${theme === 'dark' ? 'text-gray-400 border-white/10' : 'text-roi-text-tertiary border-black/10'}`}>
          {caption}
        </div>
      )}
    </div>
  );
}
