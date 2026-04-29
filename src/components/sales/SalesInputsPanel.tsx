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
 * Griglia di input completamente visibile — il corpo editoriale di /sales.
 * Due gruppi:
 *  1. Profilo PMI — numeri concreti dell'azienda (dipendenti, fatturato,
 *     ore di contabilità, fornitori, commesse, costi attuali).
 *  2. Avanzato (collassabile) — leve commerciali (margine, payback,
 *     marginFloor, modificatore tier, quota terzi) che pilotano il
 *     tetto di investimento.
 */
export const SalesInputsPanel = ({ inputs, set }: SalesInputsPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-10">
      {/* ─────────────────────────── Profilo PMI ─────────────────────────── */}
      <section>
        <p className="eyebrow eyebrow-accent">Profilo PMI</p>
        <h2 className="h3 mt-3">Cosa porta sul tavolo l'azienda?</h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Field label="Fatturato annuo" helper="Ultimo esercizio chiuso, in €.">
            <NumericInput
              value={inputs.annualRevenue}
              onChange={(n) => set("annualRevenue", n)}
              suffix="€"
            />
          </Field>

          <Field label="Dipendenti" helper="Persone interne, incluso il titolare.">
            <NumericInput
              value={inputs.employees}
              onChange={(n) => set("employees", n)}
            />
          </Field>

          <Field label="Ore di contabilità (mese)" helper="Prima nota, riconciliazioni, fatture passive.">
            <NumericInput
              value={inputs.monthlyAccountingHours}
              onChange={(n) => set("monthlyAccountingHours", n)}
              suffix="h"
            />
          </Field>

          <Field label="Fornitori attivi" helper="Anagrafiche con cui mantieni il listino.">
            <NumericInput
              value={inputs.suppliersCount}
              onChange={(n) => set("suppliersCount", n)}
            />
          </Field>

          <Field label="Commesse attive (mese)" helper="In media — 0 se non lavora a commessa.">
            <NumericInput
              value={inputs.monthlyCommesse}
              onChange={(n) => set("monthlyCommesse", n)}
            />
          </Field>

          <Field label="Ordini al mese" helper="Stima del volume di movimenti su CRM/magazzino.">
            <NumericInput
              value={inputs.monthlyOrders}
              onChange={(n) => set("monthlyOrders", n)}
            />
          </Field>

          <Field label="Costo ERP/gestionale attuale" helper="Canone mensile del software che Monolite sostituisce.">
            <NumericInput
              value={inputs.currentErpMonthlyCost}
              onChange={(n) => set("currentErpMonthlyCost", n)}
              suffix="€"
            />
          </Field>

          <Field label="Costo orario medio (ops)" helper="€/ora medio per il personale che fa data entry.">
            <NumericInput
              value={inputs.avgHourlyRate}
              onChange={(n) => set("avgHourlyRate", n)}
              suffix="€"
            />
          </Field>

          <Field label="Tier consumo agenti" helper="Mix di agenti standard vs personalizzati.">
            <SegmentedControl
              layout="block"
              value={inputs.priceTier}
              onChange={(v) => set("priceTier", v)}
              options={[
                { value: "low", label: "Basso" },
                { value: "mid", label: "Medio" },
                { value: "high", label: "Alto" },
              ]}
            />
          </Field>

          <Field
            label="Quota agenti di terzi"
            helper={`${inputs.thirdPartyAgentShare}% del consumo è agenti pubblicati da sviluppatori esterni — Monolite incassa il 5% di quella quota.`}
          >
            <SliderRow
              value={inputs.thirdPartyAgentShare}
              min={0}
              max={100}
              step={5}
              onChange={(v) => set("thirdPartyAgentShare", v)}
              suffix="%"
            />
          </Field>

          <Field
            label="POC gratuiti (mesi)"
            helper="Mesi pilota a €0 — scalano dal contratto."
          >
            <SegmentedControl
              layout="block"
              value={inputs.freePocMonths}
              onChange={(v) => set("freePocMonths", v)}
              options={[
                { value: 0, label: "0" },
                { value: 1, label: "1 m" },
                { value: 2, label: "2 m" },
                { value: 3, label: "3 m" },
              ]}
            />
          </Field>

          <Field
            label="Accesso studio commercialista"
            helper="Add-on clean data room per il commercialista esterno."
          >
            <SegmentedControl
              layout="row"
              value={inputs.includeStudio ? 1 : 0}
              onChange={(v) => set("includeStudio", v === 1)}
              options={[
                { value: 1, label: "Sì" },
                { value: 0, label: "No" },
              ]}
            />
          </Field>
        </div>
      </section>

      {/* ─────────────────────────── Avanzato ─────────────────────────── */}
      <section>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-baseline gap-2 text-left group"
        >
          <p className="eyebrow group-hover:text-[color:var(--mono-spice)] transition-colors">
            Avanzato — economia della trattativa
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
              label="Margine lordo"
              helper="Ipotesi di margine — pilota il profitto annuo."
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
              label="Orizzonte payback"
              helper="Mesi entro cui rientriamo dell'investimento."
            >
              <SliderRow
                value={inputs.paybackMonths}
                min={3}
                max={24}
                step={1}
                onChange={(v) => set("paybackMonths", v)}
                suffix=" m"
              />
            </Field>

            <Field
              label="Margine minimo"
              helper="Cap rigido sullo sconto canone — quanto deve restare a Monolite."
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
      className="mono-range flex-1"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
    />
    <span className="font-display text-[20px] font-normal tabular tracking-tight text-[var(--fg1)] min-w-[64px] text-right">
      {fmtNum(value)}
      {suffix}
    </span>
  </div>
);
