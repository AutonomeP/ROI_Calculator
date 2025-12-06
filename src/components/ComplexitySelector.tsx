import { Complexity } from '../types/roi';
import { useTheme } from '../contexts/ThemeContext';

interface ComplexitySelectorProps {
  value: Complexity;
  onChange: (value: Complexity) => void;
}

const complexityOptions = [
  { value: 'simple' as Complexity, label: 'Simple' },
  { value: 'moderate' as Complexity, label: 'Moderate' },
  { value: 'complex' as Complexity, label: 'Complex' },
];

export default function ComplexitySelector({ value, onChange }: ComplexitySelectorProps) {
  const { theme } = useTheme();

  return (
    <div className="mb-5">
      <label className={`block text-xs uppercase tracking-widest font-semibold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
        Automation Complexity
      </label>
      <div className="grid grid-cols-3 gap-2">
        {complexityOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200
              ${value === option.value
                ? 'bg-roi-orange text-white shadow-lg shadow-roi-orange/30'
                : theme === 'dark'
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  : 'bg-gray-100 text-roi-text-secondary hover:bg-gray-200 hover:text-roi-text-primary border border-black/10'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-gray-500' : 'text-roi-text-tertiary'}`}>
        Time reduction from current process time
      </p>
    </div>
  );
}
