import { WizardShell, type StepDef } from "@/components/wizard/WizardShell";
import { ResultView } from "@/components/wizard/ResultView";
import { ClientTypeStep } from "@/components/wizard/steps/ClientTypeStep";
import { AdBudgetStep } from "@/components/wizard/steps/AdBudgetStep";
import { SalesStep } from "@/components/wizard/steps/SalesStep";
import { CrmStep } from "@/components/wizard/steps/CrmStep";

const steps: StepDef[] = [
  {
    key: "clientType",
    title: "What kind of partner are you?",
    subtitle: "Pick the one that fits — we tune everything else from here.",
    isValid: (i) => Boolean(i.clientType),
    render: (p) => <ClientTypeStep {...p} />,
  },
  {
    key: "adBudget",
    title: "How much do you spend on ads each month?",
    subtitle: "Your typical monthly advertising budget.",
    isValid: (i) => i.advBudget >= 0,
    render: (p) => <AdBudgetStep {...p} />,
  },
  {
    key: "sales",
    title: "How much do you make online each month?",
    subtitle: "Average online revenue you generate today.",
    isValid: (i) => i.attributedSales >= 0,
    render: (p) => <SalesStep {...p} />,
  },
  {
    key: "crm",
    title: "How big is your CRM?",
    subtitle: "Number of contacts you'd connect to MEUS.",
    isValid: (i) => i.crmContacts >= 0,
    render: (p) => <CrmStep {...p} />,
  },
];

const ClientWizard = () => (
  <WizardShell
    audience="client"
    steps={steps}
    initialOverrides={{ autoPlan: true }}
    renderResult={({ inputs, outputs }) => (
      <ResultView inputs={inputs} outputs={outputs} />
    )}
  />
);

export default ClientWizard;
