// Dashboard — 2026 register. Editorial chapter structure with mono numerals,
// asymmetric layout, oversized display numerals, restrained tonal palette,
// hairline rules instead of cards. The product reads like a quiet broadsheet.
const AGENTS = [
  { id:'a1', name:'Contabilità Q4',     vendor:'Acme Studio Legale', tasks:147, status:'live',   cost:'412', last:'2 min fa' },
  { id:'a2', name:'Buste paga · IT',    vendor:'Northwind HR',       tasks: 32, status:'live',   cost:'188', last:'6 min fa' },
  { id:'a3', name:'Inventario · Mag B', vendor:'Monolite Internal',  tasks: 81, status:'idle',   cost:'064', last:'2 ore fa' },
  { id:'a4', name:'Marketing brief',    vendor:'Studio Forma',       tasks: 12, status:'live',   cost:'092', last:'17 min fa' },
  { id:'a5', name:'Revisione bilancio', vendor:'Revisori SRL',       tasks:  4, status:'review', cost:'240', last:'1 ora fa' },
  { id:'a6', name:'Onboarding HR',      vendor:'Northwind HR',       tasks: 18, status:'idle',   cost:'048', last:'4 ore fa' },
];

const ACTIVITY = [
  { ts:'02m', agent:'Contabilità Q4',     msg:'Riconciliato 14 movimenti bancari · Banca Sella',           tag:'RECON' },
  { ts:'06m', agent:'Buste paga · IT',    msg:'Generata busta paga · Mario Rossi · Aprile 2026',           tag:'PAYROLL' },
  { ts:'17m', agent:'Inventario · Mag B', msg:'Soglia minima raggiunta su SKU 2204 — ordine suggerito',    tag:'ALERT' },
  { ts:'34m', agent:'Marketing brief',    msg:'Pubblicata bozza campagna Q2 — in attesa di approvazione',  tag:'DRAFT' },
  { ts:'01h', agent:'Revisione bilancio', msg:'Pronto report intermedio · 3 anomalie segnalate',           tag:'REPORT' },
];

// ── Section header — chapter numeral + serif title + hairline rule ────────
function Section({ num, title, sub, action, children }) {
  return (
    <section style={{marginBottom:80}}>
      <div style={{
        display:'flex', alignItems:'baseline', gap:24,
        paddingBottom:14, marginBottom:28,
        borderBottom:'1px solid var(--mono-border)',
      }}>
        <span style={{
          fontFamily:'var(--mono-font-mono)', fontSize:11,
          letterSpacing:'0.18em', color:'var(--mono-fg-muted)',
          fontVariantNumeric:'tabular-nums', flexShrink:0, paddingTop:4,
        }}>§ {num}</span>
        <div style={{flex:1, display:'flex', alignItems:'baseline', gap:18, flexWrap:'wrap'}}>
          <h3 style={{
            margin:0, fontFamily:'var(--mono-font-display)',
            fontSize:28, fontWeight:400, letterSpacing:'-0.022em',
            whiteSpace:'nowrap',
          }}>{title}</h3>
          {sub && <span style={{
            fontFamily:'var(--mono-font-display)', fontStyle:'italic',
            fontWeight:300, fontSize:18, color:'var(--mono-fg-muted)',
            letterSpacing:'-0.012em',
          }}>{sub}</span>}
        </div>
        {action && <span style={{
          fontFamily:'var(--mono-font-mono)', fontSize:11,
          letterSpacing:'0.12em', color:'var(--mono-fg-muted)',
          textTransform:'uppercase', cursor:'pointer', whiteSpace:'nowrap',
          transition:'color 200ms cubic-bezier(.2,.8,.2,1)', flexShrink:0,
        }}
        onMouseEnter={e=>e.currentTarget.style.color='var(--mono-fg)'}
        onMouseLeave={e=>e.currentTarget.style.color='var(--mono-fg-muted)'}>{action} ↗</span>}
      </div>
      {children}
    </section>
  );
}

