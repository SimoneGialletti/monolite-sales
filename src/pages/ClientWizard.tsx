import { WizardShell, type StepDef } from "@/components/wizard/WizardShell";
import { ResultView } from "@/components/wizard/ResultView";
import { ClientTypeStep } from "@/components/wizard/steps/ClientTypeStep";
import { CrmStep } from "@/components/wizard/steps/CrmStep";
import { SalesStep } from "@/components/wizard/steps/SalesStep";
import { AdBudgetStep } from "@/components/wizard/steps/AdBudgetStep";
import { BusinessProfileStep } from "@/components/wizard/steps/BusinessProfileStep";

const steps: StepDef[] = [
  {
    key: "clientType",
    title: "Chi sei?",
    subtitle: "Scegli il profilo che ti rappresenta — calibriamo tutto il resto.",
    isValid: (i) => Boolean(i.clientType),
    render: (p) => <ClientTypeStep {...p} />,
  },
  {
    key: "employees",
    title: "Quante persone lavorano in azienda?",
    subtitle: "Conta tutti i collaboratori interni, incluso il titolare.",
    isValid: (i) => i.employees >= 0,
    render: (p) => <CrmStep {...p} />,
  },
  {
    key: "annualRevenue",
    title: "Qual è il fatturato annuo?",
    subtitle: "L'ordine di grandezza dell'ultimo esercizio. Una stima va bene.",
    isValid: (i) => i.annualRevenue >= 0,
    render: (p) => <SalesStep {...p} />,
  },
  {
    key: "accountingHours",
    title: "Quante ore al mese spendi su prima nota e contabilità?",
    subtitle: "Tutto quello che oggi è data entry: prima nota, riconciliazioni, fatture passive, scontrini.",
    isValid: (i) => i.monthlyAccountingHours >= 0,
    render: (p) => <AdBudgetStep {...p} />,
  },
  {
    key: "businessProfile",
    title: "Tre numeri sulla tua operatività",
    subtitle: "Fornitori, commesse, accesso dello studio. Con questi chiudiamo la stima.",
    isValid: (i) => i.suppliersCount >= 0 && i.monthlyCommesse >= 0,
    render: (p) => <BusinessProfileStep {...p} />,
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
