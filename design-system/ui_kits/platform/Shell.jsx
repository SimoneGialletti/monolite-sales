// Shell — assembles CompanyRail + Sidebar + BreadcrumbBar + main content.
// Theme toggling driven by class="dark" on <html>.
function useTheme() {
  const [theme, setTheme] = React.useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return [theme, () => setTheme(t => t === 'dark' ? 'light' : 'dark')];
}

function Shell() {
  const [theme, toggleTheme] = useTheme();
  const [companyId, setCompanyId] = React.useState('mon');
  const [page, setPage] = React.useState('inbox');
  const [issueOpen, setIssueOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const company = COMPANIES.find(c => c.id === companyId);
  const pageLabel = {
    inbox:'Inbox', issues:'My Issues', activity:'Activity',
    marketplace:'Marketplace', agents:'Active Agents', workflows:'Workflows',
  }[page] || 'Inbox';

  const onAgentClick = (a) => {
    setToast(`Apri agente · ${a.name}`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div style={{display:'flex', height:'100vh', width:'100vw', overflow:'hidden'}}
         data-screen-label="Platform · Inbox">
      <CompanyRail activeId={companyId} onPick={setCompanyId} onAdd={() => setToast('Aggiungi workspace')}/>
      <Sidebar active={page} onPick={setPage} companyName={company.name}/>

      <main style={{flex:1, display:'flex', flexDirection:'column', minWidth:0,
                    background:'var(--mono-bg)'}}>
        <BreadcrumbBar
          company={company.name}
          page={pageLabel}
          theme={theme}
          onTheme={toggleTheme}
          onNew={() => setIssueOpen(true)}
        />
        <div style={{flex:1, overflowY:'auto'}}>
          <Dashboard onAgentClick={onAgentClick}/>
        </div>
      </main>

      <IssueDialog open={issueOpen} onClose={() => setIssueOpen(false)}/>

      {toast && (
        <div style={{
          position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)',
          padding:'10px 16px',
          background:'var(--mono-fg)', color:'var(--mono-bg)',
          fontSize:13, fontWeight:500,
          borderRadius:6,
          boxShadow:'var(--mono-shadow-lg)',
          zIndex:60,
        }}>{toast}</div>
      )}
    </div>
  );
}

window.Shell = Shell;
