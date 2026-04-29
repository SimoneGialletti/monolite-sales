import type { StepProps } from "../WizardShell";
import { CLIENT_TYPES } from "@/lib/calc";

export const ClientTypeStep = ({ inputs, set }: StepProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    {CLIENT_TYPES.map((t) => {
      const selected = inputs.clientType === t.key;
      return (
        <button
          key={t.key}
          onClick={() => set("clientType", t.key)}
          className={`scenario text-left ${selected ? "scenario-highlight" : ""}`}
        >
          <p className="font-display text-[16px] md:text-[18px] font-normal tracking-tight text-[var(--fg1)] leading-tight">
            {t.label}
          </p>
          <p className="text-[12px] text-[var(--fg3)] mt-2 leading-snug">
            {t.hint}
          </p>
        </button>
      );
    })}
  </div>
);