// ── Stat — display numeral with mono unit, hairline divider ──────────────
function Stat({ label, value, sub, unit, delta }) {
  return (
    <div style={{padding:'4px 0', display:'flex', flexDirection:'column', gap:14}}>
      <div style={{
        fontFamily:'var(--mono-font-mono)', fontSize:10.5,
        letterSpacing:'0.16em', textTransform:'uppercase',
        color:'var(--mono-fg-muted)',
      }}>{label}</div>
      <div style={{display:'flex', alignItems:'baseline', gap:8, lineHeight:0.9}}>
        <span style={{
          fontFamily:'var(--mono-font-display)',
          fontSize:64, fontWeight:300, letterSpacing:'-0.035em',
          fontVariantNumeric:'tabular-nums', color:'var(--mono-fg)',
        }}>{value}</span>
        {unit && <span style={{
          fontFamily:'var(--mono-font-mono)', fontSize:13,
          color:'var(--mono-fg-muted)', letterSpacing:'0.02em',
        }}>{unit}</span>}
      </div>
      <div style={{display:'flex', gap:10, alignItems:'center', fontSize:11.5,
                   color:'var(--mono-fg-muted)', letterSpacing:'-0.005em'}}>
        {delta && <span style={{
          fontFamily:'var(--mono-font-mono)', color:'var(--mono-fg)',
          fontSize:11, letterSpacing:'0.02em',
        }}>{delta}</span>}
        <span>{sub}</span>
      </div>
    </div>
  );
}

// ── Status — ultra-thin pulse ring ───────────────────────────────────────
function StatusDot({ status }) {
  const map = {
    live:   { bg:'var(--mono-live)',     label:'Attivo',     dim:'live' },
    idle:   { bg:'var(--mono-fg-muted)', label:'In pausa',   dim:'idle' },
    review: { bg:'var(--mono-warn)',     label:'Da rivedere',dim:'review' },
  };
  const s = map[status];
  const isLive = status === 'live';
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:8,
                  fontFamily:'var(--mono-font-mono)', fontSize:10.5,
                  letterSpacing:'0.12em', textTransform:'uppercase',
                  color:isLive ? 'var(--mono-fg)' : 'var(--mono-fg-muted)'}}>
      <span style={{position:'relative', width:6, height:6}}>
        <span style={{
          position:'absolute', inset:0, borderRadius:999, background:s.bg,
        }}/>
        {isLive && <span style={{
          position:'absolute', inset:-2, borderRadius:999,
          border: `1px solid ${s.bg}`, opacity:0.5,
          animation:'monoPulseRing 2.6s cubic-bezier(.2,.8,.2,1) infinite',
        }}/>}
      </span>
      {s.label}
    </span>
  );
}

