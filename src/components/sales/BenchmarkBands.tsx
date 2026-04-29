import {
  CalcInputs,
  canoneMonthly,
  compute,
  fmtEur,
  studioAccessMonthly,
  marketplaceFeeFromConsumption,
  TOKEN_RATE,
} from "@/lib/calc";

interface BenchmarkBandsProps {
  inputs: CalcInputs;
  outputs: ReturnType<typeof compute>;
}

/**
 * Plot per voce di prezzo — Canone / Studio / Token agenti / Marketplace.
 * Ogni riga è una barra che mostra dove sta questa trattativa rispetto a
 * una banda tipica (low / median / high) per quella voce.
 *
 * Le bande sono euristiche derivate dal modello stesso (così che siano
 * auto-coerenti tra trattative simili). Non sono benchmark esterni.
 */
export const BenchmarkBands = ({ inputs, outputs }: BenchmarkBandsProps) => {
  const subBand = subscriptionBand(inputs.mode);
  const studioBand = studioBandFor(inputs);
  const tokenBand = tokenBandFor(inputs, outputs);
  const marketplaceBand = marketplaceBandFor(inputs, outputs);

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <p className="eyebrow eyebrow-accent">Dove cade ogni voce</p>
        <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
          vs trattative tipiche
        </p>
      </div>

      <div className="card-mono divide-y divide-[color:var(--border-subtle)]">
        <BandRow
          label="Canone Monolite"
          value={outputs.monthlyCanone}
          band={subBand}
          note={`Piano ${planLabel(inputs.plan)} · ${modeLabel(inputs.mode)}`}
        />
        {outputs.monthlyStudioFee > 0 && (
          <BandRow
            label="Accesso studio"
            value={outputs.monthlyStudioFee}
            band={studioBand}
            note="Clean data room — add-on per il commercialista"
          />
        )}
        <BandRow
          label="Token agenti (extra)"
          value={outputs.monthlyTokenRevenue}
          band={tokenBand}
          note={`${fmtCompact(outputs.monthlyTokensConsumed)} consumati · ${fmtCompact(outputs.monthlyTokensIncluded)} inclusi`}
        />
        <BandRow
          label="Marketplace (5% terzi)"
          value={outputs.monthlyMarketplaceFee}
          band={marketplaceBand}
          note={`Quota terzi ${inputs.thirdPartyAgentShare}% del consumo agenti`}
        />
      </div>
    </section>
  );
};

interface Band {
  low: number;
  median: number;
  high: number;
}

function subscriptionBand(mode: CalcInputs["mode"]): Band {
  return {
    low: canoneMonthly("starter", mode),
    median: canoneMonthly("business", mode),
    high: canoneMonthly("enterprise", mode),
  };
}

function studioBandFor(inp: CalcInputs): Band {
  return {
    low: studioAccessMonthly("starter", inp.mode, true),
    median: studioAccessMonthly("business", inp.mode, true),
    high: studioAccessMonthly("enterprise", inp.mode, true),
  };
}

function tokenBandFor(inp: CalcInputs, out: ReturnType<typeof compute>): Band {
  const consumed = out.monthlyTokensConsumed;
  // Banda ipotetica: half / current / 2× del consumo, valutato a TOKEN_RATE
  // sopra gli inclusi del piano.
  const lowExtra = Math.max(0, consumed * 0.5 - out.monthlyTokensIncluded);
  const medExtra = Math.max(0, consumed - out.monthlyTokensIncluded);
  const hiExtra = Math.max(0, consumed * 2 - out.monthlyTokensIncluded);
  return {
    low: lowExtra * TOKEN_RATE,
    median: medExtra * TOKEN_RATE,
    high: hiExtra * TOKEN_RATE,
  };
}

function marketplaceBandFor(inp: CalcInputs, out: ReturnType<typeof compute>): Band {
  const consumed = out.monthlyTokensConsumed;
  const share = inp.thirdPartyAgentShare;
  return {
    low: marketplaceFeeFromConsumption(consumed * 0.5, share),
    median: marketplaceFeeFromConsumption(consumed, share),
    high: marketplaceFeeFromConsumption(consumed * 2, share),
  };
}

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
        <div className="relative h-1.5 bg-[color:var(--bg-active)]">
          <span
            aria-hidden
            className="absolute top-0 h-1.5 bg-[color:var(--border-strong)]"
            style={{
              left: pos(band.low),
              width: `calc(${pos(band.high)} - ${pos(band.low)})`,
            }}
          />
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 h-2 w-px"
            style={{
              left: pos(band.median),
              background: "var(--fg-muted)",
            }}
          />
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full ring-2 ring-[color:var(--bg-page)]"
            style={{
              left: `calc(${pos(value)} - 6px)`,
              background: "var(--mono-spice)",
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
  p === "enterprise"
    ? "Enterprise"
    : p === "business"
      ? "Business"
      : p === "studio"
        ? "Studio"
        : "Starter";
const modeLabel = (m: CalcInputs["mode"]) =>
  m === "strategic" ? "Strategico" : "Listino";

const fmtCompact = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
