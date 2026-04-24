export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

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

export interface ChatApiRequest {
  messages: ChatMessage[];
}

export interface ChatApiResponse {
  reply: string;
  extractedSystem?: ExtractedSystemInputs;
  sessionType?: 'single' | 'platform';
  sessionComplete?: boolean;
}
