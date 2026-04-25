import { motion, AnimatePresence } from 'framer-motion';
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

  const dotColor =
    sessionType === null
      ? isDark ? 'bg-white/40' : 'bg-black/30'
      : sessionType === 'single'
      ? 'bg-roi-red'
      : 'bg-roi-yellow';

  const pingColor =
    sessionType === null
      ? isDark ? 'bg-white/20' : 'bg-black/15'
      : sessionType === 'single'
      ? 'bg-roi-red'
      : 'bg-roi-yellow';

  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-2.5 border-b ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-black/[0.02] border-black/[0.07]'}`}>
      <div className="flex items-center gap-3">
        {/* Animated status dot with ping ring */}
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${pingColor}`} />
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`} />
        </span>

        <AnimatePresence mode="wait">
          {sessionType === null && (
            <motion.div
              key="new"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className={`text-xs font-semibold ${isDark ? 'text-white/55' : 'text-black/55'}`}>
                New Session
              </span>
            </motion.div>
          )}

          {sessionType === 'single' && (
            <motion.div
              key="single"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold session-badge-single ${isDark ? 'bg-roi-red/10 text-roi-red' : 'bg-roi-red/8 text-roi-red'}`}
              >
                Single System ROI
              </span>
            </motion.div>
          )}

          {sessionType === 'platform' && (
            <motion.div
              key="platform"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold session-badge-platform ${isDark ? 'bg-roi-yellow/10 text-roi-yellow' : 'bg-roi-yellow/15 text-amber-700'}`}
              >
                Multi-System Platform
              </span>
              {systemCount > 0 && (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black tabular-nums ${isDark ? 'bg-roi-yellow/15 text-roi-yellow/90' : 'bg-roi-yellow/20 text-amber-800'}`}
                >
                  {systemCount} system{systemCount !== 1 ? 's' : ''}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}
          >
            <span className="typing-dot" style={{ width: 4, height: 4 }} />
            <span className="typing-dot" style={{ width: 4, height: 4 }} />
            <span className="typing-dot" style={{ width: 4, height: 4 }} />
            <span className="ml-1 italic">Claude is thinking</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
