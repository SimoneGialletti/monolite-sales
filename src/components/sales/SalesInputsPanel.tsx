import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CalcInputs, fmtNum } from "@/lib/calc";
import { NumericInput } from "@/components/wizard/NumericInput";
import { SegmentedControl } from "./SegmentedControl";

interface SalesInputsPanelProps {
  inputs: CalcInputs;
  set: <K extends keyof CalcInputs>(k: K, v: CalcInputs[K]) => void;
}

/**
 * All-visible inputs grid — the editorial body of /sales.
 * Two groups:
 *  1. Partner snapshot — what the partner brings to the table.
 *  2. Advanced (collapsible) — sales-only knobs (margin, payback, marginFloor)
 *     that drive maxInvestment / discount headroom.
 */
export const SalesInputsPanel = ({ inputs, set }: SalesInputsPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-10">
      {/* ─────────────────────────── Partner snapshot ─────────────────────────── */}
      <section>
        <p className="eyebrow eyebrow-accent">Partner snapshot</p>
        <h2 className="h3 mt-3">What does the partner bring?</h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Field label="Monthly online sales" helper="What they're already selling per month.">
            <NumericInput
              value={inputs.attributedSales}
              onChange={(n) => set("attributedSales", n)}
              suffix="€"
            />
          </Field>

          <Field label="Monthly ad spend" helper="Budget MEUS will manage on top.">
            <NumericInput
              value={inputs.advBudget}
              onChange={(n) => set("advBudget", n)}
              suffix="€"
            />
          </Field>

          <Field label="CRM contacts" helper="Audience size we'll connect to.">
            <NumericInput
              value={inputs.crmContacts}
              onChange={(n) => set("crmContacts", n)}
            />
          </Field>

          <Field
            label="Monthly clicks"
            helper="Used for the per-click portion of the sales fee."
          >
            <NumericInput
              value={inputs.clicks}
              onChange={(n) => set("clicks", n)}
            />
          </Field>

          <Field
            label="Attributed share"
            helper={`${inputs.pctAttributed}% of sales tracked via CPS, the rest via CPC on clicks.`}
          >
            <SliderRow
              value={inputs.pctAttributed}
              min={0}
              max={100}
              step={5}
              onChange={(v) => set("pctAttributed", v)}
              suffix="%"
            />
          </Field>

          <Field label="CPC tier" helper="Click pricing band — higher tiers fit higher-CTR markets.">
            <SegmentedControl
              layout="block"
              value={inputs.priceTier}
              onChange={(v) => set("priceTier", v)}
              options={[
                { value: "low", label: "Low" },
                { value: "mid", label: "Mid" },
                { value: "high", label: "High" },
              ]}
            />
          </Field>

          <Field
            label="Free PoC months"
            helper="Pilot months at €0 — count against contractMonths."
          >
            <SegmentedControl
              layout="block"
              value={inputs.freePocMonths}
              onChange={(v) => set("freePocMonths", v)}
              options={[
                { value: 0, label: "0" },
                { value: 1, label: "1 mo" },
                { value: 2, label: "2 mo" },
                { value: 3, label: "3 mo" },
              ]}
            />
          </Field>
        </div>
      </section>

      {/* ─────────────────────────── Advanced (sales-only) ─────────────────────────── */}
      <section>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-baseline gap-2 text-left group"
        >
          <p className="eyebrow group-hover:text-[color:var(--meus-orange)] transition-colors">
            Advanced — deal economics
          </p>
          <ChevronDown
            size={14}
            className={
              "text-[var(--fg-muted)] transition-transform duration-200 " +
              (showAdvanced ? "rotate-180" : "")
            }
          />
        </button>

        {showAdvanced && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <Field
              label="Gross margin"
              helper={`MEUS' margin assumption — drives annual gross profit.`}
            >
              <SliderRow
                value={inputs.grossMargin}
                min={20}
                max={85}
                step={1}
                onChange={(v) => set("grossMargin", v)}
                suffix="%"
              />
            </Field>

            <Field
              label="Payback horizon"
              helper="Months to recoup upfront investment from gross profit."
            >
              <SliderRow
                value={inputs.paybackMonths}
                min={3}
                max={24}
                step={1}
                onChange={(v) => set("paybackMonths", v)}
                suffix=" mo"
              />
            </Field>

            <Field
              label="Margin floor"
              helper="Hard cap on fee discount — what MEUS must keep."
            >
              <SliderRow
                value={inputs.marginFloor}
                min={10}
                max={50}
                step={1}
                onChange={(v) => set("marginFloor", v)}
                suffix="%"
              />
            </Field>
          </div>
        )}
      </section>
    </div>
  );
};

// ─────────────────────────── Helpers ───────────────────────────

interface FieldProps {
  label: string;
  helper?: string;
  children: React.ReactNode;
}

const Field = ({ label, helper, children }: FieldProps) => (
  <div className="flex flex-col gap-2">
    <span className="eyebrow">{label}</span>
    {children}
    {helper && (
      <span className="text-[12px] text-[var(--fg3)] leading-relaxed">
        {helper}
      </span>
    )}
  </div>
);

interface SliderRowProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  suffix?: string;
}

const SliderRow = ({
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: SliderRowProps) => (
  <div className="flex items-center gap-4">
    <input
      type="range"
      className="meus-range flex-1"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
    />
    <span className="font-display text-[20px] font-medium tabular tracking-tight text-[var(--fg1)] min-w-[64px] text-right">
      {fmtNum(value)}
      {suffix}
    </span>
  </div>
);
