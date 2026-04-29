import type { StepProps } from "../WizardShell";
import { NumericInput } from "../NumericInput";

/**
 * Step "Ore di contabilità mensili".
 * Mantiene il nome di file storico (AdBudgetStep) per non perdere riferimenti
 * non ancora aggiornati — il contenuto è completamente nuovo.
 */
export const AdBudgetStep = ({ inputs, set }: StepProps) => (
  <div className="max-w-md">
    <label className="label block mb-2">Ore di contabilità al mese</label>
    <NumericInput
      value={inputs.monthlyAccountingHours}
      onChange={(n) => set("monthlyAccountingHours", n)}
      suffix="h"
      autoFocus
    />
    <p className="text-[12px] text-text-muted mt-2">
      Quante ore in media spende l'azienda ogni mese su prima nota, riconciliazioni
      e data entry contabile. Anche solo una stima va bene.
    </p>
  </div>
);
