import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';
import type { ChatApiRequest, ChatApiResponse, ExtractedSystemInputs } from '../types.js';

const router = Router();

/* ────────────────────────────────────────────
   Provider detection & initialization
   ──────────────────────────────────────────── */
const useAnthropic = !!process.env.ANTHROPIC_API_KEY;
const useOpenAI = !!process.env.OPENAI_API_KEY;

if (!useAnthropic && !useOpenAI) {
  console.error('FATAL: Neither ANTHROPIC_API_KEY nor OPENAI_API_KEY is set. All /api/chat requests will fail.');
}

let anthropic: Anthropic | null = null;
let openai: OpenAI | null = null;

try {
  if (useAnthropic) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    console.log('✓ Anthropic client initialized');
  }
} catch (err) {
  console.error('✗ Failed to initialize Anthropic client:', err);
}

try {
  if (useOpenAI && !useAnthropic) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('✓ OpenAI client initialized');
  }
} catch (err) {
  console.error('✗ Failed to initialize OpenAI client:', err);
}

const activeProvider = anthropic ? 'Anthropic' : openai ? 'OpenAI' : 'NONE';
console.log(`Chat provider: ${activeProvider}`);

/* ────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────── */
const REQUEST_TIMEOUT_MS = 25_000; // 25s — safely under Railway's 30s proxy timeout
const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'; // Stable model identifier
const OPENAI_MODEL = 'gpt-4o';

/* ────────────────────────────────────────────
   XML parsing helpers
   ──────────────────────────────────────────── */
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
  } catch (err) {
    console.warn('Failed to parse extracted system JSON:', err);
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

/* ────────────────────────────────────────────
   Timeout-wrapped promise helper
   ──────────────────────────────────────────── */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms / 1000}s`));
    }, ms);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/* ────────────────────────────────────────────
   Anthropic call with retry
   ──────────────────────────────────────────── */
async function callAnthropic(messages: ChatApiRequest['messages'], attempt = 1): Promise<string> {
  try {
    const response = await anthropic!.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    
    // Retry once on transient errors (429 rate limit, 500/502/503 server errors)
    if (attempt === 1 && error.status && [429, 500, 502, 503].includes(error.status)) {
      console.warn(`Anthropic returned ${error.status}, retrying in 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
      return callAnthropic(messages, 2);
    }

    // Classify error for the caller
    if (error.status === 401) {
      throw new Error('ANTHROPIC_AUTH: API key is invalid or expired. Check ANTHROPIC_API_KEY.');
    }
    if (error.status === 429) {
      throw new Error('ANTHROPIC_RATE_LIMIT: Rate limit exceeded. Please try again in a moment.');
    }
    if (error.status === 404 || error.status === 400) {
      throw new Error(`ANTHROPIC_MODEL: Model "${ANTHROPIC_MODEL}" returned ${error.status}. ${error.message || ''}`);
    }

    throw new Error(`ANTHROPIC_ERROR: ${error.message || 'Unknown Anthropic API error'}`);
  }
}

/* ────────────────────────────────────────────
   OpenAI call with retry
   ──────────────────────────────────────────── */
async function callOpenAI(messages: ChatApiRequest['messages'], attempt = 1): Promise<string> {
  try {
    const response = await openai!.chat.completions.create({
      model: OPENAI_MODEL,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
    });

    return response.choices[0]?.message?.content ?? '';
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };

    if (attempt === 1 && error.status && [429, 500, 502, 503].includes(error.status)) {
      console.warn(`OpenAI returned ${error.status}, retrying in 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
      return callOpenAI(messages, 2);
    }

    if (error.status === 401) {
      throw new Error('OPENAI_AUTH: API key is invalid or expired. Check OPENAI_API_KEY.');
    }
    if (error.status === 429) {
      throw new Error('OPENAI_RATE_LIMIT: Rate limit exceeded. Please try again in a moment.');
    }

    throw new Error(`OPENAI_ERROR: ${error.message || 'Unknown OpenAI API error'}`);
  }
}

/* ────────────────────────────────────────────
   Route handler
   ──────────────────────────────────────────── */
router.post('/', async (req: Request, res: Response) => {
  const { messages } = req.body as ChatApiRequest;

  // Input validation
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array required' });
    return;
  }

  // Provider check
  if (!anthropic && !openai) {
    res.status(503).json({
      error: 'No AI provider configured. The server administrator must set ANTHROPIC_API_KEY or OPENAI_API_KEY.',
    });
    return;
  }

  try {
    const provider = anthropic ? 'Anthropic' : 'OpenAI';
    console.log(`[chat] Processing request via ${provider} (${messages.length} messages)`);

    // Call AI provider with timeout protection
    const rawText = await withTimeout(
      anthropic ? callAnthropic(messages) : callOpenAI(messages),
      REQUEST_TIMEOUT_MS,
      provider
    );

    const result: ChatApiResponse = {
      reply: stripXmlTags(rawText),
      extractedSystem: parseExtractedSystem(rawText),
      sessionType: parseSessionType(rawText),
      sessionComplete: parseSessionComplete(rawText) || undefined,
    };

    console.log(`[chat] Success — reply length: ${result.reply.length}, extracted: ${!!result.extractedSystem}`);
    res.json(result);

  } catch (err: unknown) {
    const error = err as Error;
    const message = error.message || 'Unknown error';

    console.error(`[chat] ERROR: ${message}`);

    // Map internal error codes to user-friendly responses
    if (message.includes('AUTH')) {
      res.status(502).json({ error: 'AI service authentication failed. Please contact the administrator.' });
    } else if (message.includes('RATE_LIMIT')) {
      res.status(429).json({ error: 'The AI service is temporarily overloaded. Please wait a moment and try again.' });
    } else if (message.includes('MODEL')) {
      res.status(502).json({ error: 'AI model configuration error. Please contact the administrator.' });
    } else if (message.includes('timed out')) {
      res.status(504).json({ error: 'The AI service took too long to respond. Please try again with a shorter message.' });
    } else {
      res.status(502).json({ error: 'Unable to reach the AI service. Please try again.' });
    }
  }
});

export default router;
