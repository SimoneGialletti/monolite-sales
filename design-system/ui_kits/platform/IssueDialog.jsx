// IssueDialog — refined. Squared corners, hairline borders, Reckless title.
function IssueDialog({ open, onClose }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setMounted('in'));
    } else {
      setMounted(false);
    }
  }, [open]);

  if (!open) return null;
  const inState = mounted === 'in';

  return (
    <div role="dialog" aria-modal="true"
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:50,
        background: inState ? 'rgba(0,0,0,0.62)' : 'rgba(0,0,0,0)',
        display:'grid', placeItems:'center',
        backdropFilter: inState ? 'blur(8px)' : 'blur(0)',
        WebkitBackdropFilter: inState ? 'blur(8px)' : 'blur(0)',
        transition:'background 320ms cubic-bezier(.2,.8,.2,1), backdrop-filter 320ms',
      }}>
      <div onClick={e => e.stopPropagation()}
        style={{
          width:'min(620px, 92vw)',
          background:'var(--mono-surface)',
          color:'var(--mono-fg)',
          border:'1px solid var(--mono-border)',
          boxShadow:'0 32px 80px -20px rgba(0,0,0,0.75), 0 1px 0 0 rgba(255,255,255,0.04) inset',
          borderRadius: 14,
          display:'flex', flexDirection:'column',
          opacity: inState ? 1 : 0,
          transform: inState ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.985)',
          transition:'opacity 320ms cubic-bezier(.2,.8,.2,1), transform 320ms cubic-bezier(.2,.8,.2,1)',
        }}>
        {/* Header */}
        <div style={{
          padding:'18px 22px 14px',
          display:'flex', alignItems:'baseline', gap:12,
        }}>
          <h3 style={{
            margin:0,
            fontFamily:'var(--mono-font-display)',
            fontSize:20, fontWeight:400, letterSpacing:'-0.018em',
          }}>Nuova issue</h3>
          <span style={{
            fontFamily:'var(--mono-font-mono)',
            fontSize:11, color:'var(--mono-fg-muted)', letterSpacing:'0.04em',
          }}>MON-417</span>
          <div style={{flex:1}}/>
          <button onClick={onClose} style={{
            width:30, height:30, padding:0, border:'none', background:'transparent',
            color:'var(--mono-fg-muted)', cursor:'pointer',
            display:'grid', placeItems:'center', borderRadius:7,
            transition:'background 180ms, color 180ms',
          }}
          onMouseEnter={e=>{e.currentTarget.style.background='var(--mono-secondary)';e.currentTarget.style.color='var(--mono-fg)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--mono-fg-muted)'}}>
            <Icon.X size={15}/>
          </button>
        </div>

        {/* Body */}
        <div style={{padding:'4px 22px 14px', display:'flex', flexDirection:'column', gap:6}}>
          <input autoFocus placeholder="Titolo issue"
            style={{
              border:'none', outline:'none', background:'transparent',
              fontFamily:'var(--mono-font-display)',
              fontSize:24, fontWeight:400, letterSpacing:'-0.018em',
              color:'var(--mono-fg)', padding:'4px 0',
            }}/>
          <textarea placeholder="Aggiungi descrizione, allega un file, menziona un agente con @…"
            rows={4}
            style={{
              border:'none', outline:'none', background:'transparent',
              resize:'none', fontFamily:'inherit', fontSize:14, lineHeight:1.55,
              color:'var(--mono-fg)', padding:'4px 0',
              letterSpacing:'-0.005em',
            }}/>

          <div style={{display:'flex', flexWrap:'wrap', gap:6, padding:'10px 0 4px'}}>
            {['Backlog','Priority · Med','@contabilita-q4','Due Apr 30'].map(c => (
              <span key={c} style={{
                padding:'5px 10px', fontSize:12, fontWeight:500,
                background:'var(--mono-secondary)',
                border:'1px solid var(--mono-border)',
                borderRadius:7,
                color:'var(--mono-fg)',
                cursor:'pointer', letterSpacing:'-0.005em',
                transition:'background 180ms',
              }}>{c}</span>
            ))}
            <span style={{
              padding:'5px 10px', fontSize:12, fontWeight:500,
              border:'1px dashed var(--mono-border)',
              borderRadius:7, color:'var(--mono-fg-muted)', cursor:'pointer',
              letterSpacing:'-0.005em',
            }}>+ Label</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding:'14px 22px',
          borderTop:'1px solid var(--mono-border)',
          background:'var(--mono-surface-2)',
          display:'flex', alignItems:'center', gap:10,
          borderRadius:'0 0 14px 14px',
        }}>
          <button style={{
            width:32, height:32, padding:0, border:'1px solid var(--mono-border)',
            background:'transparent', color:'var(--mono-fg-muted)',
            display:'grid', placeItems:'center', borderRadius:8, cursor:'pointer',
          }}><Icon.Paperclip size={14}/></button>
          <div style={{flex:1, fontSize:11.5, color:'var(--mono-fg-muted)', letterSpacing:'-0.005em'}}>
            <kbd style={{padding:'2px 6px', background:'var(--mono-secondary)',
                         border:'1px solid var(--mono-border)', borderRadius:5,
                         fontSize:10.5, fontFamily:'var(--mono-font-mono)'}}>⌘ Enter</kbd> per inviare
          </div>
          <button onClick={onClose} style={{
            height:34, padding:'0 14px',
            background:'transparent', color:'var(--mono-fg)',
            border:'1px solid var(--mono-border)', borderRadius:8,
            fontSize:13, fontWeight:500, cursor:'pointer', letterSpacing:'-0.005em',
          }}>Annulla</button>
          <button style={{
            height:34, padding:'0 16px',
            background:'var(--mono-primary)', color:'var(--mono-primary-fg)',
            border:'none', borderRadius:8,
            fontSize:13, fontWeight:500, cursor:'pointer', letterSpacing:'-0.005em',
            boxShadow:'0 6px 18px -8px rgba(0,0,0,0.5)',
          }}>Crea issue</button>
        </div>
      </div>
    </div>
  );
}

window.IssueDialog = IssueDialog;
