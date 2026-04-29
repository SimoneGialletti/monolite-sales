import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: percorso non trovato:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="font-display text-[88px] font-normal text-[var(--fg1)]">404</h1>
        <p className="mb-6 text-[15px] text-[var(--fg2)]">
          La pagina che cerchi non esiste.
        </p>
        <a href="/" className="btn-ghost text-[13px]">
          Torna al calcolatore
        </a>
      </div>
    </div>
  );
};

export default NotFound;
