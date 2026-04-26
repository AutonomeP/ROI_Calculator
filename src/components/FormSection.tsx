import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import GlassCard from './GlassCard';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  helperText?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export default function FormSection({
  title,
  children,
  helperText,
  collapsible = false,
  defaultCollapsed = false
}: FormSectionProps) {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <GlassCard>
      <div
        className={`flex items-center justify-between gap-3 mb-6 ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-autonome-blue rounded-full"></div>
          <h3 className={`text-xl font-bold transition-colors ${isCollapsed ? 'text-autonome-blue' : theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>{title}</h3>
        </div>
        {collapsible && (
          <button
            type="button"
            className={`transition-colors p-1 ${theme === 'dark' ? 'text-gray-400 hover:text-autonome-blue' : 'text-roi-text-secondary hover:text-autonome-blue'}`}
            aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
          >
            {isCollapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>
        )}
      </div>
      {helperText && !isCollapsed && (
        <p className={`text-sm mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>{helperText}</p>
      )}
      {!isCollapsed && children}
    </GlassCard>
  );
}
