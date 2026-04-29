import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalcInputs,
  defaultInputs,
  type Mode,
  type Plan,
  type PriceTier,
  type ClientType,
} from "./calc";

/**
 * Sincronizzazione hash → stato per il calcolatore Monolite.
 *
 * Gli input vengono codificati come coppie chiave/valore compatte in
 * `window.location.hash`, così che un commerciale Monolite possa incollare
 * un URL in chat e l'altro lato apra esattamente lo stesso scenario.
 * Usiamo replaceState così che il pulsante "Indietro" non si riempia di una
 * voce per ogni movimento di slider.
 */

const SHORT: Record<string, keyof CalcInputs> = {
  mode: "mode",
  plan: "plan",
  client: "clientType",
  contract: "contractMonths",
  poc: "freePocMonths",
  emp: "employees",
  rev: "annualRevenue",
  hours: "monthlyAccountingHours",
  sup: "suppliersCount",
  com: "monthlyCommesse",
  ord: "monthlyOrders",
  erp: "currentErpMonthlyCost",
  rate: "avgHourlyRate",
  fl: "monthlyFullyLoadedCost",
  tier: "priceTier",
  third: "thirdPartyAgentShare",
  studio: "includeStudio",
  margin: "grossMargin",
  payback: "paybackMonths",
  floor: "marginFloor",
  name: "partnerName",
};

const LONG_TO_SHORT: Record<string, string> = Object.fromEntries(
  Object.entries(SHORT).map(([s, l]) => [l, s])
);

const isMode = (v: string): v is Mode =>
  v === "listino" || v === "strategic";
const isPlan = (v: string): v is Plan =>
  v === "starter" || v === "business" || v === "enterprise" || v === "studio";
const isTier = (v: string): v is PriceTier =>
  v === "low" || v === "mid" || v === "high";
const isClient = (v: string): v is ClientType =>
  v === "pmi-small" ||
  v === "pmi-medium" ||
  v === "pmi-large" ||
  v === "studio" ||
  v === "developer";

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
    } else if (longKey === "clientType" && isClient(raw)) {
      out.clientType = raw;
    } else if (longKey === "partnerName") {
      out.partnerName = raw;
    } else if (longKey === "includeStudio") {
      out.includeStudio = raw === "1" || raw === "true";
    } else {
      const n = Number(raw);
      if (Number.isFinite(n)) {
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
    if (val === base[longKey]) continue;
    if (typeof val === "string" && val === "") continue;
    if (typeof val === "boolean") {
      params.set(shortKey, val ? "1" : "0");
      continue;
    }
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

  const writingRef = useRef(false);

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
