import { useState } from "react";
import {
  AGENT_COST_RATIO,
  CalcInputs,
  compute,
  estimateMonthlyCostReduction,
  estimateMonthlyUplift,
  fmtEur,
  resolvePlan,
  SavingLine,
  UPLIFT_RATE,
} from "@/lib/calc";

interface ResultViewProps {
  inputs: CalcInputs;
  outputs: ReturnType<typeof compute>;
}

/**
 * Risultato del wizard PMI — "ti costa X, ti torna Y" in tre carte:
 *
 *   1. Il pitch — riga editoriale, una frase.
 *   2. Cosa ottieni — risparmio garantito + crescita potenziale + barra net.
 *   3. Perché costa così — voci di prezzo riconciliate con il modello.
 *
 * Numero a sinistra, cifra a destra. Bordi, non ombre. Reckless sui numeri.
 */
export const ResultView = ({ inputs, outputs }: ResultViewProps) => {
  const uplift = estimateMonthlyUplift(inputs);
  const savings = estimateMonthlyCostReduction(inputs);
  const upside = uplift + savings.total;

  const fixedCost = outputs.monthlyCanone + outputs.monthlyStudioFee;
  const variableCost = outputs.monthlyTokenRevenue + outputs.monthlyMarketplaceFee;

  // Regola di prodotto: Monolite non si prende mai più del 30% del valore
  // potenziale che genera. Sopra quella soglia tagliamo i fee variabili.
  const POTENTIAL_TAKE_RATE_CAP = 0.3;
  const cappedVariable = Math.min(variableCost, uplift * POTENTIAL_TAKE_RATE_CAP);
  const capApplied = variableCost > uplift * POTENTIAL_TAKE_RATE_CAP;

  const netValue = uplift + savings.total - fixedCost - cappedVariable;
  const netPositive = netValue >= 0;
  const displayedTotalCost = fixedCost + cappedVariable;

  const plan = resolvePlan(inputs);
  const [openCard, setOpenCard] = useState<"pitch" | "get" | "why">("pitch");

  return (
    <div className="space-y-3">
      <Card
        id="pitch"
        eyebrow="Il pitch"
        eyebrowColor="var(--fg3)"
        summary={
          <span className="text-[12px] font-mono tabular text-[var(--fg3)]">
            {fmtEur(fixedCost)} → +{fmtEur(upside)}
          </span>
        }
        open={openCard === "pitch"}
        onToggle={() => setOpenCard("pitch")}
      >
        <p className="text-[var(--fg2)] text-[18px] md:text-[22px] leading-snug max-w-3xl">
          Con{" "}
          <span className="font-display font-normal text-[var(--fg1)] tabular">
            {fmtEur(fixedCost)}
          </span>
          /mese sblocchi{" "}
          <span
            className="font-display font-normal tabular"
            style={{ color: "var(--positive)" }}
          >
            +{fmtEur(upside)}
          </span>
          /mese tra risparmio sull'attuale gestione e crescita potenziale.
        </p>
        <p className="mt-4 text-[12px] text-[var(--fg-muted)] leading-relaxed max-w-2xl">
          Il canone Monolite{outputs.monthlyStudioFee > 0 ? " + accesso dello studio in clean data room" : ""}.
          I costi variabili — token agenti e marketplace di terzi — scalano solo
          quando gli agenti lavorano davvero per te.
        </p>
      </Card>

      <Card
        id="get"
        eyebrow="01 · Cosa ottieni"
        eyebrowColor="var(--positive)"
        summary={
          <span
            className="text-[14px] font-display font-normal tabular"
            style={{ color: "var(--positive)" }}
          >
            +{fmtEur(upside)}
          </span>
        }
        open={openCard === "get"}
        onToggle={() => setOpenCard("get")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Risparmio garantito */}
          <SubCard color="var(--mono-sand)" tint="var(--mono-accent-soft)">
            <p className="eyebrow" style={{ color: "var(--mono-sand)" }}>
              Risparmio garantito
            </p>
            <p
              className="number leading-none text-[40px] md:text-[56px] mt-3"
              style={{ color: "var(--mono-sand)" }}
            >
              +{fmtEur(savings.total)}
            </p>
            <p className="mt-2 text-[12px] text-[var(--fg3)]">
              Per ogni attività, l'agent costa il {Math.round((1 - AGENT_COST_RATIO) * 100)}% del
              costo mensile pieno (RAL + oneri) della persona che la fa oggi — ed è più veloce e
              più preciso.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] text-[var(--fg1)]">
              <Benefit
                title="Agent prima nota"
                detail="Registrazioni, quadrature e prima nota a metà del costo persona/mese, in tempo reale, senza errori di trascrizione."
                line={savings.primaNota}
              />
              <Benefit
                title="Agent fornitori"
                detail="Listini, ordini e follow-up scadenze a metà del costo persona/mese, più veloce delle email."
                line={savings.suppliers}
              />
              <Benefit
                title="Agent magazzino"
                detail="Movimenti, picking e controllo giacenze a metà del costo persona/mese, in tempo reale."
                line={savings.warehouse}
              />
              <Benefit
                title="Agent ore lavoratori"
                detail="Email ripetitive, reportistica, scheduling, follow-up — assorbiti a metà del costo persona/mese."
                line={savings.workerHours}
              />
            </ul>

            <CostFooter
              label="Canone Monolite"
              detail={
                outputs.monthlyStudioFee > 0
                  ? "Canone fisso + accesso studio"
                  : "Canone fisso mensile"
              }
              amount={fixedCost}
              valueAmount={savings.total}
              accent="var(--mono-sand)"
            />
          </SubCard>

          {/* Crescita potenziale */}
          <SubCard color="var(--positive)" tint="var(--positive-soft)">
            <p className="eyebrow" style={{ color: "var(--positive)" }}>
              Crescita potenziale
            </p>
            <p
              className="number leading-none text-[40px] md:text-[56px] mt-3"
              style={{ color: "var(--positive)" }}
            >
              +{fmtEur(uplift)}
            </p>
            <p className="mt-2 text-[12px] text-[var(--fg3)]">
              Modellato come {Math.round(UPLIFT_RATE * 100)}% di leva sul fatturato annuo, distribuita su 12 mesi.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] text-[var(--fg1)]">
              <Benefit
                title="Ore liberate, riallocate al business"
                detail="Le persone fanno commerciale, prodotto, qualità — non più data entry."
              />
              <Benefit
                title="Decisioni più rapide"
                detail="Contabilità industriale chiusa in tempo reale: marginalità per commessa visibile sempre."
              />
              <Benefit
                title="Marketplace di agenti specialistici"
                detail="Sviluppatori e studi pubblicano agenti per settore: scegli quelli che ti servono."
              />
            </ul>

            <CostFooter
              label="Token e marketplace"
              detail="Pay-per-use — paghi solo quando gli agenti lavorano"
              amount={cappedVariable}
              valueAmount={uplift}
              accent="var(--positive)"
            />
          </SubCard>
        </div>

        <div className="mt-10">
          <p className="eyebrow text-[10px]">Netto al mese</p>
          <p
            className={`number leading-none text-[40px] md:text-[56px] mt-2 tabular ${
              netPositive
                ? "text-[color:var(--positive)]"
                : "text-[color:var(--danger)]"
            }`}
          >
            {netPositive ? "+" : ""}
            {fmtEur(netValue)}
          </p>

          <div className="mt-6 space-y-4">
            <ValueVsCostBar
              label="Crescita potenziale"
              valueAmount={uplift}
              costAmount={cappedVariable}
              accent="var(--positive)"
              scale={Math.max(uplift, savings.total, 1)}
            />
            <ValueVsCostBar
              label="Risparmio garantito"
              valueAmount={savings.total}
              costAmount={fixedCost}
              accent="var(--mono-sand)"
              scale={Math.max(uplift, savings.total, 1)}
            />
          </div>
        </div>

        <DetailsRow inputs={inputs} netPositive={netPositive} />
      </Card>

      <Card
        id="why"
        eyebrow="02 · Perché costa così"
        eyebrowColor="var(--fg3)"
        summary={
          <span className="text-[14px] font-display font-normal tabular text-[var(--fg1)]">
            {fmtEur(displayedTotalCost)}
          </span>
        }
        open={openCard === "why"}
        onToggle={() => setOpenCard("why")}
      >
        <div className="divide-y divide-[color:var(--border-subtle)]">
          <PriceLine
            label="Canone Monolite"
            amount={outputs.monthlyCanone}
            formula={`Piano ${planLabel(plan)}`}
          />
          {outputs.monthlyStudioFee > 0 && (
            <PriceLine
              label="Accesso studio (clean data room)"
              amount={outputs.monthlyStudioFee}
              formula="Add-on per condividere il DB con il commercialista"
            />
          )}
          <PriceLine
            label="Token agenti (extra rispetto agli inclusi)"
            amount={
              capApplied && variableCost > 0
                ? cappedVariable * (outputs.monthlyTokenRevenue / variableCost)
                : outputs.monthlyTokenRevenue
            }
            formula={`Consumo stimato ${fmtNumberCompact(
              outputs.monthlyTokensConsumed
            )} token, ${fmtNumberCompact(outputs.monthlyTokensIncluded)} inclusi nel piano`}
          />
          <PriceLine
            label="Marketplace agenti di terzi"
            amount={
              capApplied && variableCost > 0
                ? cappedVariable * (outputs.monthlyMarketplaceFee / variableCost)
                : outputs.monthlyMarketplaceFee
            }
            formula={`5% sui ricavi degli agenti pubblicati da sviluppatori esterni · quota terzi ${inputs.thirdPartyAgentShare}%`}
          />
        </div>

        {capApplied && (
          <p className="mt-5 text-[12px] text-[var(--fg3)] leading-relaxed max-w-2xl">
            <span style={{ color: "var(--mono-spice)" }}>Il tetto del 30%.</span>{" "}
            I costi variabili sopra sono pro-rata fino al cap: Monolite non
            trattiene mai più del{" "}
            {Math.round(POTENTIAL_TAKE_RATE_CAP * 100)}% del valore potenziale che
            ti genera. Oltre quella soglia, i costi variabili sono azzerati.
          </p>
        )}
      </Card>
    </div>
  );
};

