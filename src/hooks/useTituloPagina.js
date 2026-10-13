import { useEffect } from "react";

export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = `${titulo} | Ferretería Los Maestros`;
  }, [titulo]);
}