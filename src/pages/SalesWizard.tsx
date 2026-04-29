import { WizardShell, type StepDef } from "@/components/wizard/WizardShell";
import { ResultView } from "@/components/wizard/ResultView";
import { SalesPanel } from "@/components/wizard/SalesPanel";
import { PlanStep } from "@/components/wizard/steps/PlanStep";
import { AdBudgetStep } from "@/components/wizard/steps/AdBudgetStep";
import { SalesStep } from "@/components/wizard/steps/SalesStep";
import { CrmStep } from "@/components/wizard/steps/CrmStep";
import { ContractStep } from "@/components/wizard/steps/ContractStep";

const steps: StepDef[] = [
  {
    key: "plan",
    title: "Which plan are you scoping?",
    subtitle: "Pick the tier you'd quote the partner.",
    isValid: (i) => Boolean(i.plan),
    render: (p) => <PlanStep {...p} />,
  },
  {
    key: "adBudget",
    title: "Partner's monthly ad budget",
    isValid: (i) => i.advBudget >= 0,
    render: (p) => <AdBudgetStep {...p} />,
  },
  {
    key: "sales",
    title: "Partner's monthly online sales",
    isValid: (i) => i.attributedSales >= 0,
    render: (p) => <SalesStep {...p} />,
  },
  {
    key: "crm",
    title: "Partner's CRM size",
    isValid: (i) => i.crmContacts >= 0,
    render: (p) => <CrmStep {...p} />,
  },
  {
    key: "contract",
    title: "Contract length",
    isValid: (i) => [12, 24, 36].includes(i.contractMonths),
    render: (p) => <ContractStep {...p} />,
  },
];

const SalesWizard = () => (
  <WizardShell
    audience="sales"
    steps={steps}
    renderResult={({ inputs, outputs }) => (
      <>
        <ResultView inputs={inputs} outputs={outputs} />
        <SalesPanel outputs={outputs} />
      </>
    )}
  />
);

export default SalesWizard;
