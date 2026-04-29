import { describe, it, expect } from "vitest";
import {
  AGENT_COST_RATIO,
  defaultInputs,
  estimateMonthlyCostReduction,
} from "@/lib/calc";

describe("estimateMonthlyCostReduction — paradigma agent = 50% del costo umano", () => {
  it("agent costa esattamente AGENT_COST_RATIO × umano per ogni voce", () => {
    const r = estimateMonthlyCostReduction(defaultInputs);
    for (const line of [r.accounting, r.erp, r.suppliers, r.commesse, r.studio]) {
      expect(line.agentCost).toBeCloseTo(line.humanCost * AGENT_COST_RATIO, 6);
      expect(line.saving).toBeCloseTo(line.humanCost - line.agentCost, 6);
    }
  });

  it("AGENT_COST_RATIO è 0.5 (50% in meno dell'umano)", () => {
    expect(AGENT_COST_RATIO).toBe(0.5);
  });

  it("total è la somma dei saving delle voci", () => {
    const r = estimateMonthlyCostReduction(defaultInputs);
    const sum =
      r.accounting.saving +
      r.erp.saving +
      r.suppliers.saving +
      r.commesse.saving +
      r.studio.saving;
    expect(r.total).toBeCloseTo(sum, 6);
  });

  it("studio è azzerato quando includeStudio è false", () => {
    const r = estimateMonthlyCostReduction({ ...defaultInputs, includeStudio: false });
    expect(r.studio.humanCost).toBe(0);
    expect(r.studio.agentCost).toBe(0);
    expect(r.studio.saving).toBe(0);
  });
});
