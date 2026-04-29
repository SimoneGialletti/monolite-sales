import type { StepProps } from "../WizardShell";
import { NumericInput } from "../NumericInput";

/**
 * Step "Numero di dipendenti".
 * Nome di file storico mantenuto; contenuto riscritto per Monolite.
 */
export const CrmStep = ({ inputs, set }: StepProps) => (
  <div className="max-w-md">
    <label className="label block mb-2">Dipendenti</label>
    <NumericInput
      value={inputs.employees}
      onChange={(n) => set("employees", n)}
      autoFocus
    />
    <p className="text-[12px] text-text-muted mt-2">
      Numero di persone in azienda — incluso il titolare. Conta tutti i
      collaboratori interni, non i fornitori.
    </p>
  </div>
);