// ─────────────────────────── Card ───────────────────────────

interface CardProps {
  id: string;
  eyebrow: string;
  eyebrowColor: string;
  summary: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Card = ({
  id,
  eyebrow,
  eyebrowColor,
  summary,
  open,
  onToggle,
  children,
}: CardProps) => (
  <div
    className={`border transition-colors duration-300 ${
      open
        ? "border-[color:var(--border-strong)] bg-[color:var(--bg-surface)]"
        : "border-[color:var(--border-subtle)] bg-[color:var(--bg-sunken)] hover:border-[color:var(--border-default)]"
    }`}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`card-body-${id}`}
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
    >
      <p className="eyebrow" style={{ color: eyebrowColor }}>
        {eyebrow}
      </p>
      <div className="flex items-center gap-4">
        {!open && summary}
        <span
          aria-hidden
          className="text-[var(--fg-muted)] text-[10px] transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ▸
        </span>
      </div>
    </button>
    {open && (
      <div id={`card-body-${id}`} className="px-6 pb-7 pt-1">
        {children}
      </div>
    )}
  </div>
);

// ─────────────────────────── Helpers ───────────────────────────

const planLabel = (plan: CalcInputs["plan"]) =>
  plan === "enterprise"
    ? "Enterprise"
    : plan === "business"
      ? "Business"
      : plan === "studio"
        ? "Studio"
        : "Starter";

