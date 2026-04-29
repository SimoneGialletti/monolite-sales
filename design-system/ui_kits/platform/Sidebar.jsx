// Sidebar — refined. 256px, generous spacing, refined nav rows with
// keyline indicator, hairline section separators, refined search.
function NavRow({ icon: I, label, badge, active, muted, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        position:'relative',
        display:'flex', alignItems:'center', gap:11,
        width:'100%', padding:'0 14px', height:34,
        border:'none', textAlign:'left', cursor:'pointer',
        background: active ? 'var(--mono-accent)'
                    : (hover ? 'var(--mono-secondary)' : 'transparent'),
        color: muted ? 'var(--mono-fg-muted)' : 'var(--mono-fg)',
        borderRadius: 8,
        fontSize: 13.5, fontWeight: active ? 500 : 400,
        letterSpacing:'-0.005em',
        transition:'background 180ms ease, color 180ms ease',
      }}>
      {/* active keyline */}
      {active && <span style={{
        position:'absolute', left:-8, top:9, bottom:9, width:2,
        background:'var(--mono-fg)', borderRadius:2,
      }}/>}
      <I size={15} />
      <span style={{flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{label}</span>
      {badge != null && (
        <span style={{
          minWidth:18, height:18, padding:'0 6px',
          borderRadius:999, fontSize:10.5, fontWeight:500,
          background: active ? 'var(--mono-fg)' : 'var(--mono-secondary)',
          color: active ? 'var(--mono-bg)' : 'var(--mono-fg-muted)',
          display:'grid', placeItems:'center',
          fontVariantNumeric:'tabular-nums',
          letterSpacing: 0,
        }}>{badge}</span>
      )}
    </button>
  );
}

function SidebarSection({ title, children, action }) {
  return (
    <div style={{padding:'10px 8px 2px'}}>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'8px 14px 6px',
        fontSize:10.5, fontWeight:500, letterSpacing:'0.14em',
        textTransform:'uppercase', color:'var(--mono-fg-muted)',
      }}>
        <span>{title}</span>
        {action && <button style={{
          border:'none', background:'transparent', color:'var(--mono-fg-muted)',
          cursor:'pointer', padding:2, display:'grid', placeItems:'center', borderRadius:4,
          opacity:0.7, transition:'opacity 200ms',
        }}
          onMouseEnter={e=>e.currentTarget.style.opacity=1}
          onMouseLeave={e=>e.currentTarget.style.opacity=0.7}
        >{action}</button>}
      </div>
      {children}
    </div>
  );
}

function Sidebar({ active, onPick, companyName }) {
  return (
    <aside style={{
      width: 256, flexShrink: 0,
      background:'var(--mono-surface-2)',
      borderRight:'1px solid var(--mono-border)',
      display:'flex', flexDirection:'column',
      height:'100%',
    }}>
      {/* Workspace header */}
      <div style={{
        height: 64, padding:'0 18px',
        display:'flex', alignItems:'center', gap:11,
      }}>
        <div style={{
          width:30, height:30, borderRadius:9,
          background:'var(--mono-fg)', color:'var(--mono-bg)',
          display:'grid', placeItems:'center',
          fontFamily:'var(--mono-font-display)', fontWeight:400, fontSize:14,
          letterSpacing:'-0.02em',
        }}>
          {companyName.slice(0,1)}
        </div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{
            fontSize:13.5, fontWeight:500, letterSpacing:'-0.005em',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
          }}>{companyName}</div>
          <div style={{fontSize:11, color:'var(--mono-fg-muted)', marginTop:1, letterSpacing:'0.02em'}}>
            Pro · 12 seats
          </div>
        </div>
        <button style={{
          width:24, height:24, padding:0, border:'none', background:'transparent',
          color:'var(--mono-fg-muted)', cursor:'pointer',
          display:'grid', placeItems:'center', borderRadius:5,
        }}><Icon.ChevronRight size={14}/></button>
      </div>

      {/* Search */}
      <div style={{padding:'2px 14px 8px'}}>
        <div style={{
          display:'flex', alignItems:'center', gap:9,
          height:34, padding:'0 12px',
          background:'var(--mono-surface)',
          border:'1px solid var(--mono-border)',
          borderRadius:9,
          color:'var(--mono-fg-muted)', fontSize:13,
          transition:'border-color 200ms, box-shadow 200ms',
        }}>
          <Icon.Search size={14}/>
          <span style={{flex:1, letterSpacing:'-0.005em'}}>Search</span>
          <kbd style={{
            padding:'2px 6px', fontSize:10.5,
            background:'var(--mono-secondary)',
            border:'1px solid var(--mono-border)', borderRadius:5,
            fontFamily:'var(--mono-font-mono)',
            color:'var(--mono-fg-muted)',
          }}>⌘K</kbd>
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', paddingBottom:8}}>
        <SidebarSection title="Work">
          <NavRow icon={Icon.Inbox}   label="Inbox"     badge={3}
                  active={active==='inbox'} onClick={()=>onPick('inbox')} />
          <NavRow icon={Icon.Target}  label="My issues" badge={12}
                  active={active==='issues'} onClick={()=>onPick('issues')} />
          <NavRow icon={Icon.History} label="Activity"
                  active={active==='activity'} onClick={()=>onPick('activity')} />
        </SidebarSection>

        <SidebarSection title="Agents" action={<Icon.Plus size={11}/>}>
          <NavRow icon={Icon.Boxes}   label="Marketplace"
                  active={active==='marketplace'} onClick={()=>onPick('marketplace')} />
          <NavRow icon={Icon.Network} label="Active agents" badge={7}
                  active={active==='agents'} onClick={()=>onPick('agents')} />
          <NavRow icon={Icon.Repeat}  label="Workflows"
                  active={active==='workflows'} onClick={()=>onPick('workflows')} />
        </SidebarSection>

        <SidebarSection title="Company">
          <NavRow icon={Icon.Plug}   label="Integrations" />
          <NavRow icon={Icon.Dollar} label="Billing" />
          <NavRow icon={Icon.Layers} label="Audit log" muted />
        </SidebarSection>
      </div>

      {/* Footer */}
      <div style={{
        borderTop:'1px solid var(--mono-border)',
        padding:'8px',
      }}>
        <NavRow icon={Icon.Book} label="Documentation" muted />
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
