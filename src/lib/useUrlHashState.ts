import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalcInputs,
  defaultInputs,
  type Mode,
  type Plan,
  type PriceTier,
} from "./calc";

/**
 * URL hash sync for the sales calculator (Index Ventures pattern).
 *
 * Inputs are encoded as compact key/value pairs in `window.location.hash`,
 * so reps can paste a URL into Slack and the receiver lands on the same
 * scenario. We use replaceState so the back button doesn't fill up with one
 * history entry per slider tick.
 */

const SHORT: Record<string, keyof CalcInputs> = {
  mode: "mode",
  plan: "plan",
  contract: "contractMonths",
  poc: "freePocMonths",
  crm: "crmContacts",
  adv: "advBudget",
  sales: "attributedSales",
  attrib: "pctAttributed",
  clicks: "clicks",
  tier: "priceTier",
  margin: "grossMargin",
  payback: "paybackMonths",
  floor: "marginFloor",
};

const LONG_TO_SHORT: Record<string, string> = Object.fromEntries(
  Object.entries(SHORT).map(([s, l]) => [l, s])
);

const isMode = (v: string): v is Mode =>
  v === "listino" || v === "strategic";
const isPlan = (v: string): v is Plan =>
  v === "starter" || v === "pro" || v === "enterprise";
const isTier = (v: string): v is PriceTier =>
  v === "low" || v === "mid" || v === "high";

function parseHash(hash: string, base: CalcInputs): CalcInputs {
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!cleaned) return base;
  const params = new URLSearchParams(cleaned);
  const out: CalcInputs = { ...base };

  for (const [shortKey, raw] of params.entries()) {
    const longKey = SHORT[shortKey];
    if (!longKey) continue;
    if (longKey === "mode" && isMode(raw)) {
      out.mode = raw;
    } else if (longKey === "plan" && isPlan(raw)) {
      out.plan = raw;
    } else if (longKey === "priceTier" && isTier(raw)) {
      out.priceTier = raw;
    } else if (longKey === "partnerName") {
      out.partnerName = raw;
    } else {
      const n = Number(raw);
      if (Number.isFinite(n)) {
        // numeric scalar — keys above are exhaustive for non-numeric ones
        (out as unknown as Record<string, number>)[longKey] = n;
      }
    }
  }
  return out;
}

function serializeHash(inputs: CalcInputs, base: CalcInputs): string {
  const params = new URLSearchParams();
  for (const [longKey, val] of Object.entries(inputs) as [
    keyof CalcInputs,
    CalcInputs[keyof CalcInputs],
  ][]) {
    const shortKey = LONG_TO_SHORT[longKey];
    if (!shortKey) continue;
    // skip values equal to defaults, keeps the URL short
    if (val === base[longKey]) continue;
    if (typeof val === "string" && val === "") continue;
    params.set(shortKey, String(val));
  }
  const s = params.toString();
  return s ? `#${s}` : "";
}

export function useUrlHashState(): [
  CalcInputs,
  (next: CalcInputs | ((prev: CalcInputs) => CalcInputs)) => void,
  <K extends keyof CalcInputs>(k: K, v: CalcInputs[K]) => void,
] {
  const [state, setState] = useState<CalcInputs>(() =>
    typeof window === "undefined"
      ? defaultInputs
      : parseHash(window.location.hash, defaultInputs)
  );

  // Suppress write-back when WE just wrote, so the hashchange listener
  // doesn't bounce us back to the parsed version of our own write.
  const writingRef = useRef(false);

  // Apply hash → state on browser navigation (back/forward, manual edit).
  useEffect(() => {
    const onHashChange = () => {
      if (writingRef.current) {
        writingRef.current = false;
        return;
      }
      setState((prev) => parseHash(window.location.hash, prev));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Apply state → hash whenever state changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = serializeHash(state, defaultInputs);
    const cur =
      window.location.hash === "" ? "" : window.location.hash;
    if (cur === next) return;
    writingRef.current = true;
    const url =
      window.location.pathname + window.location.search + (next || "");
    window.history.replaceState(null, "", url);
  }, [state]);

  const setOne = useCallback(
    <K extends keyof CalcInputs>(k: K, v: CalcInputs[K]) =>
      setState((prev) => ({ ...prev, [k]: v })),
    []
  );

  return [state, setState, setOne];
}