const fmtNumberCompact = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 0,
    useGrouping: "always",
  }).format(n);

interface ValueVsCostBarProps {
  label: string;
  valueAmount: number;
  costAmount: number;
  accent: string;
  scale: number;
}

/**
 * Una barra orizzontale dove la lunghezza piena = valore generato; un
 * overlay più scuro = quota che Monolite trattiene. Il netto resta nel
 * colore d'accento. Stessa scala tra le due barre, così le lunghezze
 * sono confrontabili.
 */
const ValueVsCostBar = ({
  label,
  valueAmount,
  costAmount,
  accent,
  scale,
}: ValueVsCostBarProps) => {
  const totalPct = scale > 0 ? (valueAmount / scale) * 100 : 0;
  const netAmount = Math.max(0, valueAmount - costAmount);
  const netPctOfValue = valueAmount > 0 ? (netAmount / valueAmount) * 100 : 0;
  const costPctOfValue = 100 - netPctOfValue;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2 text-[12px]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0"
            style={{ background: accent }}
          />
          <span className="text-[var(--fg3)]">{label}</span>
          <span className="font-mono tabular" style={{ color: accent }}>
            +{fmtEur(valueAmount)}
          </span>
        </div>
        <span
          className="font-mono tabular shrink-0 flex items-center gap-1.5"
          style={{ color: "var(--mono-spice)" }}
        >
          <span
            aria-hidden
            className="h-2 w-2"
            style={{ background: "var(--mono-spice)" }}
          />
          Monolite −{fmtEur(costAmount)}
        </span>
      </div>
      <div className="h-2 w-full">
        <div
          className="flex h-full overflow-hidden"
          style={{ width: `${totalPct}%` }}
        >
          <div
            className="h-full shrink-0"
            style={{
              width: `${netPctOfValue}%`,
              background: accent,
            }}
          />
          <div
            className="h-full shrink-0"
            style={{
              width: `${costPctOfValue}%`,
              background: "var(--mono-spice)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface SubCardProps {
  color: string;
  tint: string;
  children: React.ReactNode;
}

const SubCard = ({ color, tint, children }: SubCardProps) => (
  <div
    className="p-5 md:p-6"
    style={{
      background: tint,
      border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
    }}
  >
    {children}
  </div>
);

interface CostFooterProps {
  label: string;
  detail: string;
  amount: number;
  valueAmount: number;
  accent: string;
}

const CostFooter = ({
  label,
  detail,
  amount,
  valueAmount,
  accent,
}: CostFooterProps) => {
  const ratio = amount > 0 ? valueAmount / amount : 0;
  return (
    <div
      className="mt-6 pt-4"
      style={{
        borderTop: `1px solid color-mix(in srgb, ${accent} 18%, transparent)`,
      }}
    >
      <p className="eyebrow text-[10px] text-[var(--fg-muted)]">
        Quanto paghi a Monolite
      </p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="text-[13px] text-[var(--fg2)] leading-snug min-w-0">
          {label}
          <span className="block text-[11px] text-[var(--fg-muted)] mt-0.5">
            {detail}
          </span>
        </p>
        <p className="font-mono tabular text-[14px] text-[var(--fg1)] shrink-0">
          −{fmtEur(amount)}
        </p>
      </div>
      {ratio >= 1 && (
        <p className="mt-3 text-[11px] mono uppercase tracking-wider">
          <span style={{ color: accent }}>{ratio.toFixed(1)}×</span>
          <span className="text-[var(--fg-muted)]"> valore vs costo</span>
        </p>
      )}
    </div>
  );
};

interface BenefitProps {
  title: string;
  detail: string;
  /** Voce di saving (umano vs agent). Se presente e con saving > 0, mostra
   *  l'importo a destra e la riga "0.X persone/mese × €Y → agent €Z" sotto. */
  line?: SavingLine;
}

const Benefit = ({ title, detail, line }: BenefitProps) => {
  const showLine = line !== undefined && line.saving > 0;
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-[8px] h-px w-3 shrink-0 bg-[color:var(--fg-muted)]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[var(--fg1)] leading-snug">{title}</p>
          {showLine && (
            <p className="font-mono tabular text-[12px] text-[var(--fg2)] shrink-0">
              {fmtEur(line.saving)}
            </p>
          )}
        </div>
        <p className="text-[12px] text-[var(--fg3)] mt-0.5 leading-snug">
          {detail}
        </p>
        {showLine && (
          <p className="mt-1 font-mono tabular text-[10px] text-[var(--fg-muted)] tracking-wide">
            {line.personMonths.toFixed(2)} persone/mese × {fmtEur(line.personMonthlyCost)} ={" "}
            {fmtEur(line.humanCost)} → agent {fmtEur(line.agentCost)}
          </p>
        )}
      </div>
    </li>
  );
};

interface PriceLineProps {
  label: string;
  amount: number;
  formula: string;
}

const PriceLine = ({ label, amount, formula }: PriceLineProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--fg1)]">{label}</p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={`Come si calcola ${label}`}
            aria-expanded={open}
            className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[color:var(--border-default)] text-[10px] text-[var(--fg3)] hover:border-[color:var(--mono-spice)] hover:text-[color:var(--mono-spice)] transition-colors"
          >
            i
          </button>
        </div>
        <p className="num font-mono text-[14px] tabular text-[var(--fg1)] shrink-0">
          {fmtEur(amount)}
        </p>
      </div>
      {open && (
        <p className="mt-2 font-mono text-[11px] text-[var(--fg3)] tabular tracking-wide">
          {formula}
        </p>
      )}
    </div>
  );
};

