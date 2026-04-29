import type { StepProps } from "../WizardShell";
import { NumericInput } from "../NumericInput";

export const SalesStep = ({ inputs, set }: StepProps) => (
  <div className="max-w-md">
    <label className="label block mb-2">Monthly online sales (€)</label>
    <NumericInput
      value={inputs.attributedSales}
      onChange={(n) => set("attributedSales", n)}
      suffix="€"
      autoFocus
    />
    <p className="text-[12px] text-text-muted mt-2">
      Average revenue you generate online each month.
    </p>
  </div>
);
