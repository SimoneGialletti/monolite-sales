import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { compute } from "@/lib/calc";
import { useUrlHashState } from "@/lib/useUrlHashState";
import { SegmentedControl } from "@/components/sales/SegmentedControl";
import { SalesInputsPanel } from "@/components/sales/SalesInputsPanel";
import { CommitmentLedger } from "@/components/sales/CommitmentLedger";
import { ScenariosColumns } from "@/components/sales/ScenariosColumns";
import { BenchmarkBands } from "@/components/sales/BenchmarkBands";
import { PaybackTimeline } from "@/components/sales/PaybackTimeline";

const SalesPage = () => {
  const [inputs, , set] = useUrlHashState();
  const outputs = useMemo(() => compute(inputs), [inputs]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo-mark-white.svg"
              alt="Monolite"
              className="h-8 w-8"
              draggable={false}
            />
            <div className="flex flex-col gap-1">
              <p className="eyebrow">Monolite · Vista commerciale</p>
              <h1 className="font-display text-[19px] md:text-[21px] font-normal tracking-tight leading-tight">
                Calcolatore di trattativa
              </h1>
            </div>
          </div>
          <ShareLinkButton />
        </div>
      </header>

      {/* ─────────────────────────── Hero ─────────────────────────── */}
      <section className="border-b border-[color:var(--border-subtle)]">
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <p className="eyebrow eyebrow-accent">Modello investimento Monolite</p>
          <h2 className="display mt-5 max-w-3xl">
            Quanto possiamo investire per chiudere questa trattativa?
          </h2>
          <p className="text-[var(--fg2)] text-lg mt-6 max-w-2xl leading-relaxed">
            Configura la trattativa a destra. Ti mostriamo il tetto di investimento,
            lo sconto canone disponibile e il payback — con ogni voce di prezzo
            confrontata con bande tipiche per PMI italiane.
          </p>
        </div>
      </section>

      {/* ─────────────────────────── Mode tabs (sticky) ─────────────────────────── */}
      <div className="sticky top-0 z-10 backdrop-blur bg-[color:var(--bg-page)]/85 border-b border-[color:var(--border-subtle)]">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <SegmentedControl
            label="Modalità prezzo"
            value={inputs.mode}
            onChange={(v) => set("mode", v)}
            options={[
              { value: "listino", label: "Listino" },
              { value: "strategic", label: "Strategico" },
            ]}
          />
          <SegmentedControl
            label="Piano"
            value={inputs.plan}
            onChange={(v) => set("plan", v)}
            options={[
              { value: "starter", label: "Starter" },
              { value: "business", label: "Business" },
              { value: "enterprise", label: "Enterprise" },
              { value: "studio", label: "Studio" },
            ]}
          />
          <SegmentedControl
            label="Contratto"
            value={inputs.contractMonths}
            onChange={(v) => set("contractMonths", v)}
            options={[
              { value: 12, label: "12 m" },
              { value: 24, label: "24 m" },
              { value: 36, label: "36 m" },
            ]}
          />
        </div>
      </div>

      {/* ─────────────────────────── Inputs ─────────────────────────── */}
      <section className="border-b border-[color:var(--border-subtle)]">
        <div className="max-w-[1100px] mx-auto px-6 py-12 md:py-16">
          <SalesInputsPanel inputs={inputs} set={set} />
        </div>
      </section>

      {/* ─────────────────────────── Outputs ─────────────────────────── */}
      <section>
        <div className="max-w-[1100px] mx-auto px-6 py-12 md:py-16 space-y-16">
          <CommitmentLedger outputs={outputs} />
          <ScenariosColumns inputs={inputs} />
          <BenchmarkBands inputs={inputs} outputs={outputs} />
          <PaybackTimeline inputs={inputs} outputs={outputs} />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6 py-5 text-[11px] text-text-muted text-center font-mono tracking-[0.08em] uppercase">
          Monolite · Solo vista interna · Stime indicative
        </div>
      </footer>
    </main>
  );
};

// ─────────────────────────── Share button ───────────────────────────

const ShareLinkButton = () => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // best-effort; ignore (alcuni browser bloccano la clipboard fuori da HTTPS)
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="btn-ghost text-[12px]"
      aria-label="Copia link condivisibile"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copiato" : "Condividi"}
    </button>
  );
};

export default SalesPage;
