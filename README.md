# monolite-sales

Calcolatore di valore Monolite — il sales toolkit pubblico (PMI prospect) e
interno (commerciale Monolite) che traduce numeri concreti dell'azienda in
piano consigliato, risparmio mensile, costo agenti e — in vista commerciale
— il tetto di investimento che Monolite può mettere sul tavolo per chiudere
una partnership strategica.

## Cos'è Monolite

Monolite costruisce le **rotaie su cui camminano gli agenti AI nelle PMI
italiane**. Quello che ti consegna è un **ERP guidato da agenti**: prima
nota, CRM, fornitori (con listini sempre aggiornati), magazzino, commesse,
contabilità industriale. Tu colleghi le email aziendali (IMAP o OAuth 2.0),
il calendario, il drive (Google Drive, OneDrive, o cartelle caricate) — gli
agenti fanno il lavoro ripetitivo e quello non ripetitivo.

Lo studio commercialista o il revisore contabile accede al database della
tua azienda in modo sicuro, attraverso una **clean data room**. Tu
mantieni la proprietà dei dati: se vuoi uscire, ti portiamo via.

Su Monolite, **studi e sviluppatori** pubblicano agenti che girano sopra
le tue connessioni:

- Agenti costruiti da Monolite → 100% del compenso resta a Monolite.
- Agenti di terze parti (sviluppatori esterni) → Monolite trattiene il
  **5%** dei ricavi e l'autore paga un canone annuale come sviluppatore
  (modello marketplace tipo App Store).

## Il calcolatore

Due viste, stessa logica di prezzo:

- `/` — **Wizard PMI**. Quattro/cinque domande, restituisce piano
  consigliato, risparmio mensile stimato, costo agenti, ROI atteso.
- `/sales` — **Vista commerciale interna**. Per il team Monolite: stato
  della trattativa + investimento massimo che possiamo mettere su una
  partnership strategica per chiuderla con margine sano.

I numeri li sposti tu: tutto il modello vive in `src/lib/calc.ts`.

## Stack

Vite · React 18 · TypeScript · Tailwind 3 · shadcn/ui · React Router 6 ·
TanStack Query 5. Test: Vitest.

## Sviluppo

```bash
bun install      # oppure: npm install
bun run dev      # http://localhost:8080
bun run build
bun run test
```

## Design system

Tutto il design system Monolite (token CSS, font Reckless Standard, asset
brand, kit UI di riferimento, esempi email + investor deck) vive in
`design-system/`. Non importarlo a runtime — è la sorgente da cui derivano
i token in `src/index.css`. Quando aggiorni il DS centrale, riallinea i
token.

**Regole non-negoziabili (da `design-system/SKILL.md`):**

- Dark per default. Angoli quadrati (`--radius: 0`). Bordi, non ombre.
- Font: Reckless display + system sans. Mai prosa lunga in Reckless.
- Niente emoji. Niente gradienti decorativi. Niente glow.
- Un accent alla volta: blue = live, red = attenzione, amber = beta.

## Licenza

Privato. © Monolite.
