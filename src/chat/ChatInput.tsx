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
    <div className={`relative border-t backdrop-blur-xl ${isDark ? 'border-white/[0.08] bg-black/55' : 'border-black/[0.07] bg-white/80'}`}>
      {/* Keyboard hint */}
      <motion.div
        className={`absolute -top-6 left-4 text-[10px] pointer-events-none select-none ${isDark ? 'text-white/30' : 'text-black/30'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: showKbdHint ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        Shift + Enter for new line
      </motion.div>

      <div className="flex items-end gap-3 p-3.5 sm:p-4">
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
          className={`flex-1 resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none transition-all duration-200 disabled:opacity-50 ${
            isDark
              ? `bg-white/[0.08] border-white/[0.14] text-white placeholder-white/35 ${focused ? 'border-roi-red/50 shadow-[0_0_0_3px_rgba(204,0,0,0.12),inset_0_2px_4px_rgba(0,0,0,0.15)]' : 'hover:border-white/22 hover:bg-white/[0.1]'}`
              : `bg-white border-black/[0.12] text-black placeholder-black/30 ${focused ? 'border-roi-red/40 shadow-[0_0_0_3px_rgba(204,0,0,0.1)]' : 'hover:border-black/20'}`
          }`}
        />

        <motion.button
          onClick={handleSend}
          disabled={disabled || !hasValue}
          whileHover={!disabled && hasValue ? { scale: 1.08, y: -1 } : {}}
          whileTap={!disabled && hasValue ? { scale: 0.9 } : {}}
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
            hasValue && !disabled
              ? 'bg-gradient-to-br from-roi-red to-roi-red-deep shadow-cta-glow text-white'
              : isDark
                ? 'bg-white/[0.08] border border-white/12 text-white/30'
                : 'bg-black/[0.06] border border-black/10 text-black/30'
          } disabled:cursor-not-allowed`}
          aria-label="Send message"
        >
          {disabled ? (
            /* shimmer spinner when processing */
            <motion.div
              className="w-4 h-4 rounded-full border-2 border-t-transparent"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)', borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
