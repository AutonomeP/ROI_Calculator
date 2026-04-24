import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useROIResults } from '../hooks/useROIResults';
import { SessionBanner } from './SessionBanner';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { SessionResult } from '../types/chat';

interface ChatPanelProps {
  onComplete: (result: SessionResult) => void;
}

export function ChatPanel({ onComplete }: ChatPanelProps) {
  const { messages, sendMessage, extractedSystems, sessionType, sessionComplete, isLoading, error } = useChat();
  const systemResults = useROIResults(extractedSystems);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function handleViewResults() {
    onComplete({
      sessionType,
      systems: systemResults,
      clientName: 'Client',
    });
  }

  return (
    <div className="flex flex-col h-full">
      <SessionBanner
        sessionType={sessionType}
        systemCount={extractedSystems.length}
        isLoading={isLoading}
      />

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 opacity-60">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
            <p className="text-white/70 text-sm max-w-xs">
              Start a conversation to build your ROI analysis. Claude will guide you through the inputs.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-4 mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {sessionComplete && systemResults.length > 0 && (
        <div className="px-4 py-3 border-t border-white/10 bg-white/5">
          <button
            onClick={handleViewResults}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-colors"
          >
            View Results
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
