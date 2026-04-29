import type { StepProps } from "../WizardShell";
import { NumericInput } from "../NumericInput";

/**
 * Step "Fatturato annuo".
 * Nome di file storico mantenuto; contenuto riscritto per Monolite.
 */
export const SalesStep = ({ inputs, set }: StepProps) => (
  <div className="max-w-md">
    <label className="label block mb-2">Fatturato annuo (€)</label>
    <NumericInput
      value={inputs.annualRevenue}
      onChange={(n) => set("annualRevenue", n)}
      suffix="€"
      autoFocus
    />
    <p className="text-[12px] text-text-muted mt-2">
      Ordine di grandezza del fatturato dell'ultimo esercizio chiuso. Usato
      per stimare la complessità della contabilità e il piano consigliato.
    </p>
  </div>
);
