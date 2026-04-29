import { compute, fmtEur, fmtPct } from "@/lib/calc";

interface CommitmentLedgerProps {
  outputs: ReturnType<typeof compute>;
}

/**
 * Output sales-only: i quattro numeri che governano cosa Monolite può
 * mettere sul tavolo per chiudere il deal. Ogni riga ha una banda
 * benchmark per leggere a colpo d'occhio se la trattativa è cauta,
 * normale o aggressiva.
 */
export const CommitmentLedger = ({ outputs }: CommitmentLedgerProps) => {
  const rows: LedgerRow[] = [
    {
      label: "Tetto investimento",
      value: fmtEur(outputs.maxInvestment),
      sub: `${fmtPct(outputs.pctOfRevenue, 1)} del contratto`,
      band: positionInBand(outputs.pctOfRevenue, [0.08, 0.18, 0.32]),
      bandHint: "Tipico 8 – 18% · Aggressivo 32%+",
    },
    {
      label: "Sconto canone max",
      value: fmtEur(outputs.maxFeeDiscount),
      sub: outputs.maxFeeDiscount >= outputs.maxInvestment ? "coperto dal margine" : "limitato dal margine minimo",
      band: outputs.maxInvestment > 0
        ? outputs.maxFeeDiscount / outputs.maxInvestment
        : 0,
      bandHint: "Quota dell'impegno totale che ci sta come sconto canone",
    },
    {
      label: "Credit agenti (token in regalo)",
      value: fmtEur(outputs.agentCreditGrant),
      sub: outputs.agentCreditGrant > 0 ? "credito iniziale agenti" : "nessun credito necessario",
      band: outputs.maxInvestment > 0
        ? outputs.agentCreditGrant / outputs.maxInvestment
        : 0,
      bandHint: "Quota dell'impegno totale spesa come credit agenti",
      invertHealth: true,
    },
    {
      label: "LTV : CAC",
      value: outputs.ltvCac > 0 ? `${outputs.ltvCac.toFixed(2)}×` : "—",
      sub:
        outputs.paybackAtMax > 0
          ? `payback ${outputs.paybackAtMax.toFixed(1)} mesi`
          : "payback —",
      band: clamp01((outputs.ltvCac - 1) / 5),
      bandHint: "Critico < 1.5× · Sano 3×+ · Eccellente 5×+",
    },
  ];

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <p className="eyebrow eyebrow-accent">Commitment Monolite</p>
        <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
          Solo vista interna
        </p>
      </div>

      <div className="card-mono divide-y divide-[color:var(--border-subtle)]">
        {rows.map((r) => (
          <LedgerRowView key={r.label} row={r} />
        ))}
      </div>
    </section>
  );
};

interface LedgerRow {
  label: string;
  value: string;
  sub: string;
  band: number;
  bandHint: string;
  invertHealth?: boolean;
}

const LedgerRowView = ({ row }: { row: LedgerRow }) => {
  const pct = clamp01(row.band) * 100;
  const healthy = row.invertHealth ? row.band <= 0.4 : row.band >= 0.4;
  const dotColor = healthy
    ? "var(--mono-spice)"
    : row.band < 0.2
      ? "var(--danger)"
      : "var(--warning)";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] items-baseline gap-x-8 gap-y-2 px-5 py-5">
      <div>
        <p className="text-sm text-[var(--fg1)]">{row.label}</p>
        <p className="text-[11px] text-[var(--fg3)] mt-1 font-mono tabular tracking-wide">
          {row.sub}
        </p>
      </div>
      <p className="number text-[24px] text-[var(--fg1)] leading-none md:text-right">
        {row.value}
      </p>
      <div className="md:pl-2">
        <div className="relative h-1.5 bg-[color:var(--bg-active)]">
          <span
            aria-hidden
            className="absolute top-0 h-1.5"
            style={{
              left: 0,
              width: `${pct}%`,
              background: dotColor,
              opacity: 0.9,
            }}
          />
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full ring-2 ring-[color:var(--bg-page)]"
            style={{
              left: `calc(${pct}% - 6px)`,
              background: dotColor,
            }}
          />
        </div>
        <p className="text-[11px] text-[var(--fg-muted)] mt-2 font-mono tabular tracking-wide">
          {row.bandHint}
        </p>
      </div>
    </div>
  );
};

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function positionInBand(v: number, stops: [number, number, number]): number {
  if (v <= 0) return 0;
  if (v < stops[0]) return (v / stops[0]) * 0.33;
  if (v < stops[1])
    return 0.33 + ((v - stops[0]) / (stops[1] - stops[0])) * 0.33;
  if (v < stops[2])
    return 0.66 + ((v - stops[1]) / (stops[2] - stops[1])) * 0.34;
  return 1;
}