// ── Agent — borderless, hairline-divided row of mini-info ───────────────
function AgentCard({ a, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        textAlign:'left', cursor:'pointer',
        padding:'28px 4px 20px',
        background:'transparent',
        border:'0',
        borderTop:'1px solid var(--mono-border)',
        display:'grid',
        gridTemplateRows:'auto 1fr auto',
        gap:24,
        transition:'background 320ms cubic-bezier(.2,.8,.2,1), padding 320ms cubic-bezier(.2,.8,.2,1)',
        background: hover ? 'linear-gradient(180deg, var(--mono-secondary) 0%, transparent 100%)' : 'transparent',
        paddingLeft: hover ? 18 : 4,
        paddingRight: hover ? 18 : 4,
        position:'relative',
      }}>
      {/* Top row: status + last run */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <StatusDot status={a.status}/>
        <span style={{
          fontFamily:'var(--mono-font-mono)', fontSize:10,
          letterSpacing:'0.1em', color:'var(--mono-fg-muted)',
          fontVariantNumeric:'tabular-nums',
        }}>{a.last}</span>
      </div>

      {/* Title + vendor */}
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        <div style={{
          fontFamily:'var(--mono-font-display)',
          fontSize:26, fontWeight:400, lineHeight:1.05,
          letterSpacing:'-0.022em', color:'var(--mono-fg)',
          textWrap:'balance',
        }}>{a.name}</div>
        <div style={{fontSize:12.5, color:'var(--mono-fg-muted)',
                     letterSpacing:'-0.005em'}}>
          {a.vendor}
        </div>
      </div>

      {/* Bottom row: metrics with mono labels */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:0,
        fontVariantNumeric:'tabular-nums',
      }}>
        <div style={{display:'flex', flexDirection:'column', gap:4}}>
          <span style={{fontFamily:'var(--mono-font-mono)', fontSize:9.5,
                        letterSpacing:'0.14em', textTransform:'uppercase',
                        color:'var(--mono-fg-muted)'}}>Task</span>
          <span style={{fontFamily:'var(--mono-font-display)', fontSize:22,
                        fontWeight:400, letterSpacing:'-0.025em', lineHeight:1}}>
            {a.tasks}
          </span>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:4}}>
          <span style={{fontFamily:'var(--mono-font-mono)', fontSize:9.5,
                        letterSpacing:'0.14em', textTransform:'uppercase',
                        color:'var(--mono-fg-muted)'}}>Costo / mese</span>
          <span style={{fontFamily:'var(--mono-font-display)', fontSize:22,
                        fontWeight:400, letterSpacing:'-0.025em', lineHeight:1}}>
            €{a.cost}
          </span>
        </div>
      </div>

      {/* Hover affordance — caret */}
      <span style={{
        position:'absolute', top:28, right: hover ? 18 : 4,
        fontSize:14, color:'var(--mono-fg)',
        opacity: hover ? 1 : 0,
        transition:'opacity 220ms cubic-bezier(.2,.8,.2,1), right 320ms cubic-bezier(.2,.8,.2,1)',
        fontFamily:'var(--mono-font-mono)',
      }}>↗</span>
    </button>
  );
}

// ── Tag chip for activity rows ──────────────────────────────────────────
function ActivityTag({ tag }) {
  return (
    <span style={{
      fontFamily:'var(--mono-font-mono)', fontSize:9.5,
      letterSpacing:'0.14em', color:'var(--mono-fg-muted)',
      padding:'2px 0', minWidth:64, textAlign:'left',
    }}>{tag}</span>
  );
}

