import { compute, fmtEur, fmtPct } from "@/lib/calc";

interface CommitmentLedgerProps {
  outputs: ReturnType<typeof compute>;
}

/**
 * Sales-only output: the four numbers that govern what MEUS can commit to win
 * the deal. Each row carries a benchmark band so reps can see at-a-glance
 * whether this deal is cautious, normal, or aggressive vs. typical mid-market
 * partnerships.
 */
export const CommitmentLedger = ({ outputs }: CommitmentLedgerProps) => {
  const rows: LedgerRow[] = [
    {
      label: "Max upfront investment",
      value: fmtEur(outputs.maxInvestment),
      sub: `${fmtPct(outputs.pctOfRevenue, 1)} of contract`,
      // Industry benchmark — % of contract revenue MEUS can put in upfront
      band: positionInBand(outputs.pctOfRevenue, [0.08, 0.18, 0.32]),
      bandHint: "Typical 8 – 18% · Aggressive 32%+",
    },
    {
      label: "Max fee discount",
      value: fmtEur(outputs.maxFeeDiscount),
      sub: outputs.maxFeeDiscount >= outputs.maxInvestment ? "fully covered by margin" : "capped by margin floor",
      band: outputs.maxInvestment > 0
        ? outputs.maxFeeDiscount / outputs.maxInvestment
        : 0,
      bandHint: "Share of upfront commitment that fits as a fee discount",
    },
    {
      label: "Media barter",
      value: fmtEur(outputs.mediaBarter),
      sub: outputs.mediaBarter > 0 ? "barter top-up needed" : "no barter needed",
      band: outputs.maxInvestment > 0
        ? outputs.mediaBarter / outputs.maxInvestment
        : 0,
      bandHint: "Share of upfront commitment that must be paid in media",
      // For barter: low share = good. Invert the band so visually the bar
      // sitting near the left = healthy.
      invertHealth: true,
    },
    {
      label: "LTV : CAC",
      value: outputs.ltvCac > 0 ? `${outputs.ltvCac.toFixed(2)}×` : "—",
      sub:
        outputs.paybackAtMax > 0
          ? `payback ${outputs.paybackAtMax.toFixed(1)} mo`
          : "payback —",
      // 1.5x bad, 3x ok, 5x great — clamp display to 0..1 over [1, 6]
      band: clamp01((outputs.ltvCac - 1) / 5),
      bandHint: "Bad < 1.5× · Healthy 3×+ · Excellent 5×+",
    },
  ];

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <p className="eyebrow eyebrow-accent">MEUS commitment ledger</p>
        <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
          Sales-only
        </p>
      </div>

      <div className="card-meus divide-y divide-[color:var(--border-subtle)]">
        {rows.map((r) => (
          <LedgerRowView key={r.label} row={r} />
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────── Internals ───────────────────────────

interface LedgerRow {
  label: string;
  value: string;
  sub: string;
  band: number; // 0..1 position in the band
  bandHint: string;
  invertHealth?: boolean;
}

const LedgerRowView = ({ row }: { row: LedgerRow }) => {
  const pct = clamp01(row.band) * 100;
  const healthy = row.invertHealth ? row.band <= 0.4 : row.band >= 0.4;
  const dotColor = healthy
    ? "var(--meus-orange)"
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
        <div className="relative h-1.5 rounded-full bg-[color:var(--bg-active)]">
          <span
            aria-hidden
            className="absolute top-0 h-1.5 rounded-full"
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

/**
 * Position a value within a 3-stop band (typical-low, typical-high, aggressive).
 * Returns a 0..1 value where:
 *   v ≤ stops[0]      → 0..0.33
 *   stops[0]…stops[1] → 0.33..0.66 (typical zone)
 *   stops[1]…stops[2] → 0.66..1.0 (aggressive)
 */
function positionInBand(v: number, stops: [number, number, number]): number {
  if (v <= 0) return 0;
  if (v < stops[0]) return (v / stops[0]) * 0.33;
  if (v < stops[1])
    return 0.33 + ((v - stops[0]) / (stops[1] - stops[0])) * 0.33;
  if (v < stops[2])
    return 0.66 + ((v - stops[1]) / (stops[2] - stops[1])) * 0.34;
  return 1;
}
