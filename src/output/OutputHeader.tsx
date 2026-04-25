import { useState } from 'react';
import { ArrowLeft, Check, Pencil } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface OutputHeaderProps {
  clientName: string;
  onClientNameChange: (name: string) => void;
  systemCount: number;
  sessionType: 'single' | 'platform' | null;
  onBack: () => void;
}

export function OutputHeader({ clientName, onClientNameChange, systemCount, sessionType, onBack }: OutputHeaderProps) {
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(clientName);
  const isDark = theme === 'dark';

  function save() {
    onClientNameChange(draft.trim() || 'Client');
    setEditing(false);
  }

  return (
    <div className={`pb-6 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
      <button
        onClick={onBack}
        className={`flex items-center gap-2 text-sm mb-5 transition-colors ${isDark ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black'}`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to chat
      </button>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {editing ? (
              <>
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && save()}
                  className={`text-3xl font-black bg-transparent border-b-2 border-roi-red outline-none ${isDark ? 'text-white' : 'text-black'}`}
                />
                <button onClick={save} className="text-roi-red hover:text-roi-red-deep" aria-label="Save client name">
                  <Check className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{clientName}</h2>
                <button onClick={() => setEditing(true)} className={`transition-colors ${isDark ? 'text-white/30 hover:text-white/70' : 'text-black/30 hover:text-black/70'}`} aria-label="Edit client name">
                  <Pencil className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {' - '}
            {systemCount} System{systemCount !== 1 ? 's' : ''}
            {' - '}
            {sessionType === 'platform' ? 'Platform Package' : 'Single System'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['WLS', 'VM', 'Agentic Boost'].map((pill) => (
            <span key={pill} className="px-2.5 py-1 rounded-lg bg-roi-red/10 border border-roi-red/20 text-roi-red text-xs font-bold">
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
