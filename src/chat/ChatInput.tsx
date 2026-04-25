import { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { theme } = useTheme();
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDark = theme === 'dark';

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <div className={`flex items-end gap-3 p-4 border-t backdrop-blur-sm ${isDark ? 'border-white/10 bg-black/60' : 'border-black/10 bg-white/85'}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        placeholder={disabled ? 'Thinking...' : 'Type a message...'}
        rows={1}
        className={`flex-1 resize-none rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-roi-red/20 disabled:opacity-50 transition-all ${isDark ? 'bg-white/10 border-white/15 text-white placeholder-white/40' : 'bg-white border-black/10 text-black placeholder-black/35'}`}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="brand-button flex-shrink-0 w-10 h-10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        aria-label="Send message"
      >
        <Send className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
