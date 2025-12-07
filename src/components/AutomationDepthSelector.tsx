import { AutomationDepth } from '../types/roi';
import { useTheme } from '../contexts/ThemeContext';

interface AutomationDepthSelectorProps {
  value: AutomationDepth;
  onChange: (value: AutomationDepth) => void;
}

const depthOptions = [
  {
    value: 'light' as AutomationDepth,
    label: 'Light automation',
    caption: 'Automate key steps; humans still drive most of the workflow.',
  },
  {
    value: 'workflow' as AutomationDepth,
    label: 'Workflow automation',
    caption: 'Automate most of the end-to-end workflow; humans handle exceptions.',
  },
  {
    value: 'agentic' as AutomationDepth,
    label: 'Agentic system',
    caption: 'AI assistant that reasons, routes, and orchestrates across tools.',
  },
];

export default function AutomationDepthSelector({ value, onChange }: AutomationDepthSelectorProps) {
  const { theme } = useTheme();

  return (
    <div className="mb-5">
      <label className={`block text-xs uppercase tracking-widest font-semibold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
        Automation depth
      </label>
      <div className="space-y-2">
        {depthOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              w-full px-4 py-3 rounded-lg text-left transition-all duration-200
              ${value === option.value
                ? 'bg-roi-orange text-white shadow-lg shadow-roi-orange/30'
                : theme === 'dark'
                  ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                  : 'bg-gray-100 text-roi-text-primary hover:bg-gray-200 border border-black/10'
              }
            `}
          >
            <div className="font-semibold text-base mb-1">{option.label}</div>
            <div className={`text-xs leading-relaxed ${value === option.value ? 'text-white/80' : theme === 'dark' ? 'text-gray-500' : 'text-roi-text-tertiary'}`}>
              {option.caption}
            </div>
          </button>
        ))}
      </div>
      <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-gray-500' : 'text-roi-text-tertiary'}`}>
        We'll use typical automation ranges for each option (≈15–50% of the task).
      </p>
    </div>
  );
}
