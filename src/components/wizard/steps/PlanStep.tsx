import type { StepProps } from "../WizardShell";
import type { Plan } from "@/lib/calc";

const PLANS: { key: Plan; label: string; price: string; tagline: string }[] = [
  { key: "starter", label: "Starter", price: "€149/mo", tagline: "For early-stage fanbases" },
  { key: "pro", label: "Pro", price: "€899/mo", tagline: "For growing communities" },
  { key: "enterprise", label: "Enterprise", price: "€2 500/mo", tagline: "For established brands" },
];

export const PlanStep = ({ inputs, set }: StepProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {PLANS.map((p) => {
      const selected = inputs.plan === p.key;
      return (
        <button
          key={p.key}
          onClick={() => set("plan", p.key)}
          className={`scenario text-left ${selected ? "scenario-highlight" : ""}`}
        >
          <p className="font-display text-[19px] font-medium tracking-tight text-[var(--fg1)]">
            {p.label}
          </p>
          <p className="number text-[28px] text-[color:var(--meus-orange)] mt-2 leading-none">
            {p.price}
          </p>
          <p className="text-[13px] text-[var(--fg2)] mt-3 leading-relaxed">
            {p.tagline}
          </p>
        </button>
      );
    })}
  </div>
);
