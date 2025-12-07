export type Complexity = 'simple' | 'moderate' | 'complex';
export type SolutionMode = 'automation' | 'agentic';
export type AutomationDepth = 'light' | 'workflow' | 'agentic';

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
  automationDepth: AutomationDepth;
  baselineErrorCostMonthly: number;
  errorReductionPercent: number;
  velocityMultiplier: number;
  monthlyRunCost: number;
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
  baselineErrorCostMonthly: string;
  errorReductionPercent: string;
  velocityMultiplier: string;
  monthlyRunCost: string;
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
  wlsMultiplier: number;
  monthlyLeveragedValue: number;
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
  grossQuarter: number;
  gross6m: number;
  gross1y: number;
  roiQuarterNet: number;
  roi6mNet: number;
  roi1yNet: number;
  roiQuarterPercent: number;
  roi6mPercent: number;
  roi1yPercent: number;
  monthsToRoi: number;
  quartersToRoi: number;
  paybackMonths: number;
  timeSavedPerRunMinutes: number;
  calculatedErrorReductionPercent: number;
  netMonthlyAfterRunCost: number;
  lowCaseMonthlyROI: number;
  baseCaseMonthlyROI: number;
  highCaseMonthlyROI: number;
  lowCaseQuarterlyROI: number;
  baseCaseQuarterlyROI: number;
  highCaseQuarterlyROI: number;
  lowCase6mROI: number;
  baseCase6mROI: number;
  highCase6mROI: number;
  lowCase1yROI: number;
  baseCase1yROI: number;
  highCase1yROI: number;
}
