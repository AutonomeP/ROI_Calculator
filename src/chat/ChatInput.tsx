import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { theme } = useTheme();
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [showKbdHint, setShowKbdHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  function handleFocus() {
    setFocused(true);
    setShowKbdHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowKbdHint(false), 3500);
  }

  function handleBlur() {
    setFocused(false);
    setShowKbdHint(false);
  }

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  const hasValue = value.trim().length > 0;

  return (
    <div className={`relative ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className="flex items-end gap-3 p-4 sm:p-6">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={disabled ? 'Thinking…' : 'Type a message…'}
          rows={1}
          className={`flex-1 resize-none rounded-2xl border px-5 py-4 text-sm focus:outline-none transition-all duration-300 disabled:opacity-50 ${
            isDark
              ? `bg-white/[0.05] border-white/10 text-white placeholder-white/20 ${focused ? 'border-autonome-blue bg-white/[0.08] shadow-[0_0_20px_rgba(0,82,255,0.1)]' : 'hover:bg-white/[0.07]'}`
              : `bg-black/[0.02] border-black/10 text-black placeholder-black/25 ${focused ? 'border-autonome-blue bg-white shadow-xl' : 'hover:bg-black/[0.04]'}`
          }`}
        />

        <motion.button
          onClick={handleSend}
          disabled={disabled || !hasValue}
          whileHover={!disabled && hasValue ? { scale: 1.05 } : {}}
          whileTap={!disabled && hasValue ? { scale: 0.95 } : {}}
          className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            hasValue && !disabled
              ? 'bg-autonome-blue text-white shadow-lg'
              : isDark
                ? 'bg-white/[0.05] text-white/20'
                : 'bg-black/[0.05] text-black/20'
          } disabled:cursor-not-allowed`}
          aria-label="Send message"
        >
          {disabled ? (
            <motion.div
              className="w-5 h-5 rounded-full border-2 border-t-transparent"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', borderTopColor: isDark ? '#fff' : '#000' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