function Dashboard({ onAgentClick }) {
  const now = new Date();
  const stamp = now.toLocaleString('it-IT', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });

  return (
    <div style={{padding:'56px 56px 80px', maxWidth:1280, margin:'0 auto'}}>
      {/* ── Hero · masthead ──────────────────────────────────────────── */}
      <header style={{marginBottom:88}}>
        {/* Editorial dateline */}
        <div style={{
          display:'flex', alignItems:'center', gap:18, marginBottom:32,
          fontFamily:'var(--mono-font-mono)', fontSize:10.5,
          letterSpacing:'0.18em', textTransform:'uppercase',
          color:'var(--mono-fg-muted)',
        }}>
          <span>Vol. II · No. 04</span>
          <span style={{flex:1, height:1, background:'var(--mono-border)'}}/>
          <span>{stamp}</span>
        </div>

        {/* Greeting */}
        <h2 style={{
          margin:'0 0 18px',
          fontFamily:'var(--mono-font-display)',
          fontSize:72, fontWeight:300, letterSpacing:'-0.035em',
          lineHeight:0.98, color:'var(--mono-fg)',
          maxWidth:980, textWrap:'balance',
        }}>
          Buongiorno, Simone.
        </h2>
        <p style={{
          margin:0, maxWidth:560,
          fontFamily:'var(--mono-font-display)', fontStyle:'italic',
          fontSize:24, fontWeight:300, letterSpacing:'-0.012em',
          lineHeight:1.35, color:'var(--mono-fg-muted)',
        }}>
          Sette agenti hanno lavorato stanotte. <br/>
          Niente richiede la tua attenzione.
        </p>
      </header>

      {/* ── Stats — four columns, hairline-separated ─────────────────── */}
      <Section num="01" title="Sintesi" sub="il mese in numeri">
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(4, 1fr)',
          gap:0,
        }}>
          {[
            { l:'Agenti attivi',    v:'7',     u:null,   d:null,    s:'+2 questa settimana' },
            { l:'Task / mese',      v:'2,414', u:null,   d:'+18%',  s:'rispetto a marzo' },
            { l:'Costo / mese',     v:'1,044', u:'EUR',  d:null,    s:'commissione · €62' },
            { l:'Tempo risparmiato',v:'184',   u:'ORE',  d:null,    s:'vs. workflow manuali' },
          ].map((s,i) => (
            <div key={i} style={{
              borderLeft: i===0 ? 'none' : '1px solid var(--mono-border)',
              paddingLeft: i===0 ? 0 : 32,
              paddingRight: 32,
            }}>
              <Stat label={s.l} value={s.v} unit={s.u} delta={s.d} sub={s.s}/>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Agents — 3-col borderless grid ───────────────────────────── */}
      <Section num="02" title="Agenti" sub="attivi · sei in totale" action="Marketplace">
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(3, 1fr)',
          columnGap:32, rowGap:0,
          borderBottom:'1px solid var(--mono-border)',
        }}>
          {AGENTS.map(a => <AgentCard key={a.id} a={a} onClick={() => onAgentClick && onAgentClick(a)}/>)}
        </div>
      </Section>

      {/* ── Activity — single-line index ─────────────────────────────── */}
      <Section num="03" title="Indice attività" sub="ultime cinque" action="Audit log">
        <div>
          {ACTIVITY.map((row, i) => (
            <div key={i} style={{
              display:'grid',
              gridTemplateColumns:'56px 80px 240px 1fr 24px',
              alignItems:'baseline', gap:24,
              padding:'22px 4px',
              borderTop: i === 0 ? 'none' : '1px solid var(--mono-border)',
              transition:'padding 220ms cubic-bezier(.2,.8,.2,1), background 220ms',
              cursor:'pointer',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background='var(--mono-secondary)';
              e.currentTarget.style.paddingLeft='18px';
              e.currentTarget.style.paddingRight='18px';
              e.currentTarget.querySelector('[data-caret]').style.opacity='1';
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background='transparent';
              e.currentTarget.style.paddingLeft='4px';
              e.currentTarget.style.paddingRight='4px';
              e.currentTarget.querySelector('[data-caret]').style.opacity='0';
            }}>
              <span style={{
                fontFamily:'var(--mono-font-mono)', fontSize:11,
                color:'var(--mono-fg-muted)', fontVariantNumeric:'tabular-nums',
                letterSpacing:'0.04em',
              }}>{row.ts}</span>
              <ActivityTag tag={row.tag}/>
              <span style={{
                fontFamily:'var(--mono-font-display)',
                fontSize:18, fontWeight:400, letterSpacing:'-0.014em',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                color:'var(--mono-fg)',
              }}>
                {row.agent}
              </span>
              <span style={{color:'var(--mono-fg-muted)',
                            whiteSpace:'nowrap',
                            overflow:'hidden', textOverflow:'ellipsis',
                            letterSpacing:'-0.005em',
                            fontSize:14}}>{row.msg}</span>
              <span data-caret style={{
                fontFamily:'var(--mono-font-mono)', fontSize:13,
                color:'var(--mono-fg)', opacity:0,
                transition:'opacity 220ms cubic-bezier(.2,.8,.2,1)',
                textAlign:'right',
              }}>↗</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Colophon ──────────────────────────────────────────── */}
      <footer style={{
        marginTop:80, paddingTop:24,
        borderTop:'1px solid var(--mono-border)',
        display:'flex', justifyContent:'space-between',
        fontFamily:'var(--mono-font-mono)', fontSize:10,
        letterSpacing:'0.14em', textTransform:'uppercase',
        color:'var(--mono-fg-muted)',
      }}>
        <span>Monolite · Acme Studio Legale · Workspace</span>
        <span>Privacy · Audit · Status</span>
      </footer>
    </div>
  );
}

window.Dashboard = Dashboard;
