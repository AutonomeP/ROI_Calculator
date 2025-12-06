import { ROIInputs, ROIInputStrings, ROICalculations, Complexity } from '../types/roi';
import FormSection from './FormSection';
import FormInput from './FormInput';
import ComplexitySelector from './ComplexitySelector';
import LeverageSlider from './LeverageSlider';
import CollapsibleInput from './CollapsibleInput';
import { formatCurrency } from '../utils/formatting';

interface InputWizardPanelProps {
  inputs: ROIInputs;
  inputStrings: ROIInputStrings;
  calculations: ROICalculations;
  onChange: (field: keyof ROIInputs, value: string | number) => void;
}

export default function InputWizardPanel({ inputs, inputStrings, calculations, onChange }: InputWizardPanelProps) {
  const handleChange = (field: keyof ROIInputs) => (value: string) => {
    onChange(field, value);
  };

  const handleComplexityChange = (value: Complexity) => {
    onChange('complexity', value);
  };

  const hasUserEnteredPlatformCost = inputStrings.platformCost && parseFloat(inputStrings.platformCost) > 0;

  const platformCostHelperText = hasUserEnteredPlatformCost
    ? `Your price: ${formatCurrency(calculations.platformAnnual, 2)} total (${formatCurrency(calculations.platformMonthly, 2)}/month over 12 months). Suggested: ${formatCurrency(calculations.suggestedPlatformAnnual, 2)} total`
    : `Suggested: ${formatCurrency(calculations.suggestedPlatformAnnual, 2)} total (${formatCurrency(calculations.suggestedPlatformMonthly, 2)}/month over 12 months)`;

  const errorSavingsHelperText = `Auto-estimated: ${formatCurrency(calculations.suggestedErrorSavings, 2)}/month (based on complexity)`;
  const revenueGeneratedHelperText = `Suggested: ${formatCurrency(calculations.suggestedRG, 2)}/month (based on complexity and opportunity value)`;
  const opportunityValueHelperText = `Suggested: ${formatCurrency(calculations.suggestedOC, 2)}/month (based on time savings)`;

  return (
    <div className="space-y-6">
      <FormSection
        title="Process Basics"
        helperText="Identify the process and how often it runs"
      >
        <FormInput
          label="Process Name"
          type="text"
          value={inputs.processName}
          onChange={handleChange('processName')}
          placeholder="e.g., Invoice Processing"
        />
        <FormInput
          label="Runs per Month"
          type="number"
          value={inputStrings.runsPerMonth}
          onChange={handleChange('runsPerMonth')}
          placeholder="e.g., 20"
        />
      </FormSection>

      <FormSection
        title="Time & Cost"
        helperText="Measure current time and savings potential"
      >
        <FormInput
          label="Current Time per Run (minutes)"
          type="number"
          value={inputStrings.tOldMinutes}
          onChange={handleChange('tOldMinutes')}
          placeholder="e.g., 30"
        />
        <FormInput
          label="% of Task That Can Be Automated"
          type="number"
          value={inputStrings.percentAutomated}
          onChange={handleChange('percentAutomated')}
          placeholder="e.g., 25"
          helperText={`Recommended ranges: Simple automation (15-30%) • Complex workflows (25-50%) • Agentic systems (20-40%). Default: 25%`}
        />
        <ComplexitySelector
          value={inputs.complexity}
          onChange={handleComplexityChange}
        />
        <FormInput
          label="Hourly Rate ($/hr)"
          type="number"
          value={inputStrings.hourlyRate}
          onChange={handleChange('hourlyRate')}
          placeholder="e.g., 50"
          helperText="Average cost per hour of people doing this work"
        />
      </FormSection>

      <FormSection
        title="Leverage & Cost"
        helperText="Impact multipliers and platform investment"
      >
        <LeverageSlider
          value={inputStrings.wls}
          onChange={handleChange('wls')}
        />
        <FormInput
          label="Velocity Multiplier (VM)"
          type="number"
          value={inputStrings.velocityMultiplier}
          onChange={handleChange('velocityMultiplier')}
          placeholder={inputs.solutionMode === 'automation' ? 'e.g., 1.2' : 'e.g., 1.5'}
          helperText={
            inputs.solutionMode === 'automation'
              ? 'Automation range: 1.0-1.6 (recommended: 1.1-1.3). Default: 1.2'
              : 'Agentic range: 1.2-2.0 (recommended: 1.4-1.7). Default: 1.5'
          }
        />
        <CollapsibleInput
          label="Platform Cost"
          defaultCollapsed={true}
        >
          <FormInput
            label="Platform Cost (one-time total)"
            type="number"
            value={inputStrings.platformCost}
            onChange={handleChange('platformCost')}
            placeholder="Optional - leave blank for suggestion"
            helperText={platformCostHelperText}
          />
        </CollapsibleInput>
        <CollapsibleInput
          label="Operating Costs (OPEX)"
          defaultCollapsed={true}
        >
          <FormInput
            label="Monthly Run Cost ($/month)"
            type="number"
            value={inputStrings.monthlyRunCost}
            onChange={handleChange('monthlyRunCost')}
            placeholder="e.g., 50"
            helperText="LLM API costs, hosting, and ongoing maintenance expenses"
          />
        </CollapsibleInput>
      </FormSection>

      <FormSection
        title="Direct Savings"
        helperText="Additional monthly savings beyond time"
        collapsible={true}
        defaultCollapsed={true}
      >
        <FormInput
          label="Baseline Monthly Error Cost ($/month)"
          type="number"
          value={inputStrings.baselineErrorCostMonthly}
          onChange={handleChange('baselineErrorCostMonthly')}
          placeholder="e.g., 500"
          helperText="Current monthly cost of errors before automation"
        />
        <FormInput
          label="Expected Error Reduction (%)"
          type="number"
          value={inputStrings.errorReductionPercent}
          onChange={handleChange('errorReductionPercent')}
          placeholder={inputs.solutionMode === 'automation' ? 'e.g., 40' : 'e.g., 70'}
          helperText={
            inputs.solutionMode === 'automation'
              ? 'Simple automation: 30-60% • Default: 40%'
              : 'Agentic systems: 50-90% • Default: 70%'
          }
        />
        <FormInput
          label="Savings from Tools/Contractors ($/month)"
          type="number"
          value={inputStrings.toolSavings}
          onChange={handleChange('toolSavings')}
          placeholder="e.g., 200"
        />
      </FormSection>

      <FormSection
        title="Revenue & Opportunity"
        helperText="Value created by automation capabilities (optional - leave blank for auto-calculated suggestions)"
        collapsible={true}
        defaultCollapsed={true}
      >
        <FormInput
          label="Extra Revenue from Automation ($/month)"
          type="number"
          value={inputStrings.revenueGenerated}
          onChange={handleChange('revenueGenerated')}
          placeholder="Optional - leave blank for suggestion"
          helperText={revenueGeneratedHelperText}
        />
        <FormInput
          label="Value of New Capacity/Capability ($/month)"
          type="number"
          value={inputStrings.opportunityValue}
          onChange={handleChange('opportunityValue')}
          placeholder="Optional - leave blank for suggestion"
          helperText={opportunityValueHelperText}
        />
      </FormSection>
    </div>
  );
}
