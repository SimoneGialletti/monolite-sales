import type { StepProps } from "../WizardShell";
import { NumericInput } from "../NumericInput";

export const CrmStep = ({ inputs, set }: StepProps) => (
  <div className="max-w-md">
    <label className="label block mb-2">CRM contacts</label>
    <NumericInput
      value={inputs.crmContacts}
      onChange={(n) => set("crmContacts", n)}
      autoFocus
    />
    <p className="text-[12px] text-text-muted mt-2">
      How many contacts you'd upload to MEUS for data cleaning and targeting.
    </p>
  </div>
);
