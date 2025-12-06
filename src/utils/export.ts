import { ROIInputs, ROICalculations } from '../types/roi';
import { formatCurrency, formatNumber, formatPercent } from './formatting';

export function generateROIReport(inputs: ROIInputs, calculations: ROICalculations): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
========================================
ROI INTELLIGENCE CALCULATOR REPORT
Powered by Autonome AI
Generated: ${date}
========================================

PROCESS INFORMATION
----------------------------------------
Process Name: ${inputs.processName || 'Unnamed Process'}
Solution Mode: ${inputs.solutionMode === 'agentic' ? 'Agentic Workflows | Intelligent Systems' : 'Automation Workflows'}
Runs per Month: ${formatNumber(inputs.runsPerMonth)}
Complexity: ${inputs.complexity}

TIME & VELOCITY METRICS
----------------------------------------
Current Time per Run: ${calculations.tOld.toFixed(1)} minutes
New Time per Run: ${calculations.tNew.toFixed(1)} minutes
Velocity Multiplier (VM): ${calculations.vm.toFixed(2)}×
Total Hours Saved: ${formatNumber(calculations.totalHoursSaved, 1)} hrs/month

DIRECT SAVINGS
----------------------------------------
Money Saved from Time: ${formatCurrency(calculations.msFromTS)}
Error + Tool Savings: ${formatCurrency(calculations.msOther)}
Total Direct Savings: ${formatCurrency(calculations.directSavings)}

GROWTH VALUE (VELOCITY-ADJUSTED)
----------------------------------------
Opportunity Value (OC): ${formatCurrency(calculations.oc)}
Revenue Generated (RG): ${formatCurrency(calculations.rg)}
Growth Value: ${formatCurrency(calculations.growthValue)}

LEVERAGE & COST
----------------------------------------
Weighted Leverage Score (WLS): ${formatNumber(inputs.wls, 1)}
Platform Cost (one-time): ${formatCurrency(calculations.platformAnnual)}
Platform Cost (monthly equivalent): ${formatCurrency(calculations.platformMonthly)}/month
ROI Before Cost: ${formatCurrency(calculations.roiBeforeCost)}

FINAL RESULTS
========================================
Total ROI: ${formatCurrency(calculations.totalRoi)}/month
ROI Percentage: ${formatPercent(calculations.roiPercent)}

ROI Formula:
ROI = (MS + (OC + RG) × VM) × WLS – Platform Cost

Where:
  MS  = Monthly Savings: ${formatCurrency(calculations.msTotal)}
  OC  = Opportunity Cost: ${formatCurrency(calculations.oc)}
  RG  = Revenue Generated: ${formatCurrency(calculations.rg)}
  VM  = Velocity Multiplier: ${calculations.vm.toFixed(2)}×
  WLS = Weighted Leverage Score: ${formatNumber(inputs.wls, 1)}
  Platform Cost = ${formatCurrency(calculations.platformAnnual)} (one-time) or ${formatCurrency(calculations.platformMonthly)}/month

========================================
This report was generated using the ROI
Intelligence Calculator by Autonome AI.
========================================
`.trim();
}

export function downloadROIReport(inputs: ROIInputs, calculations: ROICalculations) {
  const report = generateROIReport(inputs, calculations);
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const processName = inputs.processName
    ? inputs.processName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    : 'roi_report';

  const date = new Date().toISOString().split('T')[0];
  link.download = `${processName}_${date}.txt`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

export function copyROIReportToClipboard(inputs: ROIInputs, calculations: ROICalculations): Promise<void> {
  const report = generateROIReport(inputs, calculations);
  return navigator.clipboard.writeText(report);
}
