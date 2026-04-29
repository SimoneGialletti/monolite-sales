// CompanyRail — refined. Wider rail, generous spacing, monogram tiles
// with subtle hover lift, soft active indicator on the left edge.
const COMPANIES = [
  { id: 'mon', name: 'Monolite',           mark: 'M',  tone: '#0e0e10' },
  { id: 'acm', name: 'Acme Studio Legale', mark: 'AS', tone: '#a48a6e' },
  { id: 'rev', name: 'Revisori SRL',       mark: 'RS', tone: '#7a5a48' },
  { id: 'hr',  name: 'Northwind HR',       mark: 'NH', tone: '#4a4f55' },
  { id: 'fr',  name: 'Studio Forma',       mark: 'SF', tone: '#5a4a3c' },
];

function Tile({ active, label, mark, tone, onClick, dashed, kid }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position:'relative',
        width: 44, height: 44,
        padding: 0, border: 'none', cursor: 'pointer',
        borderRadius: 12,
        background: dashed ? 'transparent'
          : (active ? 'var(--mono-fg)' : (tone || 'var(--mono-surface)')),
        color: active ? 'var(--mono-bg)' : (tone ? '#fff' : 'var(--mono-fg)'),
        boxShadow: dashed
          ? 'inset 0 0 0 1px var(--mono-border)'
          : (active
              ? '0 1px 0 0 rgba(255,255,255,0.06), 0 8px 24px -10px rgba(0,0,0,0.6)'
              : 'inset 0 0 0 1px rgba(255,255,255,0.04)'),
        display:'grid', placeItems:'center',
        fontFamily:'var(--mono-font-display)',
        fontWeight: 400, fontSize: 15, letterSpacing:'-0.01em',
        transform: hover && !active ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'transform 280ms cubic-bezier(.2,.8,.2,1), box-shadow 280ms cubic-bezier(.2,.8,.2,1), background 220ms ease',
      }}>
      {/* left active rail */}
      {active && <span style={{
        position:'absolute', left:-14, top:'50%', transform:'translateY(-50%)',
        width: 3, height: 18,
        background:'var(--mono-fg)', borderRadius: 2,
      }}/>}
      {kid || mark}
      {/* heartbeat dot */}
      {active && <span style={{
        position:'absolute', top:5, right:5,
        width:6, height:6, borderRadius:999,
        background:'var(--mono-live)',
        boxShadow:'0 0 0 3px var(--mono-surface-2), 0 0 12px 0 var(--mono-live)',
      }}/>}
    </button>
  );
}

function CompanyRail({ activeId, onPick, onAdd }) {
  return (
    <aside style={{
      width: 72, flexShrink: 0,
      background: 'var(--mono-surface-2)',
      borderRight: '1px solid var(--mono-border)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '20px 0 16px', gap: 10,
      position:'relative',
    }}>
      {/* Brand mark — never the active tile */}
      <div title="Monolite"
        style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'var(--mono-fg)',
          color: 'var(--mono-bg)',
          display:'grid', placeItems:'center',
          fontFamily:'var(--mono-font-display)', fontWeight: 500, fontSize: 14,
          letterSpacing:'-0.02em', marginBottom: 6,
        }}>M</div>

      <div style={{height:1, width:18, background:'var(--mono-border)', margin:'0 0 8px', opacity:0.6}}/>

      {COMPANIES.map(c => (
        <Tile key={c.id}
          active={c.id === activeId}
          label={c.name} mark={c.mark} tone={c.tone}
          onClick={() => onPick(c.id)} />
      ))}

      <Tile dashed onClick={onAdd} label="Add workspace"
        kid={<Icon.Plus size={14} />} />

      <div style={{flex:1}}/>

      <button title="Settings"
        style={{
          width: 36, height: 36, borderRadius: 10,
          border:'none', background:'transparent',
          color:'var(--mono-fg-muted)', cursor:'pointer',
          display:'grid', placeItems:'center',
          transition:'color 200ms ease, background 200ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.color='var(--mono-fg)'; e.currentTarget.style.background='var(--mono-secondary)'; }}
        onMouseLeave={e => { e.currentTarget.style.color='var(--mono-fg-muted)'; e.currentTarget.style.background='transparent'; }}>
        <Icon.Settings size={15}/>
      </button>
    </aside>
  );
}

window.CompanyRail = CompanyRail;
window.COMPANIES = COMPANIES;
