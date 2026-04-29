import {
  advFeeRate,
  CalcInputs,
  canoneMonthly,
  compute,
  cpsRate,
  dcrMonthly,
  fmtEur,
} from "@/lib/calc";

interface BenchmarkBandsProps {
  inputs: CalcInputs;
  outputs: ReturnType<typeof compute>;
}

/**
 * Per-line price plot — Subscription / Adv fee / Sales fee / DCR — each line
 * shown as a horizontal bar marking where THIS deal sits within a typical
 * low / median / high band for that line. Mirrors Index Ventures' role-by-role
 * grant range table.
 *
 * The bands are heuristics derived from the pricing model itself (so they're
 * self-consistent across the same partner). They're not external benchmarks —
 * label them as "rule of thumb" in the UI.
 */
export const BenchmarkBands = ({ inputs, outputs }: BenchmarkBandsProps) => {
  const subBand = subscriptionBand(inputs.mode);
  const advBand = advFeeBand(inputs);
  const salesBand = salesFeeBand(inputs);
  const dcrBand = dcrFeeBand(inputs);

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <p className="eyebrow eyebrow-accent">Where each fee lands</p>
        <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
          vs. typical mid-market deals
        </p>
      </div>

      <div className="card-meus divide-y divide-[color:var(--border-subtle)]">
        <BandRow
          label="Subscription"
          value={outputs.monthlyCanone}
          band={subBand}
          note={`${planLabel(inputs.plan)} · ${modeLabel(inputs.mode)}`}
        />
        <BandRow
          label="Advertising fee"
          value={outputs.monthlyAdvFee}
          band={advBand}
          note={`${(advFeeRate(inputs.mode) * 100).toFixed(0)}% of ${fmtEur(inputs.advBudget)} ad spend`}
        />
        <BandRow
          label="Sales fee"
          value={outputs.monthlySalesFee}
          band={salesBand}
          note={`${(cpsRate(inputs.mode) * 100).toFixed(0)}% CPS + per-click on unattributed`}
        />
        {outputs.monthlyDcr > 0 && (
          <BandRow
            label="CRM data hygiene"
            value={outputs.monthlyDcr}
            band={dcrBand}
            note="Tier from CRM contact count"
          />
        )}
      </div>
    </section>
  );
};

// ─────────────────────────── Bands ───────────────────────────

interface Band {
  low: number;
  median: number;
  high: number;
}

function subscriptionBand(mode: CalcInputs["mode"]): Band {
  return {
    low: canoneMonthly("starter", mode),
    median: canoneMonthly("pro", mode),
    high: canoneMonthly("enterprise", mode),
  };
}

function advFeeBand(inp: CalcInputs): Band {
  // Anchor band: half / current / 2× of current adv spend, at this mode's rate
  const r = advFeeRate(inp.mode);
  return {
    low: inp.advBudget * 0.5 * r,
    median: inp.advBudget * r,
    high: inp.advBudget * 2 * r,
  };
}

function salesFeeBand(inp: CalcInputs): Band {
  // Anchor band: same scale as adv — half / current / 2× of attributed sales
  // sample; CPC contribution kept proportional via clicks.
  const cps = cpsRate(inp.mode);
  const attribFactor = inp.pctAttributed / 100;
  return {
    low: inp.attributedSales * 0.5 * attribFactor * cps,
    median: inp.attributedSales * attribFactor * cps,
    high: inp.attributedSales * 2 * attribFactor * cps,
  };
}

function dcrFeeBand(inp: CalcInputs): Band {
  return {
    low: dcrMonthly(10000, inp.mode),
    median: dcrMonthly(100000, inp.mode),
    high: dcrMonthly(1000000, inp.mode),
  };
}

// ─────────────────────────── Row view ───────────────────────────

interface BandRowProps {
  label: string;
  value: number;
  band: Band;
  note: string;
}

const BandRow = ({ label, value, band, note }: BandRowProps) => {
  const max = Math.max(band.high, value, 1);
  const pos = (n: number) => `${(Math.min(n, max) / max) * 100}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] items-center gap-x-8 gap-y-2 px-5 py-5">
      <div>
        <p className="text-sm text-[var(--fg1)]">{label}</p>
        <p className="text-[11px] text-[var(--fg3)] mt-1 font-mono tabular tracking-wide">
          {note}
        </p>
      </div>
      <p className="number text-[20px] text-[var(--fg1)] leading-none md:text-right">
        {fmtEur(value)}
      </p>
      <div className="md:pl-2">
        <div className="relative h-1.5 rounded-full bg-[color:var(--bg-active)]">
          {/* Typical band — low → high */}
          <span
            aria-hidden
            className="absolute top-0 h-1.5 rounded-full bg-[color:var(--border-strong)]"
            style={{
              left: pos(band.low),
              width: `calc(${pos(band.high)} - ${pos(band.low)})`,
            }}
          />
          {/* Median tick */}
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 h-2 w-px"
            style={{
              left: pos(band.median),
              background: "var(--fg-muted)",
            }}
          />
          {/* This deal — orange dot */}
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full ring-2 ring-[color:var(--bg-page)]"
            style={{
              left: `calc(${pos(value)} - 6px)`,
              background: "var(--meus-orange)",
            }}
          />
        </div>
        <div className="mt-2 flex justify-between gap-2 text-[11px] text-[var(--fg-muted)] font-mono tabular">
          <span>{fmtEur(band.low)}</span>
          <span>{fmtEur(band.median)}</span>
          <span>{fmtEur(band.high)}</span>
        </div>
      </div>
    </div>
  );
};

const planLabel = (p: CalcInputs["plan"]) =>
  p === "enterprise" ? "Enterprise" : p === "pro" ? "Pro" : "Starter";
const modeLabel = (m: CalcInputs["mode"]) =>
  m === "strategic" ? "Strategic" : "Listino";
