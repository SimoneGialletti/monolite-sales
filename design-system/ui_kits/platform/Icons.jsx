// Inline Lucide icons (subset). 2px stroke, currentColor, 16px default.
const Ic = ({ d, size = 16, paths }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       style={{display:'block', flexShrink:0}}>
    {paths || <path d={d} />}
  </svg>
);

const Icon = {
  Dashboard: (p) => <Ic {...p} paths={<>
    <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
    <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>}/>,
  Inbox: (p) => <Ic {...p} paths={<>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>}/>,
  Circle: (p) => <Ic {...p} paths={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></>}/>,
  Repeat: (p) => <Ic {...p} paths={<>
    <path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
    <path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></>}/>,
  Target: (p) => <Ic {...p} paths={<>
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>}/>,
  Network: (p) => <Ic {...p} paths={<>
    <circle cx="12" cy="10" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="5" cy="6" r="3"/>
    <circle cx="12" cy="20" r="3"/><line x1="12" y1="13" x2="12" y2="17"/>
    <line x1="14.5" y1="8" x2="16.5" y2="7"/><line x1="9.5" y1="8" x2="7.5" y2="7"/></>}/>,
  Boxes: (p) => <Ic {...p} paths={<>
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5l-5-3-4.03 1.92Z"/>
    <path d="M7 16.5 2.97 14.63"/><path d="M7 16.5v5.17"/><path d="M12 13.92V19l5 3 5-3v-5L17 11l-5 2.92Z"/>
    <path d="M17 22V14"/><path d="m7 6.5 5 3 5-3"/></>}/>,
  Plug: (p) => <Ic {...p} paths={<>
    <path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/>
    <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></>}/>,
  Dollar: (p) => <Ic {...p} paths={<>
    <line x1="12" y1="2" x2="12" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}/>,
  History: (p) => <Ic {...p} paths={<>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><polyline points="3 3 3 8 8 8"/><path d="M12 7v5l4 2"/></>}/>,
  Settings: (p) => <Ic {...p} paths={<>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>}/>,
  Search: (p) => <Ic {...p} paths={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}/>,
  SquarePen: (p) => <Ic {...p} paths={<>
    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></>}/>,
  Plus: (p) => <Ic {...p} paths={<><path d="M12 5v14"/><path d="M5 12h14"/></>}/>,
  X: (p) => <Ic {...p} paths={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>}/>,
  Sun: (p) => <Ic {...p} paths={<>
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/><path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>}/>,
  Moon: (p) => <Ic {...p} paths={<><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>}/>,
  Book: (p) => <Ic {...p} paths={<>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></>}/>,
  Paperclip: (p) => <Ic {...p} paths={<>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></>}/>,
  LogOut: (p) => <Ic {...p} paths={<>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>}/>,
  ChevronRight: (p) => <Ic {...p} paths={<><polyline points="9 18 15 12 9 6"/></>}/>,
  Layers: (p) => <Ic {...p} paths={<>
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>}/>,
};

window.Icon = Icon;
