import { createContext, useContext, useEffect, useState } from "react";
import {
  listarProductos,
  listarCategorias,
  suscribirCambios,
} from "../services/productosService";


const CatalogoContext = createContext({ productos: [], categorias: [] });

export function CatalogoProvider(props) {
  const [productos, setProductos] = useState(listarProductos);
  const [categorias, setCategorias] = useState(listarCategorias);

  useEffect(() => {
    function sincronizar() {
      setProductos(listarProductos());
      setCategorias(listarCategorias());
    }

    sincronizar();
    return suscribirCambios(sincronizar);
  }, []);

  return (
    <CatalogoContext.Provider value={{ productos, categorias }}>
      {props.children}
    </CatalogoContext.Provider>
  );
}

export function useCatalogo() {
  return useContext(CatalogoContext);
}
