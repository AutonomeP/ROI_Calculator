export type Complexity = 'simple' | 'moderate' | 'complex';
export type SolutionMode = 'automation' | 'agentic';

export interface ROIInputs {
  processName: string;
  tOldMinutes: number;
  runsPerMonth: number;
  hourlyRate: number;
  errorSavings: number;
  toolSavings: number;
  revenueGenerated: number;
  opportunityValue: number;
  wls: number;
  platformCost: number;
  complexity: Complexity;
  solutionMode: SolutionMode;
}

export interface ROIInputStrings {
  runsPerMonth: string;
  tOldMinutes: string;
  hourlyRate: string;
  errorSavings: string;
  toolSavings: string;
  revenueGenerated: string;
  opportunityValue: string;
  wls: string;
  platformCost: string;
}

export interface ROICalculations {
  tOld: number;
  vm: number;
  tNew: number;
  totalHoursSaved: number;
  msFromTS: number;
  msOther: number;
  msTotal: number;
  oc: number;
  rg: number;
  directSavings: number;
  growthValue: number;
  roiBeforeCost: number;
  totalRoi: number;
  roiPercent: number;
  platformAnnual: number;
  platformMonthly: number;
  suggestedPlatformAnnual: number;
  suggestedPlatformMonthly: number;
  suggestedOC: number;
  suggestedRG: number;
  suggestedErrorSavings: number;
  errorSavings: number;
  gross6m: number;
  gross1y: number;
  roi6mNet: number;
  roi1yNet: number;
  roi6mPercent: number;
  roi1yPercent: number;
  paybackMonths: number;
}
