import { useMemo } from 'react';
import { computeInitiativeROI } from '../utils/compute-vnext';
import { calculateServicePrice } from '../utils/pricing';
import type { RoiInputPayload } from '../types/roi-vnext';
import type { ExtractedSystemInputs, SystemResult } from '../types/chat';

function buildPayload(s: ExtractedSystemInputs): RoiInputPayload {
  const defectRate = s.errorCostMonthly > 0 ? 0.05 : 0;
  const costPerDefect =
    s.errorCostMonthly > 0 && s.runsPerMonth > 0
      ? s.errorCostMonthly / (s.runsPerMonth * 0.05)
      : 50;

  const automationCoverage =
    s.automationDepth === 'light' ? 0.25 : s.automationDepth === 'agentic' ? 0.30 : 0.45;

  return {
    baseline: {
      volume: { runs_per_month: s.runsPerMonth },
      time: { minutes_per_run: s.minutesPerRun, people_affected: s.peopleAffected },
      labor: { fully_loaded_rate: s.hourlyRate > 0 ? s.hourlyRate : 36.06 },
      quality: { defect_rate: defectRate, cost_per_defect: costPerDefect },
      hard_savings: { annual_cost_removed: s.toolSavingsMonthly * 12 },
      growth: {
        incremental_units_per_year: 0,
        margin_per_unit: 0,
        conversion_lift: 0,
        value_per_conversion: 0,
      },
    },
    costs: {
      implementation_cost: 0,
      run_cost_monthly: s.monthlyRunCost,
      year1_extra_costs: 0,
    },
    allocation: { time_value_allocation: 'labor_savings' },
    assumptions: { redeploy_factor: 0.3, is_platform_initiative: false },
    multipliers: { vm: 'auto', wls: s.wls },
    adoption: 0.80,
    automation_coverage: automationCoverage,
    error_reduction: 0.50,
    solution_mode: s.solutionMode,
    automation_depth: s.automationDepth,
  };
}

export function useROIResults(extractedSystems: ExtractedSystemInputs[]): SystemResult[] {
  return useMemo(() => {
    return extractedSystems.map((s) => {
      const payload = buildPayload(s);
      const roiResult = computeInitiativeROI(payload);
      const servicePrice = calculateServicePrice({
        monthlyLeveragedValue: roiResult.monthly_leveraged_value,
        effortIndex: roiResult.effort.index,
        solutionMode: s.solutionMode,
        automationDepth: s.automationDepth,
        linkedSystemCount: extractedSystems.length,
        regulatedSystemCount: 0,
        evidenceCount: -1,
      });
      return { inputs: s, roiResult, servicePrice };
    });
  }, [extractedSystems]);
}
