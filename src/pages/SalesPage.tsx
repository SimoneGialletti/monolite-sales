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
              alt="MEUS"
              className="h-8 w-8"
              draggable={false}
            />
            <div className="flex flex-col gap-1">
              <p className="eyebrow">MEUS · Sales view</p>
              <h1 className="font-display text-[19px] md:text-[21px] font-medium tracking-tight leading-tight">
                Partnership Calculator
              </h1>
            </div>
          </div>
          <ShareLinkButton />
        </div>
      </header>

      {/* ─────────────────────────── Hero ─────────────────────────── */}
      <section className="border-b border-[color:var(--border-subtle)]">
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <p className="eyebrow eyebrow-accent">The MEUS partnership-investment model</p>
          <h2 className="display mt-5 max-w-3xl">
            How much can MEUS invest to win this partnership?
          </h2>
          <p className="text-[var(--fg2)] text-lg mt-6 max-w-2xl leading-relaxed">
            Set the deal shape on the right, then read the upfront commitment,
            discount headroom and payback we can offer — with every fee line
            benchmarked against typical mid-market deals.
          </p>
        </div>
      </section>

      {/* ─────────────────────────── Mode tabs (sticky) ─────────────────────────── */}
      <div className="sticky top-0 z-10 backdrop-blur bg-[color:var(--bg-page)]/85 border-b border-[color:var(--border-subtle)]">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <SegmentedControl
            label="Pricing mode"
            value={inputs.mode}
            onChange={(v) => set("mode", v)}
            options={[
              { value: "listino", label: "Listino" },
              { value: "strategic", label: "Strategic" },
            ]}
          />
          <SegmentedControl
            label="Plan"
            value={inputs.plan}
            onChange={(v) => set("plan", v)}
            options={[
              { value: "starter", label: "Starter" },
              { value: "pro", label: "Pro" },
              { value: "enterprise", label: "Enterprise" },
            ]}
          />
          <SegmentedControl
            label="Contract"
            value={inputs.contractMonths}
            onChange={(v) => set("contractMonths", v)}
            options={[
              { value: 12, label: "12 mo" },
              { value: 24, label: "24 mo" },
              { value: 36, label: "36 mo" },
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
          MEUS S.r.l. Innovativa · Sales-only · Estimates
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
      // best-effort; ignore (some browsers block clipboard outside HTTPS)
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="btn-ghost text-[12px]"
      aria-label="Copy shareable link"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Share"}
    </button>
  );
};

export default SalesPage;
