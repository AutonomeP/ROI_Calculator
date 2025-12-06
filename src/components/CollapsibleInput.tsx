import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface CollapsibleInputProps {
  label: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export default function CollapsibleInput({
  label,
  children,
  defaultCollapsed = false
}: CollapsibleInputProps) {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={toggleCollapse}
      >
        <h4 className={`text-base font-semibold transition-colors ${
          isCollapsed
            ? 'text-roi-orange'
            : theme === 'dark' ? 'text-white' : 'text-roi-text-primary'
        }`}>
          {label}
        </h4>
        <button
          type="button"
          className={`transition-colors p-1 ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-roi-orange'
              : 'text-roi-text-secondary hover:text-roi-orange'
          }`}
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>
      {!isCollapsed && (
        <div className="pl-0">
          {children}
        </div>
      )}
    </div>
  );
}
