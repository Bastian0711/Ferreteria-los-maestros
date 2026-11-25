import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { listarProductos, listarCategorias, catalogoEnCache } from "../services/productosService";

const CatalogoContext = createContext({
  productos: [],
  categorias: [],
  cargando: false,
  error: "",
  recargar: async () => {},
});

// Carga productos y categorías desde ms-catalogo una vez, y cuando se llama a recargar()
// (por ejemplo, después de confirmar un pedido o de editar un producto).
export function CatalogoProvider(props) {
  const [productos, setProductos] = useState(() => catalogoEnCache().productos);
  const [categorias, setCategorias] = useState(() => catalogoEnCache().categorias);
  // Solo se muestra "cargando" si todavía no hay nada que mostrar
  const [cargando, setCargando] = useState(() => catalogoEnCache().productos.length === 0);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    try {
      const [nuevosProductos, nuevasCategorias] = await Promise.all([listarProductos(), listarCategorias()]);
      setProductos(nuevosProductos);
      setCategorias(nuevasCategorias);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return (
    <CatalogoContext.Provider value={{ productos, categorias, cargando, error, recargar }}>
      {props.children}
    </CatalogoContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useCatalogo() {
  return useContext(CatalogoContext);
}
