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
      </FormSection>

      <FormSection
        title="Direct Savings"
        helperText="Additional monthly savings beyond time"
        collapsible={true}
        defaultCollapsed={true}
      >
        <FormInput
          label="Savings from Reduced Errors ($/month)"
          type="number"
          value={inputStrings.errorSavings}
          onChange={handleChange('errorSavings')}
          placeholder="Optional - leave blank for auto-estimate"
          helperText={errorSavingsHelperText}
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
