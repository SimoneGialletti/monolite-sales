import type { StepProps } from "../WizardShell";

const OPTIONS = [
  { months: 12, label: "12 months", tagline: "Standard term" },
  { months: 24, label: "24 months", tagline: "Better commitment" },
  { months: 36, label: "36 months", tagline: "Strategic partnership" },
];

export const ContractStep = ({ inputs, set }: StepProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {OPTIONS.map((o) => {
      const selected = inputs.contractMonths === o.months;
      return (
        <button
          key={o.months}
          onClick={() => set("contractMonths", o.months)}
          className={`scenario text-left ${selected ? "scenario-highlight" : ""}`}
        >
          <p className="number text-[28px] text-[color:var(--meus-orange)] leading-none">
            {o.label}
          </p>
          <p className="text-[13px] text-[var(--fg2)] mt-3 leading-relaxed">
            {o.tagline}
          </p>
        </button>
      );
    })}
  </div>
);
