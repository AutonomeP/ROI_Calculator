import { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="flex items-end gap-3 p-4 border-t border-white/10 bg-gray-900/80 backdrop-blur-sm">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        placeholder={disabled ? 'Thinking…' : 'Type a message…'}
        rows={1}
        className="flex-1 resize-none rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 transition-all"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        <Send className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
