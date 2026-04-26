import { useTheme } from '../contexts/ThemeContext';

interface LeverageSliderProps {
  value: string;
  onChange: (value: string) => void;
}

const leverageOptions = [
  { value: '1', label: 'Minimal', multiplier: '1.0×' },
  { value: '2', label: 'Low', multiplier: '1.5×' },
  { value: '3', label: 'Moderate', multiplier: '2.0×' },
  { value: '4', label: 'High', multiplier: '2.5×' },
  { value: '5', label: 'Critical', multiplier: '3.0×' },
];

export default function LeverageSlider({ value, onChange }: LeverageSliderProps) {
  const { theme } = useTheme();
  const numericValue = parseFloat(value) || 1;
  const clampedValue = Math.min(Math.max(Math.round(numericValue), 1), 5);

  return (
    <div className="mb-5">
      <label className={`block text-xs uppercase tracking-widest font-semibold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
        Weighted Leverage Score (1-5)
      </label>
      <div className="grid grid-cols-5 gap-2 mb-3">
        {leverageOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-2 py-3 rounded-lg text-xs font-semibold transition-all duration-200
              ${clampedValue.toString() === option.value
                ? 'bg-autonome-blue text-white shadow-lg shadow-autonome-blue/30'
                : theme === 'dark'
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  : 'bg-gray-100 text-roi-text-secondary hover:bg-gray-200 hover:text-roi-text-primary border border-black/10'
              }
            `}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">{option.value}</span>
              <span className="text-[10px] opacity-75 leading-tight">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
      <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
        <p className={`text-xs leading-relaxed text-center ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>1</span> = 1.0× Minimal •
          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}> 2</span> = 1.5× Low •
          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}> 3</span> = 2.0× Moderate •
          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}> 4</span> = 2.5× High •
          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}> 5</span> = 3.0× Critical
        </p>
      </div>
    </div>
  );
}
