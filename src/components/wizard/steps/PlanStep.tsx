import type { StepProps } from "../WizardShell";
import type { Plan } from "@/lib/calc";

const PLANS: { key: Plan; label: string; price: string; tagline: string }[] = [
  { key: "starter",    label: "Starter",    price: "€99/mese",    tagline: "Micro impresa, 1–5 dipendenti" },
  { key: "business",   label: "Business",   price: "€449/mese",   tagline: "PMI media, 6–25 dipendenti" },
  { key: "enterprise", label: "Enterprise", price: "€1.490/mese", tagline: "PMI strutturata, 25–100 dipendenti" },
  { key: "studio",     label: "Studio",     price: "€199/mese",   tagline: "Commercialisti e revisori contabili" },
];

export const PlanStep = ({ inputs, set }: StepProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
    {PLANS.map((p) => {
      const selected = inputs.plan === p.key;
      return (
        <button
          key={p.key}
          onClick={() => set("plan", p.key)}
          className={`scenario text-left ${selected ? "scenario-highlight" : ""}`}
        >
          <p className="font-display text-[19px] font-normal tracking-tight text-[var(--fg1)]">
            {p.label}
          </p>
          <p className="number text-[28px] mt-2 leading-none" style={{ color: "var(--mono-spice)" }}>
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
