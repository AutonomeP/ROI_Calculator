import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
          isCollapsed ? 'text-roi-orange' : 'text-white'
        }`}>
          {label}
        </h4>
        <button
          type="button"
          className="text-gray-400 hover:text-roi-orange transition-colors p-1"
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
