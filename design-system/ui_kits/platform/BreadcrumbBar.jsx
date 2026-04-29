// BreadcrumbBar — refined. 64px, generous gutters, Reckless serif page label.
function BreadcrumbBar({ company, page, onNew, theme, onTheme }) {
  return (
    <header style={{
      height: 64, flexShrink: 0,
      borderBottom: '1px solid var(--mono-border)',
      background: 'var(--mono-bg)',
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 16,
      position:'relative', zIndex: 5,
    }}>
      <div style={{display:'flex', alignItems:'baseline', gap:12, minWidth:0}}>
        <span style={{
          fontSize:11.5, color:'var(--mono-fg-muted)',
          letterSpacing:'0.04em', textTransform:'uppercase', fontWeight:500,
        }}>{company}</span>
        <span style={{color:'var(--mono-fg-muted)', opacity:0.4}}>/</span>
        <h1 style={{
          margin:0,
          fontFamily:'var(--mono-font-display)',
          fontWeight: 400, fontSize: 22, letterSpacing:'-0.018em',
          color:'var(--mono-fg)', lineHeight:1,
        }}>{page}</h1>
      </div>

      <div style={{flex:1}}/>

      <button title="Filters" style={iconBtn}>
        <Icon.Layers size={15}/>
      </button>
      <button title={theme==='dark' ? 'Light' : 'Dark'} onClick={onTheme} style={iconBtn}>
        {theme==='dark' ? <Icon.Sun size={15}/> : <Icon.Moon size={15}/>}
      </button>

      <div style={{width:1, height:20, background:'var(--mono-border)', margin:'0 4px'}}/>

      <button onClick={onNew} className="primary-btn"
        style={{
          height:34, padding:'0 14px 0 12px',
          display:'inline-flex', alignItems:'center', gap:7,
          background:'var(--mono-primary)', color:'var(--mono-primary-fg)',
          border:'none', borderRadius:8, cursor:'pointer',
          fontSize:13, fontWeight:500, letterSpacing:'-0.005em',
          whiteSpace:'nowrap',
          transition:'transform 200ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms',
          boxShadow:'0 1px 0 0 rgba(255,255,255,0.04), 0 6px 18px -8px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
        onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
        <Icon.SquarePen size={14}/> New issue
        <kbd style={{
          marginLeft:4, padding:'1px 5px',
          background:'rgba(0,0,0,0.12)', borderRadius:4,
          fontSize:10.5, fontFamily:'var(--mono-font-mono)',
          color:'inherit', opacity:0.7,
        }}>C</kbd>
      </button>

      <div style={{
        width:30, height:30, borderRadius:999,
        background:'#a48a6e', color:'#fff',
        display:'grid', placeItems:'center',
        fontFamily:'var(--mono-font-display)',
        fontWeight:400, fontSize:12, letterSpacing:'-0.005em',
        marginLeft:4,
        boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.08)',
      }}>SG</div>
    </header>
  );
}

const iconBtn = {
  width:34, height:34, padding:0,
  display:'grid', placeItems:'center',
  background:'transparent', border:'none',
  borderRadius:8, color:'var(--mono-fg-muted)', cursor:'pointer',
  transition:'background 180ms, color 180ms',
};

window.BreadcrumbBar = BreadcrumbBar;
