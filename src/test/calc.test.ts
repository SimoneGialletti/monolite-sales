import { describe, it, expect } from "vitest";
import {
  AGENT_COST_RATIO,
  defaultInputs,
  estimateMonthlyCostReduction,
  HOURS_PER_PERSON_MONTH,
  SUPPLIER_OPS_HOURS_PER_SUPPLIER,
  WAREHOUSE_OPS_HOURS_PER_ORDER,
  WORKER_REPETITIVE_HOURS_PER_EMPLOYEE,
} from "@/lib/calc";

describe("estimateMonthlyCostReduction — paradigma agent = 50% del costo persona/mese", () => {
  it("AGENT_COST_RATIO è 0.5 (l'agent costa metà del costo umano)", () => {
    expect(AGENT_COST_RATIO).toBe(0.5);
  });

  it("agent costa esattamente AGENT_COST_RATIO × umano per ogni voce", () => {
    const r = estimateMonthlyCostReduction(defaultInputs);
    for (const line of [r.primaNota, r.suppliers, r.warehouse, r.workerHours]) {
      expect(line.agentCost).toBeCloseTo(line.humanCost * AGENT_COST_RATIO, 6);
      expect(line.saving).toBeCloseTo(line.humanCost - line.agentCost, 6);
      expect(line.humanCost).toBeCloseTo(line.personMonths * line.personMonthlyCost, 6);
      expect(line.personMonthlyCost).toBe(defaultInputs.monthlyFullyLoadedCost);
    }
  });

  it("personMonths riflette le ore mensili dell'attività diviso 168", () => {
    const r = estimateMonthlyCostReduction(defaultInputs);
    expect(r.primaNota.personMonths).toBeCloseTo(
      defaultInputs.monthlyAccountingHours / HOURS_PER_PERSON_MONTH,
      6
    );
    expect(r.suppliers.personMonths).toBeCloseTo(
      (defaultInputs.suppliersCount * SUPPLIER_OPS_HOURS_PER_SUPPLIER) / HOURS_PER_PERSON_MONTH,
      6
    );
    expect(r.warehouse.personMonths).toBeCloseTo(
      (defaultInputs.monthlyOrders * WAREHOUSE_OPS_HOURS_PER_ORDER) / HOURS_PER_PERSON_MONTH,
      6
    );
    expect(r.workerHours.personMonths).toBeCloseTo(
      (defaultInputs.employees * WORKER_REPETITIVE_HOURS_PER_EMPLOYEE) / HOURS_PER_PERSON_MONTH,
      6
    );
  });

  it("total è la somma dei saving delle 4 voci", () => {
    const r = estimateMonthlyCostReduction(defaultInputs);
    const sum =
      r.primaNota.saving + r.suppliers.saving + r.warehouse.saving + r.workerHours.saving;
    expect(r.total).toBeCloseTo(sum, 6);
  });
});
