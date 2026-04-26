import { useTheme } from '../contexts/ThemeContext';

export type ErrorReductionPreset = 'conservative' | 'typical' | 'aggressive';

interface ErrorReductionSelectorProps {
  value: ErrorReductionPreset;
  onChange: (value: ErrorReductionPreset) => void;
}

const presetOptions: { value: ErrorReductionPreset; label: string; percent: number }[] = [
  { value: 'conservative', label: 'Conservative', percent: 40 },
  { value: 'typical', label: 'Typical', percent: 50 },
  { value: 'aggressive', label: 'Aggressive', percent: 70 },
];

export function getPercentFromPreset(preset: ErrorReductionPreset): number {
  const option = presetOptions.find(opt => opt.value === preset);
  return option ? option.percent : 50;
}

export default function ErrorReductionSelector({ value, onChange }: ErrorReductionSelectorProps) {
  const { theme } = useTheme();
  const selectedPercent = getPercentFromPreset(value);

  return (
    <div className="mb-5">
      <label className={`block text-xs uppercase tracking-widest font-semibold mb-3 ${
        theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'
      }`}>
        Estimated error reduction (%)
      </label>
      <div className={`flex gap-1 p-1 rounded-lg inline-flex w-full ${
        theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
      }`}>
        {presetOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
              value === option.value
                ? 'bg-autonome-blue text-white shadow-md'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-roi-text-primary hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className={`text-sm mt-2 font-medium ${
        theme === 'dark' ? 'text-gray-300' : 'text-roi-text-primary'
      }`}>
        Using {selectedPercent}% reduction
      </div>
      <p className={`text-xs mt-1 leading-relaxed ${
        theme === 'dark' ? 'text-gray-500' : 'text-roi-text-tertiary'
      }`}>
        We auto-set this from complexity. Most automations reduce errors by 40–70%.
      </p>
    </div>
  );
}
