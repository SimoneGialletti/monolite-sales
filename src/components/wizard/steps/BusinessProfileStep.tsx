import type { StepProps } from "../WizardShell";
import { NumericInput } from "../NumericInput";

/**
 * Step "Profilo operativo": fornitori, commesse e accesso allo studio.
 * Tre micro-domande raggruppate perché si rispondono di pancia in pochi secondi.
 */
export const BusinessProfileStep = ({ inputs, set }: StepProps) => (
  <div className="space-y-8 max-w-xl">
    <div>
      <label className="label block mb-2">Fornitori gestiti (anagrafiche attive)</label>
      <NumericInput
        value={inputs.suppliersCount}
        onChange={(n) => set("suppliersCount", n)}
        autoFocus
      />
      <p className="text-[12px] text-text-muted mt-2">
        Quanti fornitori ricorrenti — Monolite mantiene aggiornato il loro listino
        prezzi.
      </p>
    </div>

    <div>
      <label className="label block mb-2">Commesse attive in media (al mese)</label>
      <NumericInput
        value={inputs.monthlyCommesse}
        onChange={(n) => set("monthlyCommesse", n)}
      />
      <p className="text-[12px] text-text-muted mt-2">
        Numero medio di commesse in lavorazione contemporaneamente. Lascia 0 se
        l'azienda non lavora a commessa.
      </p>
    </div>

    <div>
      <label className="label block mb-3">Vuoi includere l'accesso dello studio commercialista?</label>
      <div className="flex gap-2">
        {[
          { key: true, label: "Sì, in clean data room" },
          { key: false, label: "No, per ora" },
        ].map((o) => {
          const selected = inputs.includeStudio === o.key;
          return (
            <button
              key={String(o.key)}
              onClick={() => set("includeStudio", o.key)}
              className={`scenario flex-1 text-left ${selected ? "scenario-highlight" : ""}`}
            >
              <p className="text-[14px] text-[var(--fg1)]">{o.label}</p>
            </button>
          );
        })}
      </div>
      <p className="text-[12px] text-text-muted mt-2">
        Il tuo commercialista accede al database aziendale in modo sicuro,
        attraverso una clean data room. I dati restano tuoi, sempre.
      </p>
    </div>
  </div>
);
