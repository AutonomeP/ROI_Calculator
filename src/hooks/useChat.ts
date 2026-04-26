import { useState, useCallback } from 'react';
import type { ChatMessage, ExtractedSystemInputs, SessionType } from '../types/chat';

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  extractedSystems: ExtractedSystemInputs[];
  sessionType: SessionType;
  sessionComplete: boolean;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [extractedSystems, setExtractedSystems] = useState<ExtractedSystemInputs[]>([]);
  const [sessionType, setSessionType] = useState<SessionType>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        // Try to extract the structured error message from the backend
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Response wasn't JSON — use the generic status code message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);

      if (data.extractedSystem) {
        setExtractedSystems((prev) => [...prev, data.extractedSystem]);
      }
      if (data.sessionType) {
        setSessionType(data.sessionType);
      }
      if (data.sessionComplete) {
        setSessionComplete(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const reset = useCallback(() => {
    setMessages([]);
    setExtractedSystems([]);
    setSessionType(null);
    setSessionComplete(false);
    setError(null);
  }, []);

  return { messages, sendMessage, extractedSystems, sessionType, sessionComplete, isLoading, error, reset };
}
