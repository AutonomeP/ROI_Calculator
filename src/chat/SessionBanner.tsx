import { useTheme } from '../contexts/ThemeContext';
import type { SessionType } from '../types/chat';

interface SessionBannerProps {
  sessionType: SessionType;
  systemCount: number;
  isLoading: boolean;
}

export function SessionBanner({ sessionType, systemCount, isLoading }: SessionBannerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center justify-between gap-3 px-5 py-3 border-b ${isDark ? 'bg-white/[0.035] border-white/10' : 'bg-black/[0.025] border-black/10'}`}>
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${isLoading ? 'bg-roi-yellow animate-pulse' : 'bg-roi-red'}`} />
        <span className={`text-xs font-semibold ${isDark ? 'text-white/65' : 'text-black/65'}`}>
          {sessionType === null && 'New Session'}
          {sessionType === 'single' && 'Single System'}
          {sessionType === 'platform' && `Platform - ${systemCount} System${systemCount !== 1 ? 's' : ''} Collected`}
        </span>
      </div>
      {isLoading && (
        <span className={`text-xs italic ${isDark ? 'text-white/40' : 'text-black/40'}`}>Claude is thinking...</span>
      )}
    </div>
  );
}
