import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import type { ChatMessage as ChatMessageType } from '../types/chat';
import blackLogo from '../assets/black_autonome_partners_-_logo_icon_(black).png';
import whiteLogo from '../assets/white__autonome_partners_-_logo_icon_(white).png';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isUser = message.role === 'user';
  const logo = isDark ? whiteLogo : blackLogo;

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}
      initial={isUser ? { opacity: 0, x: 14, y: 6 } : { opacity: 0, x: -14, y: 6 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center mr-3 mt-1 overflow-hidden ring-1 ring-roi-red/15 shadow-sm ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
          <img src={logo} alt="" className="h-7 w-7 object-contain scale-[1.55]" />
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[82%]">
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-gradient-to-br from-roi-red to-roi-red-deep text-white shadow-[0_4px_20px_rgba(204,0,0,0.28)] rounded-tr-sm'
              : isDark
                ? 'bg-white/[0.07] text-white/90 border border-white/[0.12] backdrop-blur-sm rounded-tl-sm'
                : 'bg-white/92 text-black/84 border border-black/[0.09] shadow-md rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>

        {/* Timestamp — appears on hover */}
        <span
          className={`text-[10px] tabular-nums opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${isUser ? 'text-right' : 'text-left'} ${isDark ? 'text-white/30' : 'text-black/30'}`}
        >
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* User avatar placeholder (spacing) */}
      {isUser && <div className="w-2 flex-shrink-0" />}
    </motion.div>
  );
}
