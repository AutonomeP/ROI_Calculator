import type { SessionType } from '../types/chat';

interface SessionBannerProps {
  sessionType: SessionType;
  systemCount: number;
  isLoading: boolean;
}

export function SessionBanner({ sessionType, systemCount, isLoading }: SessionBannerProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border-b border-white/10">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <span className="inline-block w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        ) : (
          <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
        )}
        <span className="text-xs text-white/60 font-medium">
          {sessionType === null && 'New Session'}
          {sessionType === 'single' && 'Single System'}
          {sessionType === 'platform' && `Platform — ${systemCount} System${systemCount !== 1 ? 's' : ''} Collected`}
        </span>
      </div>
      {isLoading && (
        <span className="text-xs text-white/40 italic">Claude is thinking…</span>
      )}
    </div>
  );
}
