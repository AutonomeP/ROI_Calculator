import type { RoiComputedResult } from './roi-vnext';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type SessionType = 'single' | 'platform' | null;

export interface ExtractedSystemInputs {
  systemName: string;
  description: string;
  peopleAffected: number;
  runsPerMonth: number;
  minutesPerRun: number;
  hourlyRate: number;
  errorCostMonthly: number;
  toolSavingsMonthly: number;
  monthlyRunCost: number;
  wls: number;
  solutionMode: 'automation' | 'agentic_intelligent_ai';
  automationDepth: 'light' | 'workflow' | 'agentic';
  opportunityValue: number;
  revenueGenerated: number;
}

export interface SystemResult {
  inputs: ExtractedSystemInputs;
  roiResult: RoiComputedResult;
  servicePrice: number;
}

export interface SessionResult {
  sessionType: SessionType;
  systems: SystemResult[];
  clientName: string;
}
