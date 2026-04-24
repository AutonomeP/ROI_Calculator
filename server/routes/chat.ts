import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';
import type { ChatApiRequest, ChatApiResponse, ExtractedSystemInputs } from '../types.js';

const router = Router();

const useAnthropic = !!process.env.ANTHROPIC_API_KEY;
const useOpenAI = !!process.env.OPENAI_API_KEY;

if (!useAnthropic && !useOpenAI) {
  console.warn('Warning: neither ANTHROPIC_API_KEY nor OPENAI_API_KEY is set');
}

const anthropic = useAnthropic ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const openai = useOpenAI && !useAnthropic ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

console.log(`Chat provider: ${useAnthropic ? 'Anthropic (claude-sonnet-4-6)' : useOpenAI ? 'OpenAI (gpt-4o)' : 'none'}`);

function stripXmlTags(text: string): string {
  return text
    .replace(/<extracted_system>[\s\S]*?<\/extracted_system>/g, '')
    .replace(/<session_type>[\s\S]*?<\/session_type>/g, '')
    .replace(/<session_complete>[\s\S]*?<\/session_complete>/g, '')
    .trim();
}

function parseExtractedSystem(text: string): ExtractedSystemInputs | undefined {
  const match = text.match(/<extracted_system>([\s\S]*?)<\/extracted_system>/);
  if (!match) return undefined;
  try {
    return JSON.parse(match[1].trim()) as ExtractedSystemInputs;
  } catch {
    return undefined;
  }
}

function parseSessionType(text: string): 'single' | 'platform' | undefined {
  const match = text.match(/<session_type>(single|platform)<\/session_type>/);
  return match ? (match[1] as 'single' | 'platform') : undefined;
}

function parseSessionComplete(text: string): boolean {
  return /<session_complete>true<\/session_complete>/.test(text);
}

async function callAnthropic(messages: ChatApiRequest['messages']): Promise<string> {
  const response = await anthropic!.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('');
}

async function callOpenAI(messages: ChatApiRequest['messages']): Promise<string> {
  const response = await openai!.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
  });
  return response.choices[0]?.message?.content ?? '';
}

router.post('/', async (req: Request, res: Response) => {
  const { messages } = req.body as ChatApiRequest;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'messages array required' });
    return;
  }

  if (!useAnthropic && !useOpenAI) {
    res.status(503).json({ error: 'No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.' });
    return;
  }

  const rawText = useAnthropic ? await callAnthropic(messages) : await callOpenAI(messages);

  const result: ChatApiResponse = {
    reply: stripXmlTags(rawText),
    extractedSystem: parseExtractedSystem(rawText),
    sessionType: parseSessionType(rawText),
    sessionComplete: parseSessionComplete(rawText) || undefined,
  };

  res.json(result);
});

export default router;
