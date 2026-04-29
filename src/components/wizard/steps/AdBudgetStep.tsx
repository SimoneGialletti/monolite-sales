import type { StepProps } from "../WizardShell";
import { NumericInput } from "../NumericInput";

export const AdBudgetStep = ({ inputs, set }: StepProps) => (
  <div className="max-w-md">
    <label className="label block mb-2">Monthly ad spend (€)</label>
    <NumericInput
      value={inputs.advBudget}
      onChange={(n) => set("advBudget", n)}
      suffix="€"
      autoFocus
    />
    <p className="text-[12px] text-text-muted mt-2">
      How much you typically invest in advertising each month.
    </p>
  </div>
);