interface DetailsRowProps {
  inputs: CalcInputs;
  netPositive: boolean;
}

const DetailsRow = ({ inputs, netPositive }: DetailsRowProps) => {
  const [open, setOpen] = useState(false);
  if (!netPositive) return null;
  // Mostriamo solo qualche numero di contesto: dipendenti + ore di contabilità.
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] mono uppercase tracking-wider text-[var(--fg-muted)] hover:text-[color:var(--mono-spice)] transition-colors"
      >
        {open ? "Nascondi dettagli" : "Dettagli"}
      </button>
      {open && (
        <p className="mt-3 text-[12px] text-[var(--fg3)] leading-relaxed max-w-md">
          Modellato su{" "}
          <span className="font-mono text-[var(--fg1)] tabular">
            {inputs.employees}
          </span>{" "}
          dipendenti,{" "}
          <span className="font-mono text-[var(--fg1)] tabular">
            {inputs.monthlyAccountingHours}h
          </span>
          /mese di contabilità,{" "}
          <span className="font-mono text-[var(--fg1)] tabular">
            {inputs.suppliersCount}
          </span>{" "}
          fornitori e{" "}
          <span className="font-mono text-[var(--fg1)] tabular">
            {inputs.monthlyCommesse}
          </span>{" "}
          commesse attive in media.
        </p>
      )}
    </div>
  );
};
