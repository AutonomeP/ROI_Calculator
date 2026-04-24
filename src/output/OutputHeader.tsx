import { useState } from 'react';
import { ArrowLeft, Pencil, Check } from 'lucide-react';

interface OutputHeaderProps {
  clientName: string;
  onClientNameChange: (name: string) => void;
  systemCount: number;
  sessionType: 'single' | 'platform' | null;
  onBack: () => void;
}

export function OutputHeader({ clientName, onClientNameChange, systemCount, sessionType, onBack }: OutputHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(clientName);

  function save() {
    onClientNameChange(draft.trim() || 'Client');
    setEditing(false);
  }

  return (
    <div className="py-6 border-b border-white/10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Chat
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
                  className="text-2xl font-black text-white bg-transparent border-b-2 border-orange-500 outline-none"
                />
                <button onClick={save} className="text-orange-400 hover:text-orange-300">
                  <Check className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-white">{clientName}</h2>
                <button onClick={() => setEditing(true)} className="text-white/30 hover:text-white/60 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <p className="text-white/50 text-sm">
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}
            {systemCount} System{systemCount !== 1 ? 's' : ''}
            {' · '}
            {sessionType === 'platform' ? 'Platform Package' : 'Single System'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['WLS', 'VM', 'Agentic Boost'].map((pill) => (
            <span key={pill} className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-medium">
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
