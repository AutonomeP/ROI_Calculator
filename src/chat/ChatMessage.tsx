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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center mr-3 mt-1 overflow-hidden ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
          <img src={logo} alt="" className="h-7 w-7 object-contain scale-[1.55]" />
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
          isUser
            ? 'bg-roi-red text-white'
            : isDark
              ? 'bg-white/[0.07] text-white/90 border border-white/10'
              : 'bg-white text-black/82 border border-black/10'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
